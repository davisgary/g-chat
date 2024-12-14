'use client';

import Chat from '../components/Chat';

export default function ChatPage() {
  const handleSendMessage = async (message: string) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data.message;
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-center text-white">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-start flex-grow py-32">
        <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-500 font-bold">
          G Chat
        </h1>
        <h2 className="p-8 font-extrabold tracking-tight text-5xl">
          What can I help you with?
        </h2>
        <Chat onSendMessage={handleSendMessage} />
      </div>
      <footer className="py-4 text-xs font-semibold">
        G Chat can make mistakes. Check your info.
      </footer>
    </div>
  );
}