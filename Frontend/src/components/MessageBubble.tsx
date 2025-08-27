import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';
import { Message } from '@/hooks/useChat';
import { Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export const MessageBubble = ({ message, isLatest = false }: MessageBubbleProps) => {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const isUser = message.role === 'user';
  const isTyping = message.isTyping;

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const CodeBlock = ({ children, className, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    const code = String(children).replace(/\n$/, '');

    return match ? (
      <div className="relative group">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => handleCopyCode(code)}
        >
          {copiedCode === code ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <SyntaxHighlighter
          style={theme === 'dark' ? oneDark : oneLight}
          language={language}
          PreTag="div"
          className="rounded-lg !mt-0 !mb-0"
          {...props}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay: isLatest ? 0.1 : 0 
      }}
      className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`
          relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-message
          ${isUser 
            ? 'bg-user-bubble text-user-bubble-foreground glass-glow' 
            : 'bg-bot-bubble text-bot-bubble-foreground glass-morphism'
          }
          ${isTyping ? 'animate-pulse' : ''}
        `}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown
              components={{
                code: CodeBlock,
                p: ({ children }) => (
                  <p className="text-sm leading-relaxed mb-2 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {children}
                  </ol>
                ),
                h1: ({ children }) => (
                  <h1 className="text-lg font-bold mb-2 gradient-text">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mb-2 gradient-text">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mb-1 gradient-text">
                    {children}
                  </h3>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground">
                    {children}
                  </blockquote>
                ),
                a: ({ children, href }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline transition-colors"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content || (isTyping ? '' : 'Processing...')}
            </ReactMarkdown>
            
            {isTyping && !message.content && (
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        )}
        
        <div className={`text-xs mt-2 opacity-60 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </motion.div>
  );
};