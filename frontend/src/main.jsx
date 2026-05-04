import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { CallProvider } from './context/CallContext';
import CallModal from './components/calling/CallModal';
import VideoCallScreen from './components/calling/VideoCallScreen';
import AudioCallScreen from './components/calling/AudioCallScreen';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <CallProvider>
            <App />
            <CallModal />
            <VideoCallScreen />
            <AudioCallScreen />
          </CallProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
