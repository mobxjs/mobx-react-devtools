/**
 * Turns a React component or stateless render function into a reactive component.
 */
import React = require('react');

export interface IDevToolProps {
    hightlightTimeout?: number;
    position?: {
        top?:    number | string;
        right?:  number | string;
        bottom?: number | string;
        left?:   number | string;
    }
}

export default class DevTools extends React.Component<IDevToolProps, {}> { }
