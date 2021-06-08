<template>
    <div class="details">
        <div class="container">
            <div class="mt-sm">
                <nitrozen-input
                    label="Type *"
                    placeholder="For eg. Black Casual Shirt"
                    v-model="department.value"
                    :disabled="true"
                    @blur="validateUniqueSlug"
                    @input="
                        (name.value = $event.trim()),
                            $emit('input-name', $event),
                            updateSlug(),
                            validateField('name')
                    "
                ></nitrozen-input>
                <nitrozen-error v-if="name.error">
                    {{ name.error }}
                </nitrozen-error>
            </div>
            <div class="mt-sm">
            </div>
            <div class="mt-sm">
                <nitrozen-input
                    label="Department *"
                    placeholder="For eg. Black Casual Shirt"
                    v-model="department.value"
                    :disabled="true"
                    @blur="validateUniqueSlug"
                    @input="
                        (name.value = $event.trim()),
                            $emit('input-name', $event),
                            updateSlug(),
                            validateField('name')
                    "
                ></nitrozen-input>
                <nitrozen-error v-if="name.error">
                    {{ name.error }}
                </nitrozen-error>
            </div>
            <div class="mt-sm">
                <nitrozen-input
                    label="Category *"
                    placeholder="For eg. Black Casual Shirt"
                    v-model="department.value"
                    :disabled="true"
                    @blur="validateUniqueSlug"
                    @input="
                        (name.value = $event.trim()),
                            $emit('input-name', $event),
                            updateSlug(),
                            validateField('name')
                    "
                ></nitrozen-input>
                <nitrozen-error v-if="name.error">
                    {{ name.error }}
                </nitrozen-error>
            </div>
            <!-- Name -->
            <div class="mt-sm">
                <nitrozen-input
                    label="Name *"
                    placeholder="For eg. Black Casual Shirt"
                    v-model="name.value"
                    @blur="validateUniqueSlug"
                    @input="
                        (name.value = $event.trim()),
                            $emit('input-name', $event),
                            updateSlug(),
                            validateField('name')
                    "
                ></nitrozen-input>
                <nitrozen-error v-if="name.error">
                    {{ name.error }}
                </nitrozen-error>
            </div>
            <!-- Slug -->
            <div class="mt-sm">
                <nitrozen-input
                    label="Slug"
                    placeholder="For eg. black-casual-shirt"
                    :showTooltip="true"
                    tooltipText="Used as product name in product links. Allowed characters are capital alphabets, numbers and hyphens"
                    :disabled="editMode"
                    v-model="slug.value"
                    @input="(slug.value = $event.trim()), validateField('slug')"
                    @blur="validateField('slug'), validateUniqueSlug()"
                ></nitrozen-input>
                <nitrozen-error v-if="slug.error">
                    {{ slug.error }}
                </nitrozen-error>
            </div>
            <!-- Brand -->
            <div class="mt-sm">
                <nitrozen-dropdown
                    label="Brand *"
                    placeholder="Choose Brand"
                    :disabled="editMode"
                    :items="brandValuesList"
                    v-model="brand_uid.value"
                    :searchable="true"
                    @change="
                        $emit('change-brand-uid', $event),
                            validateField('brand_uid'),
                            validateUniqueItemCode()
                    "
                    @searchInputChange="setBrandValuesList"
                ></nitrozen-dropdown>
                <nitrozen-error v-if="brand_uid.error">
                    {{ brand_uid.error }}
                </nitrozen-error>
            </div>
            <!-- Item Code -->
            <div class="mt-sm">
                <nitrozen-input
                    label="Item Code *"
                    placeholder="For eg. BK-101"
                    :showTooltip="true"
                    tooltipText="Allowed characters are capital alphabets, numbers and hyphens"
                    :disabled="editMode"
                    v-model="item_code.value"
                    @blur="validateUniqueItemCode"
                    @input="
                        (item_code.value = $event.trim().toUpperCase()),
                            $emit(
                                'input-item-code',
                                $event.trim().toUpperCase()
                            ),
                            validateField('item_code')
                    "
                ></nitrozen-input>
                <nitrozen-error v-if="item_code.error">
                    {{ item_code.error }}
                </nitrozen-error>
            </div>
        </div>
        <div class="header">
            <div class="container teaser">
                <div class="mt-sm">
                    <nitrozen-input
                        label="Badge"
                        placeholder="Fynd Assured"
                        v-model="teaser.value"
                    ></nitrozen-input>
                </div>

                <div class="mt-sm" v-if="product_type.value === 'standard'">
                    <nitrozen-input
                        label="No. of boxes"
                        type="number"
                        placeholder="No. of boxes"
                        v-model="no_of_boxes.value"
                    >
                    </nitrozen-input>
                    <nitrozen-error v-if="no_of_boxes.error">
                        {{ no_of_boxes.error }}
                    </nitrozen-error>
                </div>

                <!-- <div
                    class="no-image img_container"
                    @click.stop="openImageDialog"
                    v-if="!teaserURL"
                >
                    <ukt-inline-svg
                        src="plus-black"
                        class="add-image"
                    ></ukt-inline-svg>
                </div>
                <div class="image img_container" v-if="teaserURL">
                    <img
                        v-if="teaserURL"
                        :src="teaserURL"
                        @error="$imageError"
                        @mouseover="showOptions = true"
                        @mouseleave="showOptions = false"
                    />
                    <div class="delete-image" @click.stop="delete_()">
                        <ukt-inline-svg
                            title="Delete image"
                            src="delete"
                            class="delete-icon"
                        ></ukt-inline-svg>
                    </div>
                </div> -->
            </div>
        </div>

        <!-- <mirage-image-uploader-dialog
            ref="dialog"
            :label="'Teaser Tag Upload'"
            :text="'Add Image'"
            :fileTypes="fileTypes"
            :fileDomain="fileDomain"
            :maxSize="maxSize"
            :aspectRatio="'1:1'"
            :namespace="namespace"
            :fileName="teaser.tag || 'Teaser'"
            :tags="tags"
            @delete="delete_($event)"
            @save="save($event)"
            v-model="teaserURL"
        ></mirage-image-uploader-dialog> -->
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

