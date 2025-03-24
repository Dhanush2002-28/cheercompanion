import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, RefreshCw } from "lucide-react";
import { sendMessageToOllama } from "./../services/ollama";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add a system message at the beginning for better context
  useEffect(() => {
    // Only add if we don't have any messages yet
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
      // Filter system messages before display but include them in the API call
      const visibleMessages = messages.filter(msg => msg.role !== "system");
      
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

  // Filter out system messages for display
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
          <h2 className="text-3xl md:text-4xl font-light mb-4">
            Talk with our AI Companion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your thoughts, celebrate victories, or find support during
            difficult times. Our AI is here to listen without judgment.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-glass-lg border border-support-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-support-500 mr-2"></div>
              <span className="font-medium">EmotionalSupport AI</span>
            </div>
            <button
              onClick={() => setMessages([])}
              className="text-muted-foreground hover:text-support-600 p-2 rounded-full transition-colors"
              aria-label="Start new conversation"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>

          <div className="h-[400px] overflow-y-auto p-4 bg-support-50/30">
            {visibleMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-6">
                <div className="mb-4 p-3 rounded-full bg-support-100">
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
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 animate-scale
                        ${
                          msg.role === "user"
                            ? "bg-support-600 text-white ml-4"
                            : "bg-white border border-support-100 shadow-sm mr-4"
                        }`}
                    >
                      <div className="text-sm mb-1">{msg.content}</div>
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
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 border border-support-100 shadow-sm animate-pulse-subtle max-w-[80%]">
                  <div className="flex items-center space-x-2">
                    <Loader className="h-4 w-4 animate-spin text-support-500" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 my-2 text-sm">
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
                className="flex-1 px-4 py-3 focus:outline-none bg-transparent text-foreground"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 ${
                  !input.trim() || isLoading
                    ? "text-muted-foreground"
                    : "text-support-600 hover:text-support-500"
                } transition-colors focus:outline-none`}
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
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