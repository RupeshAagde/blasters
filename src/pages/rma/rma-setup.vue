<template>
    <div class="panel">
        <div class="main-container">
            <div class="page-container">
                <div class="setup-container">
                    <div class="caption">
                        <p class="setup-title">Setup</p>
                        <span class="setup-subtitle"
                            >Some description about Setup</span
                        >
                    </div>
                    <nitrozen-dropdown
                        label="Company"
                        class="platform-dropdown"
                        :items="companyList"
                        placeholder="Select Company"
                        v-model="selectedConfig.platform"
                        @change="handleDropdown"
                    ></nitrozen-dropdown>
                </div>
                <div class="setup-container">
                    <div class="caption">
                        <p class="setup-title">Sales Channels Details</p>
                        <span class="setup-subtitle"
                            >Some description about Sales Channels</span
                        >
                    </div>
                    <nitrozen-dropdown
                        label="Sales Channel"
                        class="platform-dropdown"
                        :items="companyList"
                        placeholder="Select Sales Channel"
                        v-model="selectedConfig.sales_channels.name"
                        @change="handleDropdown"
                    ></nitrozen-dropdown>
                    <div class="sales-channel-category-container">
                        <p class="setup-title">Categories</p>
                        <span class="setup-subtitle"
                            >Some description about Sales Channels
                            Categories</span
                        >
                    </div>
                    <nitrozen-dropdown
                        label="Department"
                        class="platform-dropdown"
                        :items="salesChannelCategoryList"
                        placeholder="Select Department"
                        v-model="selectedConfig.sales_channels.category"
                        @change="handleDropdown"
                    ></nitrozen-dropdown>
                    <div class="sales-channel-subcategory-container">
                        <nitrozen-dropdown
                            label="L1"
                            class="platform-dropdown"
                            :items="salesChannelCategoryList"
                            placeholder="Select L1"
                            v-model="
                                selectedConfig.sales_channels.subcategories.L1
                            "
                            @change="handleDropdown"
                        ></nitrozen-dropdown>
                        <nitrozen-dropdown
                            label="L2"
                            class="platform-dropdown"
                            :items="salesChannelCategoryList"
                            placeholder="Select L2"
                            v-model="
                                selectedConfig.sales_channels.subcategories.L2
                            "
                            @change="handleDropdown"
                        ></nitrozen-dropdown>
                        <nitrozen-dropdown
                            label="L3"
                            class="platform-dropdown"
                            :items="salesChannelCategoryList"
                            placeholder="Select L3"
                            v-model="
                                selectedConfig.sales_channels.subcategories.L3
                            "
                            @change="handleDropdown"
                        ></nitrozen-dropdown>
                    </div>
                </div>
                <div class="setup-container qc-active">
                    <div class="qc-active-container">
                        <div class="qc-active-caption">
                            <p class="qc-active-title">
                                Enable Quality Check for this category
                            </p>
                            <span class="setup-subtitle"
                                >Choose the level at which you wish to decide
                                the return window for products returned by
                                customers</span
                            >
                        </div>
                        <nitrozen-toggle-btn
                            @change="handleQCType"
                            v-model="selectedConfig.qc_active"
                        ></nitrozen-toggle-btn>
                    </div>
                </div>
                <div class="setup-container">
                    <product-return-qc
                        :returnReasonSearchText="returnReasonSearchText"
                        :searchReturnReason="searchReturnReason"
                        :selectedConfig="selectedConfig"
                        :questionsList="questionsList"
                        :addMoreQuestions="addMoreQuestions"
                    ></product-return-qc>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenToggleBtn,
    NitrozenRadio,
    NitrozenInput,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import ProductReturnQC from './product-return-qc.vue';
