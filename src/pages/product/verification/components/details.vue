<template>
    <div class="details">
        <div class="container">
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :value="rejected_fields.item_type ? false : true"
                    :checkboxValue="rejected_fields.item_type"
                    id="rejected_fields.item_type"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('item_type', item_type)"
                >
                </nitrozen-checkbox>
                
                <div class="block">
                    <nitrozen-input
                        label="Type *"
                        placeholder="For eg. Black Casual Shirt"
                        :showTooltip="true"
                        tooltipText="Type"
                        v-model="item_type"
                        :disabled="true"
                    ></nitrozen-input>
                    <nitrozen-error v-show="rejected_fields.item_type">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
            </div>
            <div class="mt-sm"></div>
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :value="rejected_fields.departments ? false : true"
                    :checkboxValue="rejected_fields.departments"
                    id="rejected_fields.departments"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('departments', department.value)"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-dropdown
                        class="input w-l"
                        label="Departments"
                        :items="departments"
                        disabled
                        v-model="product.departments"
                        :required="true"
                        :multiple="true"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-show="rejected_fields.departments">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
            </div>
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :checkboxValue="rejected_fields.category_slug"
                    :value="rejected_fields.category ? false : true"
                    id="rejected_fields.category"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('category_slug', category_slug.value)"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        label="Category *"
                        placeholder="For eg. Black Casual Shirt"
                        :showTooltip="true"
                        tooltipText="Category"
                        v-model="category_slug.value"
                        :disabled="true"
                    ></nitrozen-input>
                    <nitrozen-error v-show="rejected_fields.category_slug">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
            </div>
            <!-- Name -->
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :value="isCheckboxSelected(rejected_fields.name)"
                    :checkboxValue="rejected_fields.name"
                    id="rejected_fields.name"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('name', name.value)"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        label="Name *"
                        placeholder="For eg. Black Casual Shirt"
                        :showTooltip="true"
                        tooltipText="Name"
                        v-model="name.value"
                        disabled
                    ></nitrozen-input>
                    <nitrozen-error v-show="rejected_fields.name">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
            </div>
            <!-- Slug -->
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :checkboxValue="rejected_fields.slug"
                    :value="isCheckboxSelected(rejected_fields.slug)"
                    id="rejected_fields.slug"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('slug', slug.value)"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        label="Slug"
                        placeholder="For eg. black-casual-shirt"
                        :showTooltip="true"
                        tooltipText="Used as product name in product links. Allowed characters are capital alphabets, numbers and hyphens"
                        :disabled="true"
                        v-model="slug.value"
                    ></nitrozen-input>
                    <nitrozen-error v-show="rejected_fields.slug">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
            </div>
            <!-- Brand -->
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :value="isCheckboxSelected(rejected_fields.brand_uid)"
                    :checkboxValue="rejected_fields.brand_uid"
                    id="rejected_fields.brand"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('brand_uid', brand_uid.value)"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-dropdown
                        label="Brand *"
                        placeholder="Choose Brand"
                        disabled
                        :items="brandValuesList"
                        v-model="brand_uid.value"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-show="rejected_fields.brand_uid">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
            </div>
            <!-- Item Code -->
            <div class="mt-sm verify-block">
                <nitrozen-checkbox
                    :value="isCheckboxSelected(rejected_fields.item_code)"
                    :checkboxValue="rejected_fields.item_code"
                    id="rejected_fields.item_code"
                    class="nt-checkbox, checkbox-align"
                    @change="emitVerify('item_code', item_code.value)"
                >
                </nitrozen-checkbox>
                <div class="block">
                    <nitrozen-input
                        label="Item Code *"
                        placeholder="For eg. BK-101"
                        :showTooltip="true"
                        tooltipText="Allowed characters are capital alphabets, numbers and hyphens"
                        disabled
                        v-model="item_code.value"
                    ></nitrozen-input>
                    <nitrozen-error v-show="rejected_fields.item_code">
                        {{ errMsgRequired }}
                    </nitrozen-error>
                </div>
            </div>
            <div class="mt-sm verify-block">
                    <nitrozen-checkbox
                        :value="isCheckboxSelected(rejected_fields.teaser_tag)"
                        :checkboxValue="rejected_fields.teaser_tag"
                        id="rejected_fields.teaser_tag"
                        class="nt-checkbox, checkbox-align"
                        @change="emitVerify('teaser_tag', teaser.value)"
                    >
                    </nitrozen-checkbox>
                    <div class="block">
                        <nitrozen-input
                            label="Badge"
                            placeholder="Fynd Assured"
                            disabled
                            v-model="teaser.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            v-show="
                                !isCheckboxSelected(rejected_fields.teaser_tag)
                            "
                        >
                            {{ errMsgRequired }}
                        </nitrozen-error>
                    </div>
                </div>

                <div
                    class="mt-sm verify-block"
                    v-if="product_type.value === 'standard'"
                >
                    <nitrozen-checkbox
                        :value="isCheckboxSelected(rejected_fields.no_of_boxes)"
                        :checkboxValue="rejected_fields.no_of_boxes"
                        id="rejected_fields.no_of_boxes"
                        class="nt-checkbox, checkbox-align"
                        @change="emitVerify('no_of_boxes', no_of_boxes.value)"
                    >
                    </nitrozen-checkbox>
                    <div class="block">
                        <nitrozen-input
                            label="No. of boxes"
                            type="number"
                            disabled
                            placeholder="No. of boxes"
                            v-model="no_of_boxes.value"
                        >
                        </nitrozen-input>
                        <nitrozen-error
                            v-show="
                                !isCheckboxSelected(rejected_fields.no_of_boxes)
                            "
                        >
                            {{ errMsgRequired }}
                        </nitrozen-error>
                    </div>
                </div>
        </div>
        <div class="header">
            <div class="container teaser">
                
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
// @import './../less/page-header.less';
// @import './../less/page-ui.less';
.container {
    display: flex;
    flex-wrap: wrap;
    & > div.mt-sm {
        width: 48%;
        max-width: 450px;
        margin-right: 24px;
        @media @mobile {
            width: 100%;
            max-width: 100%;
            margin-right: 0;
        }

        .nitrozen-form-input {
            width: 100% !important;
        }
    }
}

