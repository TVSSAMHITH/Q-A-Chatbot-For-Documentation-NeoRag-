import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/Sidebar";
import { ChatWindow } from "@/components/ChatWindow";
import { useChat } from "@/hooks/useChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Main Chat App Component
const ChatApp = () => {
  // n8n webhook URL for backend integration
  const webhookUrl = "http://localhost:5678/webhook-test/b78c4981-155c-4b6e-bb2b-72b1f4b6b576";
  
  const {
    currentSession,
    chatHistory,
    createNewSession,
    loadSession,
    deleteSession,
    clearAllHistory,
    exportAsJSON,
    exportAsMarkdown
  } = useChat({ webhookUrl });

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ChatSidebar
          chatHistory={chatHistory}
          currentSessionId={currentSession?.id || null}
          onNewChat={createNewSession}
          onLoadSession={loadSession}
          onDeleteSession={deleteSession}
          onClearHistory={clearAllHistory}
          onExportJSON={exportAsJSON}
          onExportMarkdown={exportAsMarkdown}
        />
        
        <div className="flex-1 flex flex-col">
          <header className="h-12 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <SidebarTrigger className="ml-2" />
          </header>
          
          <main className="flex-1">
            <ChatWindow webhookUrl={webhookUrl} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChatApp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
