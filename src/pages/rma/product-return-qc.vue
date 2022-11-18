<template>
    <div class="container">
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
                    <nitrozen-dropdown
                        :label="'Reason'"
                        class="platform-dropdown"
                        :items="filterReason(reasonsList)"
                        :searchable="true"
                        :value="selectedReason"
                        :multiple="false"
                        placeholder="Search Reason"
                        @change="handleReasonsDropdown"
                        @searchInputChange="onSearchReasonsDropdownList"
                    ></nitrozen-dropdown>
                </div>
            </div>
        </div>
        <div class="reason-container">
            <draggable
                class="list group"
                v-model="selectedReasonsList"
                handle=".reorder"
                v-bind="dragOptions"
                @start="drag = true"
                @end="drag = false"
            >
                <div
                    v-for="(reason, reasonIndex) of selectedReasonsList"
                    :key="reason.id"
                    class="reason-item-container"
                >
                    <div class="reason-question-accordion">
                        <div class="question-accordion-header">
                            <div class="reason-name-container">
                                <inline-svg
                                    class="reorder"
                                    src="reorder"
                                ></inline-svg>
                                <span class="reason-display-name">{{
                                    reason.display_name
                                }}</span>
                            </div>
                            <div class="reason-item-buttons">
                                <span class="active-toggle">Active</span>
                                <nitrozen-toggle-btn
                                    v-model="reason.is_active"
                                ></nitrozen-toggle-btn>
                                <ukt-inline-svg
                                    class="collapse-button"
                                    @click.stop.native="toggleReason(reason.id)"
                                    :src="
                                        reason.showReason
                                            ? 'arrow-top-black'
                                            : 'arrow-dropdown-black'
                                    "
                                ></ukt-inline-svg>
                                <ukt-inline-svg
                                    class="collapse-button"
                                    :src="'delete_new'"
                                    @click.stop.native="deleteReason(reason.id)"
                                ></ukt-inline-svg>
                            </div>
                        </div>
                        <div
                            class="reason-content-wrapper"
                            v-if="reason.showReason"
                        >
                            <div
                                v-for="(subReason,
                                subReasonIndex) of reason.reasons"
                                :key="subReasonIndex"
                            >
                                <div class="sub-reason-container">
                                    <div class="question-accordion-header">
                                        <div class="reason-name-container">
                                            <span class="reason-display-name"
                                                >Sub Reason
                                                {{
                                                    reason.reasons.length === 1
                                                        ? '*'
                                                        : ''
                                                }}</span
                                            >
                                        </div>
                                        <div class="reason-item-buttons">
                                            <ukt-inline-svg
                                                v-show="
                                                    reason.reasons.length !== 1
                                                "
                                                class="collapse-button"
                                                :src="'delete_new'"
                                                @click.stop.native="
                                                    deleteSubReason(
                                                        reasonIndex,
                                                        subReasonIndex
                                                    )
                                                "
                                            ></ukt-inline-svg>
                                        </div>
                                    </div>
                                    <div class="sub-reason-content">
                                        <nitrozen-dropdown
                                            :id="subReasonIndex"
                                            label="Reason"
                                            class="reason-dropdown"
                                            :items="
                                                filterSubReason(
                                                    reasonsDropdownList,
                                                    reasonIndex
                                                )
                                            "
                                            placeholder="Choose Reason"
                                            v-model="subReason.reasonDetails"
                                            :searchable="true"
                                            @searchInputChange="
                                                subReasonDropdownSearch
                                            "
                                            @change="
                                                handleSubReasonsDropdown(
                                                    $event,
                                                    reasonIndex,
                                                    subReasonIndex
                                                )
                                            "
                                        ></nitrozen-dropdown>
                                        <div class="qc-type-container">
                                            <div
                                                class="qc-type-element"
                                                :class="
                                                    subReason.qc_type ===
                                                    'pre_qc'
                                                        ? 'selected'
                                                        : ''
                                                "
                                            >
                                                <nitrozen-radio
                                                    :name="
                                                        'pre_qc' +
                                                            subReasonIndex +
                                                            reasonIndex +
                                                            Math.random()
                                                    "
                                                    :radioValue="'pre_qc'"
                                                    v-model="subReason.qc_type"
                                                    >Pre &amp; Door Quality
                                                    Check</nitrozen-radio
                                                >
                                            </div>
                                            <div
                                                class="qc-type-element"
                                                :class="
                                                    subReason.qc_type ===
                                                    'doorstep_qc'
                                                        ? 'selected'
                                                        : ''
                                                "
                                            >
                                                <nitrozen-radio
                                                    :name="
                                                        'doorstep_qc' +
                                                            subReasonIndex
                                                    "
                                                    :radioValue="'doorstep_qc'"
                                                    v-model="subReason.qc_type"
                                                    >Door Quality
                                                    Check</nitrozen-radio
                                                >
                                            </div>
                                            <div
                                                class="qc-type-element"
                                                :class="
                                                    subReason.qc_type ===
                                                    'no_qc'
                                                        ? 'selected'
                                                        : ''
                                                "
                                            >
                                                <nitrozen-radio
                                                    :name="
                                                        'no_qc' +
                                                            subReasonIndex +
                                                            reasonIndex +
                                                            Math.random()
                                                    "
                                                    :radioValue="'no_qc'"
                                                    @change="
                                                        handleNoQC(
                                                            reasonIndex,
                                                            subReasonIndex
                                                        )
                                                    "
                                                    v-model="subReason.qc_type"
                                                    >No Quality Check
                                                    Required</nitrozen-radio
                                                >
                                            </div>
                                        </div>
                                        <div>
                                            <nitrozen-dropdown
                                                v-show="
                                                    subReason.qc_type !==
                                                        'no_qc'
                                                "
                                                :multiple="true"
                                                label="Question"
                                                class="question-dropdown"
                                                :items="questionsList"
                                                placeholder="Choose Question"
                                                @change="
                                                    handleQuestionsDropdown
                                                "
                                                v-model="subReason.question_set"
                                            ></nitrozen-dropdown>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    v-if="
                                        subReasonIndex ===
                                            reason.reasons.length - 1
                                    "
                                    @click="addSubReason(reasonIndex)"
                                    class="add-rule-option"
                                >
                                    <div class="vertical-line"></div>
                                    <div class="box-type">+</div>
                                </div>
                                <div v-else class="add-rule-option">
                                    <div class="vertical-line"></div>
                                    <div class="vertical-line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenRadio,
    NitrozenInput,
    NitrozenCheckBox,
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import Draggable from 'vuedraggable';
import { debounce } from '@/helper/utils';
import RMAService from '@/services/rma.service';

