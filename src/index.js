import ObjectAssign from 'es6-object-assign';
ObjectAssign.polyfill();

export { default } from './DevTool';
export { default as GraphControl } from './Controls/GraphControl';
export { default as LogControl } from './Controls/LogControl';
export { default as UpdatesControl } from './Controls/UpdatesControl';
