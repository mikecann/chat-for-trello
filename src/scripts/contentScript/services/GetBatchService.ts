import { ILogger } from "../../lib/logging/types";
import { HttpHelpers } from "../../lib/http/HttpHelpers";
import { constructURL } from "../../common/utils";
interface BatchedGetRequest {
    url: string;
    resolve: (data: any) => void;
    reject: (err: any) => void;
}

export class GetBatchService {
    private dispatchTimeout: number;
    private queue: BatchedGetRequest[];
    private outgoingBatch: BatchedGetRequest[] | null;

    constructor(private logger: ILogger, private serviceHelpers: HttpHelpers) {
        this.queue = [];
        this.dispatchTimeout = -1;
    }

    batch<T>(url: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.queue.push({
                url: url,
                resolve: resolve,
                reject: reject
            });

            if (this.dispatchTimeout == -1)
                this.dispatchTimeout = <any>setTimeout(() => this.dispatchBatch(), 100);
        });
    }

    dispatchBatch(): void {
        this.dispatchTimeout = -1;

        if (this.outgoingBatch != null) return;

        if (this.queue.length == 0) return;

        this.outgoingBatch = this.queue.splice(0, Math.min(this.queue.length, 40));

        this.logger.debug("Dispatching GET batch", this.outgoingBatch.length, this.outgoingBatch);

        var urls = this.outgoingBatch.map(b => b.url.replace("https://trello.com/1", "")).join(",");

        var url = constructURL("https://trello.com/1/batch", { urls: urls });
        this.serviceHelpers
            .get<any>(url)
            .then(result => this.onBatchSuccess(result))
            .catch(err => this.onBatchError(err));
    }

    private onBatchSuccess(result: any[]) {
        this.logger.debug("GET batch returned", result);
        for (var i = 0; i < result.length; i++) {
            if (this.outgoingBatch == null) throw new Error("Outgoing batch cannot be null!");

            var success = result[i]["200"];
            if (success == null) this.outgoingBatch[i].reject(result[i]);
            else this.outgoingBatch[i].resolve(result[i]["200"]);
        }
        this.outgoingBatch = null;

        if (this.dispatchTimeout == -1)
            this.dispatchTimeout = <any>setTimeout(() => this.dispatchBatch(), 100);
    }

    onBatchError(err: any) {
        this.logger.error("GET batch errored", err);
        this.outgoingBatch = null;
    }
}
