import mobx from 'mobx';

let logLevel = 0;
let logDisposer;

export function nextLogLevel() {
    return setLogLevel(logLevel + 1);
}

export function setLogLevel(newLevel) {
    logLevel = newLevel % 3;
    if (logLevel === 0 && logDisposer) {
        logDisposer();
    }
    if (logLevel === 1) {
        logDisposer = mobx.extras.trackTransitions(logger);
    }
    return logLevel;
}

function logger(change) {
    console.dir(change);
}