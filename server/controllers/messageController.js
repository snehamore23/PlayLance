const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');
const Project = require('../models/Project');

// ──────────────────────────────────────────────
// @desc    Create a conversation
// @route   POST /api/messages/conversations
// @access  Private
// ──────────────────────────────────────────────
const createConversation = async (req, res, next) => {
  try {
    const { participantId, projectId } = req.body;

    // 1. Validate participantId
    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'participantId is required',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(participantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid participant ID',
      });
    }

    // 2. Cannot create conversation with yourself
    if (participantId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot create a conversation with yourself',
      });
    }

    // 3. Validate participant exists
    const participant = await User.findById(participantId).select('-password');
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant user not found',
      });
    }

    // 4. Validate projectId if provided
    let projectRef = null;
    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project ID',
        });
      }

      const project = await Project.findById(projectId);
      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }
      projectRef = projectId;
    }

    // 5. Check for existing conversation between these two users for the same project
    const query = {
      participants: { $all: [req.user._id, participantId] },
    };

    if (projectRef) {
      query.project = projectRef;
    } else {
      query.project = null;
    }

    const existingConversation = await Conversation.findOne(query)
      .populate('participants', 'name email profileImage')
      .populate('project', 'title');

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        message: 'Conversation already exists',
        conversation: existingConversation,
      });
    }

    // 6. Create new conversation
    const conversation = await Conversation.create({
      participants: [req.user._id, participantId],
      project: projectRef,
    });

    // 7. Populate and return
    const populatedConversation = await Conversation.findById(conversation._id)
      .populate('participants', 'name email profileImage')
      .populate('project', 'title');

    return res.status(201).json({
      success: true,
      message: 'Conversation created successfully',
      conversation: populatedConversation,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get all conversations for the logged-in user
// @route   GET /api/messages/conversations
// @access  Private
// ──────────────────────────────────────────────
const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'name email profileImage')
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Private (participants only)
// ──────────────────────────────────────────────
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID',
      });
    }

    // 2. Find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // 3. Only participants can access
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a participant in this conversation',
      });
    }

    // 4. Fetch messages
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email profileImage')
      .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Send a message in a conversation
// @route   POST /api/messages/conversations/:conversationId
// @access  Private (participants only)
// ──────────────────────────────────────────────
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { message } = req.body;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid conversation ID',
      });
    }

    // 2. Validate message
    if (!message || (typeof message === 'string' && !message.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty',
      });
    }

    // 3. Find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // 4. Only participants can send messages
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a participant in this conversation',
      });
    }

    // 5. Create the message
    const newMessage = await Message.create({
      conversation: conversationId,
      sender: req.user._id,
      message: message.trim(),
    });

    // 6. Populate and return
    const populatedMessage = await Message.findById(newMessage._id)
      .populate('sender', 'name email profileImage');

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: populatedMessage,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    next(error);
  }
};

// ──────────────────────────────────────────────
// @desc    Mark a message as read
// @route   PUT /api/messages/:messageId/read
// @access  Private (receiver/participant only)
// ──────────────────────────────────────────────
const markMessageAsRead = async (req, res, next) => {
  try {
    const { messageId } = req.params;

    // 1. Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid message ID',
      });
    }

    // 2. Find the message
    const msg = await Message.findById(messageId);

    if (!msg) {
      return res.status(404).json({
        success: false,
        message: 'Message not found',
      });
    }

    // 3. Find the conversation to verify participation
    const conversation = await Conversation.findById(msg.conversation);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Related conversation not found',
      });
    }

    // 4. Only a participant (who is NOT the sender) can mark it as read
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a participant in this conversation',
      });
    }

    if (msg.sender.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot mark your own message as read',
      });
    }

    // 5. Mark as read
    msg.isRead = true;
    await msg.save();

    return res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: msg,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createConversation,
  getConversations,
  getMessages,
  sendMessage,
  markMessageAsRead,
};
