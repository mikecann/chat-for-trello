declare interface TrelloAction<T> {
    id: string;
    type: string; // and a bunch of other things but I dont want to put them all in
    data: T;
    isLocal?: boolean;
    // a bunch of other stuff here but cant be bothered to list
}

declare interface TrelloList {
    id: string;
    name: string;
    idBoard: string;
    closed: boolean;
    // a bunch of other stuff here but cant be bothered to list
}

declare interface TrelloCard {
    id: string;
    name: string;
    idBoard: string;
    idList: string;
    closed: boolean;
    pos: number;
    dateLastActivity: string;
    // a bunch of other stuff here but cant be bothered to list
}

declare interface TrelloBoard {
    id: string;
    name: string;
    lists: TrelloList[];
    cards: TrelloCard[];
    actions: TrelloAction<any>[];
    // a bunch of other stuff here but cant be bothered to list
}

declare interface TrelloCommentAction extends TrelloAction<TrelloComment> {
    type: "cardComment";
    memberCreator: TrelloMember;
    date: string;
}

declare interface TrelloComment {
    board: { id: string };
    card: { id: string };
    text: string;
}

declare interface TrelloMember {
    avatarHash: string;
    fullName: string;
    id: string;
    initials: string;
    username: string;
}
