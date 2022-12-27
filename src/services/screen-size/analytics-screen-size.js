import { SMALL_SCREEN_SIZE, MEDIUM_SCREEN_SIZE, LARGE_SCREEN_SIZE, BIG_SCREEN_SIZE } from "./screen-size-constant"

const screenSize = {
    GET_SCREEN_SIZE: () => {
        let screen_width = screen.width;
        if (screen_width < 800) {
            return SMALL_SCREEN_SIZE
        } else if (screen_width > 1100 && screen_width < 1500) {
            return LARGE_SCREEN_SIZE
        } else if (screen_width < 1100) {
            return MEDIUM_SCREEN_SIZE
        } else if (screen_width >= 1500) {
            return BIG_SCREEN_SIZE
        }
    }
}
export default screenSize;