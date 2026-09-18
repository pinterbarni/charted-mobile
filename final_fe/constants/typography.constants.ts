import { StyleSheet } from 'react-native';
import { letterSpacing, lineHeight } from '../utils/typography.utils';

const FONTS = {
  heading: 'InriaSerif-Regular',
  body: 'Montserrat-Regular',
  bodyMedium: 'Montserrat-Medium',
  bodySemiBold: 'Montserrat-SemiBold',
} as const;

const createTextStyle = (
  fontFamily: string,
  fontSize: number,
  lineHeightPercent: number,
  letterSpacingPercent: number
) => ({
  fontFamily,
  fontSize,
  lineHeight: lineHeight(fontSize, lineHeightPercent),
  letterSpacing: letterSpacing(fontSize, letterSpacingPercent),
});

export const typography = StyleSheet.create({
  // #region Headings

  h1: createTextStyle(FONTS.heading, 40, 125, 0),
  h2: createTextStyle(FONTS.heading, 32, 125, 0),
  h3: createTextStyle(FONTS.heading, 24, 125, 0),
  h4: createTextStyle(FONTS.heading, 18, 125, 0),
  h5: createTextStyle(FONTS.heading, 14, 125, 0),

  // #endregion

  // #region Body

  p1r: createTextStyle(FONTS.body, 14, 150, -2.4),
  p1m: createTextStyle(FONTS.bodyMedium, 14, 150, -1.6),

  p2r: createTextStyle(FONTS.body, 12, 150, -1),
  p2m: createTextStyle(FONTS.bodyMedium, 12, 150, -0.5),

  p3r: createTextStyle(FONTS.body, 10, 150, -0.4),
  p3m: createTextStyle(FONTS.bodyMedium, 10, 150, 0),

  // #endregion

  // #region Labels

  l1r: createTextStyle(FONTS.body, 14, 130, -2.4),
  l1m: createTextStyle(FONTS.bodyMedium, 14, 130, -1.6),
  l1u: { ...createTextStyle(FONTS.bodySemiBold, 14, 130, 9.7), textTransform: 'uppercase' },

  l2r: createTextStyle(FONTS.body, 12, 130, -1),
  l2m: createTextStyle(FONTS.bodyMedium, 12, 130, -0.5),
  l2u: { ...createTextStyle(FONTS.bodySemiBold, 12, 130, 11.1), textTransform: 'uppercase' },

  l3r: createTextStyle(FONTS.body, 10, 130, -0.4),
  l3m: createTextStyle(FONTS.bodySemiBold, 10, 130, 0),
  l3u: { ...createTextStyle(FONTS.bodySemiBold, 10, 130, 13.2), textTransform: 'uppercase' },
  // #endregion
});
