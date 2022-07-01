<template>
    <div class="packaging-create-container">
        <div class="packaging-create-container-header">
            <span id="packaging-create-container-header">Extra Details</span>
            <span class="packaging-subtitle"
                >Select and configure a return window for your sales
                channel</span
            >
        </div>
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
                <div v-if="!showListLoader">
                    <div v-if="searchedProductList.length > 0">
                        <div
                            class="packaging-search-list-row"
                            v-for="(item, index) of searchedProductList"
                            :key="'packaging-product' + index"
                            @click="handlePackagingProductClicked(item)"
                        >
                            <div class="packaging-search-list-row-image">
                                <img
                                    :src="item.media[0].url"
                                    :alt="item.name"
                                    :id="'packaging-image' + index"
                                />
                            </div>
                            <span
                                class="packaging-search-list-row-name"
                                :id="'packaging-name' + index"
                                >{{ item.name }}</span
                            >
                            <!-- <span
                            class="packaging-search-list-row-dimension"
                            :id="'packaging-dimension' + index"
                            >{{ item.dimension || 'NA' }}</span
                        > -->
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
                <div v-else>
                    <loader />
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
                    :value="row2Inputs[input].value"
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
                    :value="row3Inputs[input].value"
                />
                <nitrozen-error v-if="row3Inputs[input].error">
                    {{ row3Inputs[input].error }}
                </nitrozen-error>
            </div>
        </div>
        <div class="toggle-container">
            <div class="toggle-container-l3-header">
                <p>
                    Lvl.3 Categories
                    <nitrozen-tooltip
                        :position="'top'"
                        :tooltipText="
                            'Choose the L3 categories whose single quantity would fit inside the packaging material'
                        "
                    />
                </p>
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
        <div class="toggle-container l3-container">
            <div class="toggle-container-l3-header custom-header">
                <p>
                    Bulk Packaging
                    <nitrozen-tooltip
                        :position="'top'"
                        :tooltipText="'TBC text'"
                    />
                </p>
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
                        :groupCategories="groupCategories"
                        :dropDownValue="item.categoryConfig"
                    />
                </div>
                <div class="toggle-container-bulk-body-button-container">
                    <nitrozen-button
                        :id="'add-group'"
                        :title="'Add Group'"
                        theme="secondary"
                        :class="{
                            'add-group-btn': true,
                            'opaque-custom': checkGroupCategoryError()
                        }"
                        @click="handleAddGroup"
                        :disabled="checkGroupCategoryError()"
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
    NitrozenButton,
    NitrozenTooltip
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
import {
    FETCH_COMPANY_PRODUCTS,
    FETCH_GROUP_CATEGORIES,
    FETCH_L3_CATEGORIES
} from '../../store/action.type';
import Loader from '../common/loader.vue';
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
        CategoryMultiSelect,
        Loader,
        NitrozenTooltip
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
    props: {
        toggleBtn: {
            type: Function
        }
    },
    data() {
        return {
            searchInput: '',
            searchTooltipText:
                'Choose an item you wish to use as a packaging material, and fill its details',
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
                    placeholder: 'Enter maximum orders allowed',
                    value: '',
                    error: ''
                },
                weight: {
                    label: 'Weight (in kg)',
                    placeholder: 'Enter weight',
                    value: '',
                    error: '',
                    showToolTip: true,
                    toolTipText:
                        'Weight of a single packaging material measured in kilograms'
                },
                errorRate: {
                    label: 'Error rate (in %)',
                    placeholder: 'Enter error rate',
                    value: '',
                    error: '',
                    toolTipText:
                        'The percentage of space that would remain unfilled inside the packaging material after putting the product(s)',
                    showToolTip: true
                },
                deadWeight: {
                    label: 'Dead weight (in kg)',
                    placeholder: '0',
                    value: '',
                    error: '',
                    isDisabled: true,
                    toolTipText:
                        'The volumetric weight of packaging material calculated using the formula (Length*Breadth*Height/5000)',
                    showToolTip: true
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
            selectedPackage: '',
            showSearchList: false,
            groupCategories: [],
            showListLoader: true
        };
    },
    mounted() {
        this.setCategoryList();
        this.setEditProduct();
        this.getGroupCategories();
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Checks for multiple conditions to toggle the save button
         */
        checkForButtonToggle() {
            let disableButton = false;
            if (this.l3Checked && !this.selectedCategories.length)
                disableButton = true;
            else if (this.bulkChecked && this.checkGroupCategoryError())
                disableButton = true;
            else if (!this.selectedPackage) disableButton = true;
            // map the input field values for row2 and row3 inputs
            Object.keys(this.row2Inputs).forEach((key) => {
                if (
                    !this.row2Inputs[key].value.toString().length ||
                    this.row2Inputs[key].error
                )
                    disableButton = true;
            });
            Object.keys(this.row3Inputs).forEach((key) => {
                if (
                    !this.row3Inputs[key].value.toString().length ||
                    this.row3Inputs[key].error
                )
                    disableButton = true;
            });
            this.toggleBtn(disableButton);
        },
        /**
         * @author Rohan Shah
         * @decsription Gets all group categories for drop down
         */
        getGroupCategories() {
            this.$store
                .dispatch(FETCH_GROUP_CATEGORIES, { page_size: 1000 })
                .then((res) => {
                    if (res.error) {
                        // call snackbar and return
                        return this.$snackbar.global.showError(
                            'Could not fetch category configurations'
                        );
                    }
                    const { items } = res;
                    let temp = items;
                    temp.forEach((item) => {
                        item.text = item.name;
                        item.value = item._id;
                    });
                    this.groupCategories = temp;
                });
        },
        /**
         * @author Rohan Shah
         * @description Handle edit by appending values to
         * the state from the store state value
         */
        async setEditProduct() {
            if (Object.keys(this.editProduct).length != 0) {
                this.searchInput = this.editProduct.product.name;
                this.l3Checked = this.editProduct.is_l3_specific;
                this.packagingSelected = true;
                this.bulkChecked = this.editProduct.is_bulk;
                this.selectedPackage = this.editProduct.item_id;
                this.row3Inputs.errorRate.value = this.editProduct.error_rate;
                this.row3Inputs.deadWeight.value = this.editProduct.dead_weight_in_kg;
                this.row3Inputs.weight.value = this.editProduct.weight;
                this.row3Inputs.orderThreshold.value = this.editProduct.maximum_order;
                Object.keys(this.row2Inputs).forEach((key) => {
                    this.row2Inputs[key].value = this.editProduct.dimensions[
                        key
                    ];
                });
                // if the l3 drop down is checked then replace the state array with BE value
                if (this.l3Checked) {
                    this.$store
                        .dispatch(FETCH_L3_CATEGORIES, { is_active: true })
                        .then((data) => {
                            if (!data.error) {
                                this.selectedCategories = [];
                                this.categoryValue = this.editProduct.default_package.l3_categories;
                                this.editProduct.default_package.l3_categories.forEach(
                                    (id) => {
                                        let category = data
                                            .map((a) => {
                                                if (a.uid == id) return a;
                                            })
                                            .filter((a) => a !== undefined)[0];
                                        if (category) {
                                            category.text = category.name;
                                            category.value = category.uid;
                                            this.selectedCategories.push(
                                                category
                                            );
                                        }
                                    }
                                );
                            }
                        });
                }
                // only if the bulkchecked option is true
                if (this.bulkChecked) {
                    let tempBulkPackaging = [];
                    let bulkInput = this.bulkInput;
                    // loop through the data obtained from the BE and update the state
                    this.editProduct.l3_mapping.forEach((item) => {
                        bulkInput.toggle.val =
                            item.is_default_packaging_material;
                        bulkInput.volumetricWeight.minimum.value =
                            item.volumetric_weight.min;
                        bulkInput.volumetricWeight.maximum.value =
                            item.volumetric_weight.max;
                        bulkInput.quantity.minimum.value = item.quantity.min;
                        bulkInput.quantity.maximum.value = item.quantity.max;
                        bulkInput.categoryConfig = item.group_category;
                        tempBulkPackaging.push(bulkInput);
                    });
                    this.bulkPackaging = tempBulkPackaging;
                }

                this.checkForButtonToggle();
            }
        },
        /**
         * @author Rohan Shah
         * @description Handles the search input for packaging products
         * debounce after 1.5 seconds then executes the function and filters based on user input
         * @param {String} | input
         */
        handleSearchInput: debounce(async function(input) {
            this.showListLoader = true;
            // if there is no input in search then clear the searchedProductList array
            if (!input) {
                this.searchedProductList = [];
                this.packagingSelected = false;
                this.showSearchList = false;
                this.showListLoader = false;
                return;
            }
            this.$store
                .dispatch(FETCH_COMPANY_PRODUCTS, { q: input })
                .then((res) => {
                    const { items } = res;
                    if (items.length) {
                        let productList = items;
                        this.searchedProductList = productList;
                        this.checkForButtonToggle();
                    }
                    this.showListLoader = false;
                    this.showSearchList = true;
                });
        }, 1000),
        /**
         * @author Rohan Shah
         * @param {Object} item
         * @description Updates state value with required item name and uids
         * and toggles certain flags for UI changes
         */
        handlePackagingProductClicked(item) {
            this.selectedPackage = item.uid;
            this.packagingSelected = true;
            this.showSearchList = false;
            this.searchInput = item.name;
            this.searchedProductList = [];
            this.checkForButtonToggle();
        },
        /**
         * @author Rohan Shah
         * @param {Number} index | index position
         * @param {Number} toggleVal | Value from the drop down input
         * @description Set the drop down selection value of a group category
         */
        handleBulkDropdown(index, val) {
            // TODO Check if the val can be an ID
            this.bulkPackaging[index].categoryConfig = val;
            this.checkForButtonToggle();
        },
        /**
         * @author Rohan Shah
         * @param {Number} index | index position
         * @param {Boolean} toggleVal | Boolean val
         * @description Toggle the value based on user selection
         */
        handleBulkToggle(index, toggleVal) {
            this.bulkPackaging[index].toggle.val = !toggleVal;
            this.checkForButtonToggle();
        },
        handleGroupDelete(index) {
            this.bulkPackaging.splice(index, 1);
            this.checkForButtonToggle();
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
            this.checkForButtonToggle();
        },
        /**
         *
         * @author Rohan Shah
         * @description Generate category list based on user input
         * Designed to return all when called first time or without any input
         */
        setCategoryList(e = {}) {
            this.searchableCategoryList = [];
            const query = {
                is_active: true
            };

            if (e.text && e.text.length) {
                query.q = e.text;
            }
            this.$store.dispatch(FETCH_L3_CATEGORIES, query).then((data) => {
                if (!data.error) {
                    let tempList = [];
                    data.forEach((a) => {
                        tempList.push({
                            text: a.name,
                            value: a.uid
                        });
                    });
                    this.searchableCategoryList = tempList;
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
            categoryArr.forEach((category) => {
                let categoryObj = this.searchableCategoryList.find(
                    (a) => a.value == category
                );
                if (
                    categoryObj &&
                    !this.categoryValue.includes(categoryObj.value)
                ) {
                    this.selectedCategories.push(categoryObj);
                    // push only the unique value / id in the array to maintain selection list
                    this.categoryValue.push(categoryObj.value);
                }
            });
            let valIndex = -1;
            let selectedIndex = -1;
            // Handle the unselect of category
            this.categoryValue.forEach((categoryId, index) => {
                if (!categoryArr.includes(categoryId)) {
                    valIndex = index;
                    selectedIndex = this.selectedCategories.findIndex(
                        (a) => a.value == categoryId
                    );
                }
            });
            // only if the index is not default
            if (valIndex > -1) {
                // remove the selected item
                this.categoryValue.splice(valIndex, 1);
                this.selectedCategories.splice(selectedIndex, 1);
            }
            this.checkForButtonToggle();
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
            this.checkForButtonToggle();
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
            if (this[obj][key] && !this[obj][key].value.toString().length)
                this[obj][
                    key
                ].error = `${this[obj][key].label} is a mandatory field`;
            this.checkForButtonToggle();
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
                !this.bulkPackaging[index][obj][input].value.toString().length
            ) {
                this.bulkPackaging[index][obj][
                    input
                ].error = `${this.bulkPackaging[index][obj][input].label} should have some value`;
            }
            // check if both min and max have been filled, if so then validate if min is actually less than max
            if (
                this.bulkPackaging[index][obj]['minimum'].value.toString()
                    .length &&
                this.bulkPackaging[index][obj]['maximum'].value.toString()
                    .length &&
                !(
                    this.bulkPackaging[index][obj]['minimum'].value <
                    this.bulkPackaging[index][obj]['maximum'].value
                )
            ) {
                // if not then set error in min input field
                this.bulkPackaging[index][obj][
                    'minimum'
                ].error = `${this.bulkPackaging[index][obj]['minimum'].label} should be lesser than the maximum value`;
            }
            this.checkForButtonToggle();
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
            this.checkForButtonToggle();
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
            // check if both min and max have been filled, if so then validate if min is actually less than max
            if (
                this.bulkPackaging[index][obj]['minimum'].value.toString()
                    .length &&
                this.bulkPackaging[index][obj]['maximum'].value.toString()
                    .length &&
                this.bulkPackaging[index][obj]['minimum'].value <
                    this.bulkPackaging[index][obj]['maximum'].value
            ) {
                // if so then there are no errors so empty the error field
                this.bulkPackaging[index][obj]['minimum'].error = '';
            }
            this.checkForButtonToggle();
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
                bulkPackaging: [],
                itemId: this.selectedPackage
            };
            product.l3Categories = this.selectedCategories.map((item) => {
                return item.value;
            });
            // map the input field values for row2 and row3 inputs
            Object.keys(this.row2Inputs).forEach((key) => {
                product[key] = this.row2Inputs[key].value;
            });
            Object.keys(this.row3Inputs).forEach((key) => {
                product[key] = this.row3Inputs[key].value;
            });
            this.bulkPackaging.forEach((group) => {
                let bulkObj = {
                    is_default_packaging_material: group.toggle.val,
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
            return {
                data: generateProductRequest(product),
                isEdit: Object.keys(this.editProduct).length ? true : false,
                _id: this.editProduct._id
            };
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
            this.checkForButtonToggle();
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
                    a.volumetricWeight.maximum.error ||
                    a.volumetricWeight.minimum.error ||
                    !a.volumetricWeight.maximum.value ||
                    !a.volumetricWeight.minimum.value ||
                    a.quantity.maximum.error ||
                    a.quantity.minimum.error ||
                    !a.quantity.maximum.value ||
                    !a.quantity.minimum.value ||
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
