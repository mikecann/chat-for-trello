import { AuthStore } from "../auth/AuthStore";
import { IAPStore } from "../iap/IAPStore";
import { ILogger } from "../logging/types";
import { computed, observable } from "mobx";

export class SessionStore {
    constructor(private logger: ILogger, private auth: AuthStore, private iaps: IAPStore) {}

    async attemptToResumeSession() {
        try {
            await this.auth.authenticate(false);
            await this.iaps.load();
        } catch (e) {
            this.logger.warn(
                "SessionStore",
                "Could not resume session, the user will have to do so manually",
                e
            );
        }
    }

    startSession = async () => {
        await this.auth.authenticate(true);
        await this.iaps.load();
    };

    endSession = async () => {
        await this.auth.signout();
        await this.iaps.clear();
    };

    @computed
    get hasSession() {
        return this.auth.isAuthenticated && !this.iaps.isLoading;
    }

    @computed
    get isStartingSession() {
        return this.auth.isAuthenticating || this.iaps.isLoading;
    }
}
