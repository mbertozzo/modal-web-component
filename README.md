# modal-web-component
This project is a web component that allows to easily add one or more modals to a web page.  
It should work out of the box in all modern browsers (with the partial exception of Edge), but please always check the [compatibility table](https://caniuse.com/#search=components).

## Getting started
Using this web component in your project is totally straightforward. Just copy to your project the `modal.js` file you find in the `src` folder and reference it in your page:

```html
<script src="./src/modal.js"></script>
```

You're now able to use the tag `<modal-dialog>` through your HTML document.

### Create a modal
A modal is made of two parts: the content and the button to show or hide it.
Let's start defining the first:

```html
<modal-dialog data-name="my-modal">
  <span slot="heading"><strong>Hello World!</strong></span>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
</modal-dialog>
```

Simply wrap everything you want to display inside the modal in the `<modal-dialog>` tag.
The `data-name` attribute is needed to allow for multiple modals in the same page, the value can be anything as long as the name is unique for each modal.
Everything with the `slot="heading"` attribute will become the modal title.

To change the modal open or close state, just define a button (or any other HTML element that can trigger an onClick event) as follows:

```html
<button class="trigger-modal" data-modal="my-modal">Open modal</button>
```

The `trigger-modal` class is (for now) mandatory, since it tells the script which elements can change the modal state. The `data-modal` attribute value must be one of the names chosen for `modal-dialog`. 

### Add a close button as modal content
To close a modal a user can click on the X button in the top right corner or everywhere on the backdrop. But sometimes you may want to also have a "dismiss" button as the modal footer, to provide a more clear interaction experience. To do so, just add a button to the modal content:

```html
<modal-dialog data-name="my-modal">
  ...
  <button id="close">Close</button>
</modal-dialog>
```

The `id` here can be anything you want. Then, add an event listener to the DOM element, in the following example we'll track the `click` event:

```html
<script>
  const closeButton = document.getElementById('close');
  closeButton.addEventListener('click', () => {
      const modalNode = document.querySelector(`[data-name=my-modal]`);
      modalNode.open = false;
  })
</script>
```

When that event occurs, we retrieve the DOM Node for the modal using the `data-name` attribute and we change the open attribute for that node to false.

#### The open attribute
Each `modal-dialog` instance has a boolean `open` attribute you can use to set the state of the modal. For example, if you want a modal open by default when viewing a page, you can set:

```html
<modal-dialog data-name="my-modal" open="true">
  ...
</modal-dialog>
```

## Launch local demo
If you just want to give a quick try to the component, you can clone this repo to your local machine and type the following commands in your console:

```bash
$ npm install      # or yarn
$ npm start        # or yarn start
```

A demo page will open in your default browser (if not, just reach http://localhost:8080).

## Contribution
This is a POC project to test the capabilities of web components: any suggestion to improve the code or contribution for new functionalities (or better implementation of an existing one) is very welcome!