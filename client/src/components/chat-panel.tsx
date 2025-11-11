import { useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChatMessages, useSendMessage } from "@/hooks/use-chat";
import { useState } from "react";

interface ChatPanelProps {
  title?: string;
  placeholder?: string;
  clientId?: string;
  contextType?: "client" | "global";
}

export function ChatPanel({ 
  title = "AI Assistant", 
  placeholder = "Ask about treatment approaches...",
  clientId,
  contextType = "global"
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { data: messages = [], isLoading: isLoadingMessages } = useChatMessages(clientId);
  const { mutate: sendMessage, isPending: isSending } = useSendMessage();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    const messageContent = input;
    setInput("");

    sendMessage({ message: messageContent, clientId });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold" data-testid="text-chat-title">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {contextType === "client" ? "Client-specific context" : "All clients and sessions"}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {isLoadingMessages ? (
            <div className="text-center text-muted-foreground py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-sm">Start a conversation with the AI assistant</p>
              <p className="text-xs mt-1">
                Ask about treatment approaches, client progress, or therapeutic strategies
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                data-testid={`message-${message.id}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1 font-mono">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>

                {message.role === "user" && (
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="text-xs">You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}

          {isSending && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  AI
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="min-h-[60px] resize-none"
            disabled={isSending}
            data-testid="textarea-chat-input"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            size="icon"
            className="h-[60px] w-[60px]"
            data-testid="button-send-message"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
