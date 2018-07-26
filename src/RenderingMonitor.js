import { renderReporter } from "mobx-react"
import { getGlobalState, setGlobalState } from "./globalStore"

const getCost = renderTime => {
    switch (true) {
        case renderTime < 25:
            return "cheap"
        case renderTime < 100:
            return "acceptable"
        default:
            return "expensive"
    }
}

export default class RenderingMonitor {
    _boxesRegistry = typeof WeakMap !== "undefined" ? new WeakMap() : new Map()

    constructor({ highlightTimeout }) {
        this._renderReporterDisposer = renderReporter.on(report => {
            if (getGlobalState().updatesEnabled !== true) return
            switch (report.event) {
                case "render":
                    if (!report.node || !report.node.getBoundingClientRect || isNaN(report.renderTime)) return
                    const offset = report.node.getBoundingClientRect()
                    const box = this.getBoxForNode(report.node)
                    box.type = "rendering"
                    box.y = offset.top
                    box.x = offset.left
                    box.width = offset.width
                    box.height = offset.height
                    box.renderInfo = {
                        count: (box.renderInfo && ++box.renderInfo.count) || 1,
                        renderTime: report.renderTime,
                        totalTime: report.totalTime,
                        cost: getCost(report.renderTime)
                    }
                    box.lifeTime = highlightTimeout

                    let renderingBoxes = getGlobalState().renderingBoxes
                    if (renderingBoxes.indexOf(box) === -1)
                        renderingBoxes = renderingBoxes.concat([box])
                    setGlobalState({ renderingBoxes })
                    if (box._timeout) clearTimeout(box._timeout)
                    box._timeout = setTimeout(
                        () => this.removeBox(report.node, true),
                        highlightTimeout
                    )
                    return

                case "destroy":
                    this.removeBox(report.node)
                    this._boxesRegistry.delete(report.node)
                    return

                default:
                    return
            }
        })
    }

    getBoxForNode(node) {
        if (this._boxesRegistry.has(node)) return this._boxesRegistry.get(node)
        const box = {
            id: Math.random()
                .toString(32)
                .substr(2)
        }
        this._boxesRegistry.set(node, box)
        return box
    }

    dispose() {
        this._renderReporterDisposer()
    }

    removeBox(node) {
        if (this._boxesRegistry.has(node) === false) return
        let renderingBoxes = getGlobalState().renderingBoxes
        const index = renderingBoxes.indexOf(this._boxesRegistry.get(node))
        if (index !== -1) {
            renderingBoxes = renderingBoxes.slice(0, index).concat(renderingBoxes.slice(index + 1))
            setGlobalState({ renderingBoxes })
        }
    }
}