export default {
    name: 'product-return-qc',
    components: {
        InlineSvg,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenInput,
        Draggable,
        NitrozenToggleBtn,
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-checkbox': NitrozenCheckBox
    },
    data() {
        return {
            selectedReason: '',
            selectedReasonsList: [],
            questionsList: [],
            reasonsList: [],
            reasonsDropdownList: [],
            disableSave: true,
            dragOptions: {
                animation: 200,
                group: 'description',
                disabled: false,
                ghostClass: 'ghost'
            },
            ruleData: {}
        };
    },
    mounted() {
        this.fetchReasonsList();
        this.fetchQuestionsList();
        const rule_data = localStorage.getItem('rma_rule_data');
        if (rule_data) {
            this.ruleData = JSON.parse(rule_data);
            this.selectedReasonsList = JSON.parse(JSON.stringify(this.getSelectedReasonsList()));
        }
    },
    updated() {
        let flag = true;
        if (this.selectedReasonsList.length === 0) {
            this.$emit('disableSave', true);
            flag = false;
        } else {
            for (let selected of this.selectedReasonsList) {
                const subReasons = selected.reasons;
                for (let selectedSubReason of subReasons) {
                    if (
                        selectedSubReason.qc_type === 'no_qc' &&
                        selectedSubReason.reasonDetails.display_name !==
                            undefined
                    ) {
                        this.$emit('disableSave', false);
                        flag = false;
                    } else if (
                        (selectedSubReason.qc_type === 'pre_qc' ||
                            selectedSubReason.qc_type === 'doorstep_qc') &&
                        selectedSubReason.question_set.length !== 0
                    ) {
                        this.$emit('disableSave', false);
                        flag = false;
                    } else if (
                        selectedSubReason.qc_type === 'pre_qc' ||
                        selectedSubReason.qc_type === 'doorstep_qc' ||
                        selectedSubReason.question_set.length === 0 ||
                        selectedSubReason.reasonDetails.id === undefined
                    ) {
                        this.$emit('disableSave', true);
                        flag = false;
                        break;
                    }
                }
            }
            if (flag === true) {
                this.$emit('disableSave', false);
            }
        }
        this.$emit('getSelectedReasons', this.selectedReasonsList);
    },
    methods: {
        toggleReason(id) {
            const index = this.selectedReasonsList.findIndex(
                (reason) => reason.id === id
            );
            console.log(this.selectedReasonsList.findIndex(
                (reason) => reason.id === id
            ))
            this.selectedReasonsList[index].showReason = !this
                .selectedReasonsList[index].showReason;
                console.log(this.selectedReasonsList)
        },
        getSelectedReasonsList() {
            if (this.$route.name === 'rma-custom-rule-edit') {
                console.log('rule-data', this.ruleData);
            } else if (this.$route.name === 'rma-global-rule-edit') {
                console.log('rule-data pppp', this.ruleData.actions.reasons);
                // return this.ruleData.actions.reasons;
                const editedReasons = [...this.ruleData.actions.reasons]
                for(let res of editedReasons) {
                    res.showReason = false
                    let subReasons = res.reasons;
                    for(let sub of subReasons) {
                        sub['reasonDetails'] = {id: sub.id, display_name: sub.display_name}
                        sub.question_set = sub.question_set.map(ques => `${ques.id}--${ques.display_name}`)
                        if(sub.qc_type.includes('pre_qc') && sub.qc_type.includes('doorstep_qc')) {
                            sub.qc_type = 'pre_qc'
                        } else if(sub.qc_type.includes('doorstep_qc')){
                            sub.qc_type = 'doorstep_qc'
                        } else {
                            sub.qc_type = 'no_qc'
                        }
                    }
                }
                console.log('ppspspspspspsppspspspspspspsppspsps', editedReasons)
                return [...editedReasons]
            } else {
                return [];
            }
        },
        onSearchReasonsDropdownList: debounce(function(searchValue) {
            console.log('onSearchReasonsDropdownList', searchValue);
            this.fetchReasonsList(searchValue.text, 'reason');
        }, 300),
        subReasonDropdownSearch: debounce(function(searchValue) {
            console.log('onSearchReasonsDropdownList', searchValue);
            this.fetchReasonsList(searchValue.text, 'sub');
        }, 300),
        handleReasonsDropdown(reason) {
            console.log('reason', reason);
            const newList = this.reasonsList.filter(
                (res) => res.id !== reason.id
            );
            this.reasonsList = [...newList];
            this.selectedReasonsList.push({ ...reason });
        },
        handleNoQC(reasonIndex, subReasonIndex) {
            if (
                this.selectedReasonsList[reasonIndex].reasons[subReasonIndex]
                    .qc_type === 'no_qc'
            ) {
                this.selectedReasonsList[reasonIndex].reasons[
                    subReasonIndex
                ].question_set = [];
            }
        },
        filterReason(reasonList) {
            return reasonList.filter((res) => {
                if (
                    this.selectedReasonsList.find(
                        (selected) => selected.id === res.id
                    )
                ) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        filterSubReason(reasonsList, reasonIndex) {
            console.log(
                'sub',
                reasonsList.filter((res) => {
                    if (this.selectedReasonsList[reasonIndex].id === res.id) {
                        return false;
                    } else {
                        return true;
                    }
                })
            );
            return reasonsList.filter((res) => {
                if (this.selectedReasonsList[reasonIndex].id === res.id) {
                    return false;
                } else {
                    return true;
                }
            });
        },
        deleteReason(reasonID) {
            this.selectedReasonsList = this.selectedReasonsList.filter(
                (res) => res.id !== reasonID
            );
            console.log(this.selectedReasonsList, 'llslslslslsl');
            this.fetchReasonsList();
        },
        addSubReason(reasonIndex) {
            this.selectedReasonsList[reasonIndex].reasons.push({
                reasonDetails: '',
                qc_type: 'pre_qc',
                question_set: [],
                reasons: []
            });
        },
        deleteSubReason(reasonIndex, subReasonIndex) {
            let subReasons = [...this.selectedReasonsList[reasonIndex].reasons];
            subReasons = subReasons.filter(
                (sub, index) => index !== subReasonIndex
            );
            console.log(subReasons);
            this.selectedReasonsList[reasonIndex].reasons = [...subReasons];
        },
        handleSubReasonsDropdown(e, reasonIndex, subReasonIndex) {
            console.log('ksksksks', e);
        },
        handleQuestionsDropdown(question) {
            console.log('question', question);
        },
        fetchReasonsList(searchParam = '', type = '') {
            const query_params = {
                page_no: 1,
                page_size: 100
            };
            if (searchParam.length && type === 'sub') {
                query_params.q = searchParam;
                console.log('subapi', searchParam);
                RMAService.getReasons(query_params)
                    .then((res) => {
                        this.reasonsDropdownList = res.data.items.map(
                            (reason) => {
                                return {
                                    id: reason.id,
                                    value: {
                                        ...reason,
                                        showReason: false,
                                        reasons: [
                                            {
                                                reasonDetails: {},
                                                qc_type: 'pre_qc',
                                                question_set: [],
                                                reasons: [],
                                                isTouched: false
                                            }
                                        ]
                                    },
                                    text: reason.display_name
                                };
                            }
                        );
                    })
                    .catch(() =>
                        this.$snackbar.global.showError(
                            'Failed to get Reasons',
                            {
                                duration: 2000
                            }
                        )
                    );
            } else if (searchParam.length && type === 'reason') {
                query_params.q = searchParam;
                RMAService.getReasons(query_params)
                    .then((res) => {
                        this.reasonsList = res.data.items.map((reason) => {
                            return {
                                id: reason.id,
                                value: {
                                    ...reason,
                                    showReason: false,
                                    reasons: [
                                        {
                                            reasonDetails: {},
                                            qc_type: '',
                                            question_set: [],
                                            reasons: [],
                                            isTouched: false
                                        }
                                    ]
                                },
                                text: reason.display_name
                            };
                        });
                    })
                    .catch(() =>
                        this.$snackbar.global.showError(
                            'Failed to get Reasons',
                            {
                                duration: 2000
                            }
                        )
                    );
            } else {
                RMAService.getReasons(query_params)
                    .then((res) => {
                        this.reasonsList = res.data.items.map((reason) => {
                            return {
                                id: reason.id,
                                value: {
                                    ...reason,
                                    showReason: false,
                                    reasons: [
                                        {
                                            reasonDetails: {},
                                            qc_type: 'pre_qc',
                                            question_set: [],
                                            reasons: [],
                                            isTouched: false
                                        }
                                    ]
                                },
                                text: reason.display_name
                            };
                        });
                        this.reasonsDropdownList = [...this.reasonsList];
                    })
                    .catch(() =>
                        this.$snackbar.global.showError(
                            'Failed to get Reasons',
                            {
                                duration: 2000
                            }
                        )
                    );
            }
        },
        fetchQuestionsList() {
            const query_params = {
                page_size: 9999,
                page_number: 1
            };
            RMAService.getQuestions(query_params)
                .then((res) => {
                    this.questionsList = res.data.items.map((question) => {
                        return {
                            id: question.id,
                            value: `${question.id}--${question.display_name}`,
                            text: question.display_name
                        };
                    });
                })
                .catch(() =>
                    this.$snackbar.global.showError('Failed to get Questions', {
                        duration: 2000
                    })
                );
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
    margin: 16px 0 8px 0;
    .qc-type-element {
        width: 272px;
        height: 40px;
        box-sizing: border-box;
        margin-right: 25px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        padding: 0 16px;
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
    .list {
        // overflow-y: auto;
        // padding-right: 24px;
        .blaster-scrollbar;
    }
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
        .reason-question-accordion {
            width: 100%;
            display: flex;
            flex-direction: column;
            .question-accordion-header {
                width: 100%;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .reason-item-buttons {
                    display: flex;
                    .active-toggle {
                        font-size: 14px;
                        font-weight: 600;
                        align-self: center;
                        text-align: center;
                    }
                }
                .reason-name-container {
                    display: flex;
                    .reason-display-name {
                        align-self: center;
                        margin-left: 16px;
                    }
                }
            }
        }
        .reason-content-wrapper {
            width: 97.5%;
            margin-left: 28px;
            display: flex;
            flex-direction: column;
            margin-top: 16px;
            .sub-reason-container {
                padding: 16px;
                background: #fafafa;
                border: 1px solid #e0e0e0;
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                .sub-reason-content {
                    margin: 16px 0 0 28px;
                    .question-dropdown {
                        margin-left: 2%;
                        width: 67.5vw;
                    }
                }
            }
        }
        .collapse-button {
            margin-left: 10px;
            cursor: pointer;
            height: 25px;
            width: 25px;
            &:hover {
                background-color: @Iron;
                border-radius: 50%;
            }
        }
    }
}
.qc-active {
    padding-bottom: 0;
}
.add-rule-option {
    width: 75px;
    margin-left: 28px;
    .box-type {
        background: #e7eeff;
        border: 1px solid @RoyalBlue;
        color: @RoyalBlue;
        box-sizing: border-box;
        border-radius: 3px;
        padding: 6px 0;
        font-weight: 500;
        cursor: pointer;
        text-align: center;
        font-size: 14px;
    }
    .read-box-type {
        background: #e7eeff;
        border-radius: 3px;
        font-size: 14px;
        color: @Mako;
        padding: 6px;
        text-align: center;
    }
    .add-disable {
        background-color: @GrayShade !important;
        cursor: none;
        pointer-events: none;
        color: @Mako !important;
        border: 1px solid #e0e0e0 !important;
    }
    .multi-box {
        padding: 0;
        .light-hr {
            border: 1px solid rgba(0, 0, 0, 0.1);
            margin: 0px 12px;
        }
        .operator-type {
            padding: 12px 0;
        }
    }
    .operator-box {
        width: auto;
        ::v-deep .nitrozen-dropdown-label {
            display: none;
        }
        ::v-deep .nitrozen-select-wrapper {
            .nitrozen-select {
                border: 1px solid @RoyalBlue;
            }
            .nitrozen-select__trigger {
                background-color: #e7eefe;
                color: @RoyalBlue;
                font-size: 12px;
            }
        }
    }
    .vertical-line {
        border-left: 2px dashed @RoyalBlue;
        height: 20px;
        position: relative;
        left: 50%;
    }
}
.reorder {
    cursor: -webkit-grab;
}
</style>
