<template>
    <div class="panel">
        <page-header
            title="Configuration"
            :showBackButton="false"
            @backClick="$router.push({ name: 'support' })"
        >
            <div class="btn-container">
                <nitrozen-button
                    class="save-btn"
                    v-flat-btn
                    :rounded="false"
                    :theme="'secondary'"
                    @click="save()"
                >
                    Save
                </nitrozen-button>
            </div>
        </page-header>
        <div class="container">
            <div class="support-communication">
                <div class="toggle">
                    <label class="label">
                        Edit Technical Support Details
                    </label>
                    <nitrozen-toggle-btn
                        v-model="showCommunicationinfo"
                    ></nitrozen-toggle-btn>
                </div>
                <div class="contact-container">
                    <div class="checkbox">
                        <nitrozen-checkbox
                            v-model="support_phone.enabled"
                        ></nitrozen-checkbox>
                    </div>
                    <div>
                        <nitrozen-input
                            class="input"
                            label="Phone number"
                            v-model="support_phone.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="error"
                            :style="{
                                visibility:
                                    support_phone.value &&
                                    !validatePhone(support_phone.value)
                                        ? 'visible'
                                        : 'hidden',
                            }"
                            >{{
                                'Please enter a valid Phone Number'
                            }}</nitrozen-error
                        >
                    </div>

                    <nitrozen-input
                        class="decs"
                        label="Description"
                        placeholder="We are standby for your calls from 10 am to 6 pm on weekdays"
                        v-model="support_phone.description"
                    ></nitrozen-input>
                </div>
                <div class="contact-container">
                    <div class="checkbox">
                        <nitrozen-checkbox
                            v-model="support_email.enabled"
                        ></nitrozen-checkbox>
                    </div>
                    <div class="email-container">
                        <nitrozen-input
                            class="input"
                            label="Email ID"
                            v-model="support_email.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="error"
                            :style="{
                                visibility:
                                    support_email.value &&
                                    !validateEmail(support_email.value)
                                        ? 'visible'
                                        : 'hidden',
                            }"
                            >{{
                                'Please enter a valid email ID'
                            }}</nitrozen-error
                        >
                    </div>

                    <nitrozen-input
                        class="decs"
                        label="Description"
                        placeholder="We are standby for your calls from 10 am to 6 pm on weekdays"
                        v-model="support_email.description"
                    ></nitrozen-input>
                </div>
                <div class="contact-container">
                    <div class="checkbox">
                        <nitrozen-checkbox
                            v-model="support_faq.enabled"
                        ></nitrozen-checkbox>
                    </div>
                    <div>
                        <nitrozen-input
                            class="input"
                            label="FAQ link"
                            v-model="support_faq.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="error"
                            :style="{
                                visibility:
                                    support_faq.value &&
                                    !validatelink(support_faq.value)
                                        ? 'visible'
                                        : 'hidden',
                            }"
                            >{{ 'Invalid URL' }}</nitrozen-error
                        >
                    </div>

                    <nitrozen-input
                        class="decs"
                        label="Description"
                        placeholder="We are standby for your calls from 10 am to 6 pm on weekdays"
                        v-model="support_faq.description"
                    ></nitrozen-input>
                </div>
            </div>
            <div class="support-managers">
                <div>
                    <label class="label"> Show Support Managers </label>
                    <nitrozen-tooltip :position="'top'">
                        <span class="tooltip-label"
                            >If enabled, the name and contact no. of the
                            dedicated managers will be visible to the
                            merchants</span
                        >
                    </nitrozen-tooltip>
                </div>
                <nitrozen-toggle-btn
                    class="toggle"
                    v-model="showSupportdris"
                ></nitrozen-toggle-btn>
            </div>
            <div class="service-tool">
                <div class="toggle">
                    <label class="label">
                        Preferred Customer Service Tool
                    </label>
                    <nitrozen-toggle-btn
                        v-model="integration.enabled"
                    ></nitrozen-toggle-btn>
                </div>
                <div class="tool-container">
                    <div class="default-tool">
                        <div
                            class="left-container"
                            :class="isAvailable('default') ? '' : 'muted'"
                        >
                            <div class="radio-btn">
                                <nitrozen-radio
                                    :name="'default'"
                                    :radioValue="'default'"
                                    v-model="integration.type"
                                ></nitrozen-radio>
                            </div>
                            <div class="fynd-icon">
                                <inline-svg
                                    :src="'fynd-platform-icon'"
                                ></inline-svg>
                            </div>
                            <div class="tools-type">
                                <span class="tool-heading">Fynd Platform</span>
                                <span class="tool-decs"
                                    >This integration will be available
                                    soon</span
                                >
                            </div>
                        </div>
                        <div
                            v-if="isAvailable('default')"
                            class="right-container"
                        >
                            <div class="config-btn-conatiner">
                                <nitrozen-button
                                    class="add-btn"
                                    v-flat-btn
                                    :rounded="false"
                                    :theme="'secondary'"
                                    @click="addCategory()"
                                >
                                    Add categories
                                </nitrozen-button>
                            </div>
                        </div>
                        <div v-else class="coming-soon-icon">
                            <inline-svg :src="'coming-soon'"></inline-svg>
                        </div>
                    </div>
                    <div class="default-tool">
                        <div
                            class="left-container"
                            :class="isAvailable('freshdesk') ? '' : 'muted'"
                        >
                            <div class="radio-btn">
                                <nitrozen-radio
                                    :name="'freshdesk'"
                                    :radioValue="'freshdesk'"
                                    v-model="integration.type"
                                ></nitrozen-radio>
                            </div>
                            <div class="fynd-icon">
                                <inline-svg :src="'freshdesk'"></inline-svg>
                            </div>
                            <div class="tools-type">
                                <span class="tool-heading"
                                    >Freshdesk Integrations</span
                                >
                                <span class="tool-decs"
                                    >This integration will be available
                                    soon</span
                                >
                            </div>
                        </div>
                        <div
                            v-if="isAvailable('freshdesk')"
                            class="right-container"
                        >
                            <div class="config-btn-conatiner"></div>
                        </div>
                        <div v-else class="coming-soon-icon">
                            <inline-svg :src="'coming-soon'"></inline-svg>
                        </div>
                    </div>
                    <div class="default-tool">
                        <div
                            class="left-container"
                            :class="isAvailable('kapture') ? '' : 'muted'"
                        >
                            <div class="radio-btn">
                                <nitrozen-radio
                                    :name="'kapture'"
                                    :radioValue="'kapture'"
                                    v-model="integration.type"
                                ></nitrozen-radio>
                            </div>
                            <div class="fynd-icon">
                                <inline-svg :src="'kapture'"></inline-svg>
                            </div>
                            <div class="tools-type">
                                <span class="tool-heading"
                                    >Kapture Integrations</span
                                >
                                <span class="tool-decs"
                                    >This integration will be available
                                    soon</span
                                >
                            </div>
                        </div>
                        <div
                            v-if="isAvailable('kapture')"
                            class="right-container"
                        >
                            <div class="config-btn-conatiner"></div>
                        </div>
                        <div v-else class="coming-soon-icon">
                            <inline-svg :src="'coming-soon'"></inline-svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenInput,
    NitrozenToggleBtn,
    NitrozenCheckBox,
    NitrozenTooltip,
    NitrozenRadio,
    NitrozenError,
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../services/support.service';
import emailValidator from 'email-validator';
export default {
    name: 'category-list',
    components: {
        PageHeader,
        'inline-svg': inlineSvgVue,
        NitrozenButton,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-input': NitrozenInput,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-error': NitrozenError,
    },
    data() {
        return {
            showCommunicationinfo: false,
            showSupportdris: false,
            available_integration: [],
            integration: {
                enabled: false,
                type: undefined,
            },
            support_email: {
                value: '',
                description: '',
                enabled: false,
            },
            support_phone: {
                value: '',
                description: '',
                enabled: false,
            },
            support_faq: {
                value: '',
                description: '',
                enabled: false,
            },
        };
    },
    mounted() {
        this.getGeneralConfiguration();
    },
    methods: {
        validateEmail(email) {
            return emailValidator.validate(String(email).toLowerCase().trim());
        },
        validatePhone(phoneNo) {
            const re = /^\+?([0-9]{2})\)?[- ]?([0-9]{8,10})$/;
            return phoneNo && phoneNo.length && re.test(phoneNo.trim());
        },
        validatelink(link) {
            const re =
                /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
            return link && link.length && re.test(link.trim());
        },
        isAvailable(integration_name) {
            return this.available_integration.includes(integration_name);
        },
        validateEntries(info) {
            if (info.enabled) {
                if (!info.value) {
                    this.$snackbar.global.showError(
                        'Please enter the value for your enabled communication channel'
                    );
                    return false;
                }
                if (!info.description) {
                    this.$snackbar.global.showError(
                        'Please enter the description for your enabled communication channel'
                    );
                    return false;
                }
            }
            return true;
        },
        addCategory() {
            this.$router.push({
                path: `/administrator/support/configuration/category/default`,
            });
        },
        save() {
            if (!this.validateEntries(this.support_email)) return;
            if (!this.validateEntries(this.support_phone)) return;
            if (!this.validateEntries(this.support_faq)) return;
            let data = {
                show_communication_info: this.showCommunicationinfo,
                show_support_dris: this.showSupportdris,
                support_email: this.support_email,
                support_phone: this.support_phone,
                support_faq: this.support_faq,
                integration: this.integration,
            };
            if (data.integration.enabled && !data.integration.type) {
                this.$snackbar.global.showError('Please select an integration');
                return;
            }
            if (!data.integration.enabled) {
                data.integration.type = undefined;
            }
            SupportService.setGeneralConfig(data)
                .then((response) => {
                    this.setPageData(response.data);
                    this.$snackbar.global.showSuccess(
                        'Settings changed successfully'
                    );
                })
                .catch(() => {
                    this.$snackbar.global.showError('Failed to change setting');
                });
        },
        setPageData(data) {
            this.showCommunicationinfo =
                data.show_communication_info || this.showCommunicationinfo;
            this.showSupportdris =
                data.show_support_dris || this.showSupportdris;
            this.available_integration =
                data.available_integration || this.available_integration;
            this.integration.enabled =
                data.integration && data.integration.enabled;
            this.integration.type =
                data.integration && data.integration.type
                    ? data.integration.type
                    : undefined;

            if (data.support_phone) {
                let phone = data.support_phone;
                this.support_phone.value =
                    phone.value || this.support_phone.value;
                this.support_phone.description =
                    phone.description || this.support_phone.description;
                this.support_phone.enabled =
                    phone.enabled || this.support_phone.enabled;
            }

            if (data.support_email) {
                let email = data.support_email;
                this.support_email.value =
                    email.value || this.support_email.value;
                this.support_email.description =
                    email.description || this.support_email.description;
                this.support_email.enabled =
                    email.enabled || this.support_email.enabled;
            }

            if (data.support_faq) {
                let faq = data.support_faq;
                this.support_faq.value = faq.value || this.support_faq.value;
                this.support_faq.description =
                    faq.description || this.support_faq.description;
                this.support_faq.enabled =
                    faq.enabled || this.support_faq.enabled;
            }
        },
        getGeneralConfiguration() {
            SupportService.getGeneralConfig()
                .then((response) => {
                    this.setPageData(response.data);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        'Failed to get configuration data'
                    );
                });
        },
    },
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.container {
    position: relative;
    margin: 24px;
    padding: 24px;
    border-radius: 12px;
    top: 56.5px;
    background: #ffffff;
    border-radius: 12px;
    .support-communication {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        .toggle {
            display: flex;
            justify-content: space-between;
            padding: 16px 24px;
            border-bottom: 1px solid #e0e0e0;
        }
        .label {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 140%;
            display: flex;
            align-items: center;
            color: #000000;
        }
    }
    .support-managers {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        display: flex;
        justify-content: space-between;
        padding: 16px 24px;
        margin-top: 24px;
        .nitrozen-inline-svg {
            height: 13px;
            margin-left: 11px;
        }
        .label {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 140%;
            color: #41434c;
        }
    }
    .service-tool {
        margin-top: 24px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        .toggle {
            display: flex;
            justify-content: space-between;
            padding: 16px 24px;
            border-bottom: 1px solid #e0e0e0;
        }
        .label {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 140%;
            color: #41434c;
        }
    }
    .contact-container {
        display: flex;
        padding: 16px 26px 33px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        margin: 16px 24px;
        .radio {
            display: flex;
            align-items: center;
        }
        .checkbox {
            display: flex;
            align-items: center;
        }
        .icon {
            display: flex;
            align-items: center;
        }
        .input {
            left: 12px;
            width: 333px;
        }
        .decs {
            margin-left: 36px;
            width: 1020px;
        }
    }
    .tool-container {
        .default-tool {
            display: flex;
            padding: 16px 30px;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            margin: 16px 24px;
            justify-content: space-between;
            margin-bottom: 24px;
        }
        // .freshdesk-tool {
        //     margin-top: 24px;
        //     display: flex;
        //     padding: 16px 30px;
        //     border: 1px solid #e0e0e0;
        //     border-radius: 12px;
        //     margin: 16px 24px;
        //     justify-content: space-between;
        // }
        // .kapture-tool {
        //     margin-top: 24px;
        //     display: flex;
        //     padding: 16px 30px;
        //     border: 1px solid #e0e0e0;
        //     border-radius: 12px;
        //     margin: 16px 24px;
        //     justify-content: space-between;
        // }
    }
}
.left-container {
    display: flex;
    .radio-btn {
        display: flex;
        align-items: center;
    }
    .fynd-icon {
        display: flex;
        align-items: center;
    }
    .tools-type {
        display: flex;
        flex-direction: column;
        margin-left: 9px;
        .tool-heading {
            font-family: 'Inter';
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 140%;
            color: #41434c;
        }
        .tool-decs {
            margin-top: 4px;
            font-family: 'Inter';
            font-style: normal;
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
            color: #9b9b9b;
        }
    }
}
::v-deep .muted {
    pointer-events: none;
    opacity: 0.4;
}
.right-container {
    display: flex;
    align-items: center;
    .config-btn-conatiner {
        border: 1px solid #2e31be;
        border-radius: 4px;
        ::v-deep .n-flat-button-secondary {
            background-color: #ffffff;
        }
        ::v-deep .n-button-content {
            color: #2e31be;
        }
    }
}
::v-deep .nitrozen-input-grp {
    margin-top: 8px;
}
.tooltip-label {
    line-height: 16px;
    font-family: Inter;
    font-size: 10px;
    text-align: left;
    width: 500px;
    padding: 6px 12px;
}
.coming-soon-icon {
    margin: -16px -30px;
}
</style>
