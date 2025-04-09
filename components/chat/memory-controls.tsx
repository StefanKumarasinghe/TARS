"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw, File } from "lucide-react"
import { API_ENDPOINT } from "@/config/constants"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react"
import { toast } from "@/utils/toast-util"

const IconButton = ({
  onClick,
  icon: Icon,
  tooltip,
  variant = "outline",
}: {
  onClick: () => void
  icon: React.ElementType
  tooltip: string
  variant?: "outline" | "secondary"
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant={variant} size="icon" className="rounded-full h-9 w-9" onClick={onClick}>
        <Icon className="h-4 w-4" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
)

export function MemoryControls() {
  const [showMessage, setShowMessage] = useState(false)

  const forgetMemory = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/memory/clear`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to clear memory")
      }

      toast.success("Memory erased successfully!")
      window.location.reload()
    } catch (error) {
      console.error("Failed to clear memory:", error)
      toast.error("Failed to clear memory")
    }
  }

  const reIndex = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/reindex/`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to reindex memory")
      }

      // Show temporary message when reindexing is successful
      setShowMessage(true)
      toast.success("Memory reindexed successfully!")

      // Hide the message after 3 seconds
      setTimeout(() => setShowMessage(false), 3000)
    } catch (error) {
      console.error("Failed to reindex memory:", error)
      toast.error("Failed to reindex memory")
    }
  }

  return (
    <div className="flex items-center gap-2 relative">
      <TooltipProvider>
        {/* Forget memory button with temporary message */}
        <IconButton onClick={forgetMemory} icon={Trash2} tooltip="Forget Memory" />
        {/* Reload button */}
        <IconButton onClick={() => window.location.reload()} icon={RefreshCw} tooltip="Reload" />
        <IconButton onClick={reIndex} icon={File} tooltip="Reindex Resources" />
      </TooltipProvider>
    </div>
  )
}

