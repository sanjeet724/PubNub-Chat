import React, { useEffect, useReducer } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Badge from 'react-bootstrap/Badge';
import Timer from './timer';
import AutoScroll from './autoScroll';
import moment from 'moment';
import '../App.css';

const ChatRoom = ({
  handleExitBtnClick,
  user,
  badgeColor,
  history,
  sendMessage
}) => {
  const initialState = {
    sender: user,
    badgeColor: badgeColor,
    text: '',
    timeStamp: ''
  };

  const reducer = (state, action) => {
    let newState;
    switch (action.type) {
      case 'input-changes':
        newState = { ...state };
        newState.text = action.payload;
        return newState;
      case 'send-message':
        newState = { ...state };
        newState.text = action.payload.text;
        newState.timeStamp = action.payload.timeStamp;
        sendMessage(newState); // temp fix
        return newState;
      case 'reset-chat':
        newState = { ...state };
        newState.text = '';
        newState.timeStamp = '';
        return newState;
      default:
        console.log(`action not found`);
        break;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // component did unmount
  useEffect(() => {
    return () => {
      // console.log('Component did unmount..');
    };
  }, []);

  const sendText = e => {
    e.preventDefault();
    if (!state.text) {
      console.log(`Empty text`);
      return;
    }

    dispatch({
      type: 'send-message',
      payload: {
        text: state.text.trim(),
        timeStamp: new Date().valueOf()
      }
    });

    resetState();
  };

  const resetState = () => {
    dispatch({
      type: 'reset-chat',
      payload: {}
    });
  };

  const handleTextChange = e => {
    e.preventDefault();
    const val = e.target.value;
    dispatch({
      type: 'input-changes',
      payload: val
    });
  };

  // send text when enter is pressed
  const handleEnterPress = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      sendText(e);
    }
  };

  const formatTimeStamp = timeStamp => {
    return moment(timeStamp).format('hh:mm:ss A');
  };

  return (
    <div className="chat-area">
      <div className="chat-info">
        <Timer />
        <div className="chat-user">
          <Badge pill variant={badgeColor}>
            {user}
          </Badge>
        </div>
        <Button variant="warning" size="sm" onClick={handleExitBtnClick}>
          Exit Room
        </Button>
      </div>
      <div className="chat-box">
        {history.map((msg, id) =>
          msg.statusUpdate ? (
            <div key={id} className="chat-line-container">
              <div className="user-status">{msg.text}</div>
              <div className="time-stamp">{formatTimeStamp(msg.timeStamp)}</div>
            </div>
          ) : (
            <div key={id} className="chat-line-container">
              <div className="chat-text-room">
                <Badge variant={msg.badgeColor}>{msg.sender}</Badge> :{' '}
                {msg.text}
              </div>
              <div className="time-stamp">{formatTimeStamp(msg.timeStamp)}</div>
            </div>
          )
        )}
        <AutoScroll />
      </div>
      <InputGroup className="mb-3">
        <FormControl
          className="chat-text"
          as="textarea"
          aria-label="With textarea"
          placeholder="Type something interesting...."
          value={state.text}
          onChange={handleTextChange}
          onKeyDown={handleEnterPress}
        />
        <InputGroup.Append>
          <Button variant="success" onClick={sendText} size="sm">
            Send Message
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </div>
  );
};

export default ChatRoom;
