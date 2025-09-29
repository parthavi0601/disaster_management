import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs'; // Add this import for file system operations

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB Connection (remove deprecated options)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/disaster-chatbot';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error(err));

// Enhanced Knowledge Base Schema for Vector Search
const knowledgeChunkSchema = new mongoose.Schema({
  content: { type: String, required: true },
  embedding: { type: [Number], required: true }, // Vector embeddings
  category: { type: String, required: true }, // earthquake, tsunami, etc.
  source: { type: String, default: 'static' },
  metadata: {
    type: Object,
    default: {}
  },
  createdAt: { type: Date, default: Date.now },
});

const KnowledgeChunk = mongoose.model('KnowledgeChunk', knowledgeChunkSchema);

// Existing chat session schema
const chatSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [{
    text: String,
    role: String,
    timestamp: Date,
  }],
  createdAt: { type: Date, default: Date.now },
});

const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

// Email subscription schema
const emailSubscriptionSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subscriptionDate: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  preferences: {
    emergency_alerts: { type: Boolean, default: true },
    weather_updates: { type: Boolean, default: true },
    preparedness_tips: { type: Boolean, default: true }
  },
  location: { type: String, default: '' }, // Optional: for location-based alerts
});

const EmailSubscription = mongoose.model('EmailSubscription', emailSubscriptionSchema);

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use('/downloads', express.static(path.join(__dirname, 'public/downloads')));

// File download endpoint - FIXED
app.get('/api/download/:category/:filename', (req, res) => {
  try {
    const { category, filename } = req.params;
    const filePath = path.join(__dirname, 'public/downloads', category, filename);
    
    // Check if file exists using ES modules syntax
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'File not found' 
      });
    }

    // Set appropriate headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Send file
    res.sendFile(filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to download file' 
    });
  }
});

// Get available downloads endpoint
app.get('/api/downloads', (req, res) => {
  try {
    const downloads = [
      {
        id: 'emergency-guide',
        title: 'Emergency Preparedness Guide',
        description: 'Comprehensive PDF guide covering all aspects of disaster preparedness',
        category: 'pdfs',
        filename: 'emergency-preparedness-guide.pdf',
        type: 'PDF',
        size: '2.3 MB',
        downloadUrl: '/api/download/pdfs/emergency-preparedness-guide.pdf'
      },
      {
        id: 'family-plan',
        title: 'Family Emergency Plan Template',
        description: 'Customizable template to create your family\'s emergency plan',
        category: 'pdfs',
        filename: 'family-emergency-plan-template.pdf',
        type: 'PDF',
        size: '856 KB',
        downloadUrl: '/api/download/pdfs/family-emergency-plan-template.pdf'
      },
      {
        id: 'disaster-handbook',
        title: 'Disaster Response Handbook',
        description: 'Detailed handbook for responding to different types of disasters',
        category: 'resources',
        filename: 'disaster-response-handbook.pdf',
        type: 'PDF',
        size: '4.1 MB',
        downloadUrl: '/api/download/resources/disaster-response-handbook.pdf'
      },
      {
        id: 'emergency-apps',
        title: 'Emergency Apps Collection',
        description: 'Recommended mobile apps for emergency situations',
        category: 'resources',
        filename: 'emergency-apps-list.pdf',
        type: 'PDF',
        size: '1.2 MB',
        downloadUrl: '/api/download/resources/emergency-apps-list.pdf'
      }
    ];

    res.json({
      success: true,
      downloads
    });
  } catch (error) {
    console.error('Error getting downloads:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get downloads'
    });
  }
});

