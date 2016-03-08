import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from '../react-css-transition-group';
import classNames from 'classnames';
import transitions from './transitions.css';
import css from './modal.css';

export default class ModalContaner extends Component {

  static propTypes = {
    children: PropTypes.node,
    onOverlayClick: PropTypes.func.isRequired,
  };


  componentDidUpdate(prevProps) {
    const html = document.body.parentNode;
    if (prevProps.children && !this.props.children) {
      // Disapeared
      this.rightOffset = 0;
      html.style.borderRight = null;
      html.classList.remove(css.htmlWithModal);
    } else if (!prevProps.children && this.props.children) {
      // Appeared
      const prevTotalWidth = html.offsetWidth;
      html.classList.add(css.htmlWithModal);
      const nextTotalWidth = html.offsetWidth;
      const rightOffset = Math.max(0, nextTotalWidth - prevTotalWidth);
      html.style.borderRight = `${rightOffset}px solid transparent`
    }
  }

  stopPropogation = e => e.stopPropagation();

  render() {
    const { children, onOverlayClick } = this.props;
    return (
      <ReactCSSTransitionGroup
        transitionName={transitions}
        transitionAppear
        transitionAppearTimeout={100}
        transitionEnterTimeout={100}
        transitionLeaveTimeout={100}
      >
        {children &&
          <div
            className={css.overlay}
            onClick={onOverlayClick}
          >
            <div
              key="content"
              className={classNames(css.modal, transitions.zoom)}
              onClick={this.stopPropogation}
            >
              {children}
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    );
  }
}
