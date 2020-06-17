/**
 * @param callbackObj Object An object with callbacks in .start, .progress, and .done
 * @param duration Integer Total duration in seconds
 */
export const scrollToTop = (scrollDuration) => {
  var scrollStep = -window.scrollY / (scrollDuration / 15),
    scrollInterval = setInterval(function() {
      if (window.scrollY !== 0) {
        window.scrollBy(0, scrollStep)
      } else clearInterval(scrollInterval)
    }, 15)
}
