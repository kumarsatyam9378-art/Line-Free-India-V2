import { useState, useCallback } from 'react';
import { useHapticFeedback } from './usePullToRefresh';

interface CopyToClipboardOptions {
  successDuration?: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface CopyToClipboardResult {
  copy: (text: string) => Promise<void>;
  isCopied: boolean;
  error: Error | null;
}

/**
 * Hook for copying text to clipboard with feedback
 * 
 * Features:
 * - Async clipboard API with fallback
 * - Success/error state management
 * - Auto-reset after duration
 * - Haptic feedback on success (mobile)
 * - Error handling
 * 
 * @param options - Configuration options
 * @returns Copy function and state
 * 
 * @example
 * ```tsx
 * const { copy, isCopied, error } = useCopyToClipboard({
 *   successDuration: 2000,
 *   onSuccess: () => console.log('Copied!'),
 * });
 * 
 * <button onClick={() => copy('Hello World')}>
 *   {isCopied ? 'Copied!' : 'Copy'}
 * </button>
 * ```
 */
export function useCopyToClipboard({
  successDuration = 2000,
  onSuccess,
  onError,
}: CopyToClipboardOptions = {}): CopyToClipboardResult {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { triggerHaptic } = useHapticFeedback();

  const copy = useCallback(
    async (text: string) => {
      try {
        // Reset states
        setIsCopied(false);
        setError(null);

        // Try modern Clipboard API first
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();

          const successful = document.execCommand('copy');
          textArea.remove();

          if (!successful) {
            throw new Error('Failed to copy text');
          }
        }

        // Success!
        setIsCopied(true);
        triggerHaptic('success');
        onSuccess?.();

        // Reset after duration
        setTimeout(() => {
          setIsCopied(false);
        }, successDuration);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy');
        setError(error);
        onError?.(error);
      }
    },
    [successDuration, onSuccess, onError, triggerHaptic]
  );

  return { copy, isCopied, error };
}

export default useCopyToClipboard;
