import React, { Component } from 'react';
import Button from 'react-bootstrap/Button';
import ChatRoom from './components/chatRoom';
import httpService from './services/httpService';
import PubNub from 'pubnub';
import './App.css';

class App extends Component {
  state = {
    history: [],
    user: '',
    badgeColor: '',
    showJoinButton: true,
    showChatRoom: false,
    lastMessageTimeStamp: null
  };

  COLORS = [
    'primary',
    'secondary',
    'danger',
    'info',
    'dark',
    'success',
    'warning',
    'light'
  ];

  handleWindowClose = e => {
    e.preventDefault();
    const statusMessage = {
      text: `${this.state.user} has left the room`,
      statusUpdate: true,
      timeStamp: new Date().valueOf()
    };

    // fire this only if user is in chat room
    // else he has already exited the room
    const { showChatRoom } = this.state;
    if (showChatRoom) {
      this.pubnub.publish({
        channel: 'chat-channel',
        message: {
          statusMessage
        }
      });
    }

    this.pubnub.removeListener();
    this.pubnub.unsubscribe({
      channels: ['chat-channel']
    });
  };

  componentDidMount = async () => {
    this.setState({ user: await this._createAnonUser() });
    this.setState({ badgeColor: this._getBadgeColor() });

    this.pubnub = new PubNub({
      publishKey: 'pub-c-9ebdb0f1-0529-40ae-a4c6-07fffa4c96d6',
      subscribeKey: 'sub-c-dc3fc97e-9d09-11e9-9cd2-86061a909544'
    });

    this.pubnub.addListener({
      status: function(statusEvent) {
        if (statusEvent.category === 'PNConnectedCategory') {
        }
      },
      message: msg => {
        const { history } = this.state;
        const message = msg.message.chat || msg.message.statusMessage;
        history.push(message);
        this.setState({ history });
        if (message.timeStamp) {
          this.setState({ lastMessageTimeStamp: message.timeStamp });
        }
      }
    });

    this.pubnub.subscribe({
      channels: ['chat-channel']
    });

    this.fetchChatHistory();

    window.addEventListener('beforeunload', this.handleWindowClose);
  };

  fetchChatHistory = () => {
    // by default gets the last 100 messages
    this.pubnub.history(
      {
        channel: 'chat-channel',
        count: 50
      },
      (status, response) => {
        if (status.error) {
          console.error(`Cannot fetch history`);
        }
        const entries = response.messages.map(message => message.entry);
        // extract in the format expected
        const messages = entries.reduce((acc, entry) => {
          const key = Object.keys(entry)[0];
          const val = entry[key];
          const obj = {};
          for (let k in val) {
            obj[k] = val[k];
          }
          acc.push(obj);
          return acc;
        }, []);

        this.setState({ history: messages });
      }
    );
  };

  componentWillUnmount = () => {
    this.pubnub.removeListener();
    this.pubnub.unsubscribe({
      channels: ['chat-channel']
    });

    window.removeEventListener('beforeunload', this.handleWindowClose);
  };

  _createAnonUser = async () => {
    const url = 'https://uinames.com/api/';
    let userName;
    try {
      const { data } = await httpService.get(url);
      userName = data.name + ' ' + data.surname;
    } catch (err) {
      console.error(`Cannot fetch random user`);
      userName = Math.random()
        .toString(36)
        .substr(2, 5);
    }

    return userName;
  };

  _getBadgeColor = () => {
    const min = 0;
    const max = this.COLORS.length - 1;
    const index = Math.floor(Math.random() * (max - min + 1) + min);
    return this.COLORS[index];
  };

  handleExitBtnClick = () => {
    let { showChatRoom, showJoinButton } = this.state;
    this.setState({ showChatRoom: !showChatRoom });
    this.setState({ showJoinButton: !showJoinButton });

    const statusMessage = {
      text: `${this.state.user} has left the room`,
      statusUpdate: true,
      timeStamp: new Date().valueOf()
    };

    this.pubnub.publish({
      channel: 'chat-channel',
      message: {
        statusMessage
      }
    });
  };

  handleJoinBtnClick = () => {
    let { showChatRoom, showJoinButton } = this.state;
    this.setState({ showChatRoom: !showChatRoom });
    this.setState({ showJoinButton: !showJoinButton });
    const statusMessage = {
      text: `${this.state.user} has entered the room`,
      statusUpdate: true,
      timeStamp: new Date().valueOf()
    };

    this.pubnub.publish({
      channel: 'chat-channel',
      message: {
        statusMessage
      }
    });
  };

  sendMessage = chat => {
    this.pubnub.publish({
      channel: 'chat-channel',
      message: {
        chat
      }
    });
  };

  render() {
    const {
      user,
      badgeColor,
      history,
      showJoinButton,
      showChatRoom
    } = this.state;
    return (
      <div className="app-main">
        {showJoinButton && (
          <Button onClick={this.handleJoinBtnClick}>Join Chat Room</Button>
        )}
        {showChatRoom && (
          <ChatRoom
            handleExitBtnClick={this.handleExitBtnClick}
            user={user}
            badgeColor={badgeColor}
            history={history}
            sendMessage={this.sendMessage}
          />
        )}
      </div>
    );
  }
}

export default App;
