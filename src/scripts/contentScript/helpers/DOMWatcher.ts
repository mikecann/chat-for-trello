import { ILogger } from "../../lib/logging/types";

interface DOMWatcherOptions {
    classes?: string[];
    childList?: boolean;
    subtree?: boolean;
    attributes?: boolean;
    characterData?: boolean;
}

export class DOMWatcher {
    elementAdded = (el: Element) => {};
    elementRemoved = (el: Element) => {};
    characterDataChanged = (el: Element, char: string) => {};
    attributeChanged = (attrib: string) => {};

    private observer: MutationObserver;
    private logger: ILogger;
    private isStarted: boolean;
    private options: DOMWatcherOptions;

    constructor(logger: ILogger) {
        this.logger = logger;
        this.isStarted = false;
    }

    watch(element: Element, options?: DOMWatcherOptions) {
        if (this.isStarted == true) throw new Error("Cannot start, already stated!");

        this.logger.debug(`DOMWatcher Starting to watch element '${element}'`, element);
        this.options = options == null ? {} : options;
        this.isStarted = true;
        this.startObserving(element);
    }

    private startObserving(element: Element) {
        this.observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                for (let i = 0; i < m.addedNodes.length; i++) {
                    const added = m.addedNodes.item(i);
                    if (added instanceof Element) {
                        const el = <Element>added;
                        this.onElementAdded(el);
                    }
                }

                for (let i = 0; i < m.removedNodes.length; i++) {
                    const removed = m.removedNodes.item(i);
                    if (removed instanceof Element) {
                        const el = <Element>removed;
                        this.onElementRemoved(el);
                    }
                }

                if (m.type == "characterData" && m.target.parentElement && m.target.nodeValue)
                    this.characterDataChanged(m.target.parentElement, m.target.nodeValue);

                if (m.attributeName != null) {
                    this.attributeChanged(m.attributeName);
                }
            });
        });
        this.observer.observe(element, {
            childList: this.options.childList,
            subtree: this.options.subtree,
            attributes: this.options.attributes,
            characterData: this.options.characterData
        });
    }

    private onElementAdded(el: Element) {
        if (!this.hasRequiredClasses(el)) return;

        this.elementAdded(el);
    }

    private onElementRemoved(el: Element) {
        if (!this.hasRequiredClasses(el)) return;

        this.elementRemoved(el);
    }

    hasRequiredClasses(el: Element) {
        if (this.options.classes == null) return true;

        for (let c of this.options.classes) if (!el.classList.contains(c)) return false;

        return true;
    }

    stop() {
        this.observer.disconnect();
        this.isStarted = false;
    }
}
