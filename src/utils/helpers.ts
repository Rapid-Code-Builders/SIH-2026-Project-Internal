// =============================================================================
// TideSense Utility / Helper Functions
// =============================================================================
// Shared utility functions used across multiple components.
// Think of this like a 'utils.py' in your backend — small, reusable functions
// that don't belong to any specific component.
// =============================================================================

/**
 * Returns the appropriate CSS color class based on a beach safety status.
 * This maps the backend's status enum to Tailwind CSS color classes.
 *
 * Similar to how you might have a status-to-color mapping in a Jinja template
 * or a serializer in Django/FastAPI.
 */
export function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'SAFE':
    case 'GOOD':
      return 'text-emerald-400';
    case 'CAUTION':
    case 'MODERATE':
      return 'text-amber-400';
    case 'UNSAFE':
    case 'POOR':
    case 'DANGEROUS':
      return 'text-red-400';
    default:
      return 'text-slate-400';
  }
}

/**
 * Returns a background color class for status badges.
 */
export function getStatusBgColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'SAFE':
    case 'GOOD':
      return 'bg-emerald-400/15 text-emerald-400 border-emerald-400/30';
    case 'CAUTION':
    case 'MODERATE':
      return 'bg-amber-400/15 text-amber-400 border-amber-400/30';
    case 'UNSAFE':
    case 'POOR':
    case 'DANGEROUS':
      return 'bg-red-400/15 text-red-400 border-red-400/30';
    default:
      return 'bg-slate-400/15 text-slate-400 border-slate-400/30';
  }
}

/**
 * Returns a color class for alert severity.
 */
export function getSeverityColor(severity: string): string {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'WARNING':
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    case 'INFO':
      return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
    default:
      return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
  }
}

/**
 * Formats a timestamp into a human-readable "time ago" string.
 * e.g., "Updated 4 min ago", "Updated 2 hrs ago"
 *
 * This is purely a display helper — like a template filter in Django.
 */
export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

/**
 * Returns a greeting based on the current time of day.
 * Used on the dashboard home page.
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
