<template>
    <div class="container">
        <div class="caption">
            <p class="title">Product Return Quality Check</p>
            <span class="setup-subtitle"
                >Choose the level at which you wish to decide the return window
                for products returned by customers</span
            >
        </div>
        <div class="qc-type-container">
            <div
                class="qc-type-element"
                :class="qc_type === 'pre_qc' ? 'selected' : ''"
            >
                <nitrozen-radio
                    :name="'pre_qc'"
                    :radioValue="'pre_qc'"
                    v-model="qc_type"
                    >Pre &amp; Door Quality Check</nitrozen-radio
                >
                <span class="setup-subtitle"
                    >Set an acceptable return before assign pickup and post
                    pickup</span
                >
            </div>
            <div
                class="qc-type-element"
                :class="qc_type === 'doorstep_qc' ? 'selected' : ''"
            >
                <nitrozen-radio
                    :name="'doorstep_qc'"
                    :radioValue="'doorstep_qc'"
                    v-model="qc_type"
                    >Door Quality Check</nitrozen-radio
                >
                <span class="setup-subtitle"
                    >Set an acceptable return before assign pickup and post
                    pickup</span
                >
            </div>
        </div>
        <div class="caption">
            <p class="title">Product Return Reason</p>
            <span class="setup-subtitle"
                >Choose the level at which you wish to decide the return window
                for products returned by customers</span
            >
        </div>
        <div class="search-filter">
            <div class="search-box">
                <div class="search">
                    <nitrozen-input
                        :showSearchIcon="true"
                        type="search"
                        :placeholder="'Search by name'"
                        v-model="returnReasonSearchText"
                        @input="searchReturnReason"
                    ></nitrozen-input>
                </div>
                <div class="add-new-reason">
                    <nitrozen-button
                        :theme="'secondary'"
                        v-stroke-btn
                        @click="addNewReason()"
                    >
                        Add New
                    </nitrozen-button>
                </div>
            </div>
        </div>
        <draggable
            class="reason-container"
            v-model="selectedConfig.reasons"
            returnReasonSearchText,searchReturnReason,addNewReason,selectedConfig
            handle=".reorder"
            @start="drag = true"
            @end="drag = false"
        >
            <div
                v-for="(reason, reasonIndex) of selectedConfig.reasons"
                :key="reason.id"
                class="reason-item-container"
            >
                <div class="reason-item-caption-container">
                    <inline-svg class="reorder" src="reorder"></inline-svg>
                </div>
                <div class="reason-question-accordion">
                    <div class="question-accordion-header">
                        <nitrozen-checkbox
                            :name="reason.display_name"
                            v-model="reason.is_selected"
                        >
                            {{ reason.display_name }}
                        </nitrozen-checkbox>
                        <div class="reason-item-buttons">
                            <ukt-inline-svg
                                @click.stop.native="toggleQuestions(reason.id)"
                                :src="
                                    reason.showReasons
                                        ? 'arrow-top-black'
                                        : 'arrow-dropdown-black'
                                "
                            ></ukt-inline-svg>
                            <ukt-inline-svg
                                :src="'delete_new'"
                            ></ukt-inline-svg>
                        </div>
                    </div>
                    <div v-if="reason.showReasons">
                        <div
                            v-for="(question, index) of reason.question_set"
                            :key="`${reason.id}-${question.id}`"
                            class="question-item"
                        >
                            <div class="question-dropdown-container">
                                <nitrozen-dropdown
                                    label="Question"
                                    class="question-dropdown"
                                    :items="questionsList"
                                    placeholder="Enter Question"
                                    v-model="
                                        selectedConfig.reasons[reasonIndex]
                                            .question_set[index].display_name
                                    "
                                    @change="handleQuestionsDropdown"
                                ></nitrozen-dropdown>
                                <nitrozen-button
                                    v-if="
                                        shouldShowAddMore(
                                            reason.question_set,
                                            index
                                        )
                                    "
                                    :theme="'secondary'"
                                    @click="addMoreQuestions"
                                    class="add-more-question"
                                    >Add More</nitrozen-button
                                >
                            </div>
                            <div
                                :class="
                                    shouldShowAddMore(
                                        reason.question_set,
                                        index
                                    )
                                        ? 'delete-question-button-last'
                                        : 'delete-question-button'
                                "
                            >
                                <ukt-inline-svg
                                    :class="
                                        shouldShowAddMore(
                                            reason.question_set,
                                            index
                                        )
                                            ? 'delete-question-last'
                                            : 'delete-question'
                                    "
                                    :src="'delete_new'"
                                ></ukt-inline-svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </draggable>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenRadio,
    NitrozenInput,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import Draggable from 'vuedraggable';

