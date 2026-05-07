/**
 * Contrast Ratio Utility
 * 
 * Provides functions to calculate color contrast ratios according to WCAG 2.0 standards.
 * Used to ensure accessibility compliance for text readability in both dark and light themes.
 * 
 * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
 * @see https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */

/**
 * Parse color string to RGB array
 * Supports hex (#RRGGBB) and rgb/rgba formats
 */
function parseColor(color: string): [number, number, number] {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }
  
  // Handle rgb/rgba colors
  const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (match) {
    return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
  }
  
  throw new Error(`Unable to parse color: ${color}`);
}

/**
 * Calculate relative luminance of a color
 * 
 * @param color - Color string in hex or rgb format
 * @returns Relative luminance value between 0 and 1
 * 
 * @see https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
export function getLuminance(color: string): number {
  // Parse color to RGB
  const rgb = parseColor(color);
  
  // Convert to sRGB
  const [r, g, b] = rgb.map(val => {
    const sRGB = val / 255;
    return sRGB <= 0.03928
      ? sRGB / 12.92
      : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  
  // Calculate luminance using ITU-R BT.709 coefficients
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * 
 * @param color1 - First color (text or background)
 * @param color2 - Second color (text or background)
 * @returns Contrast ratio between 1 and 21
 * 
 * @see https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * 
 * @param textColor - Text color
 * @param bgColor - Background color
 * @param isLargeText - Whether text is large (≥18pt or ≥14pt bold)
 * @returns True if contrast meets WCAG AA requirements
 * 
 * WCAG AA Requirements:
 * - Normal text: minimum 4.5:1 contrast ratio
 * - Large text: minimum 3:1 contrast ratio
 */
export function meetsWCAGAA(
  textColor: string,
  bgColor: string,
  isLargeText: boolean = false
): boolean {
  const ratio = calculateContrastRatio(textColor, bgColor);
  const minRatio = isLargeText ? 3.0 : 4.5;
  return ratio >= minRatio;
}
