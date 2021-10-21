<template>
    <div>
        <page-header
            title="Footer"
            @backClick="$router.push({ name: 'settings' })"
        >
            <div
                class="publish-status status-text bold-xs"
                :class="{ 'publish-status-disabled': !published }"
                @click="
                    published = !published;
                    changeState();
                "
            >
                {{ published ? 'Published' : 'Unpublished' }}
            </div>
            <nitrozen-toggle-btn
                v-model="published"
                @change="changeState()"
            ></nitrozen-toggle-btn>
            <span class="actions"
                ><nitrozen-button
                    class="actions"
                    @click="saveForm"
                    v-flatBtn
                    theme="secondary"
                    ref="save-btn"
                >
                    Save
                </nitrozen-button></span
            >
        </page-header>
        <div class="main-container">
            <div class="page-container content-container">
                <label class="cl-Mako bold-sm title">Desktop Banner</label>
                <div class="input-form">
                    <nitrozen-input label="Desktop Alt text" placeholder="Enter desktop alt text" v-model="desktop.alt.value"></nitrozen-input>
                    <nitrozen-error v-if="!desktop.alt.value && desktop.alt.showError"></nitrozen-error>
                </div>
                <div class="input-form">
                    <nitrozen-input label="Desktop Redirection" placeholder="Enter desktop redirection" v-model="desktop.alt.value"></nitrozen-input>
                    <nitrozen-error v-if="!desktop.url.value && desktop.url.showError"></nitrozen-error>
                </div>
            </div>
            <div class="page-container content-container">
                <label class="cl-Mako bold-sm title">Mobile Banner</label>
                <div class="input-form">
                    <nitrozen-input label="Mobile Alt text" placeholder="Enter mobile alt text" v-model="mobile.alt.value"></nitrozen-input>
                    <nitrozen-error v-if="!mobile.alt.value && mobile.alt.showError"></nitrozen-error>
                    <div class="input-form">
                    <nitrozen-input label="Mobile Redirection" placeholder="Enter mobile redirection" v-model="desktop.alt.value"></nitrozen-input>
                    <nitrozen-error v-if="!mobile.url.value && mobile.url.showError"></nitrozen-error>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    flatBtn,
    NitrozenCheckBox,
    NitrozenToggleBtn,
    NitrozenInput,
    NitrozenError
} from '@gofynd/nitrozen-vue';
import PageError from '@/components/common/page-error';
import { Loader, PageHeader, ImageUploaderTile } from '@/components/common/';
import InlineSvg from '@/components/common/inline-svg';
import InternalSettingsService from '@/services/internal-settings.service';

export default {
    name: 'pricing-banner',
    components: {
        NitrozenButton,
        NitrozenCheckBox,
        NitrozenToggleBtn,
        NitrozenInput,
        NitrozenError,
        PageError,
        PageHeader,
        ImageUploaderTile,
        Loader,
        InlineSvg
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            inProgress: false,
            pageLoading: false,
            pageError: false,
            published: false,
            desktop: {
                alt: this.getInitialValue(),
                anchor_link: this.getInitialValue(),
                url: this.getInitialValue()
            },
            mobile: {
                alt: this.getInitialValue(),
                anchor_link: this.getInitialValue(),
                url: this.getInitialValue()
            }
        };
    },
    mounted() {},
    methods: {
        getInitialValue(value = '') {
            return {
                value,
                showError: false,
                errorText: ''
            };
        },
        saveForm() {},
        changeState() {}
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
.publish-status {
    line-height: 56.5px;
    cursor: pointer;
    color: @RoyalBlue;
    -webkit-font-smoothing: antialiased;
    @media @mobile {
        line-height: 20px;
    }
}
.publish-status-disabled {
    color: @DustyGray2;
}
.actions {
    margin-top: 5px;
    padding-left: 24px;
}

.main-container {
    margin-top: 64px;
    .content-container {
        display: block;
        width: 50%;
        flex: 1;
        &:nth-child(odd) {
            margin-left: 24px;
        }
        .input-form{
            margin-top: 16px;
        }
    }
}
</style>
