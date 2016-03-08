import mobx from 'mobx';
import mobxReact from 'mobx-react';

const getCost = renderTime => {
  switch(true) {
    case renderTime < 25: return 'cheap';
    case renderTime < 100: return 'acceptable';
    default: return 'expensive'
  }
};

export default class RenderingMonitor {

  boxesList = [];
  _boxesRegistry = typeof WeakMap !== 'undefined' ? new WeakMap() : new Map();

  constructor({ hightlightTimeout, onUpdate, shouldReport, getCoordinates }) {

    this.handleUpdate = onUpdate;

    this._disposeRenderReporter = mobxReact.renderReporter.on(report => {
      if (shouldReport() !== true) return;
      switch (report.event) {

        case 'render':
          if (!report.node) return;
          const offset = getCoordinates(report.node);
          const box = this.getBoxForNode(report.node);
          box.type = 'rendering';
          box.y = offset.top;
          box.x = offset.left;
          box.width = offset.width;
          box.height = offset.height;
          box.renderInfo = {
            count: box.renderInfo && ++box.renderInfo.count || 1,
            renderTime: report.renderTime,
            totalTime: report.totalTime,
            cost: getCost(report.renderTime),
          };

          if (this.boxesList.indexOf(box) === -1) this.boxesList = this.boxesList.concat([box]);
          this.handleUpdate();
          if (box._timeout) clearTimeout(box._timeout);
          box._timeout = setTimeout(() => this.removeBox(report.node, true), hightlightTimeout);
          return;

        case 'destroy':
          this.removeBox(report.node);
          this._boxesRegistry.delete(report.node);
          return;

        default:
          return;
      }
    });
  }

  getBoxForNode(node) {
    if (this._boxesRegistry.has(node)) return this._boxesRegistry.get(node);
    const box  = {
      id: Math.random().toString(32).substr(2),
    };
    this._boxesRegistry.set(node, box);
    return box;
  };

  dispose() {
    this._disposeRenderReporter();
  }

  removeBox(node) {
    if (this._boxesRegistry.has(node) === false) return;
    const index = this.boxesList.indexOf(this._boxesRegistry.get(node));
    if (index !== -1) {
      this.boxesList = this.boxesList.slice(0, index).concat(this.boxesList.slice(index + 1));
      this.handleUpdate();
    }
  };

}