export default {
    name: 'product-return-qc',
    components: {
        InlineSvg,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenInput,
        Draggable,
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox
    },
    props: {
        returnReasonSearchText: {
            type: String,
            required: true
        },
        searchReturnReason: {
            type: Function,
            required: true
        },
        addNewReason: {
            type: Function,
            required: true
        },
        selectedConfig: {
            type: Object,
            required: true
        },
        questionsList: {
            type: Array,
            required: true
        },
        addMoreQuestions: {
            type: Function,
            required: true
        },
        qcType: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            qc_type: this.qcType
        };
    },
    methods: {
        shouldShowAddMore(questions, index) {
            return questions.length - 1 === index;
        },
        toggleQuestions(id) {
            const index = this.selectedConfig.reasons.findIndex(
                (reason) => reason.id === id
            );
            this.selectedConfig.reasons[index].showReasons = !this
                .selectedConfig.reasons[index].showReasons;
        },
        handleQuestionsDropdown() {
            console.log('handleQuestionsDropdown', this.selectedConfig);
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

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
.search-filter {
    margin-top: 24px;
    align-items: center;

    .search-box {
        display: flex;
        justify-content: space-between;
        background: #f8f8f8;
        padding: 12px;
        border-radius: 4px;

        @media @mobile {
            min-width: 100%;
        }
        .search {
            flex-grow: 1;
        }
        .add-new-reason {
            width: fit-content;
            margin-left: 16px;
            display: flex;
            justify-content: flex-end;
        }
    }
}
.reason-container {
    width: 100%;
    margin: 20px 0;
    .reason-item-container {
        display: flex;
        max-width: 100%;
        border: 1px solid @Iron;
        border-radius: 4px;
        margin-bottom: 12px;
        padding: 12px;
        color: @Mako;
        font-size: 14px;
        font-weight: 500;
        background-color: #ffffff;
        .reason-item-caption-container {
            width: 3%;
            margin-top: 2.5px;
        }
        .reason-question-accordion {
            width: 97%;
            display: flex;
            flex-direction: column;
            .question-accordion-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .reason-item-buttons {
                    display: flex;
                }
            }
        }
        .reason-item-buttons > * {
            margin: 0 10px;
            cursor: pointer;
            height: 25px;
            width: 25px;
            &:hover {
                background-color: @Iron;
                border-radius: 50%;
            }
        }
        .question-item {
            width: 100%;
            display: flex;
            align-items: center;
            margin: 16px 0;
        }
        .question-dropdown-container {
            width: 98.5%;
            .question-dropdown {
                width: 100%;
            }
            .add-more-question {
                float: right;
            }
        }
        .delete-question-button {
            align-self: center;
            height: 100%;
            .delete-question {
                margin: 24px 10px 0 10px;
                height: 25px;
                width: 25px;
                cursor: pointer;
                &:hover {
                    background-color: @Iron;
                    border-radius: 50%;
                }
            }
        }
        .delete-question-button-last {
            height: 100%;
            .delete-question-last {
                margin: 0 10px 16px 10px;
                height: 25px;
                width: 25px;
                cursor: pointer;
                &:hover {
                    background-color: @Iron;
                    border-radius: 50%;
                }
            }
        }
    }
}
.reorder {
    cursor: -webkit-grab;
}

.qc-active {
    padding-bottom: 0;
}
</style>
