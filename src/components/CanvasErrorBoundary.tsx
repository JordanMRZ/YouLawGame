import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
}

export class CanvasErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.warn('3D canvas recovered from', error.message)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="canvas-fallback">
          <p>The 3D view stalled. Reload it to continue.</p>
          <button
            type="button"
            className="primary"
            onClick={() => {
              this.setState({ hasError: false })
              this.props.onReset?.()
            }}
          >
            Reload 3D
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
