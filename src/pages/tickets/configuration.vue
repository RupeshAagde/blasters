<template>
    <div class="panel">
        <page-header
            title="Configuration"
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
                    <nitrozen-input
                        class="input"
                        label="Phone number"
                        v-model="support_phone.key"
                    ></nitrozen-input>
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
                    <nitrozen-input
                        class="input"
                        label="Email ID"
                        v-model="support_email.key"
                    ></nitrozen-input>
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
                    <nitrozen-input
                        class="input"
                        label="FAQ link"
                        v-model="support_faq.key"
                    ></nitrozen-input>
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
                        v-model="supportCommunication"
                    ></nitrozen-toggle-btn>
                </div>
                <div class="tool-container">
                    <div class="default-tool">
                        <div class="left-container">
                            <div class="radio-btn">
                                <nitrozen-radio
                                    :radioValue="'charge_automatically'"
                                    v-model="Select"
                                ></nitrozen-radio>
                            </div>
                            <div class="fynd-icon">
                                <inline-svg :src="'fynd-icon'"></inline-svg>
                            </div>
                            <div class="tools-type">
                                <span class="tool-heading">Fynd Platform</span>
                                <span class="tool-decs"
                                    >Take appropriate actions on the business to
                                    make the seller go live</span
                                >
                            </div>
                        </div>
                        <div v-if="isAvailable" class="right-container">
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
                        <div class="left-container">
                            <div class="radio-btn">
                                <nitrozen-radio
                                    :radioValue="'charge_automatically'"
                                    v-model="isIntegrationAvailable"
                                ></nitrozen-radio>
                            </div>
                            <div class="fynd-icon">
                                <inline-svg :src="'headphone'"></inline-svg>
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
                        <div v-if="isAvailable" class="right-container">
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
                        <div class="left-container">
                            <div class="radio-btn">
                                <nitrozen-radio
                                    :radioValue="'charge_automatically'"
                                    v-model="Select"
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
                        <div v-if="isAvailable" class="right-container">
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
} from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SupportService from '../../services/support.service';
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
    },
    data() {
        return {
            showCommunicationinfo: false,
            showSupportdris: false,
            isIntegrationAvailable: false,
            isAvailable: false,
            Select:false,

            support_email: {
                key: '',
                description: '',
                enabled: true,
            },
            support_phone: {
                key: '',
                description: '',
                enabled: true,
            },
            support_faq: {
                key: '',
                description: '',
                enabled: true,
            },
        };
    },
    mounted() {
        this.getGeneralConfiguration();
    },
    methods: {
        selected(category) {
            this.$router.push({
                path: `/administrator/support/category/${category.path}`,
            });
        },
        save() {
            let data = {
                show_communication_info: this.showCommunicationinfo,
                support_email: {
                    key: this.support_email.key,
                    description: this.support_email.description,
                    enabled: this.support_email.enabled,
                },
                support_phone: {
                    key: this.support_phone.key,
                    description: this.support_phone.description,
                    enabled: this.support_phone.enabled,
                },
                support_faq: {
                    key: this.support_faq.key,
                    description: this.support_faq.description,
                    enabled: this.support_faq.enabled,
                },
                show_support_dris: this.showSupportdris,
                integration: {
                    enabled: false,
                },
                available_integration: [],
            };
            SupportService.GeneralConfig(data)
                .then(() => {
                    this.$snackbar.global.showSuccess(
                        'Setting changes successfully'
                    );
                })
                .catch(() => {
                    this.$snackbar.global.showError('Fails to change setting');
                });
        },
        getGeneralConfiguration() {
            SupportService.getGeneralConfig()
                .then((response) => {
                    console.log(response, '>>response');
                    this.showCommunicationinfo =
                        response.data.show_communication_info;
                    this.showSupportdris = response.data.show_support_dris;
                    this.isIntegrationAvailable =
                        response.data.available_integration;

                    this.support_phone.key = response.data.support_phone.key;
                    this.support_phone.description =
                        response.data.support_phone.description;
                    this.support_phone.enabled =
                        response.data.support_phone.enabled;

                    this.support_email.key = response.data.support_email.key;
                    this.support_email.description =
                        response.data.support_email.description;
                    this.support_email.enabled =
                        response.data.support_email.enabled;
                        
                    this.support_faq.key = response.data.support_faq.key;
                    this.support_faq.description =
                        response.data.support_faq.description;
                    this.support_faq.enabled =
                        response.data.support_faq.enabled;
                })
                .catch((err) => {
                    console.log(err, '>>err');
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
        margin-left: 25px;
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
    color: #ffffff;
}
.coming-soon-icon {
    margin: -16px -30px;
}
</style>
