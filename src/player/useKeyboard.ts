import { useEffect, useRef } from 'react'

export function useKeyboard() {
  const keys = useRef(new Set<string>())

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keys.current.add(event.code)
      if (event.code === 'Space' || event.code.startsWith('Arrow')) {
        event.preventDefault()
      }
    }
    const up = (event: KeyboardEvent) => {
      keys.current.delete(event.code)
    }
    const blur = () => keys.current.clear()
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [])

  return keys
}
