import { ILogger, Signal1, Signal2, Signal } from "mikeysee-helpers";

interface DOMWatcherOptions
{
    classes?: string[];
    childList?: boolean;
    subtree?: boolean;
    attributes?: boolean;
    characterData?: boolean;
}

export class DOMWatcher
{
    elementAdded: Signal1<Element>;
    elementRemoved: Signal1<Element>;
    characterDataChanged: Signal2<Element, string>;
    attributeChanged: Signal1<string>;

    private observer: MutationObserver;
    private logger: ILogger;
    private isStarted: boolean;
    private options: DOMWatcherOptions;

    constructor(logger: ILogger)
    {
        this.elementAdded = new Signal();
        this.attributeChanged = new Signal();
        this.elementRemoved = new Signal();
        this.characterDataChanged = new Signal();
        this.logger = logger;
        this.isStarted = false;
    }

    watch(element: Element, options?: DOMWatcherOptions)
    {
        if (this.isStarted == true)
            throw new Error("Cannot start, already stated!");

        this.logger.debug(`DOMWatcher Starting to watch element '${element}'`, element)
        this.options = options == null ? {} : options;
        this.isStarted = true;
        this.startObserving(element);
    }

    private startObserving(element: Element)
    {
        this.observer = new MutationObserver(mutations =>
        {
            mutations.forEach(m =>
            {
                for (let i = 0; i < m.addedNodes.length; i++)
                {
                    const added = m.addedNodes.item(i);
                    if (added instanceof Element)
                    {
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
                    this.characterDataChanged.dispatch(m.target.parentElement, m.target.nodeValue);                   

                if (m.attributeName != null) {
                    this.attributeChanged.dispatch(m.attributeName);
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

    private onElementAdded(el: Element)
    {
        if (!this.hasRequiredClasses(el))
            return;

        this.elementAdded.dispatch(el);
    }

    private onElementRemoved(el: Element) {
        if (!this.hasRequiredClasses(el))
            return;

        this.elementRemoved.dispatch(el);
    }

    hasRequiredClasses(el: Element)
    {
        if (this.options.classes == null)
            return true;

        for (let c of this.options.classes)
            if (!el.classList.contains(c))
                return false;

        return true;
    }

    stop()
    {
        this.observer.disconnect();
        this.isStarted = false;
    }
}