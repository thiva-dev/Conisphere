import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  // Child component-la error vandha full website crash aagama state maathum
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Error Caught Safely:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f8f7fc] flex items-center justify-center p-4">
          <div className="bg-white border border-[#e3dbf3] rounded-3xl p-8 max-w-md w-full text-center shadow-xl">
            <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-[#211859]">Something Went Wrong</h2>
            <p className="text-sm text-slate-500 mt-2">
              Don&apos;t worry, our system caught the issue safely. Please refresh to continue.
            </p>
            <button
              type="button"
              onClick={this.handleReload}
              className="brand-glow-btn mt-6 px-6 py-2.5 rounded-full text-xs font-semibold gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Website</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;