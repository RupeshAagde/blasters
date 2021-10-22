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
                <image-uploader-tile
                    class="input-form"
                    label="Banner"
                    aspectRatio="*"
                    @delete="desktop.url.value = ''"
                    @save="desktop.url.value = $event"
                    v-model="desktop.url.value"
                    :fileName="'platform feature'"
                    namespace="platform-feature-image"
                ></image-uploader-tile>
                <nitrozen-error v-if="desktop.url.showerror">{{
                    desktop.url.errorText
                }}</nitrozen-error>
                <div class="input-form">
                    <nitrozen-input
                        label="Desktop Redirection"
                        placeholder="Enter desktop redirection"
                        v-model="desktop.anchor_link.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="desktop.anchor_link.showError">{{
                        desktop.anchor_link.errorText
                    }}</nitrozen-error>
                </div>
                <div class="input-form">
                    <nitrozen-input
                        label="Desktop Alt text"
                        placeholder="Enter desktop alt text"
                        v-model="desktop.alt.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!desktop.alt.value && desktop.alt.showError"
                    ></nitrozen-error>
                </div>
                <div class="input-form">
                    <nitrozen-check-box
                        v-model="isBannerSame"
                        @input="copyBanner"
                        >Copy in mobile</nitrozen-check-box
                    >
                </div>
            </div>
            <div class="page-container content-container">
                <label class="cl-Mako bold-sm title">Mobile Banner</label>
                <image-uploader-tile
                    :class="{ 'disable-div': isBannerSame }"
                    class="input-form"
                    label="Banner"
                    aspectRatio="*"
                    @delete="mobile.url.value = ''"
                    @save="mobile.url.value = $event"
                    v-model="mobile.url.value"
                    :fileName="'platform feature'"
                    namespace="platform-feature-image"
                ></image-uploader-tile>
                <nitrozen-error v-if="mobile.url.showerror">{{
                    mobile.url.errorText
                }}</nitrozen-error>
                <div class="input-form">
                    <nitrozen-input
                        label="Mobile Redirection"
                        placeholder="Enter mobile redirection"
                        v-model="mobile.anchor_link.value"
                    ></nitrozen-input>
                    <nitrozen-error v-if="mobile.anchor_link.showError">{{
                        mobile.anchor_link.errorText
                    }}</nitrozen-error>
                </div>
                <div class="input-form">
                    <nitrozen-input
                        label="Mobile Alt text"
                        placeholder="Enter mobile alt text"
                        v-model="mobile.alt.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        v-if="!mobile.alt.value && mobile.alt.showError"
                    ></nitrozen-error>
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
import { validUrl } from '@/helper/utils';

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
                alt: this.getInitialValue('Desktop pricing'),
                anchor_link: this.getInitialValue(),
                url: this.getInitialValue()
            },
            mobile: {
                alt: this.getInitialValue('Mobile pricing'),
                anchor_link: this.getInitialValue(),
                url: this.getInitialValue()
            },
            isBannerSame: false
        };
    },
    mounted() {
        this.getPricingBanner();
    },
    methods: {
        getPricingBanner() {
            this.pageLoading = true;
            return InternalSettingsService.getPricingBanner()
                .then(({ data }) => {
                    console.log(data);
                    if (data._id) {
                        this.published = data.published;
                        this.desktop.url.value = data.web_banner.url;
                        this.desktop.anchor_link.value =
                            data.web_banner.anchor_link;
                        this.desktop.alt.value = data.web_banner.alt;

                        this.mobile.url.value = data.mobile_banner.url;
                        this.mobile.anchor_link.value =
                            data.mobile_banner.anchor_link;
                        this.mobile.alt.value = data.mobile_banner.alt;
                    }
                    this.pageError = false;
                })
                .catch((err) => {
                    this.pageError = true;
                    console.error(err);
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        getInitialValue(value = '') {
            return {
                value,
                showError: false,
                errorText: ''
            };
        },
        validateForm() {
            let formValid = true;
            formValid = this.checkEmpty('url') && formValid;
            if (this.desktop.anchor_link.value) {
                if (this.desktop.anchor_link.value) {
                    if (!validUrl(this.desktop.anchor_link.value)) {
                        this.$set(this.desktop.anchor_link, 'showError', true);
                        this.$set(
                            this.desktop.anchor_link,
                            'errortext',
                            'Invalid URL'
                        );
                        formValid = false;
                    } else {
                        this.$set(this.desktop.anchor_link, 'showError', false);
                        this.$set(this.desktop.anchor_link, 'errortext', '');
                        formValid = true;
                    }
                }
            }
            if (this.mobile.anchor_link.value) {
                if (this.mobile.anchor_link.value) {
                    if (!validUrl(this.mobile.anchor_link.value)) {
                        this.$set(this.mobile.anchor_link, 'showError', true);
                        this.$set(
                            this.mobile.anchor_link,
                            'errortext',
                            'Invalid URL'
                        );
                        formValid = false;
                    } else {
                        this.$set(this.mobile.anchor_link, 'showError', false);
                        this.$set(this.mobile.anchor_link, 'errortext', '');
                        formValid = true;
                    }
                }
            }
            return formValid;
        },
        checkEmpty(key) {
            const emptyErorrs = {
                url: 'Banner is required'
            };
            if (
                !this.desktop[key].value ||
                (this.desktop[key].value &&
                    this.desktop[key].value.trim() === '')
            ) {
                this.desktop[key].showError = true;
                this.desktop[key].errortext = emptyErorrs[key];

                return false;
            }
            if (
                !this.mobile[key].value ||
                (this.mobile[key].value && this.mobile[key].value.trim() === '')
            ) {
                this.mobile[key].showError = true;
                this.mobile[key].errortext = emptyErorrs[key];
                return false;
            }
            return true;
        },
        saveForm() {
            const obj = {
                web_banner: {
                    url: this.desktop.url.value,
                    anchor_link: this.desktop.anchor_link.value,
                    type: 'image',
                    alt: this.desktop.alt.value
                },
                mobile_banner: {
                    url: this.mobile.url.value,
                    anchor_link: this.mobile.anchor_link.value,
                    type: 'image',
                    alt: this.mobile.alt.value
                },
                published: this.published
            };
            if (this.validateForm() || !this.published) {
                this.inProgress = true;
                return InternalSettingsService.savePricingBanner(obj)
                    .then(({ data }) => {
                        this.$snackbar.global.showSuccess('Saved Successfully');
                    })
                    .catch((err) => {
                        console.error(err);
                    })
                    .finally(() => {
                        this.inProgress = false;
                    });
            }
        },
        changeState() {},
        copyBanner() {
            if (this.isBannerSame) {
                this.$set(this.mobile.url, 'value', this.desktop.url.value);
                this.$set(
                    this.mobile.anchor_link,
                    'value',
                    this.desktop.anchor_link.value
                );
            } else {
                this.$set(this.mobile.url, 'value', '');
                this.$set(this.mobile.anchor_link, 'value', '');
            }
        }
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
.disable-div {
    background: @WhiteSmoke;
    cursor: not-allowed;
    opacity: 0.8;
    pointer-events: none;
}

.main-container {
    margin-top: 64px;
    .content-container {
        display: block;
        // width: 50%;
        // flex: 1;
        // &:nth-child(odd) {
        //     margin-left: 24px;
        // }
        .input-form {
            margin-top: 16px;
        }
    }
}
</style>
