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