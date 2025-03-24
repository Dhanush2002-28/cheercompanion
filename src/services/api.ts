interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: ChatMessage;
  conversationId?: string;
}

interface APIConfig {
  apiKey?: string;
  baseUrl: string;
  model: string;
}

const apiConfig: APIConfig = {
  baseUrl: 'http://127.0.0.1:11500/api/chat', 
  model: 'llama3.2', 
};

/**
 */
export async function sendMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    const response = await fetch(apiConfig.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: apiConfig.model,
        messages: messages, // Ollama expects an array of messages
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to communicate with Ollama');
    }

    const data = await response.json();
    return {
      message: {
        role: 'assistant',
        content: data.message.content, // Adjusted for Ollama's response format
      },
      conversationId: data.id,
    };
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}

// Pre-defined system messages for the AI
export const systemPrompts = {
  supportive:
    "You are EmotionalSupportAI, a compassionate and empathetic AI companion. Your purpose is to provide emotional support to users by responding with understanding, validation, and helpful perspective. For joyful experiences, celebrate with the user and amplify their positive emotions. For difficult situations, offer comfort, validation, and gentle perspective when appropriate. Always prioritize emotional support over advice unless explicitly requested. Keep your responses concise, warm, and focused on the user's emotional needs. Never dismiss or minimize their feelings.",
  storyteller:
    "You are StoryMatchAI, an AI that finds relevant anonymous stories that might help the current user. Generate a brief, fictional but realistic story about someone who went through something similar to what the user is describing. Make the story relatable, hopeful, and end with gentle wisdom. Keep it brief and focused on creating connection. The story should feel authentic and not preachy. Sign it with only a first name and general age range, like 'Jamie, 30s'.",
};

// Sample anonymous stories for the community section
export const sampleStories = [
  {
    id: 1,
    title: "Finding Peace After Loss",
    content:
      "After losing my father last year, I felt completely lost. I joined this community and shared my grief. The supportive messages and shared experiences helped me realize I wasn't alone. Gradually, I've found ways to honor his memory while moving forward with life. The pain doesn't go away, but it becomes manageable.",
    author: "Alex, 20s",
    emotion: "grief",
    likes: 156,
  },
  {
    id: 2,
    title: "Overcoming Anxiety",
    content:
      "My anxiety was so debilitating I couldn't leave my apartment. Through talking with the AI and reading others' stories, I gathered the courage to seek professional help. Six months later, I'm using new coping strategies and have started volunteering at an animal shelter. Small steps lead to big changes.",
    author: "Taylor, 30s",
    emotion: "anxiety",
    likes: 243,
  },
  {
    id: 3,
    title: "Celebrating New Beginnings",
    content:
      "After my divorce, I thought my life was over. I came here feeling hopeless. Sharing my journey and reading about others who rebuilt their lives gave me hope. Today I'm starting my own business and rediscovering old passions. Sometimes endings make space for beautiful beginnings.",
    author: "Jordan, 40s",
    emotion: "hope",
    likes: 189,
  },
  {
    id: 4,
    title: "Finding Joy in Small Things",
    content:
      "Depression had stolen my ability to feel joy. Through this community, I learned to notice and appreciate tiny moments of beauty - the morning light, a perfect cup of coffee, a text from a friend. These small moments of connection to life have gradually built a bridge back to happiness.",
    author: "Riley, 20s",
    emotion: "joy",
    likes: 217,
  },
  {
    id: 5,
    title: "Growth Through Challenge",
    content:
      "Losing my job during the pandemic was terrifying. I shared my fears here and received not just support but practical suggestions. I've since retrained in a new field I'm passionate about. What felt like my lowest point became the catalyst for positive change I never would have chosen but now am grateful for.",
    author: "Morgan, 30s",
    emotion: "gratitude",
    likes: 175,
  },
];
