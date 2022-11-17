<template>
    <div class="panel">
        <div class="header-position">
            <page-header
                :title="pageTitle"
                @backClick="$router.push({ name: 'settings' })"
                :noContextMenu="true"
            >
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        :theme="'secondary'"
                        v-flatBtn
                        ref="save-button"
                        @click="saveForm"
                        >Save</nitrozen-button
                    >
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading"></loader>
        <page-error v-else-if="pageError && !pageLoading"></page-error>

        <div class="page-container" v-else>
            <!-- Details -->
            <div class="form-container">
                <div class="register-through">
                    <div class="group-header title">Register Through</div>
                    <nitrozen-radio
                        class="radio-opt"
                        v-model="registration_through"
                        radioValue="email_or_phone"
                        name="or-radio"
                    >
                        Email or Mobile Number
                    </nitrozen-radio>
                    <nitrozen-radio
                        class="radio-opt"
                        v-model="registration_through"
                        radioValue="both_email_phone"
                        name="both-radio"
                    >
                        Both Email and Mobile Number
                    </nitrozen-radio>
                </div>

                <div class="seller-consent">
                    <div class="group-header title">
                        Capture Seller’s Consent
                        <NitrozenToggleBtn
                            class="seller-consent-header"
                            v-model="consentData.consentNeeded"
                            value="consentData.consentNeeded"
                            @change="toggleConsentNeed"
                        >
                        </NitrozenToggleBtn>
                    </div>

                    <div
                        class="seller-consent-content"
                        v-if="consentData.consentNeeded"
                    >
                        <div class="tc">
                            <nitrozen-check-box v-model="consentData.tcConsent">
                                Show Terms and Conditions
                            </nitrozen-check-box>
                            <nitrozen-input
                                placeholder="Paste the URL of T&C page"
                                v-model="consentData.tcURL"
                            >
                            </nitrozen-input>
                        </div>
                        <div class="pp">
                            <nitrozen-check-box v-model="consentData.ppConsent">
                                Show Privacy Policy
                            </nitrozen-check-box>
                            <nitrozen-input
                                placeholder="Paste the URL of privacy policy page"
                                v-model="consentData.ppURL"
                            >
                            </nitrozen-input>
                        </div>
                        <div class="preview">
                            <div class="preview-title">Preview</div>

                            <div
                                class="preview-content"
                                v-if="
                                    consentData.tcConsent ||
                                    consentData.ppConsent
                                "
                            >
                                <nitrozen-check-box
                                    class="preview-checkbox"
                                    v-if="
                                        consentData.tcConsent ||
                                        consentData.ppConsent
                                    "
                                >
                                </nitrozen-check-box>

                                <div class="consent-label">
                                    I agree to the&nbsp;
                                    <a
                                        :href="consentData.tcURL"
                                        target="__blank"
                                        v-if="consentData.tcConsent"
                                    >
                                        Terms & Conditions&nbsp;
                                    </a>
                                    <p
                                        v-if="
                                            consentData.tcConsent &&
                                            consentData.ppConsent
                                        "
                                    >
                                        and&nbsp;
                                    </p>
                                    <a
                                        :href="consentData.ppURL"
                                        target="__blank"
                                        v-if="consentData.ppConsent"
                                    >
                                        Privacy Policy
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.header-position {
    height: 58.5px;
}

.cursor-pointer {
    cursor: pointer;
}

.page-container {
    flex-direction: row;
    width: auto;
    padding: 0;
    background-color: @Alabaster2;

    .form-container {
        display: block;
        flex: 1;
        border-radius: 8px;
        background-color: @White;
    }

    .register-through {
        margin: 25px 25px;
        padding: 25px 25px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;

        .radio-opt {
            margin: 10px;
        }
        div {
            margin: 5px;
            padding: 5px;
        }
    }

    .seller-consent {
        margin: 25px 25px;
        padding: 25px 25px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
    }
}

.group-header {
    display: flex;
    margin: 10px 0px;
    align-items: center;
}


.text {
    font-size: 14px;
}

.title {
    font-size: 16px;
    font-weight: 500;
}

.seller-consent {
   border: 1px solid #e0e0e0;
    .consent-label {
        font-size: 14px;
        color: #9b9b9b;
        display: flex;
        align-items: flex-end;

        a {
            font-size: 15px;
            font-weight: 700;
            color: #2e31be;
        }
    }
    div {
        margin: 5px;
        padding: 5px;
    }

    .preview-content {
        display: flex;
        align-items: center;
        margin: 10px;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;

        .preview-checkbox {
            margin-bottom: 10px;
            padding-bottom: 20px;
        }
    }
}
</style>



<script>
import {
    NitrozenCheckBox,
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenToggleBtn,
    NitrozenRadio,
} from '@gofynd/nitrozen-vue';

import PageHeader from '@/components/common/layout/page-header';
import PageError from '../../../components/common/page-error.vue';
import Loader from '@/components/common/loader';
import PlatformConfigService from '@/services/platform-config.service';

export default {
    name: 'seller-registration',
    components: {
        NitrozenButton,
        NitrozenCheckBox,
        NitrozenInput,
        NitrozenToggleBtn,
        NitrozenRadio,
        'page-header': PageHeader,
        loader: Loader,
        'page-error': PageError,
    },
    directives: {
        flatBtn,
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            pageTitle: 'Seller Registration',
            registration_through: 'both_email_phone',
            consentData: {
                consentNeeded: true,
                consentGiven: false,
                ppConsent: false,
                tcConsent: false,
                tcURL: '',
                ppURL: '',
            },
        };
    },
    methods: {
        init() {
            this.pageLoading = false;
            this.pageError = false;
            this.getConfig();
        },
        toggleConsentNeed() {
            if(!this.consentData.consentNeeded) {
                this.consentData.tcConsent = false ;
                this.consentData.ppConsent = false ;
            }
        },
        getConfig() {
            this.pageLoading = true;
            this.pageError = false;
            return PlatformConfigService.fetchPlatformConfig()
                .then((res) => {
                    this.pageLoading = false;
                    this.registration_through = res.data.registration_through;
                    this.consentData.tcConsent =
                        res.data.terms_condition_required;
                    this.consentData.ppConsent =
                        res.data.privacy_policy_required;
                    this.consentData.tcURL = res.data.terms_condition_url;
                    this.consentData.ppURL = res.data.privacy_policy_url;
                    this.consentData.consentNeeded = res.data.terms_condition_required || res.data.privacy_policy_required;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.log(err);
                });
        },
        saveForm() {
            let updateData = {
                registration_through: this.registration_through,
                terms_condition_required: this.consentData.tcConsent,
                privacy_policy_required: this.consentData.ppConsent,
                terms_condition_url: this.consentData.tcURL,
                privacy_policy_url: this.consentData.ppURL,
            };

            PlatformConfigService.editPlatformConfig(updateData)
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess(
                        'Config Updated Successfully',
                        { duration: 2000 }
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to Update Config', {
                        duration: 2000,
                    });
                });
        },
    },
};
</script>
