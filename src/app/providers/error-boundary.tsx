//src/app/providers/error-boundary.tsx
import { Component, type ReactNode, type ErrorInfo } from "react";
import { useSessionStore } from "@/features/vault-session/store/session.store";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // In production, this prevents white screens of death
    console.error("Uncaught UI error:", error, errorInfo);
  }

  private handleLockAndRecover = (): void => {
    // Lock vault to wipe RAM securely, then reset error state
    useSessionStore.getState().setLocked();
    this.setState({ hasError: false });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
          <h2 className="mb-4 text-2xl font-bold">Something went wrong</h2>
          <p className="mb-8 text-muted-foreground">
            The application encountered an unexpected error.
          </p>
          <button
            onClick={this.handleLockAndRecover}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Lock Vault & Recover
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
