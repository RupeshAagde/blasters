export const SCREEN_SIZES = {
  DESKTOP: 1200,
  MOBILE: 768,
  TABLET: 1024,
  LARGE_SCREEN: 1400,
  DEFAULT: 0

};

export function getScreenSize(size) {
  if (isNaN(size)) return SCREEN_SIZES.DEFAULT;
  if (size > SCREEN_SIZES.LARGE_SCREEN) return SCREEN_SIZES.LARGE_SCREEN;
  if (SCREEN_SIZES.DESKTOP < size && size < SCREEN_SIZES.LARGE_SCREEN) return SCREEN_SIZES.DESKTOP;
  if (SCREEN_SIZES.TABLET < size && size < SCREEN_SIZES.DESKTOP) return SCREEN_SIZES.TABLET;
  if (SCREEN_SIZES.MOBILE < size && size < SCREEN_SIZES.TABLET) return SCREEN_SIZES.MOBILE;
  if (size < SCREEN_SIZES.MOBILE) return SCREEN_SIZES.MOBILE;
  return SCREEN_SIZES.DEFAULT;
}
