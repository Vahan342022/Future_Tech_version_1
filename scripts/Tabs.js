import BaseComponent from "./BaseComponent.js"

const rootSelector = '[data-js-tabs]'

class Tabs extends BaseComponent {
  selectors = {
    root: rootSelector,
    button: '[data-js-tabs-button]',
    content: '[data-js-tabs-content]',
  }

  stateClasses = {
    isActive: 'is-active',
  }

  stateAttributes = {
    ariaSelected: 'aria-selected',
    tabIndex: 'tabindex',
  }

  constructor(rootElement) {
    super()
    this.rootElement = rootElement
    this.buttonElements = this.rootElement.querySelectorAll(this.selectors.button)
    this.contentElements = this.rootElement.querySelectorAll(this.selectors.content)
    this.state = {
        activeTabIndex: [...this.buttonElements]
        .findIndex((buttonElement) => buttonElement.classList.contains(this.stateClasses.isActive)),
    }
    this.limitTabIndex = this.buttonElements.length - 1
    this.bindEvents()
  }

  updateUI() {
    const { activeTabIndex } = this.state 

    this.buttonElements.forEach((buttonElement, index) => {
        const isActive = index === activeTabIndex

        buttonElement.classList.toggle(this.stateClasses.isActive, isActive)
        buttonElement.setAttribute(this.stateAttributes.ariaSelected, isActive.toString())
        buttonElement.setAttribute(this.stateAttributes.tabIndex, isActive ? '0' : '-1')

    })

    this.contentElements.forEach((contentElement, index) => {
        const isActive = index === activeTabIndex

        contentElement.classList.toggle(this.stateClasses.isActive, isActive)
    })
  }

  onButtonClick(buttonIndex) {
    this.state.activeTabIndex = buttonIndex
    this.updateUI()
  }
  onKeyDown = (event) => {
    const { code, metaKey } = event

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code]


    const isMacHomeKey = metaKey && code  ==='ArrowLeft'
    if (isMacHomeKey) {
      this.firstTab()
      return
    }

    const isMacEndKey = metaKey && code  ==='ArrowRight'
    if (isMacEndKey) {
      this.firstTab()
      return
    }

    action?.()
  }

  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
        buttonElement.addEventListener('click', () => 
            this.onButtonClick(index))
    })
    this.rootElement.addEventListener('keydown', this.onKeyDown)
  }
}

class TabsCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element)

    })
  }
}

export default TabsCollection