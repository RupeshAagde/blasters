<template>
    <div>
        <div>
            <page-header :title="headerText" @backClick="redirectToListing">
                <div class="page-slot">
                    <nitrozen-toggle-btn
                        v-model="is_active"
                        :title="
                            is_active
                                ? 'Disable department'
                                : 'Enable department'
                        "
                    ></nitrozen-toggle-btn>

                    <span>
                        <nitrozen-button
                            class="left-space-txb"
                            :theme="'secondary'"
                            @click="save"
                            v-flatBtn
                            >Save</nitrozen-button
                        >
                    </span>
                </div>
            </page-header>
        </div>
        <div class="v-edit-page">
            <div class="template-box">
                <div>
                    <nitrozen-dropdown
                        :label="'Template'"
                        class="filter-dropdown"
                        :multiple="true"
                        :searchable="true"
                        :required="true"
                        :items="filteredTemplateList"
                        placeholder="select templates"
                        v-model="selectedTemplates.value"
                        @change="getCurrentDep"
                        @searchInputChange="setFilteredTemplateList"
                        :enable_select_all="true"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="selectedTemplates.showerror"
                        >{{ selectedTemplates.errortext }}
                    </nitrozen-error>
                </div>

                <div v-if="selectedTemplates.value" class="label-data">
                    <span
                        v-for="(temp, index) of selectedTemplates.value"
                        class="chips mr-s mt-s"
                    >
                        {{ formatDisplay(temp) }}
                        <nitrozen-inline
                            icon="cross"
                            class="pointer ml-xs"
                            @click="removeTemplate(index)"
                        ></nitrozen-inline>
                    </span>
                </div>
            </div>
            <div class="input-row mt-l">
                <div class="row-item">
                    <nitrozen-dropdown
                        :label="'Attribute'"
                        :required="true"
                        class="filter-dropdown"
                        :disabled="
                            !selectedTemplates.value.length ||
                                !attributeList.length
                        "
                        :items="attributeList"
                        placeholder="Choose Attribute"
                        v-model="selectedAttribute.value"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="selectedAttribute.showerror"
                        >{{ selectedAttribute.errortext }}
                    </nitrozen-error>
                </div>
                <div class="row-item">
                    <nitrozen-input
                        label="Display Name *"
                        placeholder="Give a name to the variant"
                        v-model="name.value"
                        @input="validateName"
                    ></nitrozen-input>
                    <nitrozen-error v-if="name.showerror"
                        >{{ name.errortext }}
                    </nitrozen-error>
                </div>
            </div>

            <div class="mt-l">
                <nitrozen-dropdown
                    :label="'Display type '"
                    class="filter-dropdown"
                    :searchable="true"
                    :multiple="true"
                    :required="true"
                    :items="displayTypeList"
                    placeholder="Select display type"
                    v-model="selectedDisplayType.value"
                    :enable_select_all="true"
                ></nitrozen-dropdown>
                <nitrozen-error v-if="selectedDisplayType.showerror"
                    >{{ selectedDisplayType.errortext }}
                </nitrozen-error>
            </div>

            <!-- image configuration based on display type -->
            <div v-if="isSwatchSSelected" class="mt-xl suffix">
                <div class="cust-sh2">Image Configurations</div>

                <div class="input-row mt-l">
                    <!-- minimum height -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Minimum Height *"
                            placeholder=""
                            type="number"
                            v-model="image_config.min_height.value"
                            @input="
                                checkValidValue(
                                    'min_height',
                                    allowedValue.hMin,
                                    allowedValue.hMax
                                )
                            "
                            :showSuffix="true"
                            suffix="Pixels"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.min_height.showerror"
                            >{{ image_config.min_height.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- minimum width -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Minimum Width *"
                            placeholder=""
                            type="number"
                            v-model="image_config.min_width.value"
                            @input="
                                checkValidValue(
                                    'min_width',
                                    allowedValue.wMin,
                                    allowedValue.wMax
                                )
                            "
                            :showSuffix="true"
                            suffix="Pixels"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.min_width.showerror"
                            >{{ image_config.min_width.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-row mt-l">
                    <!-- maximum height -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Maximum Height *"
                            placeholder=""
                            type="number"
                            v-model="image_config.max_height.value"
                            @input="
                                checkValidValue(
                                    'max_height',
                                    allowedValue.hMin,
                                    allowedValue.hMax
                                )
                            "
                            :showSuffix="true"
                            suffix="Pixels"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.max_height.showerror"
                            >{{ image_config.max_height.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- maximum width -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Maximum Width *"
                            placeholder=""
                            type="number"
                            v-model="image_config.max_width.value"
                            @input="
                                checkValidValue(
                                    'max_width',
                                    allowedValue.wMin,
                                    allowedValue.wMax
                                )
                            "
                            :showSuffix="true"
                            suffix="Pixels"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.max_width.showerror"
                            >{{ image_config.max_width.errortext }}
                        </nitrozen-error>
                    </div>
                </div>

                <div class="input-row mt-l">
                    <!-- maximum file size -->
                    <div class="row-item">
                        <nitrozen-input
                            label="Maximum File Size *"
                            placeholder=""
                            type="number"
                            v-model="image_config.max_size.value"
                            @input="
                                checkValidValue(
                                    'max_size',
                                    allowedValue.fsMin,
                                    allowedValue.fsMax
                                )
                            "
                            :showSuffix="true"
                            suffix="MB"
                        ></nitrozen-input>
                        <nitrozen-error v-if="image_config.max_size.showerror"
                            >{{ image_config.max_size.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- file type selection -->
                    <div class="row-item">
                        <nitrozen-dropdown
                            label="File Type "
                            placeholder="select file type"
                            :required="true"
                            :searchable="true"
                            :multiple="true"
                            :items="fileTypeList"
                            v-model="image_config.file_type.value"
                        ></nitrozen-dropdown>
                        <nitrozen-error v-if="image_config.file_type.showerror"
                            >{{ image_config.file_type.errortext }}
                        </nitrozen-error>
                    </div>
                </div>
                <!-- maintain aspect ratio  -->
                <div class="mt-xl">
                    <span class="n-input-label mb-xs"
                        >Maintain Aspect Ratio</span
                    >
                    <radio-group
                        class="radios"
                        @on-change="changeOption($event)"
                        :options="[
                            { display: 'True', value: true },
                            { display: 'False', value: false }
                        ]"
                        :selectedOpt="this.image_config.maintain_aspect_ratio"
                        :align="2"
                    ></radio-group>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.suffix {
    animation: show 2s forwards;
    ::v-deep .nitrozen-input-suffix {
        background: none;
        border-left: 0px;
        font-size: 12px;
        font-weight: 600;
        line-height: 16px;
        letter-spacing: 0em;
        text-align: left;
    }
}
.radios {
    ::v-deep .radio-item {
        padding: 12px 14px 2px 6px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        margin-right: 12px;
    }
}
@keyframes show {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>
<script>
import loader from '@/components/common/loader';
import { debounce } from '@/helper/utils';
import get from 'lodash/get';
import Shimmer from '@/components/common/shimmer';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';
import RadioGroup from '@/components/common/radio-group.vue';
import {
    FETCH_VARIANT_DISPLAY_TYPE,
    FETCH_TEMPLATES,
    FETCH_ATTRIBUTES,
    FETCH_VARIANTS,
    CREATE_EDIT_VARIANTS
} from '@/store/action.type.js';
import cloneDeep from 'lodash/cloneDeep';
import {
    flatBtn,
    NitrozenBadge,
    NitrozenButton,
    NitrozenChips,
    NitrozenDropdown,
    NitrozenError,
    NitrozenInline,
    NitrozenInput,
    NitrozenToggleBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
const FILE_TYPE = [
    { text: 'PNG', value: 'png' },
    { text: 'JPEG', value: 'jpeg' },
    { text: 'PDF', value: 'pdf' }
];

const ALLOWED_VALUE = {
    hMin: 1,
    hMax: 1000,

    wMin: 1,
    wMax: 1000,

    fsMin: 1,
    fsMax: 20
};

export default {
    name: 'create-update-variant',
    components: {
        loader,
        Shimmer,
        PageHeader,
        PageError,
        NitrozenInput,
        NitrozenError,
        NitrozenButton,
        NitrozenDropdown,
        NitrozenChips,
        NitrozenInline,
        NitrozenBadge,
        NitrozenToggleBtn,
        RadioGroup
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            pageLoading: false,
            PageError: false,
            uid: null,
            is_active: true,
            priority: null,
            headerText: 'Create Variant',
            selectedTemplates: this.getInitialValue(),
            templateList: [],
            filteredTemplateList: [],
            temp_dep_set: {},
            selectedDisplayType: this.getInitialValue(),
            displayTypeList: [],
            selectedAttribute: this.getInitialValue(''),
            attributeList: [],
            name: this.getInitialValue(''),
            image_config: this.getInitialImageConfig(),
            fileTypeList: FILE_TYPE,
            allowedValue: ALLOWED_VALUE
        };
    },
    computed: {
        isSwatchSSelected() {
            return this.selectedDisplayType.value.includes('color');
        }
    },
    mounted() {
        this.init();
        if (this.$route.params.uid) {
            this.pageLoading = true;
            this.uid = this.$route.params.uid;
            this.headerText = 'Update Variant';
            this.fetchVariant(this.uid);
        }
    },
    methods: {
        getInitialValue(val = []) {
            return {
                value: val,
                showerror: false,
                errortext: ''
            };
        },
        getInitialImageConfig(
            minH = 0,
            maxH = 0,
            minW = 0,
            maxW = 0,
            maxS = 0,
            fileT = [],
            mAR = false
        ) {
            return {
                min_height: this.getInitialValue(minH),
                max_height: this.getInitialValue(maxH),
                min_width: this.getInitialValue(minW),
                max_width: this.getInitialValue(maxW),
                max_size: this.getInitialValue(maxS),
                file_type: this.getInitialValue(fileT),
                maintain_aspect_ratio: {
                    display: mAR ? 'True' : 'False',
                    value: mAR
                }
            };
        },
        init() {
            this.pageLoading = true;
            this.pageError = false;
            const templateParams = {
                page_no: 1,
                page_size: 9999,
                sort: 'created_desc'
            };
            Promise.all([
                this.$store
                    .dispatch(FETCH_VARIANT_DISPLAY_TYPE, {
                        choice_type: 'variants'
                    })
                    .catch(() => {
                        console.log('Error in fetching display type');
                    }),
                this.$store
                    .dispatch(FETCH_TEMPLATES, templateParams)
                    .catch(() => {
                        console.log('Error in fetching display type');
                    })
            ])
                .then((res) => {
                    //display type
                    if (res[0]) this.displayTypeList = res[0];

                    //template list
                    if (res[1]) {
                        this.templateList = res[1].temp;
                        this.filteredTemplateList = cloneDeep(
                            this.templateList
                        );
                        this.temp_dep_set = res[1].temp_dep_set;
                    }
                })
                .catch((err) => {
                    console.log('Something is wrong');
                })
                .finally(() => {
                    this.pageLoading = true;
                });
        },
        fetchVariant(uid) {
            this.pageLoading = true;
            this.pageError = false;
            const reqBody = {
                uid,
                params: {}
            };
            this.$store
                .dispatch(FETCH_VARIANTS, reqBody)
                .then(({ items }) => {
                    this.is_active = get(items, 'is_active', true);
                    this.priority = get(items, 'priority', null);
                    this.selectedTemplates = this.getInitialValue(
                        get(items, 'templates', [])
                    );
                    this.selectedAttribute = this.getInitialValue(
                        get(items, 'key', '')
                    );
                    this.name = this.getInitialValue(get(items, 'display', ''));
                    this.selectedDisplayType = this.getInitialValue(
                        get(items, 'display_type', [])
                    );
                    if (get(items, 'image_config', false)) {
                        const imgConfig = items.image_config;
                        this.image_config = this.getInitialImageConfig(
                            get(imgConfig, 'min_height', 0),
                            get(imgConfig, 'max_height', 0),
                            get(imgConfig, 'min_width', 0),
                            get(imgConfig, 'max_width', 0),
                            get(imgConfig, 'max_size', 0),
                            get(imgConfig, 'file_type', []),
                            get(imgConfig, 'maintain_aspect_ratio', false)
                        );
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                    this.pageLoading = false;
                    this.pageError = false;
                });
        },

        // template listing, adding removing template, calculating departments and then getting related attributes
        setFilteredTemplateList: debounce(function(e) {
            this.filteredTemplateList = [];
            this.templateList.forEach((t) => {
                if (
                    !e ||
                    !e.text ||
                    t.text.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.filteredTemplateList.push(t);
                }
            });
        }, 400),
        removeTemplate(index) {
            this.selectedTemplates.value.splice(index, 1);
            this.getCurrentDep();
        },
        getCurrentDep() {
            let departments = [];
            this.selectedTemplates.value.forEach((temp) => {
                if (this.temp_dep_set[temp]) {
                    departments.push(this.temp_dep_set[temp]);
                }
            });
            if (this.selectedTemplates.value.length > 0)
                this.getAttributes(departments);
        },
        getAttributes: debounce(function(dep) {
            this.pageLoading = true;
            const params = {
                page_no: 1,
                page_size: 9999,
                department: dep
            };
            this.$store
                .dispatch(FETCH_ATTRIBUTES, params)
                .then((res) => {
                    if (res.error) {
                        console.log('Error fetching attributes', res.err);
                        return;
                    }
                    this.attributeList = res;
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        }, 500),

        save() {
            this.pageLoading = true;
            let isValid = this.validateForm();
            if (isValid) {
                let obj = this.getFormData();
                this.$store
                    .dispatch(CREATE_EDIT_VARIANTS, obj)
                    .then((res) => {
                        if (res.error) {
                            this.$snackbar.global.showError(
                                get(
                                    res,
                                    'err.response.data.message',
                                    'Failed to save'
                                )
                            );
                            return;
                        }

                        this.$snackbar.global.showSuccess(
                            `${
                                this.uid
                                    ? 'Updated variant successfully'
                                    : 'Created variant successfully'
                            }`
                        );
                        setTimeout(() => {}, 2000);
                        this.$router.push({
                            path: `/administrator/product/variants`
                        });
                    })
                    .finally(() => {
                        this.pageLoading = false;
                    });
            } else {
                this.$snackbar.global.showError(
                    'Please correct inputs displayed in red',
                    1000
                );
            }
        },
        validateForm() {
            let isValid = true;
            // validate image config if swatch is selected
            if (this.isSwatchSSelected) {
                //check if entered maximum height and minimum height values are not contradicting each other if not then validate rest things
                let heightMinMaxValid = this.minMaxValidation(
                    'min_height',
                    'max_height',
                    this.allowedValue.hMin,
                    this.allowedValue.hMax
                )
                    ? true
                    : false;
                isValid = isValid && heightMinMaxValid;
                if (heightMinMaxValid) {
                    isValid =
                        this.checkValidValue(
                            'min_height',
                            this.allowedValue.hMin,
                            this.allowedValue.hMax
                        ) && isValid;
                    isValid =
                        this.checkValidValue(
                            'max_height',
                            this.allowedValue.hMin,
                            this.allowedValue.hMax
                        ) && isValid;
                }

                // check if entered maximum width and minimum width values are not contradicting each other if not then validate rest things
                let widthMinMaxValid = this.minMaxValidation(
                    'min_width',
                    'max_width',
                    this.allowedValue.wMin,
                    this.allowedValue.wMax
                )
                    ? true
                    : false;
                isValid = isValid && widthMinMaxValid;
                if (widthMinMaxValid) {
                    isValid =
                        this.checkValidValue(
                            'min_width',
                            this.allowedValue.wMin,
                            this.allowedValue.wMax
                        ) && isValid;
                    isValid =
                        this.checkValidValue(
                            'max_width',
                            this.allowedValue.wMin,
                            this.allowedValue.wMax
                        ) && isValid;
                }

                isValid =
                    this.checkValidValue(
                        'max_size',
                        this.allowedValue.fsMin,
                        this.allowedValue.fsMax
                    ) && isValid;

                isValid =
                    this.arrayLength(
                        this.image_config.file_type,
                        'file type'
                    ) && isValid;
            }

            isValid =
                this.arrayLength(this.selectedTemplates, 'template') && isValid;
            isValid =
                this.arrayLength(this.selectedAttribute, 'attribute') &&
                isValid;
            isValid =
                this.arrayLength(this.selectedDisplayType, 'template') &&
                isValid;
            isValid = this.validateName() && isValid;

            return isValid;
        },

        getFormData() {
            let obj = {
                is_active: this.is_active,
                priority: this.priority,
                templates: this.selectedTemplates.value,
                key: this.selectedAttribute.value,
                display: this.name.value,
                display_type: this.selectedDisplayType.value
            };
            if (this.isSwatchSSelected) {
                obj.image_config = {
                    min_height: this.image_config.min_height.value,
                    max_height: this.image_config.max_height.value,
                    min_width: this.image_config.min_width.value,
                    max_width: this.image_config.max_width.value,
                    max_size: this.image_config.max_size.value,
                    file_type: this.image_config.file_type.value,
                    maintain_aspect_ratio: this.image_config
                        .maintain_aspect_ratio.value
                };
            }
            if (this.uid) {
                obj.uid = this.uid;
            }
            return obj;
        },

        /*
        methodName: minMaxValidation
        paramCount: 4
            1. First and second params specify property name of input on which we need to perform validation
            2. Third and fourth params specify the allowed min max range value.
         */
        minMaxValidation(key1, key2, range1, range2) {
            let isValid = true;
            const enteredMin = parseInt(this.image_config[key1].value);
            const enteredMax = parseInt(this.image_config[key2].value);
            const validMin = range1 <= enteredMin && enteredMin <= range2;
            const validMax = range1 <= enteredMax && enteredMax <= range2;
            if (validMin && validMax && enteredMin >= enteredMax) {
                this.image_config[key1].showerror = true;
                this.image_config[key2].showerror = true;
                this.image_config[key1].errortext =
                    'Value should not more than maximum value';
                this.image_config[key2].errortext =
                    'Value should not less than minimum value';

                isValid = false;
            } else {
                this.image_config[key1].showerror = false;
                this.image_config[key2].showerror = false;
                this.image_config[key1].errortext = '';
                this.image_config[key2].errortext = '';
            }
            return isValid;
        },
        checkValidValue(key, min = 0, max = 0) {
            let isValid = true;
            const val = parseInt(this.image_config[key].value);

            if (val) {
                if (val < min) {
                    isValid = false;
                    this.image_config[key].showerror = true;
                    this.image_config[
                        key
                    ].errortext = `Value should not less than allowed minimum value, which is ${min}`;
                } else if (val > max) {
                    isValid = false;
                    this.image_config[key].showerror = true;
                    this.image_config[
                        key
                    ].errortext = `Value should not more than allowed maximum value, which is ${max}`;
                } else {
                    this.image_config[key].showerror = false;
                }
            } else {
                isValid = false;
                this.image_config[key].showerror = true;
                this.image_config[key].errortext = 'Field is required';
            }
            return isValid;
        },
        arrayLength(obj, name) {
            if (obj.value.length) {
                obj.showerror = false;
                return true;
            } else {
                obj.showerror = true;
                obj.errortext = `Choose at least one ${name}`;
                return false;
            }
        },
        validateName() {
            const name = this.name.value.trim();
            if (name) {
                if (name.length >= 3 && name.length <= 30) {
                    this.name.showerror = false;
                    this.name.errortext = '';
                    return true;
                } else {
                    this.name.showerror = true;
                    this.name.errortext =
                        'Display name should be between 3 to 30 characters';
                    return false;
                }
            } else {
                this.name.showerror = true;
                this.name.errortext = 'Display name is required';
                return false;
            }
        },
        changeOption(e) {
            this.image_config.maintain_aspect_ratio = e;
        },
        formatDisplay(val) {
            const tempObj = this.templateList.find((ele) => ele.value == val);
            return tempObj ? tempObj.text : val;
        },

        redirectToListing() {
            this.$router.push({ path: '/administrator/product/variants' });
        }
    }
};
</script>
