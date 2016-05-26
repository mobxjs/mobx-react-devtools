# mobx-react-devtools

![MobX devtools](devtools.gif)

## Installation

`npm install mobx-react-devtools --save-dev`

or 

`<script src="https://npmcdn.com/mobx-react-devtools"></script>`

## Usage

Somewhere in your application, create a DevTools component:

```jsx
import DevTools from 'mobx-react-devtools';

class MyApp extends React.Component {
  render() {
    return (
      <div>
        ...
        <DevTools />;
      </div>
    );
  }
}
```
or

`React.createElement(mobxDevtools.default)`




Supported props:
* `hightlightTimeout` — number, default: 1500.
* `position` — object, position of control panel, default: {top: 0, right: '20px'}.


From there on, after each rendering a reactive components logs the following three metrics:
1. Number of times the component did render so far.
2. The time spend in the `render()` method of a component
3. The time spend from the start of the `render()` method until the changes are flushed to the DOM.

For each component the color indicates roughly how long the coloring took. Rendering times are cummalitive; they include time spend in the children.
* Green: less then 25 ms.
* Orange: less then 100 ms.
* Red: rendering for this component took more than 100ms.

## Roadmap

* ~~Be able to turn dev-tools on and off at runtime.~~
* ~~Select and log dependency tree of components.~~
* Visualize observer tree values
* ~~Be able to enable state change tracking from the extras module~~

## Changelog

4.0.5
* Added Object.assign polyfill to avoid issues with server side rendering on old node vesions

4.0.2
* Make sure AMD / root imports work (#12)
* DevTools should now 'work' (not do anything) when used in Isomorphic rendering (#11)
* Highlighting boxes now show up at the proper coordinates when using complex stacking contexts

4.0.1
* Added typescript typings (see #6)
* Use (fix) uglify, by @evoyy
* Added option to customize the position of the toolbar (by @evoyy)

4.0.0
* Upgraded to MobX 2.0 / MobX-React 3.0
