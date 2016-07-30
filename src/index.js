import ObjectAssign from 'es6-object-assign';
import { setGlobalState } from './globalStore';
ObjectAssign.polyfill();

export { default } from './DevTool';
export { default as GraphControl } from './Controls/GraphControl';
export { default as LogControl } from './Controls/LogControl';
export { default as UpdatesControl } from './Controls/UpdatesControl';

export const setLogEnabled = logEnabled => { setGlobalState({ logEnabled: Boolean(logEnabled) }); };
export const setUpdatesEnabled = updatesEnabled => { setGlobalState({ updatesEnabled: Boolean(updatesEnabled) }); };
export const setGraphEnabled = graphEnabled => { setGlobalState({ graphEnabled: Boolean(graphEnabled) }); };
