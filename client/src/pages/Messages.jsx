import React, { useState } from 'react';
import Button from '../components/Button';

const Messages = () => {
  const [activeChat, setActiveChat] = useState(1);
  const [inputMessage, setInputMessage] = useState('');

  const contacts = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Full-Stack Developer',
      avatar: 'SJ',
      lastMessage: 'I have pushed the latest commits to the staging repo.',
      time: '12:45 PM',
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Apex Finance Corp',
      role: 'Client • Fintech MVP',
      avatar: 'AF',
      lastMessage: 'Could we schedule a quick call tomorrow at 10 AM?',
      time: 'Yesterday',
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: 'David Chen',
      role: 'Senior UI/UX Designer',
      avatar: 'DC',
      lastMessage: 'Uploaded the revised Figma components for review.',
      time: '2 days ago',
      unread: 0,
      online: true,
    },
  ];

  const currentMessages = [
    {
      id: 1,
      sender: 'Sarah Jenkins',
      text: 'Hi Alex! I reviewed the technical specification for the project milestones.',
      time: '11:30 AM',
      isMe: false,
    },
    {
      id: 2,
      sender: 'Alex Morgan',
      text: 'Awesome Sarah! Did the database schema look good for the analytics aggregation?',
      time: '11:45 AM',
      isMe: true,
    },
    {
      id: 3,
      sender: 'Sarah Jenkins',
      text: 'Yes, everything is crisp. I added compound indexes on tenantId and timestamp.',
      time: '12:10 PM',
      isMe: false,
    },
    {
      id: 4,
      sender: 'Sarah Jenkins',
      text: 'I have pushed the latest commits to the staging repo.',
      time: '12:45 PM',
      isMe: false,
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    setInputMessage('');
  };

  const activeContact = contacts.find((c) => c.id === activeChat) || contacts[0];

  return (
    <div className="h-[calc(100vh-8.5rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex overflow-hidden">
      {/* Contact List Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Messages
          </h2>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setActiveChat(contact.id)}
              className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                activeChat === contact.id
                  ? 'bg-emerald-50/60 dark:bg-emerald-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                  {contact.avatar}
                </div>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {contact.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {contact.time}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {contact.lastMessage}
                </p>
              </div>

              {contact.unread > 0 && (
                <span className="shrink-0 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white">
                  {contact.unread}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
              {activeContact.avatar}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {activeContact.name}
              </h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                {activeContact.role}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-xs">
              View Contract
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
          {currentMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                  msg.isMe
                    ? 'bg-emerald-600 text-white rounded-br-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.time}
              </span>
            </div>
          ))}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <button
            type="button"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Attach File"
          >
            📎
          </button>
          <input
            type="text"
            placeholder="Type your message to collaborate..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 text-sm rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
          />
          <Button variant="primary" size="md" type="submit">
            Send 🚀
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
