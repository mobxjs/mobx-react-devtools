# 6.1.1

* Fixed `Uncaught ReferenceError: propTypes is not defined` [#111](https://github.com/mobxjs/mobx-react-devtools/issues/111) through [#110](https://github.com/mobxjs/mobx-react-devtools/pull/110) by [mpedersen15](https://github.com/mpedersen15)

# 6.1.0

* Added more styling options to the panels, see [#100](https://github.com/mobxjs/mobx-react-devtools/pull/100) by [@janaagaard75](https://github.com/janaagaard75) and [#103](https://github.com/mobxjs/mobx-react-devtools/pull/103) by [@rokoroku](https://github.com/rokoroku)
* Firefox now supports nested spy logging as well. [#105](https://github.com/mobxjs/mobx-react-devtools/pull/105) by [@wkillerud](https://github.com/wkillerud)

# 6.0.3

* Fixed #101: `window` not defined on node environments
* Made border uniform, PR [#99](https://github.com/mobxjs/mobx-react-devtools/pull/99) by [@janaagaard75](https://github.com/janaagaard75)

# 6.0.2

* Fixed issue where an exception was thrown when an observer component returns a text node. Fixes [#80](https://github.com/mobxjs/mobx-react-devtools/issue/80)
* Fixed issue where `isObservableMap` was undefined when logging map transtions. Through [#98](https://github.com/mobxjs/mobx-react-devtools/pull/98) by [@AMilassin](https://github.com/AMilassin)

# 6.0.1

* Corrected peer dependency

# 6.0.0

* Added compatibility with MobX 5. See [#96](https://github.com/mobxjs/mobx-react-devtools/pull/96) by [max9599](https://github.com/max9599)
* Added support for tree-shaking / dead code elimination when the package is required but not rendered. [#95](https://github.com/mobxjs/mobx-react-devtools/pull/95) by [rifler](https://github.com/rifler)
* Stack traces are now automatically collapsed if the browser supports it. [#79](https://github.com/mobxjs/mobx-react-devtools/pull/78) by [will-stone](https://github.com/will-stone)
* Fixed several console output issues where `undefined` was printed incorrectly [#94](https://github.com/mobxjs/mobx-react-devtools/pull/94) by [srg-kostyrko](https://github.com/srg-kostyrko)
* Webpack 4 is now used to build the package. See [#87](https://github.com/mobxjs/mobx-react-devtools/pull/87) by [hiroppy](https://github.com/hiroppy)