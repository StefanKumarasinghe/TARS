"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef, useEffect, useState, useCallback } from "react"
import ChatMessage from "./chat-message"
import { ChatWelcome } from "./chat-welcome"
import { useChat } from "@/context/chat-context"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatProgressBar } from "./chat-progress-bar"

export function ChatMessageList() {
  const { messages, language, preferences, isLoading, handleCodeAction, memoryState, setMemoryState } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isAutoScrollEnabled, setIsAutoScrollEnabled] = useState(true)

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    setIsAutoScrollEnabled(true)
  }, [])

  // Handle scroll events to show/hide scroll button
  const handleScroll = useCallback(() => {
    if (!scrollAreaRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100

    setShowScrollButton(!isNearBottom)
    setIsAutoScrollEnabled(isNearBottom)
  }, [])

  // Auto-scroll when new messages arrive if auto-scroll is enabled
  useEffect(() => {
    if (isAutoScrollEnabled && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, isAutoScrollEnabled])

  // Add scroll event listener
  useEffect(() => {
    const scrollArea = scrollAreaRef.current
    if (scrollArea) {
      scrollArea.addEventListener("scroll", handleScroll)
      return () => scrollArea.removeEventListener("scroll", handleScroll)
    }
  }, [handleScroll])

  // Handle clearing memory
  const handleClearMemory = useCallback(() => {
    setMemoryState((prev) => ({ ...prev, forgetMemory: true }))
  }, [setMemoryState])

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      {/* Progress bar for chat history */}
      {messages.length > 0 && <ChatProgressBar messageCount={messages.length} onClearMemory={handleClearMemory} />}

      <ScrollArea className="flex-1 px-2 sm:px-4 py-4" scrollAreaRef={scrollAreaRef}>
        <div className="space-y-6 pb-6 max-w-full mx-auto px-3">
          {messages.length === 0 ? (
            <ChatWelcome />
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                language={language}
                syntaxHighlighting={preferences.syntaxHighlighting}
                showLineNumbers={preferences.showLineNumbers}
                onCodeAction={handleCodeAction}
              />
            ))
          )}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground ml-5 text-sm">
              <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
              <span>TARS is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Scroll to bottom button */}
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "absolute bottom-4 right-4 rounded-full h-10 w-10 bg-background shadow-md transition-opacity duration-200",
          showScrollButton ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={scrollToBottom}
        aria-label="Scroll to bottom"
      >
        <ChevronDown className="h-5 w-5" />
      </Button>
    </div>
  )
}

