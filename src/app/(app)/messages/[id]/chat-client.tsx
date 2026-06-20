"use client";

import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { markConversationRead, sendMessage, fetchMessages } from "@/server/actions/messages";

type MessageAuthor = {
  id: string;
  name: string | null;
  username: string;
  image: string | null;
};

type Message = {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  author: MessageAuthor;
};

export function ChatClient({
  initialMessages,
  conversationId,
  currentUserId,
  otherMember,
}: {
  initialMessages: Message[];
  conversationId: string;
  currentUserId: string;
  otherMember: MessageAuthor | null;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on load and when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Mark as read on enter
  useEffect(() => {
    markConversationRead(conversationId);
  }, [conversationId, messages]);

  // Polling every 3s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newMessages = await fetchMessages(conversationId);
        if (newMessages.length > messages.length) {
          setMessages(newMessages);
        }
      } catch (error) {
        console.error("Error polling messages", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [conversationId, messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const content = inputValue.trim();
    setInputValue("");
    setIsSending(true);

    try {
      // Optimistic update
      const optimisticMsg: Message = {
        id: `temp-${Date.now()}`,
        content,
        authorId: currentUserId,
        createdAt: new Date(),
        author: {
          id: currentUserId,
          name: "Você",
          username: "voce",
          image: null,
        },
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      await sendMessage(conversationId, content);
      
      // Fetch latest after sending to get actual ID and exact timestamp
      const updatedMessages = await fetchMessages(conversationId);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Failed to send message", error);
      // In a real app we might remove the optimistic message on failure
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] sm:h-[calc(100vh-4rem)] max-w-2xl mx-auto w-full border-x border-border bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-background/95 backdrop-blur z-10">
        <Avatar>
          <AvatarImage src={otherMember?.image || ""} />
          <AvatarFallback>{otherMember?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherMember?.name || otherMember?.username}</h2>
          <p className="text-xs text-muted-foreground">@{otherMember?.username}</p>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((msg, index) => {
          const isMe = msg.authorId === currentUserId;
          const showAvatar = !isMe && (index === 0 || messages[index - 1].authorId !== msg.authorId);

          return (
            <div
              key={msg.id}
              className={`flex gap-2 max-w-[80%] ${isMe ? "ml-auto" : ""}`}
            >
              {!isMe && (
                <div className="w-8 shrink-0 flex items-end">
                  {showAvatar && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.author.image || ""} />
                      <AvatarFallback>{msg.author.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}
              
              <div
                className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {format(new Date(msg.createdAt), "HH:mm")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-border bg-background mt-auto">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 rounded-full"
            disabled={isSending}
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-full shrink-0"
            disabled={!inputValue.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
