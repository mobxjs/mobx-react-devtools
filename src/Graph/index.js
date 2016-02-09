import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import ModalContainer from '../ModalContainer';
import css from './graph.css';


export default class Graph extends Component {

  static propTypes = {
    dependencyTree: PropTypes.any,
    onClose: PropTypes.func.isRequired,
  };

  handleClose = () => this.props.onClose();

  renderBox(name, isRoot) {
    return (
      <div className={classNames(css.treeBox, { [css.root]: isRoot })}>
        {name}
      </div>
    );
  }

  renderTree(dependencies) {
    return dependencies && dependencies.map(dependency =>
        <div key={dependency.id} className={css.tree}>
          {this.renderBox(dependency.name)}
          {this.renderTree(dependency.dependencies)}
        </div>
      );
  }

  renderGraph() {
    const { dependencyTree } = this.props;
    if (dependencyTree) {
      return (
        <div className={css.graph}>
          <span className={css.close} onClick={this.handleClose} />
          {this.renderBox(dependencyTree.name, true)}
          {this.renderTree(dependencyTree.dependencies)}
        </div>
      );
    }

    return undefined;
  }

  render() {
    return (
      <ModalContainer onOverlayClick={this.handleClose}>
        {this.renderGraph()}
      </ModalContainer>
    );
  }
}
