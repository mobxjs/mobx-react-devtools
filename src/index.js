import { setGlobalState } from "./globalStore"

export { default } from "./DevTool"
export { default as GraphControl } from "./Controls/GraphControl"
export { default as LogControl } from "./Controls/LogControl"
export { default as UpdatesControl } from "./Controls/UpdatesControl"

export const configureDevtool = ({ logEnabled, updatesEnabled, graphEnabled, logFilter }) => {
    const config = {}
    if (logEnabled !== undefined) {
        config.logEnabled = Boolean(logEnabled)
    }
    if (updatesEnabled !== undefined) {
        config.updatesEnabled = Boolean(updatesEnabled)
    }
    if (graphEnabled !== undefined) {
        config.graphEnabled = Boolean(graphEnabled)
    }
    if (typeof logFilter === "function") {
        config.logFilter = logFilter
    }
    setGlobalState(config)
}

export const setUpdatesEnabled = updatesEnabled => configureDevtool({ updatesEnabled })
export const setGraphEnabled = graphEnabled => configureDevtool({ graphEnabled })
export const setLogEnabled = logEnabled => configureDevtool({ logEnabled })
