/**
 * Copies plain text to the user's system clipboard safely.
 *
 * Tries the modern asynchronous Navigator Clipboard API first.
 * If blocked (e.g. insecure origin, denied permission, or older browser),
 * falls back to temporary off-screen textarea with document.execCommand('copy').
 *
 * @param text The text content to copy
 * @returns Promise<boolean> resolving to true if copy succeeded, false if it failed
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  // Method 1: Modern Clipboard API
  if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Navigator clipboard API failed, attempting execCommand fallback:', err);
    }
  }

  // Method 2: Document execCommand fallback
  if (typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      // Prevent scrolling to bottom of page in iOS/browsers
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-hidden', 'true');

      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      return successful;
    } catch (fallbackErr) {
      console.error('All clipboard copy attempts failed:', fallbackErr);
      return false;
    }
  }

  return false;
}
