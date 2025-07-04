export function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

export function getProperCapitalization(text: string) {
    return text.substring(0, 1).toUpperCase() + text.substring(1).toLowerCase();
}

export function getMultiWordCapitalization(word: string): string {
    return word.split("_").map(w => w.substring(0, 1).toUpperCase() + w.substring(1).toLowerCase()).join(" ");
}