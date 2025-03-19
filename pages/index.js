import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    
    try {
      // Call our API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });
      
      const data = await response.json();
      
      // Add Claude's response
      setMessages([
        ...updatedMessages,
        { role: 'assistant', content: data.message }
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Head>
        <title>Claude Chatbot</title>
      </Head>
      
      <h1 className="text-2xl font-bold mb-4">Chat with Claude</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg h-96 overflow-y-auto mb-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 p-3 rounded-lg ${
              message.role === 'user' ? 'bg-blue-100 ml-10' : 'bg-white mr-10'
            }`}
          >
            <div className="font-bold">{message.role === 'user' ? 'You' : 'Claude'}</div>
            <div className="whitespace-pre-wrap">{message.content}</div>
          </div>
        ))}
        {isLoading && <div className="text-center">Claude is thinking...</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 border rounded-l-lg"
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
} 