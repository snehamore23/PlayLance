import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [conversationsError, setConversationsError] = useState(null);

  const [activeConversation, setActiveConversation] = useState(null);

  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);

  const [inputMessage, setInputMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  // New Chat Modal state
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newParticipantId, setNewParticipantId] = useState('');
  const [newProjectId, setNewProjectId] = useState('');
  const [startingChat, setStartingChat] = useState(false);
  const [newChatError, setNewChatError] = useState(null);

  const messagesEndRef = useRef(null);

  const currentUserId = user?.id || user?._id;

  // Auto scroll to bottom of messages stream
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch Conversations list
  const fetchConversations = async (targetIdToSelect = null) => {
    try {
      setLoadingConversations(true);
      setConversationsError(null);
      const response = await api.get('/messages/conversations');
      if (response.data && response.data.success) {
        const convList = response.data.conversations || [];
        setConversations(convList);

        if (targetIdToSelect) {
          const target = convList.find((c) => c._id === targetIdToSelect);
          if (target) {
            setActiveConversation(target);
          } else if (convList.length > 0) {
            setActiveConversation(convList[0]);
          }
        } else if (convList.length > 0) {
          setActiveConversation((prev) => {
            if (prev && convList.some((c) => c._id === prev._id)) {
              return convList.find((c) => c._id === prev._id);
            }
            return convList[0];
          });
        }
      } else {
        setConversations([]);
      }
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setConversationsError(
        err.response?.data?.message || 'Failed to load conversations. Please try again.'
      );
    } finally {
      setLoadingConversations(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle location state parameter (if navigated to /messages with state e.g., participantId, projectId)
  useEffect(() => {
    if (location.state?.participantId) {
      const { participantId, projectId } = location.state;
      handleStartNewConversation(participantId, projectId);
    }
  }, [location.state]);

  // Fetch messages when activeConversation changes
  const fetchMessages = async (conversationId) => {
    if (!conversationId) {
      setMessages([]);
      return;
    }
    try {
      setLoadingMessages(true);
      setMessagesError(null);
      const response = await api.get(`/messages/conversations/${conversationId}`);
      if (response.data && response.data.success) {
        const fetchedMsgs = response.data.messages || [];
        setMessages(fetchedMsgs);

        // Mark unread messages as read
        fetchedMsgs.forEach((msg) => {
          const senderId =
            typeof msg.sender === 'object'
              ? msg.sender?._id || msg.sender?.id
              : msg.sender;
          if (!msg.isRead && senderId?.toString() !== currentUserId?.toString()) {
            api.put(`/messages/${msg._id}/read`).catch(() => {});
          }
        });
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessagesError(
        err.response?.data?.message || 'Failed to load messages for this conversation.'
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeConversation?._id) {
      fetchMessages(activeConversation._id);
    }
  }, [activeConversation?._id]);

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConversation?._id || sendingMessage) return;

    const messageText = inputMessage.trim();
    setInputMessage('');
    setSendingMessage(true);

    try {
      const response = await api.post(
        `/messages/conversations/${activeConversation._id}`,
        { message: messageText }
      );

      if (response.data && response.data.success) {
        const newMsg = response.data.data;
        setMessages((prev) => [...prev, newMsg]);

        // Refresh conversation list to update order/timestamps
        fetchConversations(activeConversation._id);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error(err.response?.data?.message || 'Failed to send message.');
      setInputMessage(messageText); // Restore input on error
    } finally {
      setSendingMessage(false);
    }
  };

  // Start new conversation API call
  const handleStartNewConversation = async (participantId, projectId = null) => {
    if (!participantId) return;
    setStartingChat(true);
    setNewChatError(null);

    try {
      const payload = { participantId };
      if (projectId) {
        payload.projectId = projectId;
      }

      const response = await api.post('/messages/conversations', payload);
      if (response.data && response.data.success) {
        const createdConv = response.data.conversation;
        toast.success(response.data.message || 'Conversation started successfully');
        setShowNewChatModal(false);
        setNewParticipantId('');
        setNewProjectId('');

        // Refresh conversations and select newly created conversation
        await fetchConversations(createdConv._id);
        setActiveConversation(createdConv);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      setNewChatError(
        err.response?.data?.message || 'Failed to start conversation. Check user ID.'
      );
    } finally {
      setStartingChat(false);
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!newParticipantId.trim()) {
      setNewChatError('Participant User ID is required');
      return;
    }
    handleStartNewConversation(
      newParticipantId.trim(),
      newProjectId.trim() || null
    );
  };

  // Helper to extract participant details
  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) {
      return { name: 'Unknown User', initials: 'U', email: '', profileImage: '' };
    }
    const other =
      conversation.participants.find(
        (p) => (p._id || p.id)?.toString() !== currentUserId?.toString()
      ) || conversation.participants[0] || {};

    const name = other.name || other.email || 'User';
    const initials = name
      ? name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      : 'U';

    return {
      id: other._id || other.id,
      name,
      email: other.email,
      profileImage: other.profileImage,
      initials,
    };
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    const title = conv.project?.title || 'Direct Conversation';
    const term = searchTerm.toLowerCase().trim();
    return (
      !term ||
      other.name.toLowerCase().includes(term) ||
      (other.email && other.email.toLowerCase().includes(term)) ||
      title.toLowerCase().includes(term)
    );
  });

  const activeParticipant = activeConversation
    ? getOtherParticipant(activeConversation)
    : null;

  return (
    <div className="h-[calc(100vh-8.5rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex overflow-hidden">
      {/* Sidebar: Conversations List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Messages
            </h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setNewChatError(null);
                setShowNewChatModal(true);
              }}
            >
              + New Chat
            </Button>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {loadingConversations ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 font-medium space-y-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
              <p>Loading conversations...</p>
            </div>
          ) : conversationsError ? (
            <div className="p-4 m-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs text-center space-y-2">
              <p>{conversationsError}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchConversations()}
              >
                Retry
              </Button>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400 space-y-3">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                {conversations.length === 0
                  ? 'No conversations yet.'
                  : 'No conversations match your search.'}
              </p>
              {conversations.length === 0 && (
                <p>Click "+ New Chat" above to start messaging with another user.</p>
              )}
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const participant = getOtherParticipant(conv);
              const isSelected = activeConversation?._id === conv._id;
              const projectTitle = conv.project?.title;

              return (
                <div
                  key={conv._id}
                  onClick={() => setActiveConversation(conv)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-l-4 border-emerald-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="relative shrink-0">
                    {participant.profileImage ? (
                      <img
                        src={participant.profileImage}
                        alt={participant.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                        {participant.initials}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {participant.name}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-1">
                        {formatTime(conv.createdAt)}
                      </span>
                    </div>

                    {projectTitle ? (
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">
                        📌 {projectTitle}
                      </p>
                    ) : (
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                        Direct Conversation
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {!activeConversation ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 dark:text-slate-400 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold">
              💬
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Your Messages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
                Select a conversation from the sidebar to view messages, or start a new conversation with a client or freelancer.
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setNewChatError(null);
                setShowNewChatModal(true);
              }}
            >
              + Start New Chat
            </Button>
          </div>
        ) : (
          <>
            {/* Active Chat Header */}
            <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
              <div className="flex items-center gap-3">
                {activeParticipant?.profileImage ? (
                  <img
                    src={activeParticipant.profileImage}
                    alt={activeParticipant.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                    {activeParticipant?.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {activeParticipant?.name}
                  </h3>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    {activeConversation.project?.title
                      ? `Project: ${activeConversation.project.title}`
                      : activeParticipant?.email || 'Direct Conversation'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Stream */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/50">
              {loadingMessages ? (
                <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400 space-y-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500 mx-auto"></div>
                  <p>Loading messages...</p>
                </div>
              ) : messagesError ? (
                <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 text-center space-y-2 text-xs">
                  <p className="font-semibold">{messagesError}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchMessages(activeConversation._id)}
                  >
                    Retry
                  </Button>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-slate-500 dark:text-slate-400 space-y-2">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No messages yet in this conversation.
                  </p>
                  <p className="text-xs">
                    Send a message below to start collaborating with {activeParticipant?.name}!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const senderId =
                    typeof msg.sender === 'object'
                      ? msg.sender?._id || msg.sender?.id
                      : msg.sender;
                  const isMe = senderId?.toString() === currentUserId?.toString();
                  const senderName =
                    typeof msg.sender === 'object' ? msg.sender.name : null;

                  return (
                    <div
                      key={msg._id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      {!isMe && senderName && (
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mb-0.5 px-1">
                          {senderName}
                        </span>
                      )}
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm shadow-xs break-words ${
                          isMe
                            ? 'bg-emerald-600 text-white rounded-br-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                        }`}
                      >
                        {msg.message}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSendMessage}
              className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0"
            >
              <input
                type="text"
                placeholder="Type your message to collaborate..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={sendingMessage}
                className="flex-1 text-sm rounded-lg border border-slate-300 dark:border-slate-700 py-2.5 px-4 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
              <Button
                variant="primary"
                size="md"
                type="submit"
                disabled={!inputMessage.trim() || sendingMessage}
              >
                {sendingMessage ? 'Sending...' : 'Send 🚀'}
              </Button>
            </form>
          </>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Start New Conversation
              </h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {newChatError && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs">
                {newChatError}
              </div>
            )}

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Participant User ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter User ObjectId (e.g. 6500...)"
                  value={newParticipantId}
                  onChange={(e) => setNewParticipantId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  The MongoDB ObjectId of the user you want to chat with.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Project ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter Project ObjectId (optional)"
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Optional: Associate this conversation with a specific project.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setShowNewChatModal(false)}
                  type="button"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={startingChat || !newParticipantId.trim()}
                >
                  {startingChat ? 'Starting...' : 'Start Chat'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;

