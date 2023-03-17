<template>
    <div class="service-tool">
        <div class="container">
            <div class="toggle">
                <label class="label">
                    Chatbot Support
                </label>
            </div>
            <div class="tool-container">
                <div class="default-tool">
                    <div class="left-container" :class="isAvailable('freshchat') ? '' : 'muted'">
                        <div class="radio-btn">
                            <nitrozen-radio :name="'freshchat'" :radioValue="'freshchat'" 
                            v-model="integration.type"
                            ></nitrozen-radio>
                        </div>
                        <div class="fynd-icon">
                            <inline-svg :src="'freshchat_icon'"></inline-svg>
                        </div>
                        <div class="tools-type">
                            <span class="tool-heading">Freshchat Integrations</span>
                            <span class="tool-decs">An advanced customer service tool
                                widely used by all types of
                                businesses</span>
                        </div>
                    </div>
                    <div v-if="isAvailable('freshchat')" class="right-container">
                        <div class="config-btn-conatiner"></div>
                    </div>
                    <div v-if="!isAvailable('freshchat')" class="coming-soon-icon">
                        <inline-svg :src="'coming-soon'"></inline-svg>
                    </div>
                    <div v-else class="btn-container">
                        <nitrozen-button class="save-btn" v-stroke-btn :rounded="false" :theme="'secondary'"
                            @click="configure('freshchat')">
                            Configure
                        </nitrozen-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CredentialsService from '@/services/credentials.service.js'
import { NitrozenButton, NitrozenRadio } from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';

export default {
    name: 'support-integration',
    props: ['type'],
    components: {
        "inline-svg": inlineSvgVue,
        NitrozenButton,
        NitrozenRadio,

    },
    data() {
        return {
            integration: {
                type: 'freshchat'
            },
            integrationData: [],
            available_integration: []
        }
    },
    mounted() {
        if (this.type == 'partner') this.getAllCredentials()
    },
    methods: {
        async getAllCredentials() {
            const { data: { items } } = await CredentialsService.fetchAllCredentials(this.type)
            this.available_integration = items.map(el => el.type);
            this.integrationData = items
        },
        isAvailable(integration_name) {
            return this.available_integration.includes(integration_name);
        },
        configure(type) {
            this.$router.push({
                path: `/administrator/support/configuration/integration/${type}`
            });
        },
    }
}
</script>
<style lang="less" scoped>
.service-tool {
    margin-top: 24px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    // .container {
    // position: relative;
    // margin: 24px;
    // padding: 24px;
    // background: #ffffff;
    // border-radius: 12px;
    // }
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

.coming-soon-icon {
    margin: -16px -30px;
}</style>
