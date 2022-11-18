<template>
    <div class="panel">
        <adm-page-header
            class="titlize"
            :showBackButton="true"
            @backClick="goBack"
            :title="'Return Authorisation'"
            :noContextMenu="true"
        >
            <nitrozen-button
                :disabled="isSaveDisabled"
                v-flat-btn
                :rounded="false"
                :theme="'secondary'"
                @click="saveRule()"
            >
                Save
            </nitrozen-button>
        </adm-page-header>
        <div class="main-container">
            <!-- <loader v-if="pageLoading"></loader> -->
            <div class="page-container">
                <div class="setup-header">
                    <p class="setup-title">Rule Setup</p>
                </div>
                <div class="setup-container">
                    <div class="sales-channel-category-container">
                        <p class="setup-title">Department</p>
                    </div>
                    <nitrozen-dropdown
                        label="Department"
                        :required="true"
                        class="setup-dropdown"
                        :items="departmentsDropdownList"
                        placeholder="Select Department"
                        v-model="selectedDepartment"
                        @change="handleDepartmentDropdown"
                        :searchable="true"
                        @searchInputChange="handleDepartmentDropdownSearch"
                    ></nitrozen-dropdown>
                    <nitrozen-dropdown
                        :disabled="isL3DropdownDisabled"
                        label="L3"
                        class="setup-dropdown"
                        :items="l3DropdownList"
                        placeholder="Select L3"
                        v-model="selectedL3"
                        :searchable="true"
                        @searchInputChange="handleL3DropdownSearch"
                    ></nitrozen-dropdown>
                </div>
                <div class="setup-container">
                    <div class="container">
                        <div class="caption">
                            <p class="setup-title">Product Return Reason</p>
                            <span class="setup-subtitle"
                                >Choose the level at which you wish to decide
                                the return window for products returned by
                                customers</span
                            >
                        </div>
                        <div class="search-filter">
                            <div class="search-box">
                                <div class="search">
                                    <nitrozen-dropdown
                                        :label="'Reason'"
                                        :required="true"
                                        :items="
                                            filterValues(
                                                this.parentReasonsDropdownList,
                                                this.chosenParentReasonsList
                                            )
                                        "
                                        :searchable="true"
                                        v-model="selectedParentReason"
                                        :multiple="false"
                                        placeholder="Search Reason"
                                        @change="handleParentReasonsDropdown"
                                        @searchInputChange="
                                            handleParentReasonsDropdownSearch
                                        "
                                    ></nitrozen-dropdown>
                                </div>
                            </div>
                        </div>
                        <div class="reason-container">
                            <adm-no-content
                                v-if="!chosenParentReasonsList.length"
                                :helperText="'No Reasons Selected'"
                            ></adm-no-content>
                            <draggable
                                :animation="200"
                                ghost-class="moving-card"
                                ref="drag"
                                v-model="chosenParentReasonsList"
                                handle=".reorder"
                            >
                                <div
                                    v-for="parentReason of chosenParentReasonsList"
                                    :key="parentReason.id"
                                    class="reason-item-container"
                                >
                                    <div class="reason-question-accordion">
                                        <div class="question-accordion-header">
                                            <div class="reason-name-container">
                                                <inline-svg
                                                    class="reorder"
                                                    src="reorder"
                                                ></inline-svg>
                                                <span
                                                    class="reason-display-name"
                                                    >{{
                                                        parentReason.display_name
                                                    }}</span
                                                >
                                            </div>
                                            <div class="reason-item-buttons">
                                                <span class="active-toggle"
                                                    >Active</span
                                                >
                                                <nitrozen-toggle-btn
                                                    v-model="
                                                        parentReason.is_active
                                                    "
                                                ></nitrozen-toggle-btn>
                                                <ukt-inline-svg
                                                    class="collapse-button"
                                                    @click.stop.native="
                                                        toggleParentReason(
                                                            parentReason.id
                                                        )
                                                    "
                                                    :src="
                                                        parentReason.collapse
                                                            ? 'arrow-top-black'
                                                            : 'arrow-dropdown-black'
                                                    "
                                                ></ukt-inline-svg>
                                                <ukt-inline-svg
                                                    class="collapse-button"
                                                    :src="'delete_new'"
                                                    @click.stop.native="
                                                        deleteParentReason(
                                                            parentReason.id
                                                        )
                                                    "
                                                ></ukt-inline-svg>
                                            </div>
                                        </div>
                                        <div
                                            class="reason-content-wrapper"
                                            v-if="parentReason.collapse"
                                        >
                                            <div
                                                v-for="(childReason,
                                                childReasonIndex) of parentReason.reasons"
                                                :key="childReason.id"
                                            >
                                                <div
                                                    class="sub-reason-container"
                                                >
                                                    <div
                                                        class="question-accordion-header"
                                                    >
                                                        <div
                                                            class="reason-name-container"
                                                        >
                                                            <span
                                                                class="reason-display-name"
                                                                >Sub Reason
                                                                {{
                                                                    parentReason
                                                                        .reasons
                                                                        .length ===
                                                                    1
                                                                        ? '*'
                                                                        : ''
                                                                }}</span
                                                            >
                                                        </div>
                                                        <div
                                                            class="reason-item-buttons"
                                                        >
                                                            <ukt-inline-svg
                                                                v-show="
                                                                    parentReason
                                                                        .reasons
                                                                        .length !==
                                                                        1
                                                                "
                                                                class="collapse-button"
                                                                :src="
                                                                    'delete_new'
                                                                "
                                                                @click.stop.native="
                                                                    deleteSubReason(
                                                                        parentReason.id,
                                                                        childReason.id
                                                                    )
                                                                "
                                                            ></ukt-inline-svg>
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="sub-reason-content"
                                                    >
                                                        <nitrozen-dropdown
                                                            :id="
                                                                `${parentReason.id}-${childReason.id}`
                                                            "
                                                            label="Reason"
                                                            class="reason-dropdown"
                                                            :items="[
                                                                ...filterValues(
                                                                    childReasonsDropdownList,
                                                                    selectedArrayOfReasons[
                                                                        collapsedReason
                                                                            .storedVal
                                                                    ]
                                                                ),
                                                                {
                                                                    value:
                                                                        childReason.id,
                                                                    text: childReason.id.split(
                                                                        '-|-'
                                                                    )[1]
                                                                }
                                                            ]"
                                                            placeholder="Choose Reason"
                                                            v-model="
                                                                childReason.id
                                                            "
                                                            :searchable="true"
                                                            @searchInputChange="
                                                                childReasonDropdownSearch
                                                            "
                                                            @change="
                                                                handleChildReasonsDropdown(
                                                                    $event,
                                                                    parentReason.storedVal
                                                                )
                                                            "
                                                        ></nitrozen-dropdown>
                                                        <div
                                                            class="qc-type-container"
                                                        >
                                                            <div
                                                                class="qc-type-element"
                                                                :class="
                                                                    childReason.qc_type ===
                                                                    'pre_qc'
                                                                        ? 'selected'
                                                                        : ''
                                                                "
                                                            >
                                                                <nitrozen-radio
                                                                    :disabled="
                                                                        childReason.id.includes(
                                                                            'default'
                                                                        )
                                                                    "
                                                                    :name="
                                                                        'pre_qc' +
                                                                            parentReason.id +
                                                                            childReason.id
                                                                    "
                                                                    :radioValue="
                                                                        'pre_qc'
                                                                    "
                                                                    v-model="
                                                                        childReason.qc_type
                                                                    "
                                                                    >Pre &amp;
                                                                    Door Quality
                                                                    Check</nitrozen-radio
                                                                >
                                                            </div>
                                                            <div
                                                                class="qc-type-element"
                                                                :class="
                                                                    childReason.qc_type ===
                                                                    'doorstep_qc'
                                                                        ? 'selected'
                                                                        : ''
                                                                "
                                                            >
                                                                <nitrozen-radio
                                                                    :disabled="
                                                                        childReason.id.includes(
                                                                            'default'
                                                                        )
                                                                    "
                                                                    :name="
                                                                        'doorstep_qc' +
                                                                            parentReason.id +
                                                                            childReason.id
                                                                    "
                                                                    :radioValue="
                                                                        'doorstep_qc'
                                                                    "
                                                                    v-model="
                                                                        childReason.qc_type
                                                                    "
                                                                    >Door
                                                                    Quality
                                                                    Check</nitrozen-radio
                                                                >
                                                            </div>
                                                            <div
                                                                class="qc-type-element"
                                                                :class="
                                                                    childReason.qc_type ===
                                                                    'no_qc'
                                                                        ? 'selected'
                                                                        : ''
                                                                "
                                                            >
                                                                <nitrozen-radio
                                                                    :disabled="
                                                                        childReason.id.includes(
                                                                            'default'
                                                                        )
                                                                    "
                                                                    :name="
                                                                        'no_qc' +
                                                                            parentReason.id +
                                                                            childReason.id
                                                                    "
                                                                    :radioValue="
                                                                        'no_qc'
                                                                    "
                                                                    @change="
                                                                        handleNoQC(
                                                                            parentReason.id,
                                                                            childReason.id
                                                                        )
                                                                    "
                                                                    v-model="
                                                                        childReason.qc_type
                                                                    "
                                                                    >No Quality
                                                                    Check
                                                                    Required</nitrozen-radio
                                                                >
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <nitrozen-dropdown
                                                                :disabled="
                                                                    childReason.qc_type ===
                                                                        'no_qc' ||
                                                                        childReason.id.includes(
                                                                            'default'
                                                                        )
                                                                "
                                                                :multiple="true"
                                                                label="Question"
                                                                class="question-dropdown"
                                                                :items="
                                                                    questionsList
                                                                "
                                                                placeholder="Choose Question"
                                                                v-model="
                                                                    childReason.question_set
                                                                "
                                                            ></nitrozen-dropdown>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div
                                                    v-if="
                                                        childReasonIndex ===
                                                            parentReason.reasons
                                                                .length -
                                                                1
                                                    "
                                                    @click="
                                                        addSubReason(
                                                            parentReason.id
                                                        )
                                                    "
                                                    class="add-rule-option"
                                                >
                                                    <div
                                                        class="vertical-line"
                                                    ></div>
                                                    <div class="box-type">
                                                        +
                                                    </div>
                                                </div>
                                                <div
                                                    v-else
                                                    class="add-rule-option"
                                                >
                                                    <div
                                                        class="vertical-line"
                                                    ></div>
                                                    <div
                                                        class="vertical-line"
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </draggable>
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
    NitrozenDropdown,
    NitrozenToggleBtn,
    NitrozenRadio,
    NitrozenInput,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import admNoContent from '@/components/common/adm-no-content.vue';
