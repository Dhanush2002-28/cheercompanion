import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatResponse {
  message: ChatMessage;
  id?: string;
}

const apiConfig = {
  baseUrl: 'http://127.0.0.1:11500/api/chat', // Correct Ollama default port
  model: 'llama3.2',
};

export async function sendMessageToOllama(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    const response = await axios.post(apiConfig.baseUrl, {
      model: apiConfig.model,
      messages: messages,
      stream: false
    });

    // Add debugging to see the actual response structure
    console.log('Ollama response:', response.data);
    
    // Handle different possible response formats
    let assistantMessage: ChatMessage;
    
    if (response.data && typeof response.data === 'object') {
      if (response.data.message && response.data.message.content) {
        // If response has expected structure
        assistantMessage = {
          role: 'assistant',
          content: response.data.message.content
        };
      } else if (response.data.response) {
        // Alternative response format some Ollama versions use
        assistantMessage = {
          role: 'assistant',
          content: response.data.response
        };
      } else {
        // Final fallback - stringify whatever we got
        assistantMessage = {
          role: 'assistant',
          content: "Error: Unexpected response format. See console for details."
        };
      }
    } else {
      assistantMessage = {
        role: 'assistant',
        content: "Error: Invalid response from Ollama."
      };
    }

    return {
      message: assistantMessage,
      id: response.data.id || 'unknown'
    };
  } catch (error) {
    console.error('Ollama API error:', error);
    throw error;
  }
}