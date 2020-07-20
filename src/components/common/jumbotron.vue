<template>
    <div class="jumbotron-container">
        <div class="jumbotron-content">
            <h1 class="jumbotron-title">{{ title }}</h1>
            <p v-if="desc" class="jumbotron-description">
                {{ desc }}
            </p>
            <div>
                <nitrozen-button
                    v-if="btnLabel"
                    :theme="'secondary'"
                    v-flatBtn
                    @click="btnClick"
                >
                    {{ btnLabel }}
                </nitrozen-button>
                <slot />
            </div>
        </div>
        <div class="jumbotron-image">
            <img :src="`/public/assets/admin/pngs/${illustration}.png`" />
        </div>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
import * as _ from 'lodash';

export default {
    name: 'jumbotron',
    components: {
        'nitrozen-button': NitrozenButton
    },
    props: {
        title: {
            type: String,
            required: false,
            default: ''
        },
        desc: {
            type: String,
            default: ''
        },
        btnLabel: {
            type: String
        },
        illustration: {
            type: String,
            default: 'illustration'
        }
    },
    directives: {
        flatBtn
    },
    watch: {},
    data: function() {
        return {};
    },
    mounted() {},
    methods: {
        btnClick() {
            this.$emit('btnClick');
        }
    }
};
</script>

<style lang="less" scoped>
.jumbotron-container {
    font-family: Poppins;
    flex: 1;
    padding: 20px 24px;
    border: 1px solid @Iron;
    border-radius: 3px;
    display: flex;
    background-color: @White;
    .jumbotron-content {
        flex: 0.65;
        .jumbotron-title {
            padding: 11.25px 0;
            color: @Mako;
            font-weight: bold;
            font-size: 32px;
            line-height: 48px;
            text-align: left;
        }
        .jumbotron-description {
            font-size: 16px;
            line-height: 26px;
            color: @Mako;
        }
        .n-button-secondary.n-flat-button.n-flat-button-secondary {
            margin-top: 45px;
        }
    }
    .jumbotron-image {
        flex: 0.35;
        img {
            // height: 221px;
            width: 404px;
            float: right;
            // height: 175px;
        }
    }
}
</style>
