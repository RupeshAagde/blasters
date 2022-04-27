<template>
    <div>
        <slot />
    </div>
</template>

<style lang="less" scoped></style>

<script>
export default {
    name: 'ukt-infinite-scrolling',
    mounted() {
        this.attachScrollListeners();
    },
    props: {
        loadingData: {
            type: Boolean,
            default: false
        },
        threshold: {
            type: Number,
            default: 100
        }
    },
    methods: {
        attachScrollListeners() {
            window.addEventListener('scroll', this.scrollListener.bind(this));
            window.addEventListener('resize', this.scrollListener.bind(this));
        },
        detachScrollListener() {
            window.removeEventListener(
                'scroll',
                this.scrollListener.bind(this)
            );
            window.removeEventListener(
                'resize',
                this.scrollListener.bind(this)
            );
        },

        scrollListener(evt) {
            let el = this.$el;
            if (!el) {
                this.detachScrollListener();
            }

            let scrollTop =
                window.pageYOffset !== undefined
                    ? window.pageYOffset
                    : (
                          document.documentElement ||
                          document.body.parentNode ||
                          document.body
                      ).scrollTop;

            let calc =
                this.topPosition(el) +
                el.offsetHeight -
                scrollTop -
                window.innerHeight;

            if (calc < this.threshold && !this.loadingData) {
                this.$emit('loadmore');
            }
        },
        topPosition(domElt) {
            if (!domElt) {
                return 0;
            }
            return domElt.offsetTop + this.topPosition(domElt.offsetParent);
        }
    },
    destroyed() {
        this.detachScrollListener();
    }
};
</script>
