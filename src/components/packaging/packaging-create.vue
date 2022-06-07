<template>
    <div class="packaging-create-container">
        <div class="packaging-create-container-header">Extra Details</div>
        <div class="create-packaging-search-container">
            <nitrozen-input
                class="input w-l"
                :label="'Select your packaging'"
                :search="true"
                :showSearchIcon="true"
                :showTooltip="true"
                :tooltipText="searchTooltipText"
                :placeholder="searchPlacholder"
                v-model="searchInput"
            />
        </div>
        <div class="create-packaging-row-2">
            <div
                class="row-2-input"
                v-for="(input, index) of Object.keys(row2Inputs)"
                :key="'r2-input-' + index"
            >
                <nitrozen-input
                    class="input w-l"
                    :label="row2Inputs[input].label"
                    :required="true"
                    :placeholder="row2Inputs[input].placeholder"
                    v-model="row2Inputs[input].value"
                    type="number"
                    @blur="handleBlur('row2Inputs', input)"
                    @input="(val) => handleChange('row2Inputs', input, val)"
                    :disabled="!searchInput"
                />
                <nitrozen-error v-if="row2Inputs[input].error">
                    {{ row2Inputs[input].error }}
                </nitrozen-error>
            </div>
        </div>
        <div class="create-packaging-row-3">
            <div
                class="row-3-input"
                v-for="(input, index) of Object.keys(row3Inputs)"
                :key="'r3-input-' + index"
            >
                <nitrozen-input
                    class="input w-l"
                    :label="row3Inputs[input].label"
                    :required="true"
                    :placeholder="row3Inputs[input].placeholder"
                    v-model="row3Inputs[input].value"
                    type="number"
                    :showTooltip="row3Inputs[input].showToolTip"
                    :tooltipText="row3Inputs[input].toolTipText"
                    @blur="handleBlur('row3Inputs', input)"
                    @input="(val) => handleChange('row3Inputs', input, val)"
                    :disabled="
                        row3Inputs[input].isDisabled ? true : searchInput
                    "
                />
                <nitrozen-error v-if="row3Inputs[input].error">
                    {{ row3Inputs[input].error }}
                </nitrozen-error>
            </div>
        </div>
        <div class="toggle-container">
            <div class="toggle-container-l3-header">
                <p>L3 Categories</p>
                <nitrozen-toggle-btn
                    :value="l3Checked"
                    @change="handleToggleChange('l3')"
                />
            </div>
            <div class="toggle-container-l3-body" v-if="l3Checked">
                <nitrozen-dropdown
                    id="l3-dropdown"
                    :label="'Default L3 category'"
                    :tooltip="'Some tool tip text'"
                    :searchable="true"
                    :placeholder="'Search or select a category'"
                    :multiple="true"
                    :items="searchableCategoryList"
                    @change="(val) => handleCategoryChange(val)"
                    @searchInputChange="setCategoryList"
                />
                <div class="toggle-container-l3-list">
                    <div
                        v-for="(item, index) of selectedCategories"
                        :key="'selected-category' + index"
                        :id="'selected-category' + index"
                        class="toggle-container-l3-list-item"
                    >
                        <span class="l3-list-item-ellipsis" :title="item.text">
                            {{ item.text }}
                        </span>
                        <div @click="handleCategoryRemove(item, index)">
                            <inline-svg-vue
                                :src="'cross-grey'"
                                class="icon-cross"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="toggle-container">
            <div class="toggle-container-l3-header">
                <p>Bulk Packaging</p>
                <nitrozen-toggle-btn
                    :value="bulkChecked"
                    @change="handleToggleChange('bulk')"
                />
            </div>
            <div class="toggle-container-bulk-body" v-if="bulkChecked">
                <!-- Mapping the bulk packaging cards here -->
                <div
                    v-for="(item, index) of bulkPackaging"
                    :key="'bulk-packaging-card' + index"
                    class="bulk-packgaing-card"
                >
                    <bulk-packaging-card
                        :inputs="item"
                        :currentIndex="index"
                        :handleChange="handleBulkChange"
                        :handleBlur="handleBulkBlur"
                        :handleDelete="handleGroupDelete"
                        :handleToggleChange="handleBulkToggle"
                        :handleDropDownSelect="handleBulkDropdown"
                    />
                </div>
                <div class="toggle-container-bulk-body-button-container">
                    <nitrozen-button
                        :title="'Add Group'"
                        theme="secondary"
                        class="add-group-btn"
                        @click="handleAddGroup"
                    >
                        Add Group
                    </nitrozen-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenToggleBtn,
    NitrozenDropdown,
    NitrozenButton
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '../common/inline-svg.vue';
import BulkPackagingCard from './common/bulk-packaging-card.vue';
export default {
    name: 'packaging-create',
    components: {
        NitrozenInput,
        NitrozenError,
        NitrozenToggleBtn,
        NitrozenDropdown,
        inlineSvgVue,
        NitrozenButton,
        BulkPackagingCard
    },
    computed: {
        searchPlacholder() {
            return 'Search and select packaging from the list';
        }
    },
    data() {
        return {
            // TODO remove mock categories after API integration
            categoryList: [
                {
                    name: 'Fashion Sense',
                    uid: 1
                },
                {
                    name: 'Fashion ',
                    uid: 2
                },
                {
                    name: 'Garments',
                    uid: 3
                },
                {
                    name: 'Fashion dated',
                    uid: 4
                }
            ],
            searchInput: '',
            searchTooltipText: 'Tool tip text',
            row2Inputs: {
                length: {
                    label: 'Length (cm)',
                    placeholder: 'Enter length',
                    value: '',
                    error: ''
                },
                width: {
                    label: 'Width (cm)',
                    placeholder: 'Enter width',
                    value: '',
                    error: ''
                },
                height: {
                    label: 'Height (cm)',
                    placeholder: 'Enter height',
                    value: '',
                    error: ''
                }
            },
            row3Inputs: {
                orderThreshold: {
                    label: 'Maximum order threshold',
                    placeholder: '0',
                    value: '',
                    error: ''
                },
                weight: {
                    label: 'Weight(Kg)',
                    placeholder: 'Enter weight',
                    value: '',
                    error: '',
                    showToolTip: true,
                    toolTipText: 'weight Text'
                },
                errorRate: {
                    label: 'Error Rate',
                    placeholder: '0',
                    value: '',
                    error: ''
                },
                deadWeight: {
                    label: 'Dead Weight',
                    placeholder: '0',
                    value: '',
                    error: '',
                    isDisabled: true
                }
            },
            l3Checked: false,
            bulkChecked: false,
            selectedCategories: [],
            searchableCategoryList: [],
            bulkPackaging: [],
            bulkInput: {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '',
                        error: ''
                    }
                }
            }
        };
    },
    mounted() {
        this.setCategoryList();
    },
    methods: {
        /**
         * @author Rohan Shah
         * @param {Number} index | index position
         * @param {Number} toggleVal | Value from the drop down input
         * @description Set the drop down selection value of a group category
         */
        handleBulkDropdown(index, val){
            this.bulkPackaging[index].categoryConfig = val
        },
        /**
         * @author Rohan Shah
         * @param {Number} index | index position
         * @param {Boolean} toggleVal | Boolean val 
         * @description Toggle the value based on user selection
         */
        handleBulkToggle(index, toggleVal) {
            this.bulkPackaging[index].toggle.val = !toggleVal;
            // if the value is true
            if (this.bulkPackaging[index].toggle.val) {
                // then disable all the other toggles and set every value as false
                this.bulkPackaging.forEach((a, indexPos) => {
                    if (index != indexPos) {
                        this.bulkPackaging[indexPos].toggle.val = false;
                        this.bulkPackaging[indexPos].toggle.disabled = true;
                    }
                });
            } else {
                // if not then set disable value for all to be false
                // so that user can make a selection
                this.bulkPackaging.forEach((a, indexPos) => {
                    if (index != indexPos) {
                        this.bulkPackaging[indexPos].toggle.disabled = false;
                    }
                });
            }
        },
        handleGroupDelete(index) {
            this.bulkPackaging.splice(index, 1);
        },
        /**
         * @author Rohan Shah
         * @description Checks if there are errors in the previous inputs,
         * if not then adds new card
         */
        handleAddGroup() {
            // TODO check if this can be done through state
            let input = {
                toggle: {
                    val: false,
                    disabled: false
                },
                categoryConfig: '',
                volumetricWeight: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Volumetric Weight',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Volumetric Weight',
                        value: '',
                        error: ''
                    }
                },
                quantity: {
                    minimum: {
                        label: 'Minimum',
                        placeholder: 'Minimum Quantity',
                        value: '',
                        error: ''
                    },
                    maximum: {
                        label: 'Maximum',
                        placeholder: 'Maximum Quantity',
                        value: '',
                        error: ''
                    }
                }
            };
            // error handler call here
            this.bulkPackaging.push(input);
        },
        /**
         *
         * @author Rohan Shah
         * @description Generate category list based on user input
         * Designed to return all when called first time or without any input
         */
        setCategoryList(e = {}) {
            this.searchableCategoryList = [];
            // TODO loop through state list
            this.categoryList.forEach((a) => {
                if (
                    !e.text ||
                    a.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.searchableCategoryList.push({
                        text: a.name,
                        value: a.uid
                    });
                }
            });
        },
        /**
         *
         * @author Rohan Shah
         * @description loops through the selected array of categories from the dropdown
         * and updates a new list only for display purpose and request body purpose
         */
        handleCategoryChange(categoryArr) {
            let tempCategoryArry = [];
            categoryArr.forEach((category) => {
                let categoryObj = this.searchableCategoryList.find(
                    (a) => a.value == category
                );
                tempCategoryArry.push(categoryObj);
            });
            this.selectedCategories = tempCategoryArry;
        },
        /**
         *
         * @author Rohan Shah
         * @description Handles selected category removal and change the selected
         * state in the drop down as well
         */
        handleCategoryRemove(category, index) {
            // remove the element from selected array
            this.selectedCategories.splice(index, 1);
            // TODO figure out how to remove selected state after this
        },
        /**
         *
         * @author Rohan Shah
         * @param {String} obj | state value / key that has to be updated
         * @param {String} input | Actual key input where the update has to be made
         * @description Handle blur and check for errors if found then show the error
         *
         */
        handleBlur(obj, key) {
            if (this[obj][key] && !this[obj][key].value)
                this[obj][
                    key
                ].error = `${this[obj][key].label} is a mandatory field`;
        },
        /**
         *
         * @author Rohan Shah
         * @param {String} obj | Key origin where data is to updated Volumetric / Quantity
         * @param {String} input | Actual key input where the update has to be made Minimum / Maximum
         * @param {Number} index | Index position
         * @description Handles the blur for all bulk location related fields
         */
        handleBulkBlur(obj, input, index) {
            if (
                this.bulkPackaging[index][obj][input] &&
                !this.bulkPackaging[index][obj][input].value
            ) {
                this.bulkPackaging[index][obj][
                    input
                ].error = `${this.bulkPackaging[index][obj][input].label} should have some value`;
            }
        },
        /**
         *
         * @author Rohan Shah
         * @param {String} obj | state value / key that has to be updated
         * @param {String} input | Actual key input where the update has to be made
         * @description Handle input change and save values in the state object
         */
        handleChange(obj, input, val) {
            this[obj][input].value = val;
            this[obj][input].error = '';
            this.calculateDeadWeight();
        },
        /**
         *
         * @author Rohan Shah
         * @param {String} obj | Key origin where data is to updated Volumetric / Quantity
         * @param {String} input | Actual key input where the update has to be made Minimum / Maximum
         * @param {Number} index | Index position
         * @description Handles the inputs for bulk packaging related input fields
         */
        handleBulkChange(obj, input, val, index) {
            this.bulkPackaging[index][obj][input].value = val;
            this.bulkPackaging[index][obj][input].error = '';
        },
        /**
         * @author Rohan Shah
         * @description Calculates the deadwieght if all length, width, height are present
         * else it resets it to empty / 0
         */
        calculateDeadWeight() {
            let field = this.row2Inputs;
            if (
                field['length'].value &&
                field['width'].value &&
                field['height'].value
            ) {
                let deadWeight =
                    (field['length'].value *
                        field['width'].value *
                        field['height'].value) /
                    5000;
                this.row3Inputs['deadWeight'].value = deadWeight;
            } else {
                this.row3Inputs['deadWeight'].value = '';
            }
        },
        /**
         * @author Rohan Shah
         * @description create request object and dispatch the service to save the packaging product
         */
        savePackagingOrder() {},
        /**
         * @author Rohan SHah
         * @description Toggle flags based on the type input
         */
        handleToggleChange(type) {
            switch (type) {
                case 'l3':
                    this.l3Checked = !this.l3Checked;
                    break;
                case 'bulk':
                    this.bulkChecked = !this.bulkChecked;
                    if (this.bulkPackaging.length == 0) {
                        // Initialize the array with 1 input field group
                        this.bulkPackaging.push(this.bulkInput);
                    }
                default:
                    break;
            }
        }
    }
};
</script>

<style lang="less">
@import '../../less/packaging/packaging-create.less';
</style>
