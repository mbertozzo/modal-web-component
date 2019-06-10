'use strict';

const style = `
  <style>
    .wrapper {
      opacity: 0;
      transition: visibility 0s, opacity 0.25s ease-in;
    }
    .wrapper:not(.open) {
      visibility: hidden;
    }
    .wrapper.open {
      align-items: center;
      display: flex;
      justify-content: center;
      height: 100vh;
      position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      opacity: 1;
      visibility: visible;
    }
    .overlay {
      background: rgba(0, 0, 0, 0.6);
      height: 100%;
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
    }
    .dialog {
      background: #ffffff;
      max-width: 600px;
      padding: 2rem;
      position: fixed;
      border-radius: 5px;
      box-shadow: 5px 5px 20px #424242;
    }
    button {
      all: unset;
      cursor: pointer;
      font-size: 1.25rem;
      position: absolute;
      top: 1rem;
      right: 1rem;
    }
    button:focus {
      fill: blue;
    }
    h1 {
      margin: 0;
    }
  </style>
`;

const html = `
  <div class="wrapper">
    <div class="overlay"></div>
    <div class="dialog" role="dialog" aria-labelledby="title" aria-describedby="content">
      <button class="close" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="none" d="M0 0h24v24H0V0z"/>
          <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
        </svg>
      </button>
      <h1 id="title"><slot name="heading"></slot></h1>
      <div id="content" class="content">
        <slot></slot>
      </div>
    </div>
  </div>
`;

class ModalDialog extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.close = this.close.bind(this);
    this._watchEscape = this._watchEscape.bind(this);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (oldValue !== newValue) {
      this[attrName] = this.hasAttribute(attrName);
    }
  }

  connectedCallback() {
    const { shadowRoot } = this;
    
    shadowRoot.innerHTML = `${style}${html}`;
    shadowRoot.querySelector('button').addEventListener('click', this.close);
    shadowRoot.querySelector('.overlay').addEventListener('click', this.close);
    this.open = this.open;
  }  

  disconnectedCallback() {
    this.shadowRoot.querySelector('button').removeEventListener('click', this.close);
    this.shadowRoot.querySelector('.overlay').removeEventListener('click', this.close);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(isOpen) {
    const { shadowRoot } = this;

    shadowRoot.querySelector('.wrapper').classList.toggle('open', isOpen);
    shadowRoot.querySelector('.wrapper').setAttribute('aria-hidden', !isOpen);

    if (isOpen) {
      this._wasFocused = document.activeElement;
      this.setAttribute('open', '');
      document.addEventListener('keydown', this._watchEscape);
      this.focus();
      shadowRoot.querySelector('button').focus();
    } else {
      this._wasFocused && this._wasFocused.focus && this._wasFocused.focus();
      this.removeAttribute('open');
      document.removeEventListener('keydown', this._watchEscape);
      this.close();
    }
  }

  close() {
    if (this.open !== false) {
      this.open = false;
    }

    const closeEvent = new CustomEvent('dialog-closed');
    this.dispatchEvent(closeEvent);
  }

  _watchEscape(event) {
    if (event.key === 'Escape') {
      this.close();
    }
  }
}

customElements.define('modal-dialog', ModalDialog);

const triggersCollection = document.getElementsByClassName('trigger-modal');
const triggersArray = [...triggersCollection];

triggersArray.map(item => {
  const modal = item.dataset.modal;
  const modalNode = document.querySelector(`[data-name=${modal}]`);

  item.addEventListener('click', () => {
    modalNode.open = true;
  })
})