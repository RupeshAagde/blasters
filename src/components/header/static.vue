<template>
    <div class="stheader">
        <header>
            <div class="header-container">
                <div class="menu-container">
                    <router-link to="/" class="logo">
                        <img
                            src="/public/assets/pngs/admin.png"
                            alt="[PROJECT_LOGO]"
                        />
                    </router-link>
                </div>
                <div class="group-btns">
                    <no-ssr>
                        <nitrozen-button
                            v-if="
                                isValidUser &&
                                    currentUserPermissions.permissions.length
                            "
                            v-stroke-btn
                            :theme="'secondary'"
                            @click="openLogin"
                        >
                            {{ isLoggedIn ? 'Manage' : 'Login' }}
                        </nitrozen-button>
                        <nitrozen-button
                            v-flat-btn
                            :theme="'secondary'"
                            @click="signOut()"
                        >
                            {{ isLoggedIn ? 'Logout' : 'Login' }}
                        </nitrozen-button>
                    </no-ssr>
                </div>
            </div>
        </header>
    </div>
</template>

<style lang="less" scoped>
.stheader {
    position: fixed;
    height: 64px;
    top: 0px;
    width: 100%;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
    z-index: 3;
    header {
        display: flex;
        background: #fff;
        padding: 0px 30px;
        align-items: center;
        justify-content: center;
        height: 100%;
        .header-container {
            display: flex;
            justify-content: space-between;
            width: 100%;
            max-width: 1400px;
            align-items: center;
            .menu-container {
                display: flex;
                align-items: center;
                .logo {
                    margin-right: 40px;
                    img {
                        width: 134px;
                        height: 55px;
                    }
                }
                .menu {
                    color: @HomePageText;
                    font-size: 14px;
                    line-height: 42px;
                    margin: 0 40px;
                    cursor: pointer;
                    text-align: center;
                    &.router-link-exact-active {
                        color: @RoyalBlue;
                        font-size: 20px;
                        font-weight: bold;
                        line-height: 42px;
                    }
                }
                .menu:hover {
                    color: @RoyalBlue;
                }
            }
            .group-btns {
                button {
                    margin: 0px 10px;
                }
            }
        }
    }
}
</style>

<script>
import {
    NitrozenButton,
    NitrozenInput,
    strokeBtn,
    flatBtn
} from '@gofynd/nitrozen-vue';
import { SIGNOUT_USER, OPEN_LOGIN_MODAL } from '../../store/action.type';
import { mapGetters } from 'vuex';
import {
    IS_LOGGED_IN,
    IS_VALID_USER,
    GET_USER_PERMISSIONS
} from '../../store/getters.type';
import { PERMISSION_ROUTES } from './../../helper/permission_routes'
import NoSSR from 'vue-no-ssr';
import { getFirstAllowedRoute } from '../../helper/utils';
export default {
    name: 'static-header',
    components: {
        'nitrozen-button': NitrozenButton,
        'no-ssr': NoSSR
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        ...mapGetters({
            isLoggedIn: IS_LOGGED_IN,
            isValidUser: IS_VALID_USER,
            currentUserPermissions: GET_USER_PERMISSIONS
        })
    },
    methods: {
        signOut() {
            if (this.isLoggedIn) {
                this.$store.dispatch(SIGNOUT_USER);
                return;
            }
            this.openLogin();
        },
        openLogin() {
            if (this.isLoggedIn) {
                let matchingRoute = getFirstAllowedRoute(this.currentUserPermissions.permissions);
                return this.$router.push({ path: matchingRoute });
            }
            this.$store.dispatch(OPEN_LOGIN_MODAL);
        }
    }
};
</script>
