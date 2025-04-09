"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("light")}
        className={theme === "light" ? "bg-accent text-accent-foreground" : ""}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "bg-accent text-accent-foreground" : ""}
        aria-label="Dark mode"
      >
        <Moon className="h-4 w-4" />
      </Button>
    </div>
  )
}

