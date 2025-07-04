let notFoundTriggered = false;

export function setNotFound() {
    notFoundTriggered = true;
}

export function isNotFound() {
    return notFoundTriggered;
}