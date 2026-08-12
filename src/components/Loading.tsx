// =============================================================================
// Loading State Component
// =============================================================================
// Reusable loading indicator displayed while data is being fetched from the API.
// Think of this as a "please wait" template partial — you include it in any page
// that needs to show a loading state while an API call is in progress.
//
// REACT CONCEPT — SIMPLE COMPONENTS:
// Not every component needs state or complex logic. This one just receives
// a message prop and renders it. It's a pure "presentational" component.
// =============================================================================

import { Loader2 } from 'lucide-react';

interface LoadingProps {
  message?: string;  // Optional custom message, defaults to generic text
}

export default function Loading({ message = 'Loading data...' }: LoadingProps) {
  return (
    // Center the loading indicator both horizontally and vertically
    // 'animate-spin' rotates the icon continuously — a CSS animation class
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="text-slate-400 text-sm">{message}</p>
    </div>
  );
}