import AdmPageHeader from '@/components/common/layout/page-header.vue';
import RMAService from '@/services/rma.service';
import loader from '@/components/common/loader';
import Draggable from 'vuedraggable';
import { debounce } from '@/helper/utils';

export default {
    name: 'rma-setup-new',
    components: {
        InlineSvg,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenToggleBtn,
        NitrozenInput,
        NitrozenRadio,
        Draggable,
        AdmPageHeader,
        loader,
        'adm-no-content': admNoContent,
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-checkbox': NitrozenCheckBox
    },
    data() {
        return {
            pageLoading: false,
            departmentsDropdownList: [],
            selectedDepartment: null,
            l3DropdownList: [],
            selectedL3: null,
            parentReasonsDropdownList: [],
            childReasonsDropdownList: [],
            selectedParentReason: null,
            chosenParentReasonsList: [],
            parentReasonsDropdownSearchText: '',
            selectedArrayOfReasons: {},
            collapsedReason: {},
            questionsList: []
        };
    },
    computed: {
        isL3DropdownDisabled() {
            return this.selectedDepartment === null;
        },
        isSaveDisabled() {
            if (this.selectedDepartment === null) {
                return true;
            } else if (!this.chosenParentReasonsList.length) {
                return true;
            } else if (this.chosenParentReasonsList.length) {
                for (let parentRes of this.chosenParentReasonsList) {
                    for (let childRes of parentRes.reasons) {
                        if (childRes.id.includes('default')) {
                            return true;
                        } else if (
                            (childRes.qc_type === 'pre_qc' ||
                                childRes.qc_type === 'doorstep_qc') &&
                            childRes.question_set.length === 0
                        ) {
                            return true;
                        }
                    }
                }
            } else return false;
        }
    },
    watch: {
        parentReasonsDropdownSearchText(current, prev) {
            if (prev.length !== 0 && current.length === 0) {
                this.fetchParentReasonsList();
            }
        }
    },
    mounted() {
        this.init();
    },
    onDestroy() {
        this.departmentsDropdownList = [];
        this.selectedDepartment = null;
        this.l3DropdownList = [];
        this.selectedL3 = null;
        this.parentReasonsDropdownList = [];
        this.childReasonsDropdownList = [];
        this.selectedParentReason = null;
        this.chosenParentReasonsList = [];
        this.parentReasonsDropdownSearchText = '';
        this.selectedArrayOfReasons = {};
        this.collapsedReason = {};
        this.questionsList = [];
    },
    methods: {
        init() {
            this.fetchDepartmentsList();
            this.fetchParentReasonsList(['parent', 'child']);
            this.fetchQuestionsList();
        },
        goBack() {
            this.$router.back(-1);
        },
        showSnackBar(type, message, duration) {
            switch (type) {
                case 'error':
                    this.$snackbar.global.showError(message, { duration });
                    break;
                case 'success':
                    this.$snackbar.global.showSuccess(message, { duration });
                    break;
            }
        },
        handleDepartmentDropdown(selectedDept) {
            this.selectedL3 = null;
            this.fetchL3Categories(selectedDept.split('-|-')[0]);
        },
        handleDepartmentDropdownSearch: debounce(function({ text }) {
            this.fetchDepartmentsList(text);
        }, 300),
        handleL3DropdownSearch: debounce(function({ text }) {
            this.fetchL3Categories(
                this.selectedDepartment.split('-|-')[0],
                text
            );
        }, 300),
        filterValues(parent, child) {
            return parent.filter((el) => {
                return child.every((f) => {
                    return f.storedVal !== el.value;
                });
            });
        },
        handleParentReasonsDropdown(selectedRes) {
            setTimeout(() => {
                this.selectedParentReason = null;
            }, 0);
            const [id, display_name, is_active] = selectedRes.split('-|-');
            this.chosenParentReasonsList.push({
                storedVal: selectedRes,
                id: parseInt(id),
                display_name,
                is_active: is_active === 'true' ? true : false,
                collapse: false,
                reasons: [
                    {
                        id: 'default' + Math.random(),
                        display_name: null,
                        qc_type: 'doorstep_qc',
                        question_set: []
                    }
                ]
            });
            this.selectedArrayOfReasons[selectedRes] = [
                { storedVal: selectedRes }
            ];
            this.parentReasonsDropdownSearchText = '';
        },
        handleParentReasonsDropdownSearch: debounce(function({ text }) {
            this.parentReasonsDropdownSearchText = text;
            this.fetchParentReasonsList(['parent'], text);
        }, 300),
        toggleParentReason(reasonId) {
            this.chosenParentReasonsList.forEach((res) => {
                if (res.id === reasonId && !res.collapse) {
                    res.collapse = true;
                    this.collapsedReason = { ...res };
                } else {
                    res.collapse = false;
                }
            });
            this.fetchParentReasonsList(['child']);
        },
        deleteParentReason(reasonId) {
            this.chosenParentReasonsList = this.chosenParentReasonsList.filter(
                (res) => res.id !== reasonId
            );
        },
        addSubReason(reasonId) {
            const index = this.chosenParentReasonsList.findIndex(
                (res) => res.id === reasonId
            );
            this.chosenParentReasonsList[index].reasons.push({
                id: 'default' + Math.random(),
                display_name: null,
                qc_type: 'doorstep_qc',
                question_set: []
            });
            this.fetchParentReasonsList(['child']);
        },
        handleNoQC(parentReasonId, childReasonId) {
            const parentIndex = this.chosenParentReasonsList.findIndex(
                (parent) => parent.id === parentReasonId
            );
            let childIndex = this.chosenParentReasonsList[
                parentIndex
            ].reasons.findIndex((res) => res.id === childReasonId);
            this.chosenParentReasonsList[parentIndex].reasons[
                childIndex
            ].question_set = [];
        },
        handleChildReasonsDropdown(selectedRes, parentReasonId) {
            this.selectedArrayOfReasons[parentReasonId].push({
                storedVal: selectedRes
            });
        },
        childReasonDropdownSearch: debounce(function({ text }) {
            this.fetchParentReasonsList(['child'], text);
        }, 300),
        deleteSubReason(parentReasonId, childReasonId) {
            const parentReasonIndex = this.chosenParentReasonsList.findIndex(
                (parent) => parent.id === parentReasonId
            );
            let subReasons = JSON.parse(
                JSON.stringify(
                    this.chosenParentReasonsList[parentReasonIndex].reasons
                )
            );
            subReasons = subReasons.filter((sub) => sub.id !== childReasonId);
            this.chosenParentReasonsList[
                parentReasonIndex
            ].reasons = JSON.parse(JSON.stringify(subReasons));
        },
        fetchDepartmentsList(searchText = '') {
            this.pageLoading = true;
            const params = { page_no: 1, page_size: 100 };
            if (searchText.length) {
                params['search'] = searchText;
            }
            RMAService.getDepartments(params)
                .then((res) => {
                    if (res.status === 200) {
                        this.departmentsDropdownList = res.data.items.map(
                            (department) => {
                                return {
                                    value: `${department.uid}-|-${department.name}`,
                                    text: department.name
                                };
                            }
                        );
                    } else {
                        this.showSnackBar(
                            'error',
                            'Failed to get Departments List',
                            2000
                        );
                    }
                    this.pageLoading = false;
                })
                .catch(() => {
                    this.pageLoading = false;
                    this.showSnackBar(
                        'error',
                        'Failed to get Departments List',
                        2000
                    );
                });
        },
        fetchL3Categories(departments, searchText = '') {
            this.pageLoading = true;
            const query_params = {
                departments,
                level: 3,
                page_size: 100,
                page_number: 1
            };
            if (searchText.length) {
                query_params['q'] = searchText;
            }
            RMAService.getCategories(query_params)
                .then((res) => {
                    if (res.data.success) {
                        this.l3DropdownList = res.data.items.map((category) => {
                            return {
                                value: `${category.uid}-|-${category.name}`,
                                text: category.name
                            };
                        });
                    } else {
                        this.showSnackBar(
                            'error',
                            res.data.error.message,
                            2000
                        );
                    }
                    this.pageLoading = false;
                })
                .catch(() => {
                    this.pageLoading = false;
                    this.showSnackBar(
                        'error',
                        'Failed to get L3 Categories List',
                        2000
                    );
                });
        },
        fetchParentReasonsList(type = ['parent'], searchText = '') {
            this.pageLoading = true;
            const query_params = {
                page_no: 1,
                page_size: 100
            };
            if (searchText.length) {
                query_params['q'] = searchText;
            }
            RMAService.getReasons(query_params)
                .then((res) => {
                    if (res.data.success) {
                        let list = res.data.items.map((reason) => {
                            return {
                                value: `${reason.id}-|-${reason.display_name}-|-${reason.is_active}`,
                                text: reason.display_name
                            };
                        });
                        if (type.includes('child')) {
                            this.childReasonsDropdownList = JSON.parse(
                                JSON.stringify(list)
                            );
                        }
                        if (type.includes('parent')) {
                            this.parentReasonsDropdownList = JSON.parse(
                                JSON.stringify(list)
                            );
                        }
                    } else {
                        this.showSnackBar(
                            'error',
                            res.data.error.message,
                            2000
                        );
                    }
                    this.pageLoading = false;
                })
                .catch(() => {
                    this.pageLoading = false;
                    this.showSnackBar(
                        'error',
                        'Failed to get Reasons List',
                        2000
                    );
                });
        },
        fetchQuestionsList() {
            this.pageLoading = false;
            const query_params = {
                page_size: 9999,
                page_number: 1
            };
            RMAService.getQuestions(query_params)
                .then((res) => {
                    if (res.data.success) {
                        this.questionsList = res.data.items.map((question) => {
                            return {
                                value: `${question.id}-|-${question.display_name}`,
                                text: question.display_name
                            };
                        });
                    } else {
                        this.showSnackBar(
                            'error',
                            res.data.error.message,
                            2000
                        );
                    }
                })
                .catch(() => {
                    this.pageLoading = false;
                    this.showSnackBar(
                        'error',
                        'Failed to get Questions List',
                        2000
                    );
                });
        },
        saveRule() {
            this.pageLoading = true;
            const postData = {
                entity_type: this.selectedL3 !== null ? 'l3' : 'department',
                value:
                    this.selectedL3 !== null
                        ? this.selectedL3.split('-|-')[0]
                        : this.selectedDepartment.split('-|-')[0],
                channel: null,
                rule_type: this.$route.name.includes('global')
                    ? 'global'
                    : 'custom',
                conditions: {
                    department: this.selectedDepartment.split('-|-')[0]
                },
                meta: {
                    department: {
                        id: this.selectedDepartment.split('-|-')[0],
                        display_name: this.selectedDepartment.split('-|-')[1]
                    }
                },
                qc_enabled: true,
                is_active: true,
                actions: {
                    reasons: []
                }
            };
            if (this.selectedL3 !== null) {
                postData.meta['l3'] = {
                    id: this.selectedL3.split('-|-')[0],
                    display_name: this.selectedL3.split('-|-')[1]
                };
                postData.conditions['l3'] = this.selectedL3.split('-|-')[0];
            }
            const postReasonsData = [];
            for (let parent of this.chosenParentReasonsList) {
                let reasonsObj = {
                    id: parent.id,
                    display_name: parent.display_name,
                    qc_type: [],
                    question_set: [],
                    is_active: parent.is_active,
                    reasons: []
                };
                for (let child of parent.reasons) {
                    let childData = child.id;
                    let qcType =
                        child.qc_type === 'pre_qc'
                            ? ['pre_qc', 'doorstep_qc']
                            : child.qc_type === 'doorstep_qc'
                            ? ['doorstep_qc']
                            : [];
                    let questionSet = child.question_set.map((ques) => ({
                        id: parseInt(ques.split('-|-')[0]),
                        display_name: ques.split('-|-')[1]
                    }));
                    const subReasonsObj = {
                        reasons: [],
                        id: parseInt(childData.split('-|-')[0]),
                        display_name: childData.split('-|-')[1],
                        qc_type: [...qcType],
                        question_set: [...questionSet]
                    };
                    reasonsObj.reasons.push({ ...subReasonsObj });
                }
                postReasonsData.push({ ...reasonsObj });
            }
            postData.actions.reasons = [...postReasonsData];
            console.log('postReasonsData', postReasonsData);

            RMAService.postRule(postData)
                .then((res) => {
                    if (res.data.success) {
                        this.showSnackBar(
                            'success',
                            'Rule Created Successfully',
                            2000
                        );
                        this.isSaveDisabled = true;
                        this.$router.back();
                    } else {
                        this.showSnackBar(
                            'error',
                            res.data.error.message,
                            2000
                        );
                    }
                    this.pageLoading = false;
                })
                .catch(() => {
                    this.pageLoading = false;
                    this.showSnackBar('error', 'Failed to create rule', 2000);
                });
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.page-container {
    margin: 60px 0 0 0;
    flex-direction: column;
    border-radius: 12px;
    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }
    .setup-header {
        padding-bottom: 16px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid @Iron;
        align-items: center;
        p {
            align-self: center;
            font-size: 20px;
        }
    }
    .setup-title {
        font-size: 18px;
        color: #41434c;
        font-weight: 500;
        margin: 5px 0;
    }
    .setup-container {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-bottom: 1px solid @Iron;
        padding-bottom: 32px;
        margin-bottom: 25px;
        .sales-channel-category-container {
            margin-top: 24px;
        }
        .setup-dropdown {
            width: 30%;
            margin-top: 8px;
        }
        .sales-channel-subcategory-container {
            display: flex;
            justify-content: space-between;
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
        .caption {
            height: 45px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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
            }
        }
    }
}
.qc-active {
    padding-bottom: 0;
}
::v-deep .titlize {
    text-transform: capitalize;
    z-index: 6;
}
.moving-card {
    opacity: 0.5;
    background: #f7fafc;
    border: 1px solid #2e31be;
    border-radius: 4px;
}
.reorder {
    cursor: -webkit-grab;
}
</style>
