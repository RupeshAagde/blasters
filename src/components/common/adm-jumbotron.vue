<template>
    <div>
        <div
            :class="btnLabel ? 'jumbotron-container' : 'no-btn-container'"
        >
            <div class="jumbotron-content">
                <div class="jumbotron-title">{{ title }}</div>
                <p v-if="desc" class="jumbotron-description">{{ desc }}</p>
                <div class="btn-container">
                    <nitrozen-button
                        v-if="btnLabel"
                        :theme="'secondary'"
                        v-flatBtn
                        @click.stop="btnClick"
                        :disabled="btnDisabled"
                        >{{ btnLabel }}</nitrozen-button
                    >
                    <nitrozen-button
                        v-if="secondaryBtnLabel"
                        :theme="'secondary'"
                        v-flatBtn
                        @click.stop="secondaryBtnClick"
                        >{{ secondaryBtnLabel }}</nitrozen-button
                    >
                    <slot />
                </div>
            </div>
            <div class="jumbotron-image">
                <img
                    :src="`/public/assets/pngs/${illustration}.png`"
                />
            </div>
        </div>
        <adm-page-header
            :title="title"
            @backClick="isFPApp ? onAppBack() : () => {}"
            :showBackButton="isFPApp"
            class="mobile-page-header"
        >
            <template slot="page-slot-mobile-add">
                <nitrozen-button
                    v-if="mobileHeaderBtnLabel"
                    :theme="'secondary'"
                    v-strokeBtn
                    @click.stop="mobileHeaderBtnClick"
                    >{{ mobileHeaderBtnLabel }}</nitrozen-button
                >
                <adm-inline-svg
                    v-if="btnLabel"
                    @click.stop.native="btnClick"
                    src="add-icon"
                ></adm-inline-svg>
            </template>
        </adm-page-header>
    </div>
</template>

<script>
import { NitrozenButton, flatBtn, strokeBtn } from '@gofynd/nitrozen-vue';
import admpageheader from '@/components/common/layout/page-header.vue';
import adminlinesvg from '@/components/common/adm-inline-svg';
import { detectFPApp, detectMobileWidth } from '@/helper/utils';
import { goBack } from '@/helper/actions';

export default {
    name: 'adm-jumbotron',
    components: {
        'adm-page-header': admpageheader,
        'adm-inline-svg': adminlinesvg,
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
        secondaryBtnLabel: {
            type: String
        },
        btnDisabled: {
            type: Boolean,
            default: false
        },
        illustration: {
            type: String,
            default: 'illustration'
        },
        mobileHeaderBtnLabel:{
            type: String
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data: function() {
        return {};
    },
    computed: {
        isFPApp() {
            if(detectFPApp()){
                return true;
            }
            return false;
        }
    },
    mounted() {
        console.log(this.desc)
    },
    methods: {
        detectMobileWidth,
        detectFPApp,
        btnClick() {
            this.$emit('btnClick');
        },
        secondaryBtnClick() {
            this.$emit('secondaryBtnClick');
        },
        mobileHeaderBtnClick(){
            this.$emit('mobileHeaderBtnClick');
        },
        onAppBack() {
            goBack();
        }
    }
};
</script>

<style lang="less" scoped>
.jumbotron-container {
    font-family: Inter;
    flex: 1;
    padding: 20px 24px;
    border: 1px solid @Iron;
    border-radius: 3px;
    display: flex;
    background-color: @White;
    min-height: 200px;
    @media @mobile{
        display: none;
    }
    .jumbotron-content {
        flex: 0.65;
        .jumbotron-title {
            padding: 16px 0;
            color: @Mako;
            font-weight: bold;
            font-size: 24px;
            // line-height: 48px;
            text-align: left;
        }
        .jumbotron-description {
            font-size: 16px;
            line-height: 26px;
            color: @Mako;
        }
        // .n-button-secondary.n-flat-button.n-flat-button-secondary {
        //     margin-top: 24px;
        // }
    }
    .jumbotron-image {
        flex: 0.35;
        img {
            // height: 221px;
            width: 400px;
            float: right;
            height: 175px;
        }
    }
    .btn-container {
        white-space: nowrap;
        display: flex;
        margin-top: 24px;
        button:not(:first-child) {
            margin-left: 15px;
        }
    }
}
.no-btn-container {
    font-family: Inter;
    flex: 1;
    padding: 20px 24px;
    border: 1px solid @Iron;
    border-radius: 3px;
    display: flex;
    background-color: @White;
    min-height: 200px;
    @media @mobile{
        display: none;
    }
    .jumbotron-content {
        flex: 0.65;
        .jumbotron-title {
            padding: 16px 0;
            color: @Mako;
            font-weight: bold;
            font-size: 24px;
            // line-height: 48px;
            text-align: left;
        }
        .jumbotron-description {
            font-size: 16px;
            line-height: 26px;
            color: @Mako;
        }
    }
    .jumbotron-image {
        flex: 0.35;
        img {
            // height: 221px;
            width: 400px;
            float: right;
            height: 175px;
        }
    }
}
.mobile-page-header {
    margin: -24px -24px 12px -24px;
    display: none;
    @media @mobile{
        display: block;
    }
}
</style>
