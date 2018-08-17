import { observable, toJS, computed, action, runInAction } from "mobx";
import { IPersistable } from "../persistance/IPersistable";
import { ILogger } from "../logging/types";
import { UserInfo, GoogleCloudServices } from "../chrome/GoogleCloudServices";
import { ChromeService } from "../chrome/ChromeService";

type JsonProps = {
    token?: string;
    userInfo?: UserInfo;
};

export class AuthStore implements IPersistable<JsonProps> {
    @observable token?: string;

    @observable userInfo?: UserInfo;

    @observable isAuthenticating = false;

    constructor(
        private logger: ILogger,
        private chromeService: ChromeService,
        private cloudServices: GoogleCloudServices,
        private intervaler = setInterval
    ) {}

    @computed
    get isAuthenticated(): boolean {
        return this.userInfo != undefined;
    }

    @action
    async authenticate(interactive = true) {
        this.logger.debug(
            "AuthStore",
            "attempting to authenticate to get auth token from chrome.."
        );

        try {
            this.isAuthenticating = true;
            var token = await this.chromeService.getAuthToken({ interactive });
            this.logger.debug("AuthStore", "token loaded. Getting user info..", { token });
            var userInfo = await this.cloudServices.getUserInfo(token);

            runInAction(() => {
                this.token = token;
                this.userInfo = userInfo;
            });
        } catch (e) {
            throw e;
        } finally {
            runInAction(() => {
                this.isAuthenticating = false;
            });
        }
    }

    @action
    debugAuth(email: string) {
        console.log("debug auth", email);
        this.userInfo = {
            email
        } as any;
    }

    startPeriodicallyReauthenticating(intervalMs = 3600000) {
        this.intervaler(() => this.authenticate(false), intervalMs);
    }

    @action
    signout() {
        this.logger.debug("AuthStore", "logging user out..");
        this.token = undefined;
        this.userInfo = undefined;
    }

    @computed
    get asJson(): JsonProps {
        return {
            token: this.token,
            userInfo: this.userInfo
        };
    }

    fromJson(json: JsonProps) {
        this.token = json.token;
        this.userInfo = json.userInfo;
    }
}
