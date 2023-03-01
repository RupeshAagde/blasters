<template>
    <div class="panel">
        <div>
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
                <support-Communication :type="type"></support-Communication>

                <div v-if="isDRIenabled" class="support-managers">
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
                                        @change="switchIntegration($event, 'default')"
                                    ></nitrozen-radio>
                                </div>
                                <div class="fynd-icon">
                                    <inline-svg
                                        :src="'fynd-platform-icon'"
                                    ></inline-svg>
                                </div>
                                <div class="tools-type">
                                    <span class="tool-heading"
                                        >Fynd Platform</span
                                    >
                                    <span class="tool-decs"
                                        >Fynd Platform's default CRM tool for
                                        handling tickets</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="isAvailable('default')"
                                class="right-container"
                            ></div>
                            <div
                                v-if="!isAvailable('default')"
                                class="coming-soon-icon"
                            >
                                <inline-svg :src="'coming-soon'"></inline-svg>
                            </div>
                            <div v-else class="btn-container">
                                <nitrozen-button
                                    class="save-btn"
                                    v-stroke-btn
                                    :rounded="false"
                                    :theme="'secondary'"
                                    @click="configure(default_integration)"
                                >
                                    Configure
                                </nitrozen-button>
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
                                        @change="switchIntegration($event, 'freshdesk')"
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
                                        >An advanced customer service tool
                                        widely used by all types of
                                        businesses</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="isAvailable('freshdesk')"
                                class="right-container"
                            >
                                <div class="config-btn-conatiner"></div>
                            </div>
                            <div
                                v-if="!isAvailable('freshdesk')"
                                class="coming-soon-icon"
                            >
                                <inline-svg :src="'coming-soon'"></inline-svg>
                            </div>
                            <div v-else class="btn-container">
                                <nitrozen-button
                                    class="save-btn"
                                    v-stroke-btn
                                    :rounded="false"
                                    :theme="'secondary'"
                                    @click="configure(freshdesk_integration)"
                                >
                                    Configure
                                </nitrozen-button>
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
                                        @change="switchIntegration($event, 'kapture')"
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
                                        >An enterprise-grade CRM with
                                        ready-to-use integrations</span
                                    >
                                </div>
                            </div>
                            <div
                                v-if="isAvailable('kapture')"
                                class="right-container"
                            >
                                <div class="config-btn-conatiner"></div>
                            </div>
                            <div
                                v-if="!isAvailable('kapture')"
                                class="coming-soon-icon"
                            >
                                <inline-svg :src="'coming-soon'"></inline-svg>
                            </div>
                            <div v-else class="btn-container">
                                <nitrozen-button
                                    class="save-btn"
                                    v-stroke-btn
                                    :rounded="false"
                                    :theme="'secondary'"
                                    @click="configure(kapture_integration)"
                                >
                                    Configure
                                </nitrozen-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <pop-up
            v-if="warningPopUp"
            :infoText="popupDecs"
            :textHeading="popupHeading"
            @cancel="cancelPopup"
            @confirm="confirmPopUp"
        />
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
    NitrozenDropdown,
    NitrozenError
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../../services/support.service';
import PopUp from '../configuration/common/PopUp.vue';
import draggable from 'vuedraggable';
import supportCommunication from '../../../pages/settings/support-configuration/supportCommunication.vue'
export default {
    name: 'category-list',
    components: {
        PageHeader,
        'pop-up': PopUp,
        'inline-svg': inlineSvgVue,
        NitrozenButton,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-input': NitrozenInput,
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-error': NitrozenError,
        draggable,
        'support-Communication': supportCommunication,
    },
    data() {
        return {
            showCommunicationinfo: false,
            isDRIenabled: false,
            _id: undefined,
            showSupportdris: false,
            available_integration: [],
            type:'platform',
            integration: {
                type: undefined
            },
            support_email: {
                value: '',
                description: '',
                enabled: false
            },
            support_phone: {
                value: '',
                description: '',
                enabled: false
            },
            support_faq: {
                value: '',
                description: '',
                enabled: false
            },
            kapture_integration: 'kapture',
            freshdesk_integration: 'freshdesk',
            default_integration: 'default',
            enabledToAddContact: false,
            showPreview: false,
            typeofSupport: [
                { value: 'phone_number', text: 'Phone Number' },
                { value: 'email', text: 'Email' },
                { value: 'link', text: 'Link' }
            ],
            supportCommunication: [],
            selectedSupport: '',
            supportTitle: '',
            supportValue: '',
            supportDecs: '',
            editSelectedIndex: '',
            editContact: false,
            isLimitExceed: false,
            warningPopUp: false,
            selectedIntegrationType:''
        };
    },
    watch: {},
    mounted() {
        this.getGeneralConfiguration();
    },
    methods: {
        switchIntegration(integration) {
            this.selectedIntegrationType = integration
            this.warningPopUp = true;
            this.popupHeading = `Are you sure?`;
            this.popupDecs = `You are trying to switch to another integration? This action will remove the current integration.`;
        },
        confirmPopUp() {
            this.integration.type = this.selectedIntegrationType
            this.warningPopUp = false;
        },
        cancelPopup(){
            this.integration.type = ''
            this.warningPopUp = !this.warningPopUp
        },
        isAvailable(integration_name) {
            return this.available_integration.includes(integration_name);
        },
        configure(type) {
            this.$router.push({
                path: `/administrator/support/configuration/integration/${type}`
            });
        },
    
        save() {
            if(this.integration && !this.integration.type){
                return this.$snackbar.global.showError('Please select an integration');
            }
            let data = {
                _id: this._id,
                show_communication_info: this.showCommunicationinfo,
                show_support_dris: this.showSupportdris && this.isDRIenabled,
                support_email: this.support_email,
                support_phone: this.support_phone,
                support_faq: this.support_faq,
                integration: this.integration,
                support_communication: this.supportCommunication
            };
            SupportService.setGeneralConfig(data)
                .then((response) => {
                    this.setPageData(response.data);
                    this.$snackbar.global.showSuccess(
                        'Settings changed successfully'
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError(
                        `${err.response.data.message}`
                    );
                });
        },
        setPageData(data) {
            this._id = data._id;
            this.isDRIenabled = data.enable_dris;
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
            this.supportCommunication = data.support_communication
                ? data.support_communication
                : [];
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
        }
    }
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
    top: 56.5px;
    background: #ffffff;
    border-radius: 12px;

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
            font-family: Inter, sans-serif;
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
            font-family: Inter, sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            line-height: 140%;
            color: #41434c;
        }
    }
    .contact-container {
        display: flex;
        flex-direction: row;
        padding: 24px 24px 24px 20px;
        border: 1px solid #e0e0e0;
        border-radius: 12px;
        margin: 16px 24px;
        .draggable-icon {
            display: flex;
            align-items: center;
        }
        .contact-container-section {
            margin-left: 24px;
            width: 100%;
            .contact-container-section-1 {
                display: flex;
                align-items: center;
                justify-content: space-between;

                .contact-container-sub-section-1 {
                    display: flex;
                    flex-direction: row;
                    .checkbox {
                        display: flex;
                        align-items: center;
                    }
                    .max-entries {
                        color: #9b9b9b;
                        font-weight: 400;
                        margin-left: 4px;
                    }
                }
                .contact-container-sub-section-2 {
                    display: flex;
                    flex-direction: row;
                    .editContact {
                        cursor: pointer;
                    }
                    .deleteContact {
                        margin-left: 16px;
                        cursor: pointer;
                    }
                }
            }
            .contact-container-section-2 {
                display: flex;
                flex-direction: row;
                margin-top: 18px;
                .input {
                    width: 333px;
                }
                .decs {
                    margin-left: 36px;
                    width: 100%;
                }
            }
        }

        .radio {
            display: flex;
            align-items: center;
        }

        .icon {
            display: flex;
            align-items: center;
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
            font-family: Inter, sans-serif;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 140%;
            color: #41434c;
        }
        .tool-decs {
            margin-top: 4px;
            font-family: Inter, sans-serif;
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
    font-family: Inter, sans-serif;
    font-size: 10px;
    text-align: left;
    width: 500px;
    padding: 6px 12px;
}
.coming-soon-icon {
    margin: -16px -30px;
}
::v-deep .dropdown .nitrozen-dropdown-label {
    margin-bottom: 8px;
}
</style>