// --- Enhanced Knowledge Base with Categories ---
const enhancedKnowledgeBase = [
  {
    content: "During an earthquake, immediately drop to your hands and knees, take cover under a sturdy desk or table, and hold on until the shaking stops. Stay away from windows, mirrors, and heavy objects that could fall.",
    category: "earthquake",
    metadata: { priority: "high", action_type: "immediate" }
  },
  {
    content: "Tsunami evacuation requires immediate movement to higher ground at least 100 feet above sea level or 2 miles inland. Do not wait for official warnings if you feel an earthquake near the coast.",
    category: "tsunami", 
    metadata: { priority: "critical", action_type: "evacuation" }
  },
  {
    content: "For house fires, use the PASS method with fire extinguishers: Pull the pin, Aim at the base of the flames, Squeeze the handle, and Sweep from side to side. Call emergency services immediately.",
    category: "fire",
    metadata: { priority: "high", action_type: "suppression" }
  },
  {
    content: "Emergency kit essentials include 1 gallon of water per person per day for 3 days, non-perishable food for 3 days, battery-powered radio, flashlight, first aid kit, whistle, dust mask, plastic sheeting, moist towelettes, wrench to turn off utilities, and cash.",
    category: "emergency_kit",
    metadata: { priority: "medium", action_type: "preparation" }
  },
  {
    content: "Flood safety: Never walk or drive through flooded roads. Turn around, don't drown. Six inches of moving water can knock you down, and one foot can sweep away a vehicle.",
    category: "flood",
    metadata: { priority: "high", action_type: "avoidance" }
  },
  {
    content: "During a tornado, seek shelter in a basement, storm cellar, or interior room on the lowest floor of a sturdy building. Stay away from windows and cover yourself with a mattress or heavy blankets.",
    category: "tornado",
    metadata: { priority: "critical", action_type: "shelter" }
  },
  {
    content: "Hurricane preparation includes boarding up windows, securing outdoor objects, having emergency supplies for at least 7 days, and following official evacuation orders. Never ignore evacuation warnings.",
    category: "hurricane",
    metadata: { priority: "high", action_type: "preparation" }
  },
  {
    content: "First aid basics: For bleeding, apply direct pressure with a clean cloth. For burns, run cool water over the area for 10-20 minutes. For broken bones, immobilize the area and seek medical help immediately.",
    category: "first_aid",
    metadata: { priority: "high", action_type: "medical" }
  }
];

// --- RAG Functions ---

// Generate embeddings using Gemini
async function generateEmbedding(text) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('Error generating embedding with Gemini:', error);
    throw error;
  }
}

// Initialize knowledge base with embeddings
async function initializeKnowledgeBase() {
  try {
    const existingCount = await KnowledgeChunk.countDocuments();
    if (existingCount === 0) {
      console.log('Initializing knowledge base with embeddings...');
      
      for (const item of enhancedKnowledgeBase) {
        console.log(`Processing: ${item.category}`);
        const embedding = await generateEmbedding(item.content);
        await KnowledgeChunk.create({
          content: item.content,
          embedding: embedding,
          category: item.category,
          metadata: item.metadata
        });
        
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log('Knowledge base initialized successfully!');
    } else {
      console.log(`Knowledge base already exists with ${existingCount} documents`);
    }
  } catch (error) {
    console.error('Error initializing knowledge base:', error);
  }
}

// Perform vector similarity search
async function retrieveRelevantContext(query, limit = 3) {
  try {
    const queryEmbedding = await generateEmbedding(query);
    
    // MongoDB aggregation pipeline for vector search
    const pipeline = [
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 50,
          limit: limit,
        }
      },
      {
        $project: {
          content: 1,
          category: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    const results = await KnowledgeChunk.aggregate(pipeline);
    return results;
  } catch (error) {
    console.error('Error retrieving context:', error);
    return [];
  }
}

// --- API Endpoints ---

// Endpoint to create a new session
app.post('/api/sessions/new', async (req, res) => {
  try {
    const { userId } = req.body;
    let session = await ChatSession.findOne({ userId });
    if (!session) {
      session = new ChatSession({ userId, messages: [] });
      await session.save();
    }
    res.status(201).json({ sessionId: session._id, messages: session.messages });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ message: 'Error creating new session' });
  }
});

// Endpoint to get session history
app.get('/api/sessions/:sessionId', async (req, res) => {
  try {
    const session = await ChatSession.findById(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ messages: session.messages });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({ message: 'Error fetching session history' });
  }
});

// Email subscription endpoint
app.post('/api/subscribe', async (req, res) => {
  try {
    const { email, location = '' } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Check if email already exists
    const existingSubscription = await EmailSubscription.findOne({ email: email.toLowerCase() });
    
    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is already subscribed to our alerts' 
        });
      } else {
        // Reactivate existing subscription
        existingSubscription.isActive = true;
        existingSubscription.subscriptionDate = new Date();
        await existingSubscription.save();
        
        return res.status(200).json({ 
          success: true, 
          message: 'Welcome back! Your subscription has been reactivated.' 
        });
      }
    }

    // Create new subscription
    const newSubscription = new EmailSubscription({
      email: email.toLowerCase().trim(),
      location: location.trim(),
      subscriptionDate: new Date(),
      isActive: true
    });

    await newSubscription.save();
    
    console.log(`New email subscription: ${email}`);
    
    res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed to emergency alerts!' 
    });

  } catch (error) {
    console.error('Error subscribing email:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is already subscribed' 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

// Get all subscriptions (admin endpoint)
app.get('/api/subscriptions', async (req, res) => {
  try {
    const subscriptions = await EmailSubscription.find({ isActive: true })
      .select('email subscriptionDate location preferences')
      .sort({ subscriptionDate: -1 });
    
    res.json({ 
      success: true, 
      count: subscriptions.length,
      subscriptions 
    });
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch subscriptions' 
    });
  }
});

