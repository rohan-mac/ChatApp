import Home from './pages/Home';
import Chat from './pages/Chat';
import './styles/messenger.css';

const App = () => (
  <main className="messenger-bg">
    <h1 className="messenger-title">Messenger Chats</h1>
    <div className="screen-grid">
      <Home />
      <Chat />
    </div>
  </main>
);

export default App;
