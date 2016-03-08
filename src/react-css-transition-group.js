import React from 'react';

// Hacky hacky hack to avoid ReactCSSTransitionGroup as additional peer dependency. See also webpack config
const ReactCSSTransitionGroup_import = require('react-addons-css-transition-group');
const ReactCSSTransitionGroup = (ReactCSSTransitionGroup_import
    ? ReactCSSTransitionGroup_import
    : React.addons.CSSTransitionGroup
);

export default ReactCSSTransitionGroup;