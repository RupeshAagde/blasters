<template>
    <div id="app" ref="app" class="main-app">
        <template>
            <transition name="fade" mode="out-in">
                <router-view ></router-view>
            </transition>
        </template>
    </div>
</template>

<script>
import './less/common.less';
import root from 'window-or-global';
const envVars = root.env || {};

export default {
    mounted() {
        //add sentry
        const { SENTRY_DSN, SENTRY_ENVIRONMENT } = envVars;

        if (SENTRY_DSN) {
            window.Raven.config(`${SENTRY_DSN}`, {
                environment: `${SENTRY_ENVIRONMENT}`
            }).install();
        }
    },
};
</script>

<style lang="less">
@import './less/text.less';
@import './less/color.less';
</style>
