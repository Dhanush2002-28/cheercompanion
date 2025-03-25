import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, RefreshCw, Sparkles } from "lucide-react";
import { sendMessageToOllama } from "./../services/ollama";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// Function to add subtle formatting to AI responses
const formatAIResponse = (text: string) => {
  // Split into paragraphs
  const paragraphs = text.split('\n\n');
  
  return paragraphs.map((paragraph, index) => {
    // Detect and highlight key emotional words
    const emotionalWords = [
      'feel', 'feeling', 'hope', 'support', 'understand', 
      'comfort', 'care', 'love', 'appreciate', 'grateful'
    ];

    const highlightedText = paragraph.split(' ').map((word, wordIndex) => {
      const lowercaseWord = word.toLowerCase().replace(/[.,!?]/g, '');
      if (emotionalWords.includes(lowercaseWord)) {
        return (
          <span 
            key={wordIndex} 
            className="font-semibold text-support-600 transition-colors duration-300 hover:text-support-700"
          >
            {word}{' '}
          </span>
        );
      }
      return <span key={wordIndex}>{word}{' '}</span>;
    });

    return (
      <p 
        key={index} 
        className="mb-2 text-sm leading-relaxed animate-fade-in"
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        {highlightedText}
      </p>
    );
  });
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      const systemMessage: ChatMessage = {
        role: "system",
        content: "You are EmotionalSupportAI, a compassionate and empathetic AI companion. Your purpose is to provide emotional support to users by responding with understanding, validation, and helpful perspective."
      };
      setMessages([systemMessage]);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessageToOllama(messages.concat(userMessage));
      
      if (response && response.message) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: response.message.content,
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        throw new Error("Invalid response format from Ollama");
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Failed to communicate with Ollama service. Make sure Ollama is running and the correct model is loaded.");
    } finally {
      setIsLoading(false);
    }
  };

  const visibleMessages = messages.filter(msg => msg.role !== "system");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <section
      id="chat"
      className="min-h-screen py-24 px-6 bg-gradient-radial from-white to-support-50/30"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 reveal">
          <h2 className="text-3xl md:text-4xl font-light mb-4 animate-slide-in-top">
            Talk with our AI Companion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-slide-in-bottom">
            Share your thoughts, celebrate victories, or find support during
            difficult times. Our AI is here to listen without judgment.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-glass-lg border border-support-100 overflow-hidden animate-scale-up">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-support-500 mr-2 animate-pulse"></div>
              <span className="font-medium text-muted-foreground">EmotionalSupport AI</span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-muted-foreground hover:text-support-600 p-2 rounded-full transition-colors group"
              aria-label="Start new conversation"
            >
              <RefreshCw className="h-4 w-4 group-hover:rotate-180 transition-transform" />
            </button>
          </div>

          <div className="h-[400px] overflow-y-auto p-4 bg-support-50/30">
            {visibleMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6 animate-fade-in">
                <div className="mb-4 p-3 rounded-full bg-support-100 animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-support-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <p className="text-sm mb-2">No messages yet</p>
                <p className="text-xs max-w-sm">
                  Share your thoughts, feelings, or experiences. The AI is here
                  to provide emotional support.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    } animate-slide-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 animate-scale 
                        ${
                          msg.role === "user"
                            ? "bg-support-600 text-white ml-4"
                            : "bg-white border border-support-100 shadow-sm mr-4"
                        }`}
                    >
                      <div 
                        className={`text-sm mb-1 ${
                          msg.role === "assistant" 
                            ? "text-support-800" 
                            : "text-white"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="flex items-center mb-2">
                            <Sparkles className="h-4 w-4 mr-2 text-support-500" />
                            <span className="font-semibold">AI Support</span>
                          </div>
                        ) : null}
                        {msg.role === "assistant" 
                          ? formatAIResponse(msg.content)
                          : msg.content
                        }
                      </div>
                      <div
                        className={`text-xs text-right 
                          ${
                            msg.role === "user"
                              ? "text-white/70"
                              : "text-muted-foreground"
                          }
                        `}
                      >
                        {new Date().toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-white rounded-2xl px-4 py-3 border border-support-100 shadow-sm animate-pulse-subtle max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-support-500" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 my-2 text-sm animate-shake">
                {error}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-border">
            <div
              className={`flex items-center rounded-lg border ${
                isLoading
                  ? "border-support-400 ring-2 ring-support-100"
                  : "border-border"
              } overflow-hidden transition-all`}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-3 focus:outline-none bg-transparent text-muted-foreground"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 ${
                  !input.trim() || isLoading
                    ? "text-muted-foreground"
                    : "text-support-600 hover:text-support-500"
                } transition-colors focus:outline-none group`}
                aria-label="Send message"
              >
                <Send className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              All conversations are anonymous and private
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ChatInterface;