.label {
    color: #9b9b9b !important;
    font-size: 12px !important;
}
.no-image {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background-color: @Alabaster2;
    border: 1px dashed @RoyalBlue;
    border-radius: @BorderRadius;
    cursor: pointer;
    &.disabled {
        opacity: 0.5;
        pointer-events: none;
    }
    .add-image {
        ::v-deep {
            svg {
                width: 20px;
                height: 20px;
                #prefix__Group {
                    stroke: #d5daff;
                }
            }
        }
    }
}
.teaser {
    width: 100%;
    display: flex;
}
.hidden {
    visibility: hidden;
}
.block {
    display: block;
    width: 100%;
}

.img_container {
    margin: 35px 0 0 20px !important;
}
.verify-block {
    display: flex;
}
.image {
    width: 75px;
    height: 50px;
    position: relative;
    background-color: @Alabaster2;
    border: 1px dashed @RoyalBlue;
    border-radius: @BorderRadius;
    img {
        object-fit: contain;
        display: block;
        margin: 0 auto;
        height: 100%;
        width: 83.33%;
    }
    .delete-image {
        position: absolute;
        display: inline-block;
        cursor: pointer;
        right: 4px;
        top: 4px;
    }
}
.add-hsn {
    display: flex;
    justify-content: flex-end;
    line-height: 22px;
}
.mt-sm {
    margin-top: 12px;
    width: 45% !important;
    @media @mobile {
        width: 100% !important;
        max-width: 100%;
        margin-right: 0;
    }
}
.inline {
    display: flex;
}
.details {
    .header {
        .title {
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 14px;
            width: 46%;
        }
    }
}
.checkbox-align {
    margin-top: 30px;
}
</style>

