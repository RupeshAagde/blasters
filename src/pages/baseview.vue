<template>
    <div class="container">
        <static-header></static-header>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <default-footer />
    </div>
</template>

<script>
import { NitrozenButton, NitrozenInput, flatBtn } from '@gofynd/nitrozen-vue';
import { mapGetters } from 'vuex';
import { IS_LOGGED_IN, IS_VALID_USER } from '@/store/getters.type';

import {
    VALIDATE_USER
} from '@/store/action.type';
import StaticHeaderVue from '@/components/header/static.vue';
import defaultFooter from '@/components/footer/default-footer.vue';
import inlineSVG from '@/components/common/inline-svg.vue';
export default {
    components: {
        'static-header': StaticHeaderVue,
        'default-footer': defaultFooter,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'inline-svg': inlineSVG
    },
    directives: {
        flatBtn
    },
    computed: {
        ...mapGetters({
            isLoggedIn: IS_LOGGED_IN,
            isValidUser: IS_VALID_USER
        })
    },
    mounted() {
        this.validateUser();
    },
    methods: {
        validateUser() {
            this.$store.dispatch(VALIDATE_USER);
        }
    }
};
</script>

<style lang="less" scoped>
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 1400px;
    .child-container {
        width: 100%;
    }
    section.create-partner-account {
        width: 100%;
        background-color: #f4f8fb;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 50px 0;
        text-align: center;
        .email-get-started {
            display: flex;
            width: 100%;
            justify-content: center;
            margin-top: 50px;
            .nitrozen-form-input {
                margin-right: 10px;
                min-width: 300px;
            }
        }
    }
}
</style>
