import { useWebSocket } from '../../hooks/useWebSocket';

const WebSocketProvider = ({ children }) => {
  useWebSocket(); // Just run the hook for real-time updates

  return children;
};

export default WebSocketProvider;