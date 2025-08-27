import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Trash2, 
  Download, 
  Plus, 
  Moon, 
  Sun, 
  Monitor,
  MoreVertical,
  FileText,
  Database
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { ChatSession } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';

interface ChatSidebarProps {
  chatHistory: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onLoadSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onClearHistory: () => void;
  onExportJSON: () => void;
  onExportMarkdown: () => void;
}

export const ChatSidebar = ({
  chatHistory,
  currentSessionId,
  onNewChat,
  onLoadSession,
  onDeleteSession,
  onClearHistory,
  onExportJSON,
  onExportMarkdown
}: ChatSidebarProps) => {
  const { theme, setTheme } = useTheme();
  const [selectedSessionForDelete, setSelectedSessionForDelete] = useState<string | null>(null);

  const ThemeIcon = theme === 'dark' ? Sun : theme === 'light' ? Moon : Monitor;

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark': return 'Dark';
      case 'light': return 'Light';
      default: return 'System';
    }
  };

  const cycleTheme = () => {
    const themes = ['system', 'light', 'dark'];
    const currentIndex = themes.indexOf(theme || 'system');
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  return (
    <Sidebar className="border-r border-border/50 backdrop-blur-xl">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center glow-effect">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">NeoRAG Chat</h1>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            Chat Sessions
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewChat}
              className="h-6 w-6 p-0 hover:bg-primary/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <AnimatePresence>
                {chatHistory.map((session) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        isActive={session.id === currentSessionId}
                        className="group relative hover:bg-accent/50 transition-colors"
                        onClick={() => onLoadSession(session.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium truncate">
                            {session.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.messages.length} messages
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSessionForDelete(session.id);
                              }}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {chatHistory.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No chat sessions yet</p>
                  <p className="text-xs">Start a conversation to begin</p>
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={cycleTheme}
            className="w-full justify-start"
          >
            <ThemeIcon className="h-4 w-4 mr-2" />
            {getThemeLabel()}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Chat
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={onExportJSON}>
                <Database className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportMarkdown}>
                <FileText className="h-4 w-4 mr-2" />
                Export as Markdown
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear All Chat History</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all chat sessions and messages. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onClearHistory}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Clear All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarFooter>

      {/* Delete Session Dialog */}
      <AlertDialog 
        open={selectedSessionForDelete !== null} 
        onOpenChange={(open) => !open && setSelectedSessionForDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this chat session and all its messages. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedSessionForDelete) {
                  onDeleteSession(selectedSessionForDelete);
                  setSelectedSessionForDelete(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
};