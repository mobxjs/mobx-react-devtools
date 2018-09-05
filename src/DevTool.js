import React, { Component } from "react"
import PropTypes from "prop-types"
import { getGlobalState, restoreState, eventEmitter } from "./globalStore"
import Panel from "./Panel"
import Highlighter from "./Highlighter"
import Graph from "./Graph"

export default class DevTool extends Component {
    static propTypes = {
        highlightTimeout: PropTypes.number,
        position: PropTypes.object,
        noPanel: PropTypes.bool,
        className: PropTypes.string,
        style: propTypes.object
    }

    static defaultProps = {
        noPanel: false
    }

    componentWillMount() {
        this.setState(getGlobalState())
    }

    componentDidMount() {
        eventEmitter.on("update", this.handleUpdate)
    }

    componentWillUnmount() {
        eventEmitter.removeListener("update", this.handleUpdate)
    }

    handleUpdate = () => this.setState(getGlobalState())

    handleToggleGraph = () => {
        this.setState({
            hoverBoxes: [],
            graphEnabled: !this.state.graphEnabled
        })
    }

    render() {
        const { noPanel, highlightTimeout, className, style } = this.props
        const { renderingBoxes, hoverBoxes } = this.state
        return (
            <div>
                {noPanel !== true && (
                    <Panel
                        position={this.props.position}
                        highlightTimeout={highlightTimeout}
                        className={className}
                        style={style}
                    />
                )}
                <Highlighter boxes={renderingBoxes.concat(hoverBoxes)} />
                <Graph />
            </div>
        )
    }
}
