<template>
    <div class="page-error">
        <img :src="icon" />
        <div class="page-error-text" alt="No content">
            <span class="dark-sm cl-DustyGray2">{{ helperText }}</span>
        </div>
        <div v-if="btnText">
            <nitrozen-button theme="secondary" v-flatBtn @click="onTryAgain()"
                >{{ btnText }}
            </nitrozen-button>
        </div>
    </div>
</template>

<style lang="less" scoped>
.page-error {
    width: 60%;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    padding: 5%;
    @media @mobile {
        width: 60%;
    }
    img {
        width: 400px;
        height: 300px;
        @media @mobile {
            width: 200px;
            height: 150px;
        }
    }
    .page-error-text {
        color: @Mako;
        span {
            display: block;
            margin: 24px;
        }
    }
}
</style>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-no-content',
    components: {
        'nitrozen-button': NitrozenButton
    },
    directives: {
        flatBtn
    },
    props: {
        helperText: {
            type: String,
            default: 'No content present'
        },
        icon: {
            type: String,
            default: '/public/assets/admin/pngs/empty_state.png'
        },
        btnText: {
            type: String,
            default: ''
        }
    },
    methods: {
        onTryAgain() {
            this.$emit('tryAgain');
        }
    }
};
</script>