// Unsubscribe endpoint
app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const subscription = await EmailSubscription.findOne({ email: email.toLowerCase() });
    
    if (!subscription) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email not found in our subscription list' 
      });
    }

    subscription.isActive = false;
    await subscription.save();
    
    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from emergency alerts' 
    });

  } catch (error) {
    console.error('Error unsubscribing email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe. Please try again later.' 
    });
  }
});

// Enhanced RAG-powered chat endpoint
app.post('/api/chat', async (req, res) => {
  const { sessionId, userId, message, chatHistory } = req.body;

  try {
    if (!sessionId || !userId || !message) {
      return res.status(400).json({ message: 'Missing session ID, user ID, or message.' });
    }

    const session = await ChatSession.findById(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found.' });
    }

    // RAG: Retrieve relevant context
    console.log(`Searching for context related to: ${message}`);
    const relevantContext = await retrieveRelevantContext(message, 3);
    
    // Build context string from retrieved documents
    const contextString = relevantContext.length > 0 
      ? relevantContext.map((doc, index) => 
          `Context ${index + 1} (${doc.category}, score: ${doc.score?.toFixed(3)}): ${doc.content}`
        ).join('\n\n')
      : "No specific context found in knowledge base.";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // Enhanced RAG prompt
    const ragPrompt = `
You are a compassionate, knowledgeable disaster management chatbot with access to a specialized knowledge base.

**Instructions:**
1. Use the retrieved context below to provide accurate, specific disaster management advice
2. If the context is relevant, prioritize it over general knowledge
3. Maintain a helpful, empathetic tone with clear, actionable guidance
4. Use markdown formatting for better readability
5. If the question is outside disaster management, politely redirect

**Retrieved Context:**
${contextString}

**Chat History:**
${chatHistory ? chatHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n') : 'No previous conversation'}

**Current Question:** ${message}

**Response Instructions:**
- Start with immediate safety advice if applicable
- Provide step-by-step instructions when relevant  
- Include preparation tips for future situations
- End with a supportive follow-up question

**Response:**`;

    const result = await model.generateContent(ragPrompt);
    const apiResponse = await result.response;
    const botResponseText = apiResponse.text();

    // Save to session
    session.messages.push({ text: message, role: 'user', timestamp: new Date() });
    session.messages.push({ text: botResponseText, role: 'model', timestamp: new Date() });
    await session.save();

    // Return response with context metadata
    res.json({ 
      response: botResponseText,
      context_used: relevantContext.length,
      categories: relevantContext.map(doc => doc.category),
      debug: {
        query: message,
        context_scores: relevantContext.map(doc => ({ category: doc.category, score: doc.score }))
      }
    });

  } catch (error) {
    console.error("Error processing RAG chat message:", error);
    res.status(500).json({ message: 'Failed to process request.', error: error.message });
  }
});

// Endpoint to add new knowledge (for dynamic updates)
app.post('/api/knowledge/add', async (req, res) => {
  try {
    const { content, category, metadata = {} } = req.body;
    
    if (!content || !category) {
      return res.status(400).json({ message: 'Content and category are required' });
    }

    console.log(`Adding new knowledge for category: ${category}`);
    const embedding = await generateEmbedding(content);
    
    const newKnowledge = await KnowledgeChunk.create({
      content,
      embedding,
      category,
      metadata,
      source: 'dynamic'
    });

    res.status(201).json({ 
      message: 'Knowledge added successfully',
      id: newKnowledge._id,
      category: category
    });
  } catch (error) {
    console.error('Error adding knowledge:', error);
    res.status(500).json({ message: 'Error adding knowledge', error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'RAG-enhanced disaster chatbot is running'
  });
});

// Initialize knowledge base on startup
initializeKnowledgeBase();

app.listen(port, () => {
  console.log(`🚀 RAG-enhanced disaster chatbot running on port ${port}`);
  console.log(`📊 Health check available at http://localhost:${port}/api/health`);
});
