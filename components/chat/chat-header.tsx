"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Terminal, Menu, Settings, Info, HelpCircle, Github, Twitter, Keyboard, Download } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ThemeToggle } from "../ui/theme-toggle"
import { MemoryControls } from "./memory-controls"
import { useChat } from "@/context/chat-context"
import SettingsSheet from "../settings/settings-sheet"
import { ChatHistoryDownload } from "./chat-history-download"
import type { ActiveView } from "@/types"
import { motion, AnimatePresence } from "framer-motion"

export function ChatHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const {
    preferences,
    setPreferences,
    activeView,
    setActiveView,
    customPrompt,
    setCustomPrompt,
    personalInfo,
    setPersonalInfo,
    messages,
  } = useChat()

  const renderNavButton = (label: string, view: ActiveView, Icon: React.ElementType) => (
    <button
      className={`flex items-center px-3 py-2 text-sm rounded-md w-full ${
        activeView === view
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent hover:text-accent-foreground transition-colors"
      }`}
      onClick={() => {
        setActiveView(view)
        setIsMobileMenuOpen(false)
      }}
    >
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </button>
  )

  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0

  return (
    <>
      <header className="h-14 border-b px-4 flex md:hidden items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
            <img
              src="https://t4.ftcdn.net/jpg/04/22/92/29/360_F_422922955_XaGCE7Nqe8DyLiY7mGe5SACyp8N4oHTB.jpg"
              alt="TARS Logo"
              className="h-4 w-4"
            />
          </div>
          <span className="font-semibold">TARS</span>
        </div>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent side="left" className="w-[300px] sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center">
                    <img
                      src="https://t4.ftcdn.net/jpg/04/22/92/29/360_F_422922955_XaGCE7Nqe8DyLiY7mGe5SACyp8N4oHTB.jpg"
                      alt="TARS Logo"
                      className="h-4 w-4"
                    />
                  </div>
                  <span>TARS</span>
                </div>
              </SheetTitle>
            </SheetHeader>

            <div className="py-4">
              <nav className="space-y-2">{renderNavButton("Coding Assistant", "chat", Terminal)}</nav>

              <Separator className="my-4" />

              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm">Theme</span>
                <ThemeToggle />
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowKeyboardShortcuts(true)}>
                  <Keyboard className="mr-2 h-4 w-4" />
                  Keyboard Shortcuts
                </Button>

                <SheetClose asChild>
                  <Button variant="outline" onClick={() => setIsMobileMenuOpen(false)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </SheetClose>

                {messages.length > 0 && (
                  <SheetClose asChild>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download Chat
                    </Button>
                  </SheetClose>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 px-3 py-2">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <header className="h-14 border-b px-4 hidden md:flex items-center justify-between">
        <div className="flex items-center gap-4">
          {renderNavButton("Chat", "chat", Terminal)}

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                >
                  <Keyboard className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Keyboard Shortcuts</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowInfo(!showInfo)}>
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Information</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {messages.length > 0 && <ChatHistoryDownload messages={messages} />}
        </div>

        <div className="flex items-center gap-2">
          <MemoryControls />
          <SettingsSheet
            preferences={preferences}
            setPreferences={setPreferences}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
          />
          <ThemeToggle />
        </div>
      </header>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 right-4 z-50 bg-card border rounded-lg shadow-lg p-4 w-80"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center gap-2">
                <Info className="h-4 w-4" />
                About TARS
              </h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowInfo(false)}>
                &times;
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              TARS is an AI-powered coding assistant designed to help with programming tasks, debugging, and learning.
              It is designed to be more specific to coding and also provide documentation and resources to assist it's
              accuracy.
            </p>
            <div className="text-xs text-muted-foreground">
              <p>Version: 0.1.0</p>
              <p>Developed by Stefan Kumarasinghe</p>
            </div>
            <Separator className="my-2" />
            <div className="text-xs">
              <p className="font-medium mb-1">Keyboard Shortcuts:</p>
              <ul className="space-y-1">
                <li>
                  <span className="font-mono bg-muted px-1 rounded">{isMac ? "⌘" : "Ctrl"}+Enter</span> - Send message
                </li>
                <li>
                  <span className="font-mono bg-muted px-1 rounded">{isMac ? "⌘" : "Ctrl"}+K</span> - Focus input
                </li>
                <li>
                  <span className="font-mono bg-muted px-1 rounded">{isMac ? "⌘" : "Ctrl"}+E</span> - Explain code
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKeyboardShortcuts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowKeyboardShortcuts(false)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-card border rounded-lg shadow-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Keyboard className="h-5 w-5" />
                  Keyboard Shortcuts
                </h2>
                <Button variant="ghost" size="sm" className="h-8 w-8" onClick={() => setShowKeyboardShortcuts(false)}>
                  &times;
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">General</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Focus input</span>
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{isMac ? "⌘" : "Ctrl"}+K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Send message</span>
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{isMac ? "⌘" : "Ctrl"}+Enter</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Code Actions</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Explain Code</span>
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{isMac ? "⌘" : "Ctrl"}+E</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Debug Code</span>
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{isMac ? "⌘" : "Ctrl"}+D</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Optimize Code</span>
                      <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{isMac ? "⌘" : "Ctrl"}+O</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" variant="default" onClick={() => setShowKeyboardShortcuts(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

