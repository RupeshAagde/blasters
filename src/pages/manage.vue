<template>
    <div>
        <section class="league-of-experts">
            <div class="left">
                <h1>Welcome to Fynd Administrator</h1>
                <p>
                    You are successfully logged in, to go to the dashboard press
                    the View Dashboard button or click the button below.
                </p>
                <nitrozen-button v-flat-btn :theme="'secondary'" @click="open">
                    Go to Home Page
                </nitrozen-button>
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
import { GET_USER_PERMISSIONS } from '@/store/getters.type';
import { mapGetters } from 'vuex';
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
            currentUserPermissions: GET_USER_PERMISSIONS
        })
    },
    methods: {
        open() {
            const firstPermission = this.currentUserPermissions.permissions.length ? this.currentUserPermissions.permissions[0] : ''
                if(firstPermission){
                    return this.$router.push({ path: `/administrator/${PERMISSION_ROUTES[firstPermission]}` });
                }
        }
    }
};
</script>

<style lang="less" scoped>
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

section.league-of-experts {
    margin-top: 100px;
    padding: 80px 0;
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
        p {
            max-width: 350px;
            font-size: 14px;
            line-height: 21px;
            font-family: Inter, sans-serif;
            margin: 45px 0;
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
