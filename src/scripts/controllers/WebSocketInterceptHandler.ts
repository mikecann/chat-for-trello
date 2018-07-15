import { ILogger } from "mikeysee-helpers";
import { setProps, waitForMilliseconds } from "../helpers/utils";
import { action } from "mobx";
import { PageStore } from "../contentScript/stores/PageStore";
import { BoardStore } from "../contentScript/stores/BoardStore";

type NotifyMessage = {
    idModelChannel: string,
    ixLastUpdateChannel: number,
    notify: {
        event: string,
        typeName: "Board" | "List" | "Card" | "Action",
        deltas: Delta[]
        tags: string[],
        idBoard: string
        idAction?: string
    }
}

type Delta = {
    id: string
}

type ActionDelta = Delta & { type: string | "commentCard" };

export class WebSocketInterceptHandler {
    constructor(
        private logger: ILogger,
        private page: PageStore
    ) { }

    listen() {
        window.addEventListener("chat-for-trello-wrapped-WebSocket-message", this.onWebSocketMessage);
    }

    private onWebSocketMessage = async (e: CustomEvent) => {
        if (!e.detail)
            return;

        // Always pause a small amount to allow the Trello UI to update first
        await waitForMilliseconds(100);

        var content = JSON.parse(e.detail);
        this.logger.debug("WebSocket message intercepted", content);

        if (content["notify"])
            this.handleNotifyMessage(content as NotifyMessage);
    }

    @action private handleNotifyMessage(msg: NotifyMessage) {

        const board = this.page.board;

        if (!board)
            return;

        if (msg.notify.typeName == "Action")
            msg.notify.deltas.forEach(d => this.applyActionDelta(d as ActionDelta, board));

        if (msg.notify.idBoard != board.id)
            return;

        if (msg.notify.typeName == "Board")
            msg.notify.deltas.forEach(d => this.applyBoardDelta(d, board));

        if (msg.notify.typeName == "List")
            msg.notify.deltas.forEach(d => this.applyListDelta(d, board));

        if (msg.notify.typeName == "Card")
            msg.notify.deltas.forEach(d => this.applyCardDelta(d, board));
    }

    private applyBoardDelta(delta: Delta, board: BoardStore) {
        this.logger.debug("WebSocketInterceptHandler applying board delta", delta);
        setProps(board, delta);
    }

    private applyListDelta(delta: Delta, board: BoardStore) {
        //this.logger.debug("WebSocketInterceptHandler applying list delta", delta);
        // var list = board.lists.find(l => l.id == delta.id);
        // list ? setProps(list, delta) : board.lists.push(delta as TrelloList);
    }

    private applyCardDelta(delta: Delta, board: BoardStore) {
        //this.logger.debug("WebSocketInterceptHandler applying card delta", delta);
        // var card = board.cards.find(c => c.id == delta.id);
        // card ? setProps(card, delta) : board.cards.push(delta as TrelloCard);
    }

    private applyActionDelta(delta: ActionDelta, board: BoardStore) {

        this.logger.debug("WebSocketInterceptHandler detected delta change", delta);

        if (delta.type != "commentCard")
            return;

        const comment = delta as TrelloCommentAction;
        const isChatComment = comment.data.card.id == board.chat.card.id;

        if (!isChatComment)
            return;

        board.chat.history.push(comment);
        //var action = board.actions.find(a => a.id == delta.id);
        //action ? setProps(action, delta) : board.actions.push(delta as TrelloAction<any>);
    }
}

