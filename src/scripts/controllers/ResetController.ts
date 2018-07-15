
const messageType = "ResetController-reset";

export class ResetController
{
    sendReset() {
        chrome.runtime.sendMessage({ type: messageType })
    }

    listenForReset(){
        chrome.runtime.onMessage.addListener((request, sender) => {
            
            if (request.type != messageType)
                return;

            window.location.reload();
        });
    }
}