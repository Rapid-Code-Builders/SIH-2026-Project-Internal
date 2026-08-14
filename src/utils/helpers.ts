// =============================================================================
// Kinaara Utility / Helper Functions
// Status color functions return inline-style-compatible values using CSS vars
// so they cascade from the single source of truth in index.css
// =============================================================================

/**
 * Returns a text color for status — used in SVG stroke (must be a hex/rgb,
 * not a CSS class, because SVG stroke="currentColor" needs to inherit).
 * Colors match --color-safe / --color-caution / --color-unsafe tokens.
 */
export function getStatusColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'SAFE':
    case 'GOOD':
      return 'text-[#4C8B6F]';    // var(--color-safe)
    case 'CAUTION':
    case 'MODERATE':
      return 'text-[#D69A3C]';    // var(--color-caution)
    case 'UNSAFE':
    case 'POOR':
    case 'DANGEROUS':
      return 'text-[#C74B3F]';    // var(--color-unsafe)
    default:
      return 'text-[#9C8775]';    // var(--color-text-muted)
  }
}

/**
 * Returns CSS hex color for status — used directly in style={{color:}} for
 * SVG/icon contexts where class-based color inheritance is unreliable.
 */
export function getStatusHex(status: string): string {
  switch (status?.toUpperCase()) {
    case 'SAFE':
    case 'GOOD':
      return '#4C8B6F';
    case 'CAUTION':
    case 'MODERATE':
      return '#D69A3C';
    case 'UNSAFE':
    case 'POOR':
    case 'DANGEROUS':
      return '#C74B3F';
    default:
      return '#9C8775';
  }
}

/**
 * Returns badge className for solid-fill status badges.
 * Replaces the old tinted/pastel approach with solid fills + white text.
 */
export function getStatusBgColor(status: string): string {
  switch (status?.toUpperCase()) {
    case 'SAFE':
    case 'GOOD':
      return 'badge badge-safe';
    case 'CAUTION':
    case 'MODERATE':
      return 'badge badge-caution';
    case 'UNSAFE':
    case 'POOR':
    case 'DANGEROUS':
      return 'badge badge-unsafe';
    default:
      return 'badge badge-info';
  }
}

/**
 * Returns severity color className for alert banners.
 * Critical = unsafe red, Warning = caution amber, Info = ocean blue.
 */
export function getSeverityColor(severity: string): string {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return 'bg-[#FDECEA] text-[#C74B3F] border border-[#C74B3F]/30';
    case 'WARNING':
      return 'bg-[#FDF3E0] text-[#A67020] border border-[#D69A3C]/40';
    case 'INFO':
      return 'bg-[#E8F2F8] text-[#2E5A72] border border-[#3E6E8E]/30';
    default:
      return 'bg-[#F6EEE1] text-[#6B5A47] border border-[rgba(34,25,15,0.10)]';
  }
}

/**
 * Returns a severity hex color (for icon tinting in SVG contexts).
 */
export function getSeverityHex(severity: string): string {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL': return '#C74B3F';
    case 'WARNING':  return '#D69A3C';
    case 'INFO':     return '#3E6E8E';
    default:         return '#6B5A47';
  }
}

/**
 * Formats a timestamp into a human-readable "time ago" string.
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
 */
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12)  return 'The tides are calm — good morning';
  if (hour >= 12 && hour < 15) return 'High tide energy — good afternoon';
  if (hour >= 15 && hour < 18) return 'The sun meets the sea — good afternoon';
  if (hour >= 18 && hour < 21) return 'Golden hour on the shore — good evening';
  return 'The coast never sleeps — good evening';
}
