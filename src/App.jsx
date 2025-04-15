import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  
  // Function to connect to the SSE endpoint
  const connectToSSE = () => {
    setConnected(true);
    setMessages([]);
    setError(null);
    
    try {
      // Create EventSource connection to the server
      const eventSource = new EventSource('http://localhost:3001/api/stream');
      
      // Handle connection open
      eventSource.onopen = () => {
        console.log('SSE connection opened');
      };
      
      // Handle incoming messages
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages(prevMessages => [...prevMessages, data]);
      };
      
      // Handle errors
      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        setError('连接错误，请检查服务器是否运行');
        eventSource.close();
        setConnected(false);
      };
      
      // Clean up the connection when disconnecting
      return () => {
        console.log('Closing SSE connection');
        eventSource.close();
        setConnected(false);
      };
    } catch (err) {
      console.error('Failed to connect to SSE:', err);
      setError(`连接失败: ${err.message}`);
      setConnected(false);
    }
  };
  
  // Function to disconnect from SSE
  const disconnectFromSSE = () => {
    setConnected(false);
  };

  return (
    <div className="container">
      <div className="header">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>React SSE 流式输出测试</h1>
      
      <div className="card">
        <div className="controls">
          <button 
            onClick={connectToSSE} 
            disabled={connected}
            className={connected ? "button-disabled" : "button-connect"}
          >
            连接到服务器
          </button>
          
          <button 
            onClick={disconnectFromSSE}
            disabled={!connected} 
            className={!connected ? "button-disabled" : "button-disconnect"}
          >
            断开连接
          </button>
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <div className="message-container">
          <h2>实时消息：</h2>
          {messages.length === 0 && !error && (
            <p className="no-messages">{connected ? '等待消息中...' : '点击连接按钮开始接收消息'}</p>
          )}
          <ul className="message-list">
            {messages.map((msg) => (
              <li key={msg.id} className="message-item">
                <div className="message-content">
                  <strong>{msg.message}</strong>
                </div>
                <div className="message-timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <p className="read-the-docs">
        本示例演示了如何使用 Server-Sent Events (SSE) 实现服务器到客户端的实时数据流
      </p>
    </div>
  )
}

export default App
