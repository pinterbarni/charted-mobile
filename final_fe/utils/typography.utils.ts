/**
 * Converts percentage based  line height 2 absolute points for RN lineHeight.
 *
 * @param params - Typography parameters
 * @param params.fontSize - Font size in points
 * @param params.percentage - Line height percentage (example: 125 for 125%)
 * @returns Absolute line height in points
 *
 * @example
 * lineHeight(40, 125) // 50
 */
export const lineHeight = (fontSize: number, fontPercentage: number): number =>
  (fontPercentage / 100) * fontSize;

/**
 * Converts percentage based letter spacing 2 absolute points for RN letterSpacing.
 * @param params - Typography parameters
 * @param params.fontSize - Font size in points
 * @param params.percentage - Letter spacing percentage (example: -2.4 for -2.4%)
 * @returns Absolute letter spacing in points
 *
 * @example
 * letterSpacing(14, -2.4) // -0.336 (if my calculations are correct.)
 */
export const letterSpacing = (fontSize: number, fontPercentage: number): number =>
  (fontPercentage / 100) * fontSize;

//TODO: Does not work properly?
