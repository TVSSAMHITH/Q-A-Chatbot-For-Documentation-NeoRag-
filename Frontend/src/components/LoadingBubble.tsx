import { motion } from 'framer-motion';

interface LoadingBubbleProps {
  isVisible: boolean;
}

export const LoadingBubble = ({ isVisible }: LoadingBubbleProps) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.8 }}
      className="flex justify-start mb-4"
    >
      <div className="glass-morphism rounded-2xl px-4 py-3 max-w-xs shadow-message">
        <div className="flex items-center space-x-2">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="text-sm text-muted-foreground animate-pulse">
            AI is thinking...
          </span>
        </div>
      </div>
    </motion.div>
  );
};