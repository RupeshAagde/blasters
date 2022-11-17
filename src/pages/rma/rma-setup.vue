<template>
    <div class="panel">
        <div class="main-container">
            <div class="page-container">
                <div class="setup-header">
                    <p class="setup-title">Rule Setup</p>
                    <nitrozen-button
                        :disabled="
                            shouldDisableSaveReasons || shouldDisableSaveDept
                        "
                        v-flat-btn
                        :rounded="false"
                        :theme="'secondary'"
                        @click="save()"
                    >
                        Save
                    </nitrozen-button>
                </div>
                <div class="setup-container">
                    <div class="sales-channel-category-container">
                        <p class="setup-title">Department</p>
                    </div>
                    <nitrozen-dropdown
                        label="Department"
                        class="platform-dropdown"
                        :items="departmentsDropdownList"
                        placeholder="Select Department"
                        v-model="selectedDepartment"
                        @change="handleDepartmentDropdown"
                        :searchable="true"
                        @searchInputChange="onSearchDepartmentDropdownList"
                    ></nitrozen-dropdown>
                    <nitrozen-dropdown
                        :disabled="selectedDepartment === ''"
                        label="L3"
                        class="platform-dropdown"
                        :items="l3DropdownList"
                        placeholder="Select L3"
                        v-model="selectedL3"
                        @change="handleL3Dropdown"
                        :searchable="true"
                        @searchInputChange="onSearchL3DropdownList"
                    ></nitrozen-dropdown>
                </div>
                <div class="setup-container">
                    <product-return-qc
                        @getSelectedReasons="getSelectedReasons"
                        @disableSave="disableSave"
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
import RMAService from '@/services/rma.service';
import { debounce } from '@/helper/utils';

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
            departmentsDropdownList: [],
            l3DropdownList: [],
            selectedDepartment: '',
            selectedL3: '',
            salesChannelSearchText: '',
            departmentSearchText: '',
            l3SearchText: '',
            shouldDisableSaveReasons: true,
            shouldDisableSaveDept: true,
            reasonsData: []
        };
    },
    mounted() {
        this.fetchDepartmentsList();
    },
    updated() {
        if (this.selectedDepartment.length !== 0) {
            this.shouldDisableSaveDept = false;
        } else {
            this.shouldDisableSaveDept = true;
        }
        console.log(this.shouldDisableSaveReasons, this.shouldDisableSaveDept);
    },
    methods: {
        handleDepartmentDropdown() {
            console.log('handleDepartmentDropdown');
            this.getCategoryTypes();
        },
        handleL3Dropdown() {
            console.log('handleL3Dropdown');
        },
        onSearchDepartmentDropdownList: debounce(function(e) {
            console.log('onSearchDepartmentDropdownList', e);
            this.departmentSearchText = e.text;
            this.fetchDepartmentsList();
        }, 300),
        onSearchL3DropdownList: debounce(function(e) {
            console.log('onSearchL3DropdownList', e);
            this.l3SearchText = e.text;
            this.getCategoryTypes();
        }, 300),
        getSelectedReasons(selectedReasons) {
            console.log('selectedReasons', selectedReasons);
            this.reasonsData = [...selectedReasons];
        },
        disableSave(disable) {
            console.log('dis', disable);
            this.shouldDisableSaveReasons = disable;
        },
        save() {
            console.log('save');
            console.log(
                'savepost',
                this.selectedDepartment,
                this.selectedL3,
                this.reasonsData
            );
            const postData = {
                entity_type: this.selectedL3.length === 0 ? 'department' : 'l3',
                value:
                    this.selectedL3.length === 0
                        ? this.selectedDepartment.split('--')[0]
                        : this.selectedL3.split('--')[0],
                channel: null,
                rule_type: 'global',
                qc_enabled: true,
                is_active: true,
                meta: {
                    department: {
                        id: this.selectedDepartment.split('--')[0],
                        display_name: this.selectedDepartment.split('--')[1]
                    }
                },
                actions: {
                    reasons: []
                }
            };
            if (this.selectedL3.length !== 0) {
                postData.conditions[
                    'department'
                ] = this.selectedDepartment.split('--')[0];
                postData.meta['l3'] = {
                    id: this.selectedL3.split('--')[0],
                    display_name: this.selectedL3.split('--')[1]
                };
            }

            const reasonsPostData = [];
            for (let selectedReason of this.reasonsData) {
                const reasonsObj = {
                    id: selectedReason.id,
                    display_name: selectedReason.display_name,
                    qc_type: [],
                    question_set: [],
                    is_active: selectedReason.is_active,
                    reasons: []
                };
                const subReasonsData = selectedReason.reasons;
                for (let sub of subReasonsData) {
                    let qc_selected = [];
                    if (sub.qc_type === 'pre_qc') {
                        qc_selected = ['pre_qc', 'doorstep_qc'];
                    } else if (sub.qc_type === 'doorstep_qc') {
                        qc_selected = ['doorstep_qc'];
                    }
                    const questionSetFormat = sub.question_set.map((ques) => ({
                        id: ques.split('--')[0],
                        display_name: ques.split('--')[1]
                    }));
                    const subReasonsObj = {
                        id: sub.reasonDetails.id,
                        display_name: sub.reasonDetails.display_name,
                        qc_type: qc_selected,
                        question_set: questionSetFormat,
                        reasons: []
                    };
                    reasonsObj.reasons.push({ ...subReasonsObj });
                }
                reasonsPostData.push({ ...reasonsObj });
            }
            postData.actions['reasons'] = [...reasonsPostData];
            console.log('postdata', postData);

            RMAService.postRule(postData)
                .then((res) => {
                    if (res.data.success) {
                        this.$snackbar.global.showSuccess(
                            'Rule Created Successfully',
                            { duration: 2000 }
                        );
                    } else {
                        this.$snackbar.global.showError(
                            res.data.error.message,
                            { duration: 2000 }
                        );
                    }
                })
                .catch(() => {
                    this.$snackbar.global.showError('Failed to create Rule', {
                        duration: 2000
                    });
                });
        },
        fetchDepartmentsList() {
            const param = {
                search: this.departmentSearchText
            };
            RMAService.getDepartments(param)
                .then((res) => {
                    this.departmentsDropdownList = res.data.items.map(
                        (department) => {
                            return {
                                id: department.id,
                                value: `${department.uid}--${department.name}`,
                                text: department.name
                            };
                        }
                    );
                })
                .catch(() =>
                    this.$snackbar.global.showError(
                        'Failed to get Departments List',
                        { duration: 2000 }
                    )
                );
        },
        getCategoryTypes() {
            const query_params = {
                departments: this.selectedDepartment.split('--')[0],
                page_size: 50,
                page_number: 1,
                search: this.l3SearchText
            };
            RMAService.getCategories(query_params)
                .then((res) => {
                    this.l3DropdownList = res.data.items.map((category) => {
                        return {
                            id: category.uid,
                            value: `${category.uid}--${category.name}`,
                            text: category.name
                        };
                    });
                })
                .catch(() =>
                    this.$snackbar.global.showError(
                        'Failed to get L3 Subcategories',
                        { duration: 2000 }
                    )
                );
        }
    },
    beforeDestroy(){
        if(localStorage.getItem('rma_rule_data')) localStorage.removeItem('rma_rule_data')
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
    }
}

::v-deep .titlize {
    text-transform: capitalize;
    position: initial;
    width: auto;
    z-index: 6;
}
</style>
