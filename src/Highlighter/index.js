import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from '../react-css-transition-group';
import classNames from 'classnames';
import css from './hightlighter.css';
import cssTransitions from './transitions.css';

export default class Highlighter extends Component {

  static propTypes = {
    boxes: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['rendering', 'hover']).isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      renderInfo: PropTypes.shape({
        count: PropTypes.number.isRequired,
        renderTime: PropTypes.number.isRequired,
        totalTime: PropTypes.number.isRequired,
        cost: PropTypes.oneOf(['cheap', 'acceptable', 'expensive']).isRequired,
      }),
    })).isRequired,
  };

  renderBox(box) {
    switch (box.type) {
      case 'rendering':
        return (
          <div
            key={box.id}
            className={classNames(css.box, css.rendering, css[box.renderInfo.cost])}
            style={{
                left: box.x,
                top: box.y,
                width: box.width,
                height: box.height,
              }}
          >
            <span className={css.text}>
              {box.renderInfo.count}x | {box.renderInfo.renderTime} / {box.renderInfo.totalTime} ms
            </span>
          </div>
        );

      case 'hover':
        return (
          <div
            key={box.id}
            className={classNames(css.box, css.hover)}
            style={{
                left: box.x,
                top: box.y,
                width: box.width,
                height: box.height,
              }}
          />
        );

      default:
        throw new Error();
    }
  }

  render() {
    const { boxes } = this.props;

    return (
      <div>
        <ReactCSSTransitionGroup
          transitionName={cssTransitions}
          transitionEnterTimeout={50}
          transitionLeaveTimeout={500}
        >
          {boxes.map(box => this.renderBox(box))}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}