export default {
    name: 'rma-setup',
    components: {
        InlineSvg,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenToggleBtn,
        NitrozenInput,
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox,
        'product-return-qc': ProductReturnQC
    },
    data() {
        return {
            companyList: [
                { value: 1, text: 'FYND' },
                { value: 2, text: 'Amazon' },
                { value: 3, text: 'JioMart' },
                { value: 4, text: 'Flipkart' }
            ],
            salesChannelCategoryList: [
                { value: 1, text: 'Electronics' },
                { value: 2, text: 'Fashion' },
                { value: 3, text: 'Food' },
                { value: 4, text: 'Kitchen' }
            ],
            questionsList: [
                {
                    value: 19800,
                    text: 'Check the Brand'
                },
                {
                    value: 2323,
                    text: 'Check the Size'
                }
            ],
            newReason: '',
            returnReasonSearchText: '',
            selectedConfig: {
                platform: '',
                sales_channels: {
                    name: '',
                    category: '',
                    subcategories: {
                        L1: '',
                        L2: '',
                        L3: ''
                    }
                },
                qc_active: true,
                qc_type: [],
                reasons: [
                    {
                        id: 111223,
                        display_name: 'Received a wrong or defective product',
                        showReasons: false,
                        qc_type: 'pre_qc',
                        question_set: [
                            {
                                id: 1,
                                display_name: 'Check the brand'
                            }
                        ]
                    },
                    {
                        id: 20000,
                        display_name:
                            'Images shown did not match to the actual product',
                        showReasons: false,
                        qc_type: 'doorstep_qc',
                        question_set: [
                            {
                                id: 1,
                                display_name: 'Check the brand'
                            },
                            {
                                id: 2,
                                display_name: 'Check the Size'
                            }
                        ]
                    },
                    {
                        id: 1968,
                        display_name: 'Received a wrong or defective product',
                        showReasons: false,
                        qc_type: 'doorstep_qc',
                        question_set: [
                            {
                                id: 1,
                                display_name: 'Check the brand'
                            }
                        ]
                    },
                    {
                        id: 212434,
                        display_name:
                            'Images shown did not match to the actual product',
                        showReasons: false,
                        qc_type: 'doorstep_qc',
                        question_set: [
                            {
                                id: 1,
                                display_name: 'Check the brand'
                            },
                            {
                                id: 2,
                                display_name: 'Check the Size'
                            }
                        ]
                    },
                    {
                        id: 120912,
                        display_name: 'Received a wrong or defective product',
                        showReasons: false,
                        qc_type: 'pre_qc',
                        question_set: [
                            {
                                id: 1,
                                display_name: 'Check the brand'
                            }
                        ]
                    },
                    {
                        id: 2474746,
                        display_name:
                            'Images shown did not match to the actual product',
                        showReasons: false,
                        qc_type: 'doorstep_qc',
                        question_set: [
                            {
                                id: 1,
                                display_name: 'Check the brand'
                            },
                            {
                                id: 2,
                                display_name: 'Check the Size'
                            }
                        ]
                    }
                ]
            }
        };
    },
    methods: {
        save() {
            console.log('saved');
        },
        handleDropdown() {
            console.log('handleDropdown', this.selectedConfig);
        },
        handleQCType() {
            console.log('handleQCType', this.selectedConfig);
        },
        searchReturnReason() {
            console.log('searchReturnReason');
        },
        addMoreQuestions() {
            console.log('addMoreQuestions');
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.page-container {
    margin: 0;
    flex-direction: column;
    border-radius: 12px;

    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }

    .setup-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom: 1px solid @Iron;
        padding-bottom: 32px;
        margin-bottom: 25px;
        .sales-channel-category-container {
            margin-top: 50px;
        }
        .setup-title {
            font-size: 18px;
            color: #41434c;
            font-weight: 500;
            margin: 5px 0;
        }
        .setup-subtitle {
            color: #9b9b9b;
            font-size: 12px;
            font-weight: 400;
        }
        .platform-dropdown {
            width: 30%;
            margin-top: 20px;
        }
        .sales-channel-subcategory-container {
            display: flex;
            justify-content: space-between;
        }
        .caption {
            height: 45px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .qc-active-container {
            display: flex;
            justify-content: space-between;
            width: 100%;

            .qc-active-caption {
                width: 30%;
            }

            .qc-active-title {
                font-size: 14px;
                color: #41434c;
                font-weight: 500;
                margin: 5px 0;
            }
        }
        .qc-type-container {
            width: 100%;
            display: flex;
            margin: 35px 0;
            .qc-type-element {
                width: 349px;
                height: 110px;
                box-sizing: border-box;
                margin-right: 25px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                padding: 25px;
                background: #ffffff;
                border: 1px solid @Iron;
                border-radius: 4px;
            }
            .selected {
                background: #e7eeff;
                border: 1px solid #2e31be;
                border-radius: 4px;
            }
        }
    }
    .qc-active {
        padding-bottom: 0;
    }
}

::v-deep .titlize {
    text-transform: capitalize;
    position: initial;
    width: auto;
    z-index: 6;
}
</style>
