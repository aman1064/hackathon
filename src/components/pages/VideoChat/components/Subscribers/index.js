import React, {Component} from "react";

class Subscriber extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            isForm: false,
            currentId: "",
            msgList: []
        }
    }

    onSubmit = event => {
        const {currentId, message} = this.state;
        event.preventDefault();
        this.props.sendMessageToUser(currentId, message);
        this.cancelHandler();
    }

    handleChange = event => {
        this.setState({message: event.target.value})
    }

    openForm = e => {
        this.setState({isForm: true, currentId: e.target.dataset.id});
    }

    cancelHandler = () => {
        this.setState({isForm: false, message: "", currentId: null})
    }

    componentDidMount() {
        const {sessionUser} = this.props;
        sessionUser.getStreamManager().stream.session.on('signal', event => {
            if (event.type === "signal:PERSONAL_CHAT") {
                const data = event.data;
                this.setState({msgList: [...this.state.msgList, data]});
            }
        });
    }


    render() {
        const {users} = this.props;
        const {message, isForm, msgList} = this.state;
        const chatMsg = msgList.map(msg => <li>{msg}</li>);
        return (
            <div>
                <ul>
                    {users.map(user => <li onClick={this.openForm} data-id={user.connectionId}>{user.nickname}</li>)}
                </ul>
                {
                    isForm ?
                        <form onSubmit={this.onSubmit}>
                            <input type="text" onChange={this.handleChange} value={message}/>
                            <button type="button" onClick={this.cancelHandler}>Cancel</button>
                            <button>Send</button>
                        </form> : null
                }

                <ul>{chatMsg}</ul>
            </div>
        )
    }
}

export default Subscriber;