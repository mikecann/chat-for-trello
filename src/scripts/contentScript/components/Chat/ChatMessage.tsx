import * as React from "react";
import { observer } from "mobx-react";
import { Comment } from "semantic-ui-react";
import * as moment from "moment";
import { ChatMessageAvatar } from "./ChatMessageAvatar";
import { observable, action } from "mobx";

interface Props {
    action: TrelloCommentAction;
}

@observer
export class ChatMessage extends React.Component<Props, {}> {
    @observable isMouseOver: boolean = false;

    @action onMouseOver = () => (this.isMouseOver = true);
    @action onMouseOut = () => (this.isMouseOver = false);

    render() {
        const action = this.props.action;
        return (
            <li
                onMouseOver={this.onMouseOver}
                onMouseOut={this.onMouseOut}
                style={{
                    position: "relative",
                    minHeight: 30,
                    display: "block",
                    padding: 5
                }}
            >
                <div
                    style={{
                        left: 5,
                        top: 7,
                        position: "absolute",
                        width: 30,
                        height: 30
                    }}
                >
                    <ChatMessageAvatar member={action.memberCreator} />
                </div>
                <div
                    style={{
                        marginLeft: 40,
                        wordWrap: "break-word"
                    }}
                >
                    <div>
                        <span
                            style={{
                                fontWeight: "bold"
                            }}
                        >
                            {action.memberCreator.fullName}
                        </span>

                        <span
                            style={{
                                fontSize: 10,
                                color: "grey",
                                paddingLeft: 6
                                //visibility: this.isMouseOver ? "visible" : "hidden"
                            }}
                        >
                            {moment(action.date).fromNow()}
                        </span>
                    </div>
                    <div
                        className="action-comment"
                        style={{
                            padding: "9px 11px",
                            cursor: "auto"
                        }}
                    >
                        <p>{action.data.text}</p>
                    </div>
                </div>
            </li>
        );

        // <Comment>
        //     <Comment.Avatar as={ChatMessageAvatar} member={action.memberCreator} />
        //     <Comment.Content>
        //         <Comment.Author as='a'>{action.memberCreator.fullName}</Comment.Author>
        //         <Comment.Metadata>
        //             <div>{moment(action.date).fromNow()}</div>
        //         </Comment.Metadata>
        //         <Comment.Text>{action.data.text}</Comment.Text>

        //     </Comment.Content>
        // </Comment>

        {
            /*
        <div class="phenom mod-comment-type">
    <div class="phenom-creator">
        <div class="member js-show-mem-menu" idmember="53708ee03fb4a5df3ded2cb7">
            <img class="member-avatar" height="30" width="30" src="https://trello-avatars.s3.amazonaws.com/68a12e163484f36070a94b5b25cb9f6d/30.png"
                srcset="https://trello-avatars.s3.amazonaws.com/68a12e163484f36070a94b5b25cb9f6d/30.png 1x, https://trello-avatars.s3.amazonaws.com/68a12e163484f36070a94b5b25cb9f6d/50.png 2x"
                alt="Mike Cann (mikecann)" title="Mike Cann (mikecann)">
            <span class="member-gold-badge" title="This member has Trello Gold."></span>
        </div>
    </div>
    <div class="phenom-desc">
        <span class="inline-member js-show-mem-menu" idmember="53708ee03fb4a5df3ded2cb7">
            <span class="u-font-weight-bold">Mike Cann</span>
        </span>
        <span class="inline-spacer"> </span>
        <span class="phenom-date quiet">
            <a class="date js-hide-on-sending js-highlight-link" dt="2018-07-15T08:27:57.848Z" href="/c/rDkmuszz/2-testies#comment-5b4b058df1c39043e69971af"
                title="15 July 2018 16:27">a minute ago</a>
        </span>
        <div class="comment-container">
            <div class="action-comment can-edit markeddown js-comment" dir="auto">
                <div class="current-comment js-friendly-links js-open-card">
                    <p>Something else here</p>
                </div>
                <div class="comment-box">
                    <textarea class="comment-box-input js-text" tabindex="1">Something else here</textarea>
                    <div class="comment-box-options">
                        <a class="comment-box-options-item js-comment-add-attachment" href="#" title="Add an attachment…">
                            <span class="icon-sm icon-attachment"></span>
                        </a>
                        <a class="comment-box-options-item js-comment-mention-member" href="#" title="Mention a member…">
                            <span class="icon-sm icon-mention"></span>
                        </a>
                        <a class="comment-box-options-item js-comment-add-emoji" href="#" title="Add emoji…">
                            <span class="icon-sm icon-emoji"></span>
                        </a>
                        <a class="comment-box-options-item js-comment-add-card" href="#" title="Add card…">
                            <span class="icon-sm icon-card"></span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div class="hide embedly js-embedly"></div>
    </div>
    <div class="phenom-reactions">
        <div class="js-reaction-piles reaction-piles-container">
            <div class="reaction-piles reaction-piles-empty"></div>
        </div>
        <div class="phenom-meta quiet">
            <span class="js-spinner hide">
                <span class="spinner spinner--inline mod-left small"></span> Sending…</span>
            <span class="js-hide-on-sending middle">
                <span class="inline-add-reaction">
                    <a class="meta-add-reaction" href="#">
                        <span class="reactions-add js-open-reactions"></span>
                    </a>
                </span> -
                <a class="js-edit-action" href="#">Edit</a> -
                <a class="js-confirm-delete-action" href="#">Delete</a>
                <span class="edits-warning quiet"> - You have unsaved edits on this field.</span>
            </span>
        </div>
    </div>
</div>
        */
        }
    }
}
