import { ILogger, AggregateLogger, ConsoleLogger } from 'mikeysee-helpers';
import { AppSettingsModel, AppSettings } from '../models/AppSettingsModel';
import { LogFilter, FilteredLogger } from './FilteredLogger';
import { LogLevel } from './Logging';
import { BackgroundPage } from '../background/background';
import { ExtensionMessagingLogger, LogMessage } from './ExtensionMessagingLogger';
import { ChromeService } from '../services/ChromeService';
import { toJS } from 'mobx';
import { LogMessagesFromExtensionModel } from '../models/LogMessagesFromExtensionModel';

export function waitForMilliseconds(ms: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        setTimeout(resolve, ms);
    })
}

export function toArray<T extends Node>(nodes: NodeListOf<T>): T[] {
    var array: T[] = [];
    for (var i = nodes.length; i--; array.unshift(nodes[i]));
    return array;
}

export function insertAfter(newNode: HTMLElement, referenceNode: HTMLElement) {
    var parent = referenceNode.parentNode;
    if (parent == null)
        throw Error("Parent cannot be null!");

    parent.insertBefore(newNode, referenceNode.nextSibling);
}

export function insertBefore(newNode: HTMLElement, referenceNode: HTMLElement) {
    var parent = referenceNode.parentNode;
    if (parent == null)
        throw Error("Parent cannot be null!");

    parent.insertBefore(newNode, referenceNode);
}

export async function pageLoaded() {
    return new Promise((resolve, reject) => {
        document.addEventListener("load", e => resolve());
    })
}

export function getCardShortlink(url: string) {
    
    var regex = /http.*:\/\/trello.com\/c\/(.*)/g;
    var match = regex.exec(url);
    console.log("MATCH", match);
    if (match == null || match.length != 2)
        throw new Error("Could not getCardShortlink. Invalid matches: "+url);

    return match[1];
}

export function constructURL(url: string, params: any = null): string {
    if (params == null)
        params = {};

    var keyCount = Object.keys(params).length;
    if (keyCount == 0)
        return url;

    return url + "?" + param(params);
}

export function param(obj: any): string {
    var str: string[] = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export function getCardIsDoneStatus(card: TrelloCard, board: TrelloBoard): boolean {
    const comments = getCardComments(card, board);
    //console.log("DONE STATUS", toJS(card), JSON.parse(JSON.stringify(comments)));
    return calculateCurrentTaskStatusFromComments(comments.map(a => a.data));
}

export function getCardComments(card: TrelloCard, board: TrelloBoard) {
    return  board.actions
        .filter(a => a.type == "commentCard")
        .map(a => a as TrelloAction<TrelloComment>)
        .filter(a => a.data.card.id == card.id)
        .sort((a, b) => {
            if (b.id == a.id)
                return b.isLocal ? 1 : -1;
            
            return idToUTC(b.id) - idToUTC(a.id);
        });
}

export function getANewIdForComment(card: TrelloCard, board: TrelloBoard): string {
    const comments = getCardComments(card, board);
    if (comments.length == 0)
        return dateToId(new Date(0,0,0));
    
    return comments[0].id;
}

export function calculateCurrentTaskStatusFromComments(comments: TrelloComment[]): boolean {
    for (let comment of comments) {
        if (comment.text.indexOf("TrelloChat! task completed") != -1)
            return true;

        if (comment.text.indexOf("ChatForTrello! task completed") != -1)
            return true;

        if (comment.text.indexOf("TrelloChat! task uncompleted") != -1)
            return false;

        if (comment.text.indexOf("ChatForTrello! task uncompleted") != -1)
            return false;
    }
    return false;
}

export function dateToId(date: Date): string {
    return Math.floor(date.getTime() / 1000).toString(16) + "0000000000000000";
}

export function idToUTC(id: string): number {
    return 1000*parseInt(id.substring(0,8),16);
} 

export function idToDate(id: string): Date {
    return new Date(1000*parseInt(id.substring(0,8),16));
} 

export function logUnhandledErrors(logger: ILogger) {
    window.addEventListener("error", (e) => {

        console.error("Unhandled Error occurred", e);

        logger.error("Unhandled error", {
            column: e.colno,
            message: e.message,
            line: e.lineno,
            stack: e.error ? e.error.stack : undefined,
            filename: e.filename
        });

        return false;
    })
}

const shouldLog: { [key: string]: LogLevel[] } = {
    debug: ["debug", "info", "warn", "error"],
    info: ["info", "warn", "error"],
    warn: ["warn", "error"],
    error: ["error"],
}

export function createAppSettingsLogFilter(appSettings: AppSettings): LogFilter {
    return (level, area) => shouldLog[appSettings.logLevel].indexOf(level) != -1;
}

export function createBackgroundAppSettingsLogFilter(background: BackgroundPage): LogFilter {
    return (level, area) =>
        background.appSettings
            ? shouldLog[background.appSettings.settings.logLevel].indexOf(level) != -1
            : true;
}

export async function setupStandardLogging(pageName: string, logSender?: (msg: LogMessage) => void): Promise<ILogger> {
    const service = new ChromeService();
    const background = await service.getBackgroundPage<BackgroundPage>();
    const aggregateLogger = new AggregateLogger();
    aggregateLogger.loggers = [new ConsoleLogger(), new ExtensionMessagingLogger(pageName, logSender || chrome.runtime.sendMessage)];
    const logger = new FilteredLogger(aggregateLogger);
    logUnhandledErrors(logger);
    logger.filter = createBackgroundAppSettingsLogFilter(background);
    logger.info(`Chat for Trello v${service.appVersion} starting up ${pageName}`, {env: process.env})
    return logger;
}

export const isDevMode = process.env.NODE_ENV == "development";

export function addLiveReloadIfDevMode() {
    if (!isDevMode)
        return;

    const scriptTag = document.createElement("script");
    scriptTag.src = "http://localhost:35729/livereload.js";
    document.body.appendChild(scriptTag);
}

export function setProps(target: object, props: object) {
    for(var key in props) {
        if (target.hasOwnProperty(key))
            target[key] = props[key];
    }
}