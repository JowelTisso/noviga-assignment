import * as React from "react";
import "./ErrorBoundary.scss";

type ErrorProps = {
  fallback?: React.ReactNode | string;
  children: React.ReactNode;
};

type StateType = {
  hasError: boolean;
};

export default class ErrorBoundary extends React.Component<
  ErrorProps,
  StateType
> {
  constructor(props: ErrorProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="error-boundary-wrapper">
            <img src="/error.svg" alt="Error image" className="img-error" />
            <h2>Something went wrong!</h2>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
