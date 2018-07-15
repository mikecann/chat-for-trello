declare const google : any;

declare interface GoogleIAPProductPrice {
    valueMicros: string,
    currencyCode: string,
    regionCode: string
}

declare interface GoogleIAPProduct {
    kind: string,
    sku: string,
    item_id: string,
    type: string,
    state: string,
    prices: GoogleIAPProductPrice[]
    localeDate: any
}

declare interface GoogleIAPSKUDetails {
    kind: string,
    inAppProducts: GoogleIAPProduct[];
}

declare interface GoogleIAPSKUDetailsResponse {
    response: {
        details: GoogleIAPSKUDetails
    }
}

declare interface GoogleIAPPurchase {
    kind: string,
    itemId: string,
    sku: string,
    createdTime: string,
    state: string
}

declare interface GoogleIAPBuyResponse {
    jwt: string,
    request: {
        cartId: string
    },
    response: {
        orderId: string
    }
}