import * as React from 'react';
import { observable, action, runInAction } from 'mobx';
import { observer } from 'mobx-react';

interface ChatPopupBodyProps {
    onSubmitMessage: (message: string) => void
}

@observer
export class ChatWindowFooter extends React.Component<ChatPopupBodyProps, {}> {

   @observable message: string = "";

   private onKeyPress = (e: any) =>
    {
        if( e.charCode != 13) 
            return;
        
        this.props.onSubmitMessage(this.message);
        e.preventDefault();
        e.stopPropagation();
        runInAction(() => this.message = "");
    }
    
    @action onInputValueChange = (e: any) =>  this.message = e.target.value

    render() {
        return <div           
            style={{
                background: "#edeff0",
                borderTop: "1px solid #dddddd",
                borderBottomLeftRadius: 6,
                borderBottomRightRadius: 6,
                overflow: "hidden"
            }}
            >
            <textarea 
                style={{
                    width: "100%",
                    resize: "none",
                    border: "0",
                    boxShadow: "none",
                    background: "none",
                }}
                placeholder="Enter message"
                rows={1}
                value={this.message}
                onChange={this.onInputValueChange}
                onKeyPress={this.onKeyPress} />
        </div>;
    }
}