var commentAddedActionExample = {
    "notify": {
        "event": "updateModels",
        "typeName": "Action",
        "deltas": [
            {
                "id": "5b2e027e503faec9240290e5",
                "idMemberCreator": "53708ee03fb4a5df3ded2cb7",
                "data": {
                    "list": {
                        "name": "LIST AAA",
                        "id": "5b2cbbc729ec50c1a2e11750"
                    },
                    "board": {
                        "shortLink": "RiW0XdXM",
                        "name": "Chat for Trello Tests GGG",
                        "id": "5ac46c9b3dc1be71a87dca7b"
                    },
                    "card": {
                        "shortLink": "wrpurmIQ",
                        "idShort": 72,
                        "name": "CARD 1",
                        "id": "5b2dd4a86621bcb7930bf00b"
                    },
                    "text": "ChatForTrello! task completed"
                },
                "type": "commentCard",
                "date": "2018-06-23T08:19:10.920Z",
                "limits": {
                    "reactions": {
                        "perAction": {
                            "status": "ok",
                            "disableAt": 950,
                            "warnAt": 900
                        },
                        "uniquePerAction": {
                            "status": "ok",
                            "disableAt": 17,
                            "warnAt": 16
                        }
                    }
                },
                "display": {
                    "translationKey": "action_comment_on_card",
                    "entities": {
                        "contextOn": {
                            "type": "translatable",
                            "translationKey": "action_on",
                            "hideIfContext": true,
                            "idContext": "5b2dd4a86621bcb7930bf00b"
                        },
                        "card": {
                            "type": "card",
                            "hideIfContext": true,
                            "id": "5b2dd4a86621bcb7930bf00b",
                            "shortLink": "wrpurmIQ",
                            "text": "CARD 1"
                        },
                        "comment": {
                            "type": "comment",
                            "text": "ChatForTrello! task completed"
                        },
                        "memberCreator": {
                            "type": "member",
                            "id": "53708ee03fb4a5df3ded2cb7",
                            "username": "mikecann",
                            "text": "Mike Cann"
                        }
                    }
                },
                "entities": [
                    {
                        "type": "member",
                        "id": "53708ee03fb4a5df3ded2cb7",
                        "username": "mikecann",
                        "text": "Mike Cann"
                    },
                    {
                        "type": "text",
                        "text": "on",
                        "hideIfContext": true,
                        "idContext": "5b2dd4a86621bcb7930bf00b"
                    },
                    {
                        "type": "card",
                        "hideIfContext": true,
                        "id": "5b2dd4a86621bcb7930bf00b",
                        "shortLink": "wrpurmIQ",
                        "text": "CARD 1"
                    },
                    {
                        "type": "comment",
                        "text": "ChatForTrello! task completed"
                    }
                ],
                "memberCreator": {
                    "id": "53708ee03fb4a5df3ded2cb7",
                    "avatarHash": "68a12e163484f36070a94b5b25cb9f6d",
                    "avatarUrl": "https://trello-avatars.s3.amazonaws.com/68a12e163484f36070a94b5b25cb9f6d",
                    "fullName": "Mike Cann",
                    "initials": "MC",
                    "username": "mikecann"
                }
            }
        ],
        "tags": [
            "allActions",
            "clientActions"
        ],
        "idAction": "l-l-l-legacy"
    },
    "idModelChannel": "5ac46c9b3dc1be71a87dca7b",
    "ixLastUpdateChannel": 1543
}

var cardArchived = {
    "notify": {
        "event": "updateModels",
        "typeName": "Card",
        "deltas": [
            {
                "id": "5b2de6ee00fe8adbad0b20f2",
                "idBoard": "5ac46c9b3dc1be71a87dca7b",
                "idList": "5b2dd49f3ada965f39994254",
                "badges": {
                    "votes": 0,
                    "attachmentsByType": {
                        "trello": {
                            "board": 0,
                            "card": 0
                        }
                    },
                    "fogbugz": "",
                    "checkItems": 0,
                    "checkItemsChecked": 0,
                    "comments": 0,
                    "attachments": 0,
                    "description": false,
                    "due": null,
                    "dueComplete": false
                },
                "closed": true,
                "dueComplete": false,
                "dateLastActivity": "2018-06-23T06:25:14.743Z",
                "desc": "",
                "due": null,
                "idAttachmentCover": null,
                "idMembers": [],
                "idShort": 75,
                "labels": [],
                "limits": {
                    "attachments": {
                        "perCard": {
                            "status": "ok",
                            "disableAt": 950,
                            "warnAt": 900
                        }
                    },
                    "checklists": {
                        "perCard": {
                            "status": "ok",
                            "disableAt": 475,
                            "warnAt": 450
                        }
                    },
                    "stickers": {
                        "perCard": {
                            "status": "ok",
                            "disableAt": 67,
                            "warnAt": 63
                        }
                    }
                },
                "attachments": [],
                "customFieldItems": [],
                "idLabels": [],
                "name": "CARD 4",
                "pos": 196607,
                "shortLink": "w1o4gLcs",
                "url": "https://trello.com/c/w1o4gLcs/75-card-4",
                "pluginData": [],
                "stickers": []
            }
        ],
        "tags": [
            "updates"
        ],
        "idBoard": "5ac46c9b3dc1be71a87dca7b"
    },
    "idModelChannel": "5ac46c9b3dc1be71a87dca7b",
    "ixLastUpdateChannel": 1506
}

