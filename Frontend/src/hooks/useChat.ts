import { useState, useEffect, useCallback } from 'react';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface UseChatProps {
  webhookUrl?: string;
}

export const useChat = ({ webhookUrl }: UseChatProps = {}) => {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('neorag-chat-history');
    if (savedHistory) {
      try {
        const parsedHistory = JSON.parse(savedHistory);
        setChatHistory(parsedHistory.map((session: any) => ({
          ...session,
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })),
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt)
        })));
      } catch (err) {
        console.error('Failed to parse chat history:', err);
      }
    }
  }, []);

  // Save chat history to localStorage
  const saveToLocalStorage = useCallback((history: ChatSession[]) => {
    try {
      localStorage.setItem('neorag-chat-history', JSON.stringify(history));
    } catch (err) {
      console.error('Failed to save chat history:', err);
    }
  }, []);

  // Create a new chat session
  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setCurrentSession(newSession);
    return newSession;
  }, []);

  // Add message to current session
  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    setCurrentSession(prev => {
      if (!prev) {
        const newSession = createNewSession();
        return {
          ...newSession,
          messages: [newMessage],
          updatedAt: new Date()
        };
      }

      const updatedSession = {
        ...prev,
        messages: [...prev.messages, newMessage],
        updatedAt: new Date()
      };

      // Update title with first user message if it's still "New Chat"
      if (prev.title === 'New Chat' && message.role === 'user') {
        updatedSession.title = message.content.slice(0, 50) + (message.content.length > 50 ? '...' : '');
      }

      return updatedSession;
    });

    return newMessage;
  }, [createNewSession]);

  // Update specific message (for streaming)
  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setCurrentSession(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId ? { ...msg, ...updates } : msg
        ),
        updatedAt: new Date()
      };
    });
  }, []);

  // Save current session to history
  const saveCurrentSession = useCallback(() => {
    if (!currentSession || currentSession.messages.length === 0) return;

    setChatHistory(prev => {
      const existingIndex = prev.findIndex(session => session.id === currentSession.id);
      let updatedHistory;

      if (existingIndex !== -1) {
        updatedHistory = [...prev];
        updatedHistory[existingIndex] = currentSession;
      } else {
        updatedHistory = [currentSession, ...prev];
      }

      saveToLocalStorage(updatedHistory);
      return updatedHistory;
    });
  }, [currentSession, saveToLocalStorage]);

  // Load a specific session
  const loadSession = useCallback((sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setCurrentSession(session);
    }
  }, [chatHistory]);

  // Delete a session
  const deleteSession = useCallback((sessionId: string) => {
    setChatHistory(prev => {
      const updatedHistory = prev.filter(s => s.id !== sessionId);
      saveToLocalStorage(updatedHistory);
      return updatedHistory;
    });

    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  }, [currentSession, saveToLocalStorage]);

  // Clear all chat history
  const clearAllHistory = useCallback(() => {
    setChatHistory([]);
    setCurrentSession(null);
    localStorage.removeItem('neorag-chat-history');
  }, []);

  // Send message to webhook (with optional file) in ChatTrigger-compatible format
  const sendMessage = useCallback(async (content: string, file?: File) => {
    if (!content.trim() && !file) return;

    setError(null);
    setIsLoading(true);

    // Add user message
    addMessage({ content: content.trim(), role: 'user' });

    // Add loading assistant message
    const assistantMessage = addMessage({ 
      content: '', 
      role: 'assistant', 
      isTyping: true 
    });

    try {
      if (!webhookUrl) {
        // Demo response
        setTimeout(() => {
          const fileText = file ? ` with file: ${file.name}` : '';
          updateMessage(assistantMessage.id, {
            content: `I received your message: "${content}"${fileText}. (Demo mode, set WEBHOOK_URL for real backend)`,
            isTyping: false
          });
          setIsLoading(false);
        }, 2000);
        return;
      }

      let body: any;
      let headers: Record<string, string> = { "Content-Type": "application/json" };

      if (file) {
        // Convert file to base64 string (strip prefix)
        const fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]); // remove "data:...;base64,"
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        body = JSON.stringify({
          chatInput: content,
          binary: {
            file1: {
              data: fileData,
              fileName: file.name,
              mimeType: file.type
            }
          }
        });
      } else {
        body = JSON.stringify({ chatInput: content });
      }

      const response = await fetch(webhookUrl, { method: 'POST', headers, body });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      
      // Update assistant message with actual backend response
      updateMessage(assistantMessage.id, {
        content: data.output || data.text || data.answer || data.message || JSON.stringify(data),
        isTyping: false
      });

    } catch (err) {
      console.error('Failed to send message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      updateMessage(assistantMessage.id, {
        content: 'Sorry, I encountered an error while processing your message. Please try again.',
        isTyping: false
      });
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl, addMessage, updateMessage]);

  // Export chat as JSON
  const exportAsJSON = useCallback(() => {
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `neorag-chat-export-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [chatHistory]);

  // Export chat as Markdown
  const exportAsMarkdown = useCallback(() => {
    const markdown = chatHistory.map(session => {
      const sessionDate = session.createdAt.toLocaleDateString();
      const messages = session.messages.map(msg => {
        const timestamp = msg.timestamp.toLocaleString();
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        return `### ${role} (${timestamp})\n\n${msg.content}\n`;
      }).join('\n');
      return `# ${session.title}\n*Created: ${sessionDate}*\n\n${messages}`;
    }).join('\n\n---\n\n');

    const dataUri = 'data:text/markdown;charset=utf-8,'+ encodeURIComponent(markdown);
    const exportFileDefaultName = `neorag-chat-export-${new Date().toISOString().split('T')[0]}.md`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [chatHistory]);

  // Auto-save current session
  useEffect(() => {
    if (currentSession && currentSession.messages.length > 0) {
      const saveTimer = setTimeout(() => saveCurrentSession(), 1000);
      return () => clearTimeout(saveTimer);
    }
  }, [currentSession, saveCurrentSession]);

  return {
    currentSession,
    chatHistory,
    isLoading,
    error,
    createNewSession,
    loadSession,
    deleteSession,
    clearAllHistory,
    sendMessage,
    exportAsJSON,
    exportAsMarkdown,
    addMessage,
    updateMessage
  };
};
