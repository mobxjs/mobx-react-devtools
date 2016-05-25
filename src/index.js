import ObjectAssign from 'es6-object-assign';
ObjectAssign.polyfill();
import React, { Component, PropTypes } from 'react';
import RenderingMonitor from './RenderingMonitor';
import mobx from 'mobx';
import mobxReact from 'mobx-react';
import deduplicateDependencies from './deduplicateDependencies';
import {setLogLevel} from './changeLogger';

import Panel from './Panel';
import Highlighter from './Highlighter';
import Graph from './Graph';

const LS_UPDATES_KEY = 'mobx-react-devtool__updatesEnabled';
const LS_LOG_KEY = 'mobx-react-devtool__logEnabled';

export default class DevTool extends Component {

  static propTypes = {
    hightlightTimeout: PropTypes.number,
    position: PropTypes.object,
    userAgent: PropTypes.string,
  };

  static defaultProps = {
    hightlightTimeout: 1500,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36',
  };

  state = {
    updatesEnabled: false,
    graphEnabled: false,
    logEnabled: false,
    hoverBoxes: [],
  };

  componentWillMount() {
    const { hightlightTimeout } = this.props;

    this.renderingMonitor = new RenderingMonitor({
      hightlightTimeout,
      shouldReport: () => this.state.updatesEnabled,
      onUpdate: () => this.forceUpdate(),
      getCoordinates: target => this.getCoordinates(target),
    });
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      /* Start magic */
      mobxReact.trackComponents();

      document.body.addEventListener('mousemove', this._handleMouseMove, true);
      document.body.addEventListener('click', this._handleClick, true);

      if (window.localStorage.getItem(LS_UPDATES_KEY) === 'YES') this.handleToggleUpdates();
      if (window.localStorage.getItem(LS_LOG_KEY) === 'YES') this.handleToggleLog();
    }
  }

  componentWillUnmount() {
    this.renderingMonitor.dispose();
    if (typeof document !== 'undefined') {
      document.body.removeEventListener('mousemove', this._handleMouseMove);
      document.body.removeEventListener('click', this._handleMouseMove);
    }
  }

  getCoordinates(target) {
    return target.getBoundingClientRect();
  }

  _handleMouseMove = e => {
    if (this.state.graphEnabled) {
      const target = e.target;
      const node = this.findComponentAndNode(target).node;
      if (node) {
        const coordinates = this.getCoordinates(node);
        this.setState({
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

  _handleClick = e => {
    if (this.state.graphEnabled) {
      const target = e.target;
      const component = this.findComponentAndNode(target).component;
      if (component) {
        e.stopPropagation();
        e.preventDefault();
        const dependencyTree = mobx.extras.getDependencyTree(component.render.$mobx);
        deduplicateDependencies(dependencyTree);
        this.setState({
          dependencyTree,
          hoverBoxes: [],
          graphEnabled: false,
        });
      }
    }
  };

  findComponentAndNode(target) {
    let node = target;
    let component;
    while(node) {
      component = mobxReact.componentByNodeRegistery.get(node);
      if (component) return { component, node };
      node = node.parentNode;
    }
    return { component: undefined, node: undefined };
  }

  handleToggleUpdates = () => {
    const updatesEnabled = !this.state.updatesEnabled;
    this.setState({ updatesEnabled });
    if (updatesEnabled) {
      typeof window !== 'undefined' && window.localStorage.setItem(LS_UPDATES_KEY, 'YES');
    } else {
      typeof window !== 'undefined' && window.localStorage.removeItem(LS_UPDATES_KEY);
    }
  };

  handleToggleGraph = () => {
    this.setState({
      hoverBoxes: [],
      graphEnabled: !this.state.graphEnabled
    });
  };

  handleToggleLog = () => {
    const newLevel = !this.state.logEnabled;
    setLogLevel(newLevel);
    this.setState({
      logEnabled: newLevel
    });
    if (newLevel) {
      typeof window !== 'undefined' && window.localStorage.setItem(LS_LOG_KEY, 'YES');
    } else {
      typeof window !== 'undefined' && window.localStorage.removeItem(LS_LOG_KEY);
    }
  };

  handleCloseGraph = () => {
    this.setState({ dependencyTree: undefined })
  };

  render() {
    const { updatesEnabled, graphEnabled, logEnabled, dependencyTree } = this.state;

    return (
      <div ref={el => this.containerEl = el}>
        <Panel
          radiumConfig={{ userAgent: this.props.userAgent }}
          position={this.props.position}
          updatesEnabled={updatesEnabled}
          graphEnabled={graphEnabled}
          logEnabled={logEnabled}
          onToggleUpdates={this.handleToggleUpdates}
          onToggleGraph={this.handleToggleGraph}
          onToggleLog={this.handleToggleLog}
        />
        <Highlighter
          boxes={this.renderingMonitor.boxesList.concat(this.state.hoverBoxes)}
        />
        <Graph
          dependencyTree={dependencyTree}
          onClose={this.handleCloseGraph}
        />
      </div>
    );
  }
}


