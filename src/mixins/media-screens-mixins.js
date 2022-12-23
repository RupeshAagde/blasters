import { getScreenSize, SCREEN_SIZES } from "../helper/media-helper";

const mediaScreensMixins = {
  data: () => ({
    cssClassMapping: {
      [SCREEN_SIZES.MOBILE]: '',
      [SCREEN_SIZES.DEFAULT]: '',
      [SCREEN_SIZES.DESKTOP]: '',
      [SCREEN_SIZES.TABLET]: '',
      [SCREEN_SIZES.LARGE_SCREEN]: '',
    }
  }),
  computed: {
    screenSize() {
      return getScreenSize(screen.width);
    },
    isMobile() {
      return this.screenSize === SCREEN_SIZES.MOBILE;
    }
  },
  methods: {
    applyClasses(classMapping = this.cssClassMapping) {
      return classMapping[this.screenSize];
    }
  }
};

export { mediaScreensMixins };
