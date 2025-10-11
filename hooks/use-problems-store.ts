import { useLocalStorage } from "./use-local-storage"

export interface Problem {
  id: string
  content: string
}

export function useProblemsStore() {
  const [problems, setProblems] = useLocalStorage<Problem[]>("problems", [])

  const addProblem = (content: string) => {
    if (content.trim() !== "") {
      const newProblem = {
        id: Date.now().toString(),
        content: content.trim(),
      }
      setProblems((prevProblems) => [...prevProblems, newProblem])
    }
  }

  const deleteProblem = (id: string) => {
    setProblems((prevProblems) => prevProblems.filter((problem) => problem.id !== id))
  }

  const reorderProblems = (oldIndex: number, newIndex: number) => {
    setProblems((prevProblems) => {
      const result = Array.from(prevProblems)
      const [removed] = result.splice(oldIndex, 1)
      result.splice(newIndex, 0, removed)
      return result
    })
  }

  const clearAllProblems = () => {
    setProblems([])
  }

  return {
    problems,
    addProblem,
    deleteProblem,
    reorderProblems,
    clearAllProblems,
  }
}