.img_container {
    margin: 35px 0 0 20px !important;
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
</style>

<script>
import { parseDynamicAttributes } from './util';
// import JsonToForm from '@/components/admin/common/json-to-form';
// import SellerService from '@/services/admin/admin-seller.service';
// import mirageimageuploaderdialog from '@/components/admin/common/image-uploader/dialog.vue';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import { fieldSchemaValidation } from './util';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import slugify from 'slugify';
import path from 'path';
import Ajv from 'ajv';
import {
    NitrozenRadio,
    NitrozenInput,
    NitrozenInline,
    NitrozenDropdown,
    NitrozenError,
    NitrozenTooltip,
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
// import { seller } from '../../../auto_gen/admin-svgs';

const VALIDATE_FIELDS = [
    'name',
    'slug',
    'brand_uid',
    'item_code',
    'teaser',
    'no_of_boxes'
];
const ONE_MB = 1024;

export default {
    name: 'ProductDetails',
    components: {
        // JsonToForm,
        // 'mirage-image-uploader-dialog': mirageimageuploaderdialog,
        'nitrozen-checkbox': NitrozenCheckBox,
        'ukt-inline-svg': uktinlinesvg,
        NitrozenRadio,
        NitrozenInput,
        NitrozenInline,
        NitrozenDropdown,
        NitrozenError,
        NitrozenTooltip
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
            // teaserURL: '',


            brandValuesList: [],
            categoryValuesList: [],
            productTypeList: [
                { text: 'Standard', value: 'Standard' }
            ],
            errMsgGeneric: 'Something went wrong',

            showOptions: false,
            namespace: 'products-item-image', // change this later to correct namespace.
            fileTypes: ['png', 'jpeg'],
            fileDomain: 'image',
            maxSize: ONE_MB * 3
        };
    },
    props: {
        editMode: {
            type: Boolean,
            default: false
        },
        product: {
            type: Object,
            default: () => {
                return {};
            }
        },
        globalSchema: {
            type: Object,
            default: () => {
                return {};
            }
        },
        brands: {
            type: Array,
            default: () => {
                return [];
            }
        },
        categories: {
            type: Array,
            default: () => {
                return [];
            }
        },
        tags: {
            type: Array,
            default: () => {
                return [];
            }
        },
        product_type: {
            type: Object,
            default: () => {
                return {
                    value: '',
                    error: ''
                };
            }
        },
        no_of_boxes: {
            type: Object,
            default: () => {
                return {
                    value: '',
                    error: ''
                };
            }
        },
        is_dependent: {
            type: Object,
            default: () => {
                return {
                    value: '',
                    error: ''
                };
            }
        }
    },
    computed: {
        brand() {
            return this.brands.find(
                brand => brand.brand.uid === this.brand_uid.value
            );
        }
    },
    mounted() {
        
    },
    methods: {
        isEmpty: isEmpty,
        getInitialValue() {
            return {
                value: '',
                error: ''
            };
        },
        openDialog() {
            this.$refs.dialog.open();
        },
        openImageDialog() {
            this.namespace = 'products-item-image';
            this.fileTypes = ['png', 'jpeg'];
            this.fileDomain = 'image';
            this.maxSize = ONE_MB * 3;
            this.openDialog();
        },
        populateForm() {
            try {
                this.setBrandValuesList();
                this.setCategoryValuesList();

                this.name.value = this.name.value || this.product.name || '';
                this.slug.value = this.slug.value || this.product.slug || '';
                this.department.value = this.department.value || this.product.department || '';
                this.item_code.value = this.item_code.value || this.product.item_code || '';
                this.teaser.value = this.teaser.value || (this.product.teaser_tag
                    ? this.product.teaser_tag.tag
                    : '');
                // this.teaserURL = this.product.teaser_tag
                //     ? this.product.teaser_tag.url
                //         ? this.product.teaser_tag.url
                //         : ''
                //     : '';

                this.brand_uid.value =
                    this.product.brand_uid ||
                    (this.brands.length && this.brands[0].brand.uid);
                this.$emit('change-brand-uid', this.brand_uid.value);
                this.category_slug.value =
                    this.product.category_slug ||
                    (this.categories.length && this.categories[0].slug_key);

                this.no_of_boxes.value = this.no_of_boxes.value || this.product.no_of_boxes ? this.product.no_of_boxes : 1;
                this.is_dependent.value = this.product.is_dependent ? this.product.is_dependent : this.is_dependent.value
                this.$emit('change-category-slug', this.category_slug.value);
            } catch (err) {
                this.$snackbar.global.showError('Something not right here');
                console.error(err);
            }
        },
        updateSlug() {
            if (this.editMode) return;
            this.slug.value = slugify(this.name.value, {
                lower: true,
                strict: true
            });
        },
        setBrandValuesList(e = {}) {
            this.brandValuesList = [];
            this.brands.forEach(b => {
                if (
                    !e ||
                    !e.text ||
                    b.brand.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.brandValuesList.push({
                        text: b.brand.name,
                        value: b.brand.uid,
                        logo: b.brand.logo
                    });
                }
            });
        },
        setCategoryValuesList(e = {}) {
            this.categoryValuesList = [];
            this.categories.forEach(c => {
                if (
                    !e ||
                    !e.text ||
                    c.name.toLowerCase().includes(e.text.toLowerCase())
                ) {
                    this.categoryValuesList.push({
                        text: c.name,
                        value: c.slug_key
                    });
                }
            });
        },
        validateUniqness(prop = '', params = {}) {
            if (!this[prop].value) {
                return;
            }
            this.$parent.inProgress = true;
            SellerService.validateAttributes(params)
                .then(({ data }) => {
                    this.$parent.inProgress = false;
                    if (data.valid) {
                        return;
                    }
                    this.$snackbar.global.showError(data.message);
                    this[prop].error = data.message;
                })
                .catch(err => {
                    this.$parent.inProgress = false;
                    this.$snackbar.global.showError(this.errMsgGeneric);
                });
        },
        validateUniqueSlug() {
            if (this.editMode) {
                return;
            }
            const params = {
                type: 'slug',
                slug: this.slug.value
            };
            this.validateUniqness('slug', params);
        },
        validateUniqueItemCode() {
            const params = {
                type: 'item',
                brand_uid: this.brand_uid.value,
                item_code: this.item_code.value
            };
            this.validateUniqness('item_code', params);
        },
        validateForm() {
            let isValid = true;
            VALIDATE_FIELDS.forEach(prop => {
                isValid = !this[prop].error && isValid;
                isValid = this.validateField(prop) && isValid;
            });

            return isValid;
        },
        validateField(prop) {
            this[prop].error = '';
            this[prop].error = fieldSchemaValidation(
                this.globalSchema,
                prop,
                this[prop].value
            );
            return !this[prop].error;
        },
        getFormData() {
            let value = {
                name: this.name.value,
                slug: this.slug.value,
                brand_uid: this.brand_uid.value,
                item_code: this.item_code.value,
                teaser_tag: {
                    // url: this.teaserURL,
                    tag: this.teaser.value
                },
            };
            // if (!this.teaserURL && !this.teaser.value) {
            //     delete value['teaser_tag'];
            // }
            // if (!this.teaserURL) {
            //     delete value['teaser_tag']['url'];
            // }
            if (!this.teaser.value) {
                delete value['teaser_tag']['tag'];
            }
            if (this.product_type.value === 'standrd') {
                value['no_of_boxes'] = this.no_of_boxes.value
            }

            return pickBy(value, identity);
        }
        // save(url) {
        //     this.teaserURL = url;
        // },
        // delete_() {
        //     this.teaserURL = '';
        // }
    }
};
</script>
