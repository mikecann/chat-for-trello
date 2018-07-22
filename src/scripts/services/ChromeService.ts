export class ChromeService {
    async getBackgroundPage<T>(): Promise<T> {
        return new Promise<any>((resolve, reject) => {
            chrome.runtime.getBackgroundPage(page => resolve(page));
        });
    }

    async getActiveTab(): Promise<chrome.tabs.Tab> {
        return new Promise<any>((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => resolve(tabs[0]));
        });
    }

    async sendMessageAndWaitForResponse<T>(message: any): Promise<T> {
        return new Promise<any>((resolve, reject) => {
            chrome.runtime.sendMessage(message, response => resolve(response));
        });
    }

    // Thanks to this guide: https://gist.github.com/raineorshine/970b60902c9e6e04f71d
    async getAuthToken(details?: chrome.identity.TokenDetails): Promise<string> {
        if (!details) details = { interactive: true };

        return new Promise<string>((resolve, reject) => {
            chrome.identity.getAuthToken(details!, token => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                    return;
                }

                resolve(token);

                // var x = new XMLHttpRequest();
                // x.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
                // x.onload = () => resolve(x.response);
                // x.onerror = (e) => reject(e);
                // x.send();
            });
        });
    }

    get appVersion(): string {
        var manifest = chrome.runtime.getManifest();
        return manifest.version;
    }
}
