<template>
    <div>
        <no-ssr>
            <div class="container">
                <container />
            </div>
        </no-ssr>
    </div>
</template>

<script>
/* Package imports */
import Vue from 'vue';
import NoSSR from 'vue-no-ssr';
import Container from './container.vue';
import root from 'window-or-global';

export default {
    name: 'extensions-listing',
    components: {
        'no-ssr': NoSSR,
        container: Container
    },
    mounted() {
        /* istanbul ignore if */
        if (
            !root.process ||
            (root.process &&
                root.process.env &&
                root.process.env.NODE_ENV != 'test')
        ) {
            import(
                /*webpackChunkName:"nitrozen-snackbar" */ '@gofynd/nitrozen-vue/src/components/NSnackbar'
            ).then((NitrozenSnackbar) => {
                Vue.use(NitrozenSnackbar.default);
                Vue.snackbar.register('show', (message) => message, {
                    position: 'top-center',
                    duration: 2000
                });
                Vue.snackbar.register('showSuccess', (message) => message, {
                    position: 'top-center',
                    duration: 2000,
                    type: 'success'
                });
                Vue.snackbar.register('showError', (message) => message, {
                    position: 'top-center',
                    duration: 2000,
                    type: 'error'
                });
                Vue.snackbar.register('showWarning', (message) => message, {
                    position: 'top-center',
                    duration: 2000,
                    type: 'warning'
                });
                Vue.snackbar.register('showInfo', (message) => message, {
                    position: 'top-center',
                    duration: 2000,
                    type: 'infor'
                });
            });
        }
    }
};
</script>

<style lang="less" scoped>
#app {
    height: 100%;
    .section-content {
        // height: 100%;

        > div {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>

<style lang="less" scoped>
.container {
    flex: 1;
    display: flex;
    font-family: Inter, sans-serif !important;

    button,
    input,
    textarea,
    select {
        font-family: Inter, sans-serif !important;
    }

    ::placeholder {
        font-family: Inter, sans-serif !important;
    }
}
</style>
