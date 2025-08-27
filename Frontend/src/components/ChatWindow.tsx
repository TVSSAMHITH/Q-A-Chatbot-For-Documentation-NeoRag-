import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Mic, Square } from 'lucide-react';
import { MessageBubble } from './MessageBubble';
import { LoadingBubble } from './LoadingBubble';
import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import heroImage from '@/assets/neorag-hero.jpg';

interface ChatWindowProps {
  webhookUrl?: string;
}

export const ChatWindow = ({ webhookUrl }: ChatWindowProps) => {
  const {
    currentSession,
    isLoading,
    error,
    sendMessage,
    createNewSession
  } = useChat({ webhookUrl });

  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      });
    }
  }, [error]);

  // Create initial session if none exists
  useEffect(() => {
    if (!currentSession) {
      createNewSession();
    }
  }, [currentSession, createNewSession]);

  const handleSend = async () => {
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    const message = input.trim();
    const files = [...attachedFiles];
    
    setInput('');
    setAttachedFiles([]);
    
    // Send files one by one with the message
    if (files.length > 0) {
      for (const file of files) {
        await sendMessage(message || `[File: ${file.name}]`, file);
      }
    } else {
      await sendMessage(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
      toast({
        title: 'Files Added',
        description: `${files.length} file(s) ready to send`,
      });
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files]);
      toast({
        title: 'Files Added',
        description: `${files.length} file(s) ready to send`,
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording functionality would go here
    if (!isRecording) {
      toast({
        title: 'Voice Recording',
        description: 'Voice recording functionality coming soon!',
      });
    }
  };

  const messages = currentSession?.messages || [];
  const showLoadingBubble = isLoading && !messages.some(m => m.isTyping);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="border-b border-border/50 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold gradient-text">
              {currentSession?.title || 'New Chat'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {messages.length} messages
              {!webhookUrl && ' • Demo Mode'}
            </p>
          </div>
        </div>
      </header>

      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-2xl mx-auto"
            >
              <div className="relative">
                <img
                  src={heroImage}
                  alt="NeoRAG AI Brain"
                  className="w-32 h-16 object-cover rounded-xl shadow-glass glow-effect"
                />
                <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-xl"></div>
              </div>
              <div className="space-y-4">
                <h3 className="text-2xl font-bold gradient-text">
                  Welcome to NeoRAG Chat
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Experience the future of AI conversation with advanced neural networks 
                  and intelligent responses. Your AI assistant is ready to help with 
                  complex queries, creative tasks, and meaningful dialogue.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setInput("What can you help me with today?")}
                    className="glass-morphism hover:bg-primary/10"
                  >
                    Ask about capabilities
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setInput("Explain quantum computing in simple terms")}
                    className="glass-morphism hover:bg-primary/10"
                  >
                    Explain complex topics
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setInput("Help me brainstorm ideas for a project")}
                    className="glass-morphism hover:bg-primary/10"
                  >
                    Creative assistance
                  </Button>
                </div>
                {!webhookUrl && (
                  <div className="glass-morphism rounded-lg p-3 border border-amber-500/20">
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      <strong>Demo Mode:</strong> Running with simulated responses. 
                      Configure your n8n webhook URL for full functionality.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}

          <LoadingBubble isVisible={showLoadingBubble} />
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="border-t border-border/50 p-4 backdrop-blur-xl">
        <div className="relative max-w-4xl mx-auto">
          <div 
            className={`glass-morphism rounded-2xl p-4 glow-effect transition-all duration-200 ${
              isDragOver ? 'border-2 border-primary border-dashed bg-primary/5' : ''
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {/* File Previews */}
            {attachedFiles.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {attachedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-accent/50 rounded-lg px-3 py-1 text-sm"
                  >
                    <Paperclip className="h-3 w-3" />
                    <span className="max-w-32 truncate">{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      className="text-muted-foreground hover:text-foreground ml-1"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {isDragOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-2xl border-2 border-primary border-dashed">
                <p className="text-primary font-medium">Drop files here to attach</p>
              </div>
            )}

            <div className="flex items-end space-x-2">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                accept="*"
              />
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 hover:bg-accent/50"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message... (Shift + Enter for new line)"
                  className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  rows={1}
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={toggleRecording}
                className={`p-2 transition-colors ${
                  isRecording 
                    ? 'text-red-500 hover:text-red-600 animate-pulse' 
                    : 'hover:bg-accent/50'
                }`}
              >
                {isRecording ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>

              <Button
                onClick={handleSend}
                disabled={(!input.trim() && attachedFiles.length === 0) || isLoading}
                className="bg-gradient-primary text-white hover:opacity-90 transition-opacity glow-effect"
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};