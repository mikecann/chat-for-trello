import { runInAction } from "mobx";
import { PageStore } from "../contentScript/stores/PageStore";
import { ILogger } from "../lib/logging/types";
import { setProps } from "../common/utils";

interface InterceptedData {
    request: {
        method: string;
        url: string;
        headers: { [key: string]: string };
    };
    response: string;
}

export class WebRequestInterceptorHandler {
    constructor(private logger: ILogger, private page: PageStore) {}

    listen() {
        window.addEventListener("wrapped-webRequest-message", this.onWebRequestMessage);
    }

    private onWebRequestMessage = (e: CustomEvent) => {
        if (!e.detail) return;

        const data = e.detail as InterceptedData;
        this.logger.debug("WebRequestInterceptorHandler", "Intercepted web request", data);

        try {
            var response = JSON.parse(data.response);
            if (response.id) this.updateModel(response.id, response);
        } catch (e) {
            this.logger.warn("Could not convert web request response to json", e, data.response);
        }
    };

    updateModel(modelId: string, data: any) {
        const board = this.page.board;
        if (!board) return;

        if (board.id == modelId) {
            this.logger.debug(
                "WebRequestInterceptorHandler",
                "Updating Board with new data",
                modelId,
                data
            );
            runInAction(() => setProps(board, data));
            return;
        }

        // const card = board.cards.find(c => c.id == modelId);
        // if (card) {
        //     this.logger.debug("WebRequestInterceptorHandler", "Updating Card with new data", modelId, data);
        //     runInAction(() => setProps(card, data));
        //     return;
        // }

        // const list = board.lists.find(c => c.id == modelId);
        // if (list) {
        //     this.logger.debug("WebRequestInterceptorHandler", "Updating List with new data", modelId, data);
        //     runInAction(() => setProps(list, data));
        //     return;
        // }
    }
}
