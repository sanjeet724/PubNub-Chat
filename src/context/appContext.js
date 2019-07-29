import { createContext } from 'react';

const AppContext = createContext({
  showChatRoom: false,
  showJoinButton: true,
  handleExitBtnClick: () => {},
  messages: []
});

export default AppContext;
