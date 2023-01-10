<template>
    <div class="baseview">
        <administrator-header></administrator-header>
        <div class="content">
            <sidebar class="menu-block"></sidebar>
            <div class="section-content">
                <no-ssr>
                    <transition name="fade" mode="out-in">
                        <router-view class="view"></router-view>
                    </transition>
                </no-ssr>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.menu-block {
    position: fixed;
    height: calc(100% - 60px);
    background-color: #ffffff;
    width: 250px;
    left: 0px;
    overflow: auto;
    transition: all 0.25s ease-in-out;
    box-shadow: 1px 1px 1px 1px #eeeeee;
}
.content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.section-content {
    width: calc(100% - 250px);
    min-width: 1000px;
    background-color: #f8f8f8;
    margin-left: 250px;
    position: absolute;
    border-left: 1px solId #e4e5e6;
    box-sizing: border-box;
    transition: all 0.25s ease-in-out;
    display: flex;
}
</style>

<script>
import NoSSR from 'vue-no-ssr';
import { isBrowser, isNode } from 'browser-or-node';
import AdministratorHeaderVue from './../../components/header/administrator.vue';
import SideBarVue from './../../components/administrator/sidebar.vue';
import { VALIDATE_USER } from '@/store/action.type';
import Vue from 'vue';

export default {
    name: 'base-view',
    components: {
        'administrator-header': AdministratorHeaderVue,
        sidebar: SideBarVue,
        'no-ssr': NoSSR
    },
    beforeRouteEnter(to, from, next) {
        if (isNode) {
            return next();
        }
        import('./../../entry-client').then((appModule) => {
            const appStore = appModule.getAppStore();
            appStore
                .dispatch(VALIDATE_USER)
                .then((res) => {
                    // console.log(appStore.state,'appStore.state',res)
                    if (!appStore.state.auth.isValidUser) {
                        return (window.location.href = '/');
                    }
                    next();
                })
                .catch((err) => {
                    return (window.location.href = '/');
                });
        });
    },
    mounted() {
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
        this.validateUser();
    },
    methods: {
        validateUser() {
            this.$store.dispatch(VALIDATE_USER);
        }
    }
};
</script>
