<template>
    <div class="panel">
        <div class="header-position">
            <page-header
                :title="pageTitle"
                @backClick="$goBack('/administrator/settings/platform')"
                :noContextMenu="true"
            >
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        :theme="'secondary'"
                        v-flatBtn
                        ref="save-button"
                        @click="saveForm"
                        >Save</nitrozen-button
                    >
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading" />
        <page-error v-else-if="pageError" />
        <div class="page-container" v-else>
            <!-- Details -->

            <div class="form-container">
                <div class="inline apart">
                    <div class="card-avatar">
                        <image-uploader
                            v-model="item.logo"
                            label="Logo *"
                            aspectRatio="1:1"
                            :minimumResolution="{
                                width: 80,
                                height: 80
                            }"
                            :maximumResolution="{
                                width: 2000,
                                height: 2000
                            }"
                            :recommendedResolution="{
                                width: 196,
                                height: 196
                            }"
                            namespace="platform-favicon-logo"
                            @delete="item.logo = ''"
                            @save="item.logo = $event"
                            fileName="logo"
                        />
                        <nitrozen-error v-if="errors.logo">
                            {{ errors.logo }}
                        </nitrozen-error>
                    </div>

                    <div class="inline name">
                        <div class="cell-value">
                            <nitrozen-input
                                v-model="item.name"
                                label="Application Name"
                                type="text"
                                placeholder="Enter Name"
                                :required="true"
                                @input="
                                    updateSlug($event), checkRequired('name')
                                "
                            />
                            <nitrozen-error v-if="errors.name">
                                {{ errors.name }}
                            </nitrozen-error>
                        </div>
                    </div>
                    <div class="inline name">
                        <nitrozen-input
                            v-model="item.slug"
                            label="Application Slug"
                            type="text"
                            class="cell-value"
                            placeholder="Enter Slug"
                            :disabled="true"
                        />
                    </div>
                </div>
                <div class="border-line">
                    <div class="inline margin">
                        <div class="cl-Mako dark-xs group-header">
                            Application Opt-in Requirements
                        </div>
                    </div>
                    <div
                        v-for="item in lineItems"
                        :key="item.id"
                        class="hr-style"
                    >
                        <component-factory
                            ref="getData"
                            :lineItem="item"
                            :parentState="true"
                            textClass="group-header"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenButton,
    flatBtn,
    NitrozenInput,
    NitrozenError
} from '@gofynd/nitrozen-vue';
import {
    getCheckboxComponent,
    getGroupComponent,
    getRadioGroup,
    getRadioComponent
} from '@/helper/admin-config.util';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';

import Loader from '@/components/common/loader';
import ComponentFactory from './components/component-factory.vue';
import MiniImageUploader from '@/components/common/image-uploader/mini-image.vue';
import InternalMarketplaceAdminService from '@/services/internal-marketplaces.service';

