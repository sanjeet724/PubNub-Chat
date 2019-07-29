// action handlers
const joinChatRoom = (payload, state) => {
  console.log(`In Join Chat Room Action`);
  const newState = { ...state };
  newState.showChatRoom = true;
  newState.showJoinButton = false;

  return newState;
};

const exitChatRoom = (payload, state) => {
  const newState = { ...state };
  newState.showChatRoom = false;
  newState.showJoinButton = true;

  return newState;
};

export default (state, action) => {
  switch (action.type) {
    case 'JOIN_CHAT_ROOM':
      return joinChatRoom(action.payload, state);
    case 'EXIT_CHAT_ROOM':
      return exitChatRoom(action.payload, state);
    default:
      return state;
  }
};
