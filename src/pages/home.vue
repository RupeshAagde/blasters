<template>
    <div>
        <section class="league-of-experts">
            <div class="left">
                <h1>Fynd Platform Admin</h1>
                <p class="cst-mh1">
                    Internal Visibility and Control to help businesses sell
                    smoothly with Fynd Platform.
                </p>
                <p class="cst-margin">
                    Manage company settings and product information, ensure the
                    right level of access, and oversee platform configurations
                    for a smooth selling experience. Also, solve problems and
                    take actions on open tickets all from within the Fynd
                    Platform.
                </p>
                <nitrozen-button
                    v-flat-btn
                    :theme="'secondary'"
                    @click="openLogin"
                    >Get Started</nitrozen-button
                >
            </div>
            <div class="right">
                <img src="/public/assets/pngs/home/league-of-experts.png" />
            </div>
        </section>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenInput,
    strokeBtn,
    flatBtn
} from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
import { IS_LOGGED_IN, GET_USER_PERMISSIONS } from '@/store/getters.type';
import { OPEN_LOGIN_MODAL } from '@/store/action.type';
import { PERMISSION_ROUTES } from './../helper/permission_routes'

export default {
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        ...mapGetters({
            isLoggedIn: IS_LOGGED_IN,
            currentUserPermissions: GET_USER_PERMISSIONS
        })
    },
    methods: {
        openLogin() {
            if (this.isLoggedIn) {
                const firstPermission = this.currentUserPermissions.permissions.length ? this.currentUserPermissions.permissions[0] : ''
                if(firstPermission){
                    return this.$router.push({ path: `/administrator/${PERMISSION_ROUTES[firstPermission]}` });
                }
            }
            this.$store.dispatch(OPEN_LOGIN_MODAL);
        }
    }
};
</script>

<style lang="less" scoped>
.desc-heading {
    font-weight: bold;
    // margin-bottom: 24px;
}
section {
    width: 100%;
    max-width: 1400px;
    min-height: 55vh;
}
section:first-child {
    margin-top: 100px;
}
section:nth-child(2n + 1) {
    background-color: #f4f8fb;
}
.cst-margin {
    margin: 22px 0 45px 0;
    max-width: 500px;
    font-size: 14px;
    line-height: 21px;
    font-family: Inter, sans-serif;
}
section.league-of-experts {
    margin-top: 64px;
    padding: 70px 0;
    display: flex;
    .left {
        width: 58%;
        padding-left: 40px;
        color: @HomePageText;
        h1 {
            font-size: 60px;
            line-height: 83px;
            font-weight: bold;
            font-family: Inter, sans-serif;
        }
        .cst-mh1 {
            max-width: 500px;
            font-size: 14px;
            line-height: 21px;
            font-family: Inter, sans-serif;
            margin: 45px 0 22px 0;
        }
    }
    .right {
        width: 42%;
        padding-right: 40px;
        img {
            width: 100%;
        }
    }
}
</style>
