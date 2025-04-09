"use client"

import type React from "react"

import { APP_NAME, APP_VERSION } from "@/config/constants"
import { Button } from "@/components/ui/button"
import { Terminal, Code, Zap, FileCode, Sparkles, Lightbulb, Keyboard, ArrowDown } from "lucide-react"
import { useState, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { useChat } from "@/context/chat-context"

const EXAMPLE_PROMPTS = [
  "Give me a code example of a simple React component",
  "How do I create a REST API with Node.js and Express?",
  "Write a SQL query to find all users with an age greater than 30",
  "Explain the concept of promises in JavaScript",
  "How do I use async/await in JavaScript?",
  "Create a simple CRUD application using React and Redux",
  "What is the difference between var, let, and const in JavaScript?",
  "Write a Python function to calculate the factorial of a number",
  "How do I implement authentication in a Node.js application?",
  "Create a responsive layout using CSS Grid",
  "How do I handle form validation in React?",
  "Write a JavaScript function to debounce a given function",
  "How do I use the Fetch API to make HTTP requests?",
  "Give me some important DevOps tools to use",
  "How do I set up a MongoDB database with Mongoose?",
  "Write a CSS rule to center an element both vertically and horizontally",
  "How do I implement routing in a React application?",
  "How do I implement a responsive navbar with React and Tailwind?",
  "Explain the difference between useEffect and useLayoutEffect in React",
  "Write a function to find the longest substring without repeating characters",
  "How can I optimize the performance of my React application?",
  "Create a TypeScript interface for a user authentication system",
  "How do I set up a custom webpack configuration for a React app?",
  "Write a Python function to merge two sorted lists into one sorted list",
  "How can I handle errors in asynchronous JavaScript code?",
  "Explain the concept of closures in JavaScript with an example",
  "Create a Node.js REST API using Express.js",
  "How do I implement lazy loading in React?",
  "Write a SQL query to find the second highest salary from an employees table",
  "How do I create a custom hook in React?",
  "How do I debug a memory leak in a Node.js application?",
  "Write a regular expression to validate an email address",
]

export function ChatWelcome() {
  const [activeTab, setActiveTab] = useState<"features" | "examples">("features")
  const [hoveredPrompt, setHoveredPrompt] = useState<number | null>(null)
  const { handleSubmit } = useChat()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Use the prompt directly in the chat
  const usePrompt = useCallback(
    (prompt: string) => {
      console.log("Using prompt:", prompt)
      handleSubmit(prompt) // Submit the prompt to the chat

      // Focus the textarea
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    },
    [handleSubmit],
  )

  const handlePromptClick = (prompt: string) => {
    usePrompt(prompt)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 py-8">
      {/* give me an alert box to say not to share personal information or tokens as the conversation is shared and for demo purposes */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mb-8 p-4 rounded-lg bg-destructive border border-destructive/50 shadow-md flex flex-col items-center text-center gap-4"
      >
        <div>
          <p className="text-sm text-destructive-foreground">
            Please do not share any personal information or tokens. This conversation is shared and for demo purposes
            only.
          </p>
          <p className="text-sm font-semibold text-destructive-foreground mt-1">
            Do not use your personal information or tokens in the conversation.
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-20 w-20 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg"
      >
        <img
          src="https://t4.ftcdn.net/jpg/04/22/92/29/360_F_422922955_XaGCE7Nqe8DyLiY7mGe5SACyp8N4oHTB.jpg"
          alt="TARS Logo"
          className="h-16 w-16 rounded-full"
        />
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold mb-2"
      >
        Welcome to {APP_NAME} {APP_VERSION}
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-muted-foreground max-w-lg mb-8"
      >
        Your AI-powered coding companion. Ask any programming question or request code examples to boost your
        productivity.
      </motion.p>

      <div className="w-full max-w-3xl mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-muted/50 rounded-lg p-1 flex">
            <Button
              variant={activeTab === "features" ? "default" : "ghost"}
              className="rounded-md"
              onClick={() => setActiveTab("features")}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Features
            </Button>
            <Button
              variant={activeTab === "examples" ? "default" : "ghost"}
              className="rounded-md"
              onClick={() => setActiveTab("examples")}
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Example Prompts
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "features" ? (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid justify-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full"
            >
              <FeatureCard
                icon={<Terminal className="h-5 w-5 text-primary" />}
                title="Code Assistant"
                description="Get help with syntax, debugging, or understanding complex concepts"
              />
              <FeatureCard
                icon={<Code className="h-5 w-5 text-primary" />}
                title="Code Generation"
                description="Request code examples, boilerplates, or complete solutions for your projects"
              />
              <FeatureCard
                icon={<Zap className="h-5 w-5 text-primary" />}
                title="Code Optimization"
                description="Improve your existing code for better performance and readability"
              />
              <FeatureCard
                icon={<FileCode className="h-5 w-5 text-primary" />}
                title="Custom Preferences"
                description="Enhance results with preferences and other custom prompts"
              />
              <FeatureCard
                icon={<ArrowDown className="h-5 w-5 text-primary" />}
                title="Interactive Code"
                description="Click 'Use' on any code block to instantly add it to your message input"
              />
              <FeatureCard
                icon={<ArrowDown className="h-5 w-5 text-primary" />}
                title="Run HTML codes"
                description="To get a preview of your HTML, click run"
              />
            </motion.div>
          ) : (
            <motion.div
              key="examples"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3 max-w-2xl mx-auto"
            >
              {EXAMPLE_PROMPTS.map((prompt, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer text-left flex justify-between items-center",
                    hoveredPrompt === index && "bg-accent/50",
                  )}
                  onMouseEnter={() => setHoveredPrompt(index)}
                  onMouseLeave={() => setHoveredPrompt(null)}
                  onClick={() => handlePromptClick(prompt)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <p className="text-sm">{prompt}</p>
                  <Button variant="ghost" size="sm" className="ml-2 opacity-70">
                    <Keyboard className="h-3.5 w-3.5 mr-1" />
                    <span className="text-xs">Use</span>
                  </Button>
                </motion.div>
              ))}
              <p className="text-xs text-muted-foreground mt-4">Click on a prompt to use it in your conversation</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-sm text-muted-foreground max-w-lg"
      >
        <p>Type your question below or select a prompt to get started</p>
      </motion.div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="bg-card border rounded-lg p-4 hover:shadow-md transition-all hover:border-primary/50"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="bg-primary/10 p-2 rounded-full">{icon}</div>
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  )
}