<script>
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import isEmpty from 'lodash/isEmpty';
import {
    NitrozenRadio,
    NitrozenInput,
    NitrozenInline,
    NitrozenDropdown,
    NitrozenButton,
    NitrozenError,
    NitrozenTooltip,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';

export default {
    name: 'ProductDetails',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox,
        'ukt-inline-svg': uktinlinesvg,
        NitrozenRadio,
        NitrozenInput,
        NitrozenInline,
        NitrozenDropdown,
        NitrozenError,
        NitrozenTooltip,
    },

    data() {
        return {
            name: this.getInitialValue(),
            slug: this.getInitialValue(),
            department: this.getInitialValue(),
            category: this.getInitialValue(),
            item_code: this.getInitialValue(),
            description: this.getInitialValue(),
            brand_uid: this.getInitialValue(),
            category_slug: this.getInitialValue(),
            teaser: this.getInitialValue(),
            item_type: '',
            brandValuesList: [],
            categoryValuesList: [],
            errMsgGeneric: 'Something went wrong',
        };
    },
    props: {
        editMode: {
            type: Boolean,
            default: false,
        },
        product: {
            type: Object,
            default: () => {
                return {};
            },
        },
        globalSchema: {
            type: Object,
            default: () => {
                return {};
            },
        },
        brands: {
            type: Array,
            default: () => {
                return [];
            },
        },
        departments: {
            type: Array,
            default: () => {
                return [];
            },
        },
        categories: {
            type: Array,
            default: () => {
                return [];
            },
        },
        tags: {
            type: Array,
            default: () => {
                return [];
            },
        },
        product_type: {
            type: Object,
            default: () => {
                return {
                    value: '',
                    error: '',
                };
            },
        },
        no_of_boxes: {
            type: Object,
            default: () => {
                return {
                    value: '',
                    error: '',
                };
            },
        },
        rejected_fields: {
            type: Object,
            default: () => {
                return {};
            },
        },
        is_dependent: {
            type: Object,
            default: () => {
                return {
                    value: '',
                    error: '',
                };
            },
        },
        errMsgRequired: {
            type: String,
            default: () => {
                return 'This field is required to verify the product';
            },
        },
    },
    computed: {
        brand() {
            return this.brands.find(
                (brand) => brand.brand.uid === this.brand_uid.value
            );
        },
    },
    mounted() {
        this.populateForm();
    },
    methods: {
        isEmpty: isEmpty,
        getInitialValue() {
            return {
                value: '',
                error: '',
            };
        },
        populateForm() {
            try {
                this.setBrandValuesList();
                // this.setCategoryValuesList();
                const {
                    slug = '',
                    name = '',
                    item_type = '',
                    department = '',
                    item_code = '',
                    teaser_tag = '',
                } = this.product;

                this.item_type = item_type;
                this.name.value = this.name.value || name;
                this.slug.value = this.slug.value || slug;
                this.department.value = this.department.value || department;
                this.item_code.value = this.item_code.value || item_code;
                this.teaser.value =
                    this.teaser.value ||
                    (teaser_tag ? this.product.teaser_tag.tag : '');

                this.brand_uid.value =
                    this.product.brand_uid ||
                    (this.brands.length && this.brands[0].brand.uid);
                this.$emit('change-brand-uid', this.brand_uid.value);
                this.category_slug.value =
                    this.product.category_slug ||
                    (this.categories.length && this.categories[0].slug_key);

                this.no_of_boxes.value =
                    this.no_of_boxes.value || this.product.no_of_boxes
                        ? this.product.no_of_boxes
                        : 1;
                this.is_dependent.value = this.product.is_dependent
                    ? this.product.is_dependent
                    : this.is_dependent.value;
                this.$emit('change-category-slug', this.category_slug.value);
            } catch (err) {
                this.$snackbar.global.showError('Something not right here');
                console.error(err);
            }
        },
        setBrandValuesList(e = {}) {
            this.brandValuesList = [];
            this.brands.forEach((b) => {
                if (
                    !e ||
                    !e.text ||
                    b.brand.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.brandValuesList.push({
                        text: b.brand.name,
                        value: b.brand.uid,
                        logo: b.brand.logo,
                    });
                }
            });
        },
        isCheckboxSelected(value) {
            return value ? false : true;
        },
        setCategoryValuesList(e = {}) {
            this.categoryValuesList = [];
            this.categories.forEach((c) => {
                if (
                    !e ||
                    !e.text ||
                    c.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.categoryValuesList.push({
                        text: c.name,
                        value: c.slug_key,
                    });
                }
            });
        },
        emitVerify(name, value) {
            this.$emit('trigger-verify', { key: name, value });
        },
    },
};
</script>
