// Copies text to the clipboard.
// Tries the modern Clipboard API first, then falls back to execCommand.
export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback:', err);
    }
  }

  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
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
  } catch (err) {
    console.error('Copy failed:', err);
    return false;
  }
}
