import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ClipboardList, ArrowDownUp, Star } from "lucide-react"

interface WelcomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WelcomeDialog({ open, onOpenChange }: WelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/40 backdrop-blur-xl border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white/90">Welcome to Problems Lister! 👋</DialogTitle>
          <DialogDescription className="text-white/70">
            A simple way to organize and prioritize your problems.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-white/90 mb-1">List Your Problems</h3>
              <p className="text-sm text-white/70">Add any problems or challenges you're currently facing.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
              <ArrowDownUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-white/90 mb-1">Drag to Prioritize</h3>
              <p className="text-sm text-white/70">
                Drag items up or down to set their priority level. Higher items are more urgent.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-white/90 mb-1">Visual Priority</h3>
              <p className="text-sm text-white/70">
                Colors indicate priority: red for urgent, orange for high, yellow for medium, and green for low
                priority.
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)} className="bg-purple-600 hover:bg-purple-500 text-white">
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
