import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, Terminal, Github, LinkedinIcon } from "lucide-react"
import { ThemeProvider, ThemeToggle } from "@/components/theme-provider"
// Remove this import:
// import { ToastProvider } from "@/components/ui/simple-toast"
import { Quicksand } from "next/font/google"
import "./globals.css"

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
})

export const metadata = {
  title: "TARS AI",
  description: "TARS is an AI-powered coding assistant that helps you with your coding tasks.",
  generator: "v0.dev",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={quicksand.variable}>
      <body className="font-quicksand">
        <ThemeProvider defaultTheme="dark" storageKey="code-assistant-theme" attribute="class">
          {/* Remove the ToastProvider wrapper */}
          <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r bg-muted/10 hidden md:flex md:flex-col flex-shrink-0">
              <div className="p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full flex items-center justify-center">
                    <img
                      src="https://t4.ftcdn.net/jpg/04/22/92/29/360_F_422922955_XaGCE7Nqe8DyLiY7mGe5SACyp8N4oHTB.jpg"
                      alt="Badge"
                      className="h-6 w-6"
                    />
                  </div>
                  <span className="font-bold text-lg">TARS</span>
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="space-y-4 p-4">
                  <nav className="space-y-1.5">
                    <button className="flex items-center w-full px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground">
                      <Terminal className="mr-2 h-4 w-4" />
                      Coding Assistant
                    </button>
                    <button className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Documentation
                    </button>
                  </nav>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="px-3 py-2">
                      <span className="text-sm">
                        TARS will not remember or store chats, it will remember its recent conversation as long as you
                        don't purge its memory. Developed by Stefan Kumarasinghe
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-sm font-medium">Version</span>
                      <span className="text-sm text-muted-foreground">v0.1.0</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <a
                        href="https://github.com/StefanKumarasinghe/sars"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        aria-label="GitHub"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/stefan-kumarasinghe/"
                        className="text-muted-foreground hover:text-foreground transition-colors ml-auto"
                        aria-label="Support"
                      >
                        <LinkedinIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollArea>
              <div className="p-4 border-t text-xs text-muted-foreground">
                <p>© 2025 TARS AI. All rights reserved.</p>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
              <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

import "./globals.css"



import './globals.css'