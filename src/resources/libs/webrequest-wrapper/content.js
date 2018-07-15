// Thanks to https://www.moesif.com/blog/technical/apirequest/How-We-Captured-AJAX-Requests-with-a-Chrome-Extension/
function captureXMLHttpRequest(recorder) {
    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    // Collect data:
    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();
        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function (postData) {
        this.addEventListener('load', function () {

            recorder({ request: {
                headers: this._requestHeaders,
                url: this._url,
                method: this._method
            }, response: this.responseText })
          
        });
        return send.apply(this, arguments);
    };

    var undoPatch = function () {
        XHR.open = open;
        XHR.send = send;
        XHR.setRequestHeader = setRequestHeader;
    };

    return undoPatch;
}

captureXMLHttpRequest(event => {
    window.dispatchEvent(new CustomEvent("wrapped-webRequest-message", {detail: event}));
});