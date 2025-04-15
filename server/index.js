import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());
app.use(express.json());

// SSE endpoint
app.get('/api/stream', (req, res) => {
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send a comment to keep the connection alive
  res.write(':keep-alive\n\n');
  
  let counter = 0;
  
  // Function to send data events
  const sendEvent = () => {
    counter++;
    const data = {
      id: counter,
      message: `这是第 ${counter} 条消息`,
      timestamp: new Date().toISOString()
    };
    
    // Format the event 
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    
    // Stop after 10 messages
    if (counter >= 10) {
      clearInterval(interval);
      res.end();
    }
  };
  
  // Send events every second
  const interval = setInterval(sendEvent, 1000);
  
  // Clean up when the connection is closed
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Simple status endpoint
app.get('/api/status', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});