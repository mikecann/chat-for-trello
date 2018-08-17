export interface UserInfo {
    id: string;
    email: string;
    name: string;
    given_name: string;
    family_name: string;
    link: string;
    picture: string;
    gender: string;
}

export interface UserLiscence {
    kind: string;
    itemId: string;
    result: boolean;
    accessLevel: "FREE_TRIAL" | "FULL" | "NONE";
    maxAgeSecs: string;
    createdTime: string;
}

export class GoogleCloudServices {
    async getUserInfo(token: string): Promise<UserInfo> {
        var response = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
        );
        return await response.json();
    }

    async getLicense(token: string): Promise<UserLiscence> {
        var init: RequestInit = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
        var response = await fetch(
            `https://www.googleapis.com/chromewebstore/v1.1/userlicenses/${chrome.runtime.id}`,
            init
        );
        return await response.json();
    }

    async getSkuDetails(): Promise<GoogleIAPSKUDetails> {
        return new Promise<GoogleIAPSKUDetails>((resolve, reject) => {
            google.payments.inapp.getSkuDetails({
                parameters: { env: "prod" },
                success: (resp: any) => resolve(resp.response.details),
                failure: (err: any) => reject(err)
            });
        });
    }

    async getPurchases(): Promise<GoogleIAPPurchase[]> {
        return new Promise<GoogleIAPPurchase[]>((resolve, reject) => {
            google.payments.inapp.getPurchases({
                parameters: { env: "prod" },
                success: (resp: any) => resolve(resp.response.details),
                failure: (err: any) => reject(err)
            });
        });
    }

    async buy(sku: string): Promise<GoogleIAPBuyResponse[]> {
        return new Promise<GoogleIAPBuyResponse[]>((resolve, reject) => {
            google.payments.inapp.buy({
                parameters: { env: "prod" },
                sku,
                success: (resp: any) => resolve(resp),
                failure: (err: any) => reject(err)
            });
        });
    }
}
