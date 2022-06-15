<template>
    <div class="packaging-create-container">
        <div class="packaging-create-container-header">Extra Details</div>
        <div class="create-packaging-search-container">
            <nitrozen-input
                id="select-packaging"
                class="input w-l"
                :label="'Select your packaging'"
                :showSearchIcon="true"
                :showTooltip="true"
                :tooltipText="searchTooltipText"
                :placeholder="searchPlacholder"
                v-model="searchInput"
                @input="handleSearchInput"
            />
            <div class="packaging-search-list-container" v-if="showSearchList">
                <div v-if="searchedProductList.length > 0">
                    <div
                        class="packaging-search-list-row"
                        v-for="(item, index) of searchedProductList"
                        :key="'packaging-product' + index"
                        @click="handlePackagingProductClicked(item)"
                    >
                        <div class="packaging-search-list-row-image">
                            <img
                                :src="item.image"
                                :alt="item.name"
                                :id="'packaging-image' + index"
                            />
                        </div>
                        <span
                            class="packaging-search-list-row-name"
                            :id="'packaging-name' + index"
                            >{{ item.name }}</span
                        >
                        <span
                            class="packaging-search-list-row-dimension"
                            :id="'packaging-dimension' + index"
                            >{{ item.dimension || 'NA' }}</span
                        >
                    </div>
                </div>
                <div
                    v-else
                    class="packaging-search-list-row no-products"
                    :id="'product-not-found'"
                >
                    No products found
                </div>
            </div>
        </div>
        <div class="create-packaging-row-2">
            <div
                class="row-2-input"
                v-for="(input, index) of Object.keys(row2Inputs)"
                :key="'r2-input-' + index"
            >
                <nitrozen-input
                    :id="'row2-' + index"
                    class="input w-l"
                    :label="row2Inputs[input].label"
                    :required="true"
                    :placeholder="row2Inputs[input].placeholder"
                    v-model="row2Inputs[input].value"
                    type="number"
                    @blur="handleBlur('row2Inputs', input)"
                    @input="(val) => handleChange('row2Inputs', input, val)"
                    :disabled="!packagingSelected"
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
                    :id="'row3-' + index"
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
                        row3Inputs[input].isDisabled ? true : !packagingSelected
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
                    :disabled="!packagingSelected"
                />
            </div>
            <!-- Call to reusable component to select multiple categories 
            only show if the l3Checked flag is true
            -->
            <category-multi-select
                v-if="l3Checked"
                :handleCategoryChange="handleCategoryChange"
                :handleCategoryRemove="handleCategoryRemove"
                :searchableCategoryList="searchableCategoryList"
                :selectedCategories="selectedCategories"
                :setCategoryList="setCategoryList"
                :categoryValue="categoryValue"
            />
        </div>
        <div class="toggle-container">
            <div class="toggle-container-l3-header">
                <p>Bulk Packaging</p>
                <nitrozen-toggle-btn
                    :value="bulkChecked"
                    @change="handleToggleChange('bulk')"
                    :disabled="!packagingSelected"
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
                        :id="'add-group'"
                        :title="'Add Group'"
                        theme="secondary"
                        :class="{
                            'add-group-btn': true,
                            opaque: checkGroupCategoryError
                        }"
                        @click="handleAddGroup"
                        :disabled="checkGroupCategoryError"
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
import CategoryMultiSelect from './common/category-multi-select.vue';
import { debounce } from '@/helper/utils';
import { mapGetters } from 'vuex';
import {
    GET_EDIT_PRODUCT,
    GET_PACKAGING_PRODUCTS
} from '../../store/getters.type';
import { generateProductRequest } from '../../helper/utils';
export default {
    name: 'packaging-create',
    components: {
        NitrozenInput,
        NitrozenError,
        NitrozenToggleBtn,
        NitrozenDropdown,
        inlineSvgVue,
        NitrozenButton,
        BulkPackagingCard,
        CategoryMultiSelect
    },
    computed: {
        searchPlacholder() {
            return 'Search and select packaging from the list';
        },
        ...mapGetters({
            products: GET_PACKAGING_PRODUCTS,
            editProduct: GET_EDIT_PRODUCT
        })
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
            },
            categoryValue: [],
            packagingSelected: false,
            searchedProductList: [],
            selectedPackage: {},
            showSearchList: false
        };
    },
    mounted() {
        this.setCategoryList();
        this.setEditProduct();
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Handle edit by appending values to
         * the state from the store state value
         */
        setEditProduct() {
            // get query param
            let isEdit = this.$router.currentRoute.query.type;
            // if there is a query param only then execute
            if (isEdit) {
                let tempRow2 = this.row2Inputs;
                let tempRow3 = this.row3Inputs;
                Object.keys(tempRow2).forEach((item) => {
                    tempRow2[item].value = this.editProduct[item];
                });
                Object.keys(tempRow3).forEach((item) => {
                    tempRow3[item].value = this.editProduct[item];
                });
            }
        },
        /**
         * @author Rohan Shah
         * @description Handles the search input for packaging products
         * debounce after 1.5 seconds then executes the function and filters based on user input
         * @param {String} | input
         */
        handleSearchInput: debounce(async function(input) {
            // if there is no input in search then clear the searchedProductList array
            if (!input) {
                this.searchedProductList = [];
                this.packagingSelected = false;
                this.showSearchList = false;
                return;
            }
            // if not then check if input has 3 or more characters
            if (input.length >= 3) {
                let productList = this.products;
                // filter the list and save in temp var
                let filteredList = productList.filter((item) =>
                    item.name.toLowerCase().includes(input.toLowerCase())
                );
                // set to state
                this.searchedProductList = filteredList;
                this.showSearchList = true;
            }
        }, 1500),
        /**
         * @author Rohan Shah
         * @param {Object} item
         * @description TODO
         */
        handlePackagingProductClicked(item) {
            this.selectedPackage = item;
            this.packagingSelected = true;
            this.showSearchList = false;
            this.searchInput = item.name;
            this.searchedProductList = [];
        },
        /**
         * @author Rohan Shah
         * @param {Number} index | index position
         * @param {Number} toggleVal | Value from the drop down input
         * @description Set the drop down selection value of a group category
         */
        handleBulkDropdown(index, val) {
            this.bulkPackaging[index].categoryConfig = val;
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
            let tempCategoryArr = [];
            categoryArr.forEach((category) => {
                let categoryObj = this.searchableCategoryList.find(
                    (a) => a.value == category
                );
                tempCategoryArry.push(categoryObj);
                // push only the unique value / id in the array to maintain selection list
                tempCategoryArr.push(categoryObj.value);
            });
            // assign the values to state variables
            this.selectedCategories = tempCategoryArry;
            this.categoryValue = tempCategoryArr;
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
            // Find the index by value
            let valIndex = this.categoryValue.findIndex(
                (ele) => ele == category.value
            );
            // remove the index so it is unselected from the drop down as well
            this.categoryValue.splice(valIndex, 1);
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
        savePackagingOrder() {
            let product = {
                bulkChecked: this.bulkChecked,
                l3Checked: this.l3Checked,
                l3Categories,
                bulkPackaging,
                l3Categories: this.selectedCategories,
                bulkPackaging: []
            };
            // map the input field values for row2 and row3 inputs
            Object.keys(this.row2Inputs).forEach((key) => {
                product[key] = this.row2Inputs[key].value;
            });
            Object.keys(this.row3Inputs).forEach((key) => {
                product[key] = this.row3Inputs[key].value;
            });
            this.bulkPackaging.forEach((group) => {
                let bulkObj = {
                    is_default_packaging_material: group.toggle.value,
                    // TODO update this once API works
                    group_category: group.categoryConfig,
                    quantity: {
                        max: group.quantity.maximum.value,
                        min: group.quantity.minimum.value
                    },
                    volumetric_weight: {
                        max: group.volumetricWeight.maximum.value,
                        min: group.volumetricWeight.minimum.value
                    }
                };
                // push the created object in the product obj
                product.bulkPackaging.push(bulkObj);
            });
            // return the request body for create/update product object
            return generateProductRequest(product);
        },
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
        },
        /**
         * @author Rohan Shah
         * @description Loops through the category cards array and checks for errors or null values
         * if found then sets the flag as true else false as default
         * @returns Boolean value
         */
        checkGroupCategoryError() {
            let isError = false;
            this.bulkPackaging.forEach((a) => {
                if (
                    a.volumetricWeight.error ||
                    !a.volumetricWeight.val ||
                    a.quantity.error ||
                    !a.quantity.val ||
                    !a.categoryConfig
                ) {
                    isError = true;
                    return;
                }
            });
            return isError;
        }
    }
};
</script>

<style lang="less">
@import '../../less/packaging/packaging-create.less';
</style>