import safeAccess from 'safe-access';
import slugify from 'slugify';
import isEmpty from 'lodash/isEmpty';
import { dirtyCheckMixin } from '@/mixins/dirty-check.mixin';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
export default {
    name: 'update-marketplace',
    components: {
        NitrozenInput,
        NitrozenButton,
        NitrozenError,
        'image-uploader': MiniImageUploader,
        'page-header': PageHeader,
        loader: Loader,
        'component-factory': ComponentFactory,
        'page-error': PageError
    },
    directives: {
        flatBtn
    },
    mixins: [dirtyCheckMixin],
    data() {
        return {
            pageLoading: true,
            pageError: false,
            pageTitle: 'Create Application',
            lineItems: [],
            serverConfigIdentifier: 'brand',
            item: {
                logo: '',
                name: '',
                slug: ''
            },
            errors: {},
            applicationId: this.$route.params.applicationId,
            originalData: []
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.pageLoading = true;
            this.pageError = false;
            if (this.applicationId) {
                this.fetchData()
                    .then((storedConfig) => {
                        this.pageLoading = false;
                        this.item.logo = storedConfig.logo;
                        this.item.name = storedConfig.name;
                        this.item.slug = storedConfig.slug;

                        this.lineItems = [
                            this.getCompanyComponent(
                                storedConfig.validation.company
                            ),
                            this.getBrandComponent(
                                storedConfig.validation.brand
                            ),
                            this.getLocationComponent(
                                storedConfig.validation.location
                            ),
                            this.getProductComponent(
                                storedConfig.validation.product
                            ),
                            this.getInventoryComponent(
                                storedConfig.validation.inventory
                            )
                        ];
                    })
                    .catch(() => {
                        this.pageLoading = true;
                        this.pageError = true;
                    });
            } else {
                this.pageLoading = false;
                this.lineItems = [
                    this.getCompanyComponent({}),
                    this.getBrandComponent({}),
                    this.getLocationComponent({}),
                    this.getProductComponent({}),
                    this.getInventoryComponent({})
                ];
                this.originalData = cloneDeep(this.lineItems);
            }
        },
        fetchData() {
            return new Promise((resolve, reject) => {
                InternalMarketplaceAdminService.fetchMarketplaceDetails(
                    this.applicationId
                )
                    .then(({ data }) => {
                        return resolve(data);
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError(
                            'Failed to Load Config',
                            { duration: 2000 }
                        );
                        return reject(err);
                    });
            });
        },
        saveForm() {
            if (!this.validateForm()) {
                this.$snackbar.global.showError(
                    'Form validation failed. Please correct the form according to the error messages displayed in red'
                );
                return;
            }
            let formData = {};
            this.lineItems.map((data, index) => {
                formData[data.id] = this.$refs.getData[index].saveForm();
            });
            let updateData = {
                name: this.item.name,
                slug: this.item.slug,
                logo: this.item.logo,
                validation: {
                    company: {
                        verified: formData.company.verified,
                        gst_required: formData.company.gst_required,
                        bank_ac_required: formData.company.bank_account_required
                    },
                    brand: {
                        consent_doc_required:
                            formData.brand.consent_document_required,
                        stage: formData.brand.brand_stage
                    },
                    location: {
                        gst_required: formData.location.gst_required,
                        stage: formData.location.location_stage
                    },
                    product: {
                        stage: formData.product.product_stage,
                        imageless_products: formData.product.imageless_allowed,
                        gated_category_applicable:
                            formData.product.gated_category_applicable
                    },
                    inventory: {
                        out_of_stock_products: formData.inventory.out_of_stocks
                    }
                }
            };
            if (this.applicationId) {
                InternalMarketplaceAdminService.updateMarketPlaceDetails(
                    this.applicationId,
                    updateData
                )
                    .then(() => {
                        this.$snackbar.global.showSuccess(
                            'MarketPlace Updated Successfully',
                            { duration: 2000 }
                        );
                        this.init();
                    })
                    .catch(() => {
                        this.$snackbar.global.showError(
                            'Failed to Update MarketPlace',
                            { duration: 2000 }
                        );
                    });
            } else {
                InternalMarketplaceAdminService.createMarketPlace(updateData)
                    .then(() => {
                        this.$snackbar.global.showSuccess(
                            'MarketPlace Created Successfully',
                            { duration: 2000 }
                        );
                    })
                    .catch(() => {
                        this.$snackbar.global.showError(
                            'Failed to Create MarketPlace',
                            { duration: 2000 }
                        );
                    });
            }
        },
        getCompanyComponent(companyDetails) {
            return getGroupComponent('company', 'Company', [
                getCheckboxComponent(
                    'verified',
                    'Only allow verified companies',
                    safeAccess(companyDetails, 'verified')
                ),
                getCheckboxComponent(
                    'gst_required',
                    'Only allow companies having GST',
                    safeAccess(companyDetails, 'gst_required')
                ),
                getCheckboxComponent(
                    'bank_account_required',
                    'Only allow companies with verified bank accounts',
                    safeAccess(companyDetails, 'bank_ac_required')
                )
            ]);
        },
        getBrandComponent(brandDetails) {
            return getGroupComponent('brand', 'Brand', [
                getRadioGroup(
                    `brand_stage`,
                    '',
                    safeAccess(brandDetails, 'stage') || 'all',
                    [
                        getRadioComponent(
                            'verified',
                            'Only allow verified brands',
                            []
                        ),
                        getRadioComponent('all', 'Allow all brands', [])
                    ]
                ),
                getCheckboxComponent(
                    'consent_document_required',
                    'Should have a consent document uploaded',
                    safeAccess(brandDetails, 'consent_doc_required')
                )
            ]);
        },
        getLocationComponent(locationDetails) {
            return getGroupComponent('location', 'Location', [
                getRadioGroup(
                    `location_stage`,
                    '',
                    safeAccess(locationDetails, 'stage') || 'all',
                    [
                        getRadioComponent(
                            'verified',
                            'Only allow verified locations',
                            []
                        ),
                        getRadioComponent('all', 'Allow all locations', [])
                    ]
                ),
                getCheckboxComponent(
                    'gst_required',
                    'Location should have GST details added',
                    safeAccess(locationDetails, 'gst_required')
                )
            ]);
        },
        getProductComponent(productDetails) {
            return getGroupComponent('product', 'Product', [
                getRadioGroup(
                    `product_stage`,
                    '',
                    safeAccess(productDetails, 'stage') || 'all',
                    [
                        getRadioComponent(
                            'verified',
                            'Only allow verified products',
                            []
                        ),
                        getRadioComponent('all', 'Allow all products', [])
                    ]
                ),
                getCheckboxComponent(
                    'imageless_allowed',
                    'Display imageless products',
                    safeAccess(productDetails, 'imageless_products')
                ),
                getCheckboxComponent(
                    'gated_category_applicable',
                    'Apply category restrictions to Products',
                    safeAccess(productDetails, 'gated_category_applicable')
                )
            ]);
        },
        getInventoryComponent(inventoryDetails) {
            return getGroupComponent('inventory', 'Inventory', [
                getCheckboxComponent(
                    'out_of_stocks',
                    'Show out of stock products',
                    safeAccess(inventoryDetails, 'out_of_stock_products')
                )
            ]);
        },
        checkRequired(prop) {
            let isValid = true;
            this.$set(this.errors, prop, '');

            if (!this.item[prop] || isEmpty(this.item[prop])) {
                isValid = false;
                this.errors[prop] = `required`;
            }

            return isValid;
        },
        updateSlug(str) {
            if (this.editMode) return;
            this.$set(
                this.item,
                'slug',
                slugify(str, {
                    lower: true,
                    strict: true
                })
            );
        },
        validateForm() {
            let formValid = true;
            formValid = this.checkRequired('name') && formValid;
            formValid = this.checkRequired('slug') && formValid;
            formValid = this.checkRequired('logo') && formValid;
            return formValid;
        },


        // dirtForm check
        isFormDirty() {
            return !isEqual(this.originalData, this.lineItems);
        }
    }
};
</script>

<style lang="less" scoped>
.header-position {
    height: 58.5px;
}

.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }
}
.cell-value {
    width: 100%;
}
.page-container {
    flex-direction: row;
    width: auto;
    padding: 0;
    background-color: @Alabaster2;
    line-height: 16px;
    .form-container {
        display: block;
        flex: 1;
        padding: 24px;
        border-radius: 8px;
        background-color: @White;
    }
}
.border-line {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin-top: 40px;
}

.group-header {
    font-weight: 600;
    font-size: 14px;
    width: 100%;
    padding: 16px 0px;
}
.name {
    width: 50%;
    margin-left: 24px;
}
.card-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    align-self: center;

    img {
        align-items: center;
        min-height: 40px;
        max-height: 40px;
        min-width: 40px;
        max-width: 40px;
    }
}

.margin {
    padding: 0px 24px;
}

.hr-style {
    border-top: 1px solid #e0e0e0;
}
</style>
