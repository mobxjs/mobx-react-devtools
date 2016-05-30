import mobx from 'mobx';

let logDisposer = null;

export function setLogLevel(newLevel) {
    if (newLevel === true && !logDisposer) {
        console.log("The output of the MobX logger is optimized for Chrome");
        logDisposer = mobx.spy(logger);
    } else if (newLevel === false && logDisposer) {
        logDisposer();
        logDisposer = null;
    }
}

function logger(change) {
    if (change.spyReportEnd === true) {
        if (typeof change.time === "number") {
            log("%ctotal time: %sms", "color:gray", change.time);
        }
        console.groupEnd();
    } else {
        const logNext = change.spyReportStart === true ? group : log;
        switch (change.type) {
            case 'action':
                // name, target, arguments, fn
                logNext(`%caction '%s' %s`, 'color:blue', change.name, autoWrap("(", getNameForThis(change.target)));
                log(change.arguments);
                // dir({
                //     fn: change.fn,
                //     target: change.target
                // });
                trace();
                break;
            case 'transaction':
                // name, target
                logNext(`%ctransaction '%s' %s`, 'color:gray', change.name, autoWrap("(", getNameForThis(change.target)));
                break;
            case 'scheduled-reaction':
                // object
                logNext(`%cscheduled async reaction '%s'`, 'color:green', observableName(change.object));
                break;
            case 'reaction':
                // object, fn
                logNext(`%creaction '%s'`, 'color:green', observableName(change.object));
                // dir({
                //     fn: change.fn
                // });
                trace();
                break;
            case 'compute':
                // object, target, fn
                group(`%ccomputed '%s' %s`, 'color:green', observableName(change.object), autoWrap("(", getNameForThis(change.target)));
                // dir({
                //    fn: change.fn,
                //    target: change.target 
                // });
                groupEnd();
                break;
            case 'error':
                // message
                logNext('%cerror: %s', 'color:red', change.message);
                trace();
                closeGroupsOnError();
                break;
            case 'update':
                // (array) object, index, newValue, oldValue
                // (map, obbject) object, name, newValue, oldValue
                // (value) object, newValue, oldValue
                if (mobx.isObservableArray(change.object)) {
                    logNext("updated '%s[%s]': %s (was: %s)", observableName(change.object), change.index, formatValue(change.newValue), formatValue(change.oldValue));
                } else if (mobx.isObservableObject(change.object)) {
                    logNext("updated '%s.%s': %s (was: %s)", observableName(change.object), change.name, formatValue(change.newValue), formatValue(change.oldValue));
                } else {
                    logNext("updated '%s': %s (was: %s)", observableName(change.object), change.name, formatValue(change.newValue), formatValue(change.oldValue));
                }
                dir({
                    newValue: change.newValue,
                    oldValue: change.oldValue
                });
                trace();
                break;
            case 'splice':
                // (array) object, index, added, removed, addedCount, removedCount
                logNext("spliced '%s': index %d, added %d, removed %d", observableName(change.object), change.index, change.addedCount, change.removedCount);
                dir({
                    added: change.added,
                    removed: change.removed
                });
                trace();
                break;
            case 'add':
                // (map, object) object, name, newValue
                logNext("set '%s.%s': %s", observableName(change.object), change.name, formatValue(change.newValue));
                dir({
                    newValue: change.newValue
                });
                trace();
                break;
            case 'delete':
                // (map) object, name, oldValue
                logNext("removed '%s.%s' (was %s)", observableName(change.object), change.name, formatValue(change.oldValue));
                dir({
                    oldValue: change.oldValue
                });
                trace();
                break;
            case 'create':
                // (value) object, newValue
                logNext("set '%s': %s", observableName(change.object), formatValue(change.newValue));
                dir({
                    newValue: change.newValue
                });
                trace();
                break;
            default:
                // generic fallback for future events
                logNext(change.type);
                dir(change);
                break;
        }
    }
}

const consoleSupportsGroups = typeof console.groupCollapsed === "function";
let currentDepth = 0;

function group() {
    // TODO: firefox does not support formatting in groupStart methods..
    console[consoleSupportsGroups ? "groupCollapsed" : "log"].apply(console, arguments);
    currentDepth++;
}

function groupEnd() {
    currentDepth--;
    if (consoleSupportsGroups)
        console.groupEnd();
}

function log() {
    console.log.apply(console, arguments);
}

function dir() {
    console.dir.apply(console, arguments);
}

function trace() {
    // TODO: needs wrapping in firefox?
    console.trace("stack"); // TODO: use stacktrace.js or similar and strip off unrelevant stuff?
}

function closeGroupsOnError() {
    for (let i = 0, m = currentDepth; i < m; i++)
        groupEnd();
}

const closeToken = {
    "\"" : "\"",
    "'" : "'",
    "(" : ")",
    "[" : "]",
    "<" : "]",
    "#" : ""
}

function autoWrap(token, value) {
    if (!value)
        return "";
    return (token || "") + value + (closeToken[token] || "");
}

function observableName(object) {
    return mobx.extras.getDebugName(object);
}

function formatValue(value) {
    if (isPrimitive(value)) {
        if (typeof value === "string" && value.length > 100)
            return value.substr(0, 97) + "..."
        return value;
    } else
        return autoWrap("(", getNameForThis(value));
}

function getNameForThis(who) {
    if (who === null || who === undefined) {
        return "";
    } else if (who && typeof who === "object") {
	    if (who && who.$mobx) {
		    return who.$mobx.name;
        } else if (who.constructor) {
            return who.constructor.name || "object";
        }
	}
	return `${typeof who}`;
}

function isPrimitive(value) {
	return value === null || value === undefined || typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}