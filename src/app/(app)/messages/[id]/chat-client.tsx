"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { format } from "date-fns";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getInitials } from "@/lib/utils";
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
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  // Scroll to bottom on load and when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Mark as read on enter
  useEffect(() => {
    markConversationRead(conversationId);
  }, [conversationId]);

  // Polling every 3s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const newMessages = await fetchMessages(conversationId);
        if (newMessages.length > messages.length) {
          setMessages(newMessages);
        }
      } catch {
        // Silent - polling failures are non-critical
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

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      content,
      authorId: currentUserId,
      createdAt: new Date(),
      author: {
        id: currentUserId,
        name: "Você",
        username: "",
        image: null,
      },
    };
    setMessages((prev) => [...prev, optimisticMsg]);

    try {
      await sendMessage(conversationId, content);
      const updatedMessages = await fetchMessages(conversationId);
      setMessages(updatedMessages);
    } catch {
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      toast.error("Não foi possível enviar a mensagem. Tente novamente.");
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-[calc(100dvh-80px)] max-w-2xl mx-auto w-full flex-col border-x border-border bg-background sm:h-[calc(100dvh-4rem)]">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-background/95 p-4 backdrop-blur">
        <Link
          href="/messages"
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground lg:hidden"
          aria-label="Voltar para mensagens"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <Avatar className="h-10 w-10 nexus-ring">
          <AvatarImage src={otherMember?.image || ""} />
          <AvatarFallback>
            {getInitials(otherMember?.name ?? otherMember?.username)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">{otherMember?.name || otherMember?.username}</h2>
          <p className="text-xs text-muted-foreground">@{otherMember?.username}</p>
        </div>
      </header>

      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-3"
        role="log"
        aria-label="Mensagens da conversa"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Envie a primeira mensagem para iniciar a conversa.
          </p>
        )}
        {messages.map((msg, index) => {
          const isMe = msg.authorId === currentUserId;
          const showAvatar =
            !isMe &&
            (index === 0 || messages[index - 1].authorId !== msg.authorId);

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
                      <AvatarFallback>
                        {getInitials(msg.author.name ?? msg.author.username)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              <div
                className={`flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`px-4 py-2.5 rounded-2xl ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  } ${msg.id.startsWith("temp-") ? "opacity-70" : ""}`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm">{msg.content}</p>
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
      <div className="border-t border-border bg-background p-4">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite uma mensagem..."
            className="flex-1 rounded-full"
            disabled={isSending}
            aria-label="Mensagem"
            maxLength={2000}
          />
          <Button
            type="submit"
            size="icon"
            className="shrink-0 rounded-full"
            disabled={!inputValue.trim() || isSending}
            aria-label="Enviar mensagem"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
