<template>
    <div class="panel">
        <div class="header-position">
            <page-header
                :title="pageTitle"
                @backClick="$router.push({ name: 'settings' })"
                :noContextMenu="true"
            >
                <div class="button-box">
                    <nitrozen-button
                        id="save"
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
        <loader v-if="pageLoading"></loader>
        <page-error v-else-if="pageError"></page-error>
        <div class="page-container" v-else>
            <!-- Details -->
            <div class="form-container">
                <div v-for="item in lineItems" :key="item.id" class="border">
                    <component-factory
                        :lineItem="item"
                        :parentState="true"
                        ref="getData"
                        textClass="group-header"
                    ></component-factory>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.header-position {
    height: 58.5px;
}

.page-container {
    flex-direction: row;
    width: auto;
    padding: 0;
    background-color: @Alabaster2;
    .form-container {
        display: block;
        flex: 1;
        border-radius: 8px;
        background-color: @White;
    }
}
.border {
    border: 1px solid #E0E0E0;
    border-radius: 8px;
    margin: 24px;
}
</style>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
import {
    getToggleComponent,
    getGroupComponent,
    getBadge,
    getCheckboxComponent,
    getDropDownComponent,
} from '@/helper/admin-config.util';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';

import Loader from '@/components/common/loader';
import InternalSettings from '@/services/internal-settings.service';
import ComponentFactory from './components/component-factory.vue';
import CatalogService from '../../../services/catalog.service';
import safeAccess from 'safe-access';

// const PRODUCT_TEMPLATE_TYPE = 'product_template_types';
export default {
    name: 'product-config',
    components: {
        'nitrozen-button': NitrozenButton,
        'page-header': PageHeader,
        loader: Loader,
        'component-factory': ComponentFactory,
        'page-error': PageError
    },
    directives: {
        flatBtn,
    },
    mounted() {
        this.init();
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            pageTitle: 'Product',
            lineItems: [],
            serverConfigIdentifier: 'product',
            // templateTypes: [],
        };
    },
    methods: {
        init() {
            this.pageLoading = true;
            this.pageError = false;
            // fetch choices data and product data
            // Promise.all([this.fetchData(), this.fetchChoices()]).then((data) => {
            Promise.all([this.fetchData()]).then((data) => {
                let storedConfig = data[0];
                // let templateTypeChoices = data[1] || [];
                // this.templateTypes = templateTypeChoices || [];
                this.lineItems = [
                    this.getProductUpdateComponent(storedConfig),
                    this.getNationalPricingComponent(storedConfig),
                    this.getReturnConfigurationOnProduct(storedConfig),
                    this.getAutoVerifyComponent(storedConfig),
                    // this.getProductTemplateComponent(storedConfig),
                ];
                this.pageLoading = false;
            }).catch((error) => {
                this.pageLoading = false;
                this.pageError = true
            });
        },
        // fetchChoices() {
        //     let params = {
        //         choice_type: PRODUCT_TEMPLATE_TYPE
        //     }
        //     return new Promise((resolve, reject) => {
        //         CatalogService.fetchChoices(params)
        //             .then((res) => {
        //                 return resolve(res.data.items);
        //             })
        //             .catch((err) => {
        //                 this.$snackbar.global.showError('Failed to Load Product Template Types',{duration: 2000});
        //                 return reject(err);                      
        //             })
        //     })
        // },
        fetchData() {
            return new Promise((resolve, reject) => {
                InternalSettings.getAdminConfig(this.serverConfigIdentifier)
                    .then(({ data }) => {
                        return resolve(data.configuration);
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError('Failed to Load Config',{duration: 2000});
                        return reject(err);
                    });
            });
        },
        saveForm() {
            let formData = {};
            this.lineItems.map((data, index) => {
                formData[data.id] = this.$refs.getData[index].saveForm();
            });
            let updateData = {
                configuration: {
                    product_update:{
                        restricted_gategory_rules_applicable: safeAccess(formData, 'product_update.restricted_gategory_rules_applicable') || false,
                        gst_exemption_applicable: safeAccess(formData, 'product_update.gst_exemption_applicable') || false,
                        product_verification_media_mandatory: safeAccess(formData, 'product_update.product_verification_media_mandatory') || false,
                    },
                    auto_verify: {
                        enabled: safeAccess(formData, 'auto_verify.enabled') || false,
                    },
                    national_pricing: {
                        enabled: safeAccess(formData, 'national_pricing.enabled') || false,
                    },
                    return_config: {
                        enabled: safeAccess(formData, 'return_config.enabled') || false,
                    },
                    // product_template_type: safeAccess(formData, 'product_template.product_template_type')
                },
            };
            InternalSettings.saveAdminConfig(this.serverConfigIdentifier, updateData)
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess('Config Updated Successfully',{duration: 2000});
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to Update Config',{duration: 2000});
                });
        },

        getAutoVerifyComponent(apiConfig) {
            return getToggleComponent(
                'auto_verify',
                'Auto Verify',
                safeAccess(apiConfig,'auto_verify.enabled'),
                [getBadge(
                        'note',
                        'Note: Product must be in active state'
                    ),]
            );
        },
        getNationalPricingComponent(apiConfig) {
            return getToggleComponent(
                'national_pricing',
                'National Pricing',
                safeAccess(apiConfig,'national_pricing.enabled')
            );
        },
        getReturnConfigurationOnProduct(apiConfig) {
            return getToggleComponent(
                'return_config',
                'Return Configuration on Product',
                safeAccess(apiConfig,'return_config.enabled')
            );
        },
        getProductUpdateComponent(apiConfig) {
            return getGroupComponent(
                'product_update',
                'Add and Edit Product',
                [
                    getCheckboxComponent(
                        'restricted_gategory_rules_applicable', 
                        'Restricted category requirements must be satisfied',
                        safeAccess(apiConfig, 'product_update.restricted_gategory_rules_applicable')
                    ),
                    getCheckboxComponent(
                        'gst_exemption_applicable', 
                        'GST Exempt/Non-Exempt shall apply',
                        safeAccess(apiConfig, 'product_update.gst_exemption_applicable')
                    ),
                    getCheckboxComponent(
                        'product_verification_media_mandatory', 
                        'Make media assets (e.g. images) mandatory for product verification',
                        safeAccess(apiConfig, 'product_update.product_verification_media_mandatory')
                    ),
                    getBadge(
                        'note',
                        'Note: Company and brand must be in verified state'
                    ),
                ]
            );
        },
        // getProductTemplateComponent(apiConfig) {
        //     return getGroupComponent(
        //         'product_template',
        //         'Product Template Type',
        //         [
        //             getDropDownComponent(
        //                 'product_template_type',
        //                 'Select Product Template',
        //                 safeAccess(apiConfig, 'product_template_type'),
        //                 undefined,
        //                 this.templateTypes
        //             )
        //         ]
        //     )
        // }
    },
};
</script>