var listArchived = {
    "notify": {
        "event": "updateModels",
        "typeName": "List",
        "deltas": [
            {
                "id": "5b2de711f3fc1ea7877a5b6c",
                "name": "LIST C",
                "closed": true,
                "idBoard": "5ac46c9b3dc1be71a87dca7b",
                "pos": 199231.744140625
            }
        ],
        "tags": [
            "updates"
        ],
        "idBoard": "5ac46c9b3dc1be71a87dca7b"
    },
    "idModelChannel": "5ac46c9b3dc1be71a87dca7b",
    "ixLastUpdateChannel": 1503
}

var cardCreatedExample = {
    "notify": {
        "event": "updateModels",
        "typeName": "Card",
        "deltas": [
            {
                "id": "5b2de5c68849c002fa924e6d",
                "badges": {
                    "votes": 0,
                    "attachmentsByType": {
                        "trello": {
                            "board": 0,
                            "card": 0
                        }
                    },
                    "fogbugz": "",
                    "checkItems": 0,
                    "checkItemsChecked": 0,
                    "comments": 0,
                    "attachments": 0,
                    "description": false,
                    "due": null,
                    "dueComplete": false
                },
                "dueComplete": false,
                "idBoard": "5ac46c9b3dc1be71a87dca7b",
                "idList": "5b2dd49f3ada965f39994254",
                "dateLastActivity": "2018-06-23T06:16:38.092Z",
                "closed": false,
                "desc": "",
                "due": null,
                "idAttachmentCover": null,
                "idMembers": [],
                "idShort": 74,
                "labels": [],
                "limits": {
                    "attachments": {
                        "perCard": {
                            "status": "ok",
                            "disableAt": 950,
                            "warnAt": 900
                        }
                    },
                    "checklists": {
                        "perCard": {
                            "status": "ok",
                            "disableAt": 475,
                            "warnAt": 450
                        }
                    },
                    "stickers": {
                        "perCard": {
                            "status": "ok",
                            "disableAt": 67,
                            "warnAt": 63
                        }
                    }
                },
                "attachments": [],
                "customFieldItems": [],
                "idLabels": [],
                "name": "CARD 3",
                "pos": 131071,
                "shortLink": "wfvVn2Bl",
                "url": "https://trello.com/c/wfvVn2Bl/74-card-3",
                "pluginData": [],
                "stickers": []
            }
        ],
        "tags": [
            "updates"
        ],
        "idBoard": "5ac46c9b3dc1be71a87dca7b"
    },
    "idModelChannel": "5ac46c9b3dc1be71a87dca7b",
    "ixLastUpdateChannel": 1497
}

var renameCardExample = {
    "notify": {
        "event": "updateModels",
        "typeName": "Card",
        "deltas": [
            {
                "id": "5b2dd4a37ccd8dc900b3a174",
                "name": "CARD 00",
                "idBoard": "5ac46c9b3dc1be71a87dca7b",
                "idList": "5b2cbbc729ec50c1a2e11750",
                "dateLastActivity": "2018-06-23T06:10:37.955Z",
                "closed": false
            }
        ],
        "tags": [
            "updates"
        ],
        "idBoard": "5ac46c9b3dc1be71a87dca7b"
    },
    "idModelChannel": "5ac46c9b3dc1be71a87dca7b",
    "ixLastUpdateChannel": 1494
}

var renamingBoardExample = {
    "notify": {
        "event": "updateModels",
        "typeName": "Board",
        "deltas": [
            {
                "id": "5ac46c9b3dc1be71a87dca7b",
                "name": "Chat for Trello Tests AAA"
            }
        ],
        "tags": [
            "updates"
        ],
        "idBoard": "5ac46c9b3dc1be71a87dca7b"
    },
    "idModelChannel": "5ac46c9b3dc1be71a87dca7b",
    "ixLastUpdateChannel": 1470
}

var renamingListExample = {
    "notify": {
        "event": "updateModels",
        "typeName": "List",
        "deltas": [
            {
                "id": "5b2cbbc729ec50c1a2e11750",
                "name": "LIST AAA",
                "idBoard": "5ac46c9b3dc1be71a87dca7b"
            }
        ],
        "tags": [
            "updates"
        ],
        "idBoard": "5ac46c9b3dc1be71a87dca7b"
    },
    "idModelChannel": "5ac46c9b3dc1be71a87dca7b",
    "ixLastUpdateChannel": 1478
}