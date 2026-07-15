import { Component } from "react";
import { Button } from "../components/ui/Button";
import { Card, CardBody, CardHeader } from "../components/ui/Card";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Application error boundary caught an error.", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <Card className="max-w-lg">
            <CardHeader title="Something went wrong" />
            <CardBody className="space-y-4">
              <p className="text-sm leading-6 text-slate-600">
                The application hit an unexpected error. Reload the page, then try the action again.
                If the issue continues, check the backend API response for the current collection.
              </p>
              <Button onClick={() => window.location.reload()}>Reload page</Button>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
