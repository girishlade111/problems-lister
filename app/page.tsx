"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Plus, X, GripVertical, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WelcomeDialog } from "@/components/welcome-dialog"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { motion, AnimatePresence } from "framer-motion"
import { useProblemsStore } from "@/hooks/use-problems-store"
import { format } from "date-fns"

const getPriorityColor = (problemCount: number) => {
  if (problemCount >= 10) return "rgb(239, 68, 68)" // red-500
  if (problemCount >= 7) return "rgb(249, 115, 22)" // orange-500
  if (problemCount >= 4) return "rgb(234, 179, 8)" // yellow-500
  return "rgb(34, 197, 94)" // green-500
}

const getPriorityText = (problemCount: number) => {
  if (problemCount >= 10) return "Critical"
  if (problemCount >= 7) return "High"
  if (problemCount >= 4) return "Medium"
  if (problemCount >= 1) return "Low"
  return "None"
}

interface SortableItemProps {
  id: string
  content: string
  index: number
  totalItems: number
  onDelete: (id: string) => void
}

function SortableItem({ id, content, index, totalItems, onDelete }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...getItemStyle(index, totalItems),
  }

  return (
    <motion.li
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      ref={setNodeRef}
      style={style}
      className={`
        relative p-3 sm:p-4 rounded-lg
        bg-black/40 backdrop-blur-lg border border-white/10
        ${isDragging ? "z-50 shadow-2xl ring-1 ring-purple-500/30" : "z-10"}
      `}
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <button {...attributes} {...listeners} className="touch-none cursor-grab active:cursor-grabbing">
          <GripVertical className="w-4 h-4 text-white/40" />
        </button>
        <span className="flex-grow text-sm sm:text-base text-white/80">{content}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(id)}
          className="text-white/40 hover:text-white/90 hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </motion.li>
  )
}

const getItemStyle = (index: number, totalItems: number) => {
  const colorStops = [
    { r: 255, g: 59, b: 48 }, // Red (Urgent)
    { r: 255, g: 149, b: 0 }, // Orange (High)
    { r: 255, g: 204, b: 0 }, // Yellow (Medium)
    { r: 40, g: 205, b: 65 }, // Green (Low)
  ]

  const position = index / (totalItems - 1 || 1)
  const colorIndex = position * (colorStops.length - 1)
  const lowerIndex = Math.floor(colorIndex)
  const upperIndex = Math.min(colorStops.length - 1, Math.ceil(colorIndex))

  const ratio = colorIndex - lowerIndex
  const lowerColor = colorStops[lowerIndex]
  const upperColor = colorStops[upperIndex]

  const r = Math.round(lowerColor.r + (upperColor.r - lowerColor.r) * ratio)
  const g = Math.round(lowerColor.g + (upperColor.g - lowerColor.g) * ratio)
  const b = Math.round(lowerColor.b + (upperColor.b - lowerColor.b) * ratio)

  return {
    borderLeft: `4px solid rgba(${r}, ${g}, ${b}, 0.8)`,
  }
}

export default function ProblemsLister() {
  const { problems, addProblem, deleteProblem, reorderProblems, clearAllProblems } = useProblemsStore()
  const [newProblem, setNewProblem] = useState("")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage("hasSeenWelcome", false)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (!hasSeenWelcome) {
      setShowWelcome(true)
    }
  }, [hasSeenWelcome])

  const handleWelcomeClose = (open: boolean) => {
    setShowWelcome(open)
    if (!open) {
      setHasSeenWelcome(true)
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleAddProblem = () => {
    if (newProblem.trim()) {
      addProblem(newProblem)
      setNewProblem("") // Clear the input after adding
    }
  }

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = problems.findIndex((item) => item.id === active.id)
      const newIndex = problems.findIndex((item) => item.id === over.id)
      reorderProblems(oldIndex, newIndex)
    }
    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddProblem()
    }
  }

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  }

  return (
    <div className="min-h-screen bg-[#0F1117] bg-gradient-to-br from-purple-900/20 to-slate-900/20 p-4 sm:p-8">
      <div className="w-full max-w-md mx-auto rounded-xl p-4 sm:p-6 bg-black/20 backdrop-blur-xl border border-white/10 shadow-[0_0_1000px_rgba(139,92,246,0.05)] relative">
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-white/90">Problems Lister</h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1">Organize and prioritize your challenges</p>
            <div className="text-xs sm:text-sm text-white/60 mt-1">{format(new Date(), "MMMM d, yyyy")}</div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowWelcome(true)}
            className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
          >
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row mb-4 sm:mb-6 gap-2">
          <Input
            type="text"
            value={newProblem}
            onChange={(e) => setNewProblem(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What's bothering you today?"
            className="flex-grow bg-white/5 border-white/10 text-white/80 placeholder:text-white/40"
          />
          <Button onClick={handleAddProblem} className="bg-purple-600 hover:bg-purple-500 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add
          </Button>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={problems.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {problems.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-6 sm:py-8 text-sm sm:text-base text-white/40"
                >
                  No problems yet. Add one to get started!
                </motion.div>
              ) : (
                <ul className="space-y-2">
                  {problems.map((problem, index) => (
                    <SortableItem
                      key={problem.id}
                      id={problem.id}
                      content={problem.content}
                      index={index}
                      totalItems={problems.length}
                      onDelete={deleteProblem}
                    />
                  ))}
                </ul>
              )}
            </AnimatePresence>
          </SortableContext>
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId ? (
              <div className="p-3 sm:p-4 rounded-lg bg-black/40 backdrop-blur-lg border border-white/10 shadow-2xl ring-1 ring-purple-500/30">
                <div className="flex items-center gap-2 sm:gap-3">
                  <GripVertical className="w-4 h-4 text-white/40" />
                  <span className="flex-grow text-sm sm:text-base text-white/80">
                    {problems.find((p) => p.id === activeId)?.content}
                  </span>
                  <X className="w-4 h-4 text-white/40" />
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <div className="mt-4 sm:mt-6 flex flex-col gap-4">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-3 sm:p-4 shadow-inner">
            <h2 className="text-base sm:text-lg font-semibold text-white/90 mb-2">Problem Summary</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div>
                <p className="text-xs sm:text-sm text-white/60">Total problems:</p>
                <p className="text-2xl sm:text-3xl font-bold text-white">{problems.length}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-xs sm:text-sm text-white/60">Level:</p>
                <p className="text-lg sm:text-xl font-semibold" style={{ color: getPriorityColor(problems.length) }}>
                  {getPriorityText(problems.length)}
                </p>
              </div>
            </div>
          </div>
          {problems.length > 0 && (
            <Button
              variant="destructive"
              onClick={clearAllProblems}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500"
            >
              Clear All Problems
            </Button>
          )}
          <div className="text-center text-xs sm:text-sm text-white/40 pt-4 border-t border-white/10">
            Created with ❤️ by{" "}
            <a
              href="https://github.com/Shuuubhraj"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300"
            >
              @Shubhraj
            </a>
          </div>
        </div>
      </div>
      <WelcomeDialog open={showWelcome} onOpenChange={handleWelcomeClose} />
    </div>
  )
}
