import mobx from 'mobx';
import mobxReact from 'mobx-react';
import EventEmmiter from 'events';
import deduplicateDependencies from './deduplicateDependencies';

const LS_UPDATES_KEY = 'mobx-react-devtool__updatesEnabled';
const LS_LOG_KEY = 'mobx-react-devtool__logEnabled';

let state = {
  updatesEnabled: false,
  graphEnabled: false,
  logEnabled: false,
  hoverBoxes: [],
  renderingBoxes: [],
};

export const eventEmitter = new EventEmmiter();

export const setGlobalState = newState => {
  state = Object.assign({}, state, newState);

  if (typeof window !== 'undefined' && window.localStorage) {
    if (state.updatesEnabled) {
      window.localStorage.setItem(LS_UPDATES_KEY, 'YES');
    } else {
      window.localStorage.removeItem(LS_UPDATES_KEY);
    }
    if (state.logEnabled) {
      window.localStorage.setItem(LS_LOG_KEY, 'YES');
    } else {
      window.localStorage.removeItem(LS_LOG_KEY);
    }
  }
  eventEmitter.emit('update');
};

export const getGlobalState = () => state;

export const restoreState = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const updatesEnabled = window.localStorage.getItem(LS_UPDATES_KEY) === 'YES';
    const logEnabled = window.localStorage.getItem(LS_LOG_KEY) === 'YES';
    setGlobalState({ updatesEnabled, logEnabled });
  }
};

const findComponentAndNode = target => {
  let node = target;
  let component;
  while(node) {
    component = mobxReact.componentByNodeRegistery.get(node);
    if (component) return { component, node };
    node = node.parentNode;
  }
  return { component: undefined, node: undefined };
};

export const _handleMouseMove = e => {
  if (state.graphEnabled) {
    const target = e.target;
    const node = findComponentAndNode(target).node;
    if (node) {
      const coordinates = node.getBoundingClientRect();
      setGlobalState({
        hoverBoxes: [{
          id: 'the hovered node',
          type: 'hover',
          x: coordinates.left,
          y: coordinates.top,
          width: coordinates.width,
          height: coordinates.height,
          lifeTime: Infinity,
        }]
      });
    }
  }
};

export const _handleClick = e => {
  if (state.graphEnabled) {
    const target = e.target;
    const component = findComponentAndNode(target).component;
    if (component) {
      e.stopPropagation();
      e.preventDefault();
      const dependencyTree = mobx.extras.getDependencyTree(component.render.$mobx);
      deduplicateDependencies(dependencyTree);
      setGlobalState({
        dependencyTree,
        hoverBoxes: [],
        graphEnabled: false,
      });
    }
  }
};
