import React, { Component } from "react"
import PropTypes from "prop-types"
import { getGlobalState, restoreState, eventEmitter } from "./globalStore"
import Panel from "./Panel"
import Highlighter from "./Highlighter"
import Graph from "./Graph"

export default class DevTool extends Component {
    static propTypes = {
        highlightTimeout: PropTypes.number,
        noPanel: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        position: PropTypes.oneOfType(
            PropTypes.oneOf(['topRight', 'bottomRight', 'bottomLeft', 'topLeft']),
            PropTypes.shape({
                top: PropTypes.string,
                right: PropTypes.string,
                bottom: PropTypes.string,
                left: PropTypes.string,
            })
        )
    }

    static defaultProps = {
        noPanel: false,
        className: ''
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
