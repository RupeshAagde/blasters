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
    getCheckboxComponent,
    getToggleComponent,
    getGroupComponent,
    getRadioGroup,
    getRadioComponent,
    getRangeComponent,
} from '@/helper/admin-config.util';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';

import Loader from '@/components/common/loader';
import InternalSettings from '@/services/internal-settings.service';
import ComponentFactory from './components/component-factory.vue';
import safeAccess from 'safe-access';
export default {
    name: 'brand-config',
    components: {
        'nitrozen-button': NitrozenButton,
        'page-header': PageHeader,
        'page-error': PageError,
        loader: Loader,
        'component-factory': ComponentFactory,
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
            pageTitle: 'Brand',
            lineItems: [],
            serverConfigIdentifier: 'brand',
        };
    },
    methods: {
        init() {
            this.fetchData().then((storedConfig) => {
                this.lineItems = [
                    this.getAutoVerifyComponent(storedConfig),
                    this.getBrandDocumentsComponent(storedConfig),
                    this.getBrandLogoComponent(storedConfig),
                    this.getBrandLandscapeBannerComponent(storedConfig),
                    this.getBrandPortraitBannerComponent(storedConfig),
                ];
            }).catch(() => {});
        },
        fetchData() {
            this.pageLoading = true;
            this.pageError = false;
            return new Promise((resolve, reject) => {
                InternalSettings.getAdminConfig(this.serverConfigIdentifier)
                    .then(({ data }) => {
                        this.pageLoading = false;
                        return resolve(data.configuration);
                    })
                    .catch((err) => {
                        this.pageLoading = false;
                        this.pageError = true;
                        this.$snackbar.global.showError('Failed to Load Config',{duration: 2000});
                        return reject(err);
                    });
            });
        },
        saveForm() {
            let formData = {};
            try{
                    this.lineItems.map((data, index) => {
                    formData[data.id] = this.$refs.getData[index].saveForm();
                });

            }
            catch(error){
                this.$snackbar.global.showError(
                    error.message
                );
                return;
            }
            let error = this.validateForm(formData);
            if (error) {
                this.$snackbar.global.showError(`Form validation failed. ${error}` , {duration: 5000});
                return;
            }

            let updateData = {
                configuration: {
                    auto_verify: {
                        enabled: safeAccess(formData, 'auto_verify.enabled') || false,
                    },
                    documents: {
                        enabled: safeAccess(formData, 'brand_documents.enabled') || false,
                        mandatory: safeAccess(formData, 'brand_documents.mandatory'),
                        documents:{
                            authorization_letter: safeAccess(formData, 'brand_documents.documents.authorization_letter'),
                            trademark_certificate: safeAccess(formData, 'brand_documents.documents.trademark_certificate'),
                            trademark_certificate_application: safeAccess(formData, 'brand_documents.documents.trademark_certificate_application'),
                            other: safeAccess(formData, 'brand_documents.documents.other')
                        }
                    },
                    brand_logo: {
                        dimensions: {
                            width: safeAccess(formData, 'brand_logo.dimensions_header.dimensions.from'),
                            height: safeAccess(formData, 'brand_logo.dimensions_header.dimensions.to'),
                        },
                        fixed_aspect_ratio: safeAccess(formData, 'brand_logo.brand_logo_aspect_ratio') || false,
                    },
                    brand_landscape_banner: {
                        dimensions: {
                            width: safeAccess(formData, 'brand_landscape_banner.dimensions_header.dimensions.from'),
                            height: safeAccess(formData, 'brand_landscape_banner.dimensions_header.dimensions.to'),
                        },
                        fixed_aspect_ratio: safeAccess(formData, 'brand_landscape_banner.brand_landscape_banner_aspect_ratio') || false,
                    },
                    brand_portrait_banner: {
                        dimensions: {
                            width: safeAccess(formData, 'brand_portrait_banner.dimensions_header.dimensions.from'),
                            height: safeAccess(formData, 'brand_portrait_banner.dimensions_header.dimensions.to'),
                        },
                        fixed_aspect_ratio: safeAccess(formData, 'brand_portrait_banner.brand_portrait_banner_aspect_ratio') || false,
                    },
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
                'Auto-verify Brand',
                safeAccess(apiConfig,'auto_verify.enabled')
            );
        },
        getBrandDocumentsComponent(apiConfig) {
            return getToggleComponent(
                'brand_documents',
                'Brand Documents',
                safeAccess(apiConfig,'documents.enabled'),
                [
                    getCheckboxComponent(
                        'mandatory',
                        'Make document upload mandatory',
                         safeAccess(apiConfig,'documents.mandatory')
                    ),
                    getGroupComponent('documents', 'Documents', [
                        getCheckboxComponent(
                            'authorization_letter',
                            'Authorization Letter',
                             safeAccess(apiConfig,'documents.documents.authorization_letter')
                        ),
                        getCheckboxComponent(
                            'trademark_certificate',
                            'Trademark Certificate',
                             safeAccess(apiConfig,'documents.documents.trademark_certificate')
                        ),
                        getCheckboxComponent(
                            'trademark_certificate_application',
                            'Trademark Certificate Application',
                             safeAccess(apiConfig,'documents.documents.trademark_certificate_application')
                        ),
                        getCheckboxComponent('other', 'Other', safeAccess(apiConfig,'documents.documents.other')),
                    ]),
                ]
            );
        },
        getBrandLogoComponent(apiConfig) {
            return getGroupComponent('brand_logo', 'Brand Logo', [
                ...this.getImageComponent('brand_logo', safeAccess(apiConfig,'brand_logo')),
            ]);
        },
        getBrandLandscapeBannerComponent(apiConfig) {
            return getGroupComponent(
                'brand_landscape_banner',
                'Brand Landscape Banner',
                [
                    ...this.getImageComponent('brand_landscape_banner',safeAccess(apiConfig,'brand_landscape_banner')),
                ]
            );
        },
        getBrandPortraitBannerComponent(apiConfig) {
            return getGroupComponent(
                'brand_portrait_banner',
                'Brand Portrait Banner',
                [
                    ...this.getImageComponent('brand_portrait_banner', safeAccess(apiConfig,'brand_portrait_banner')),
                ]
            );
        },

        getImageComponent(id, data) {
            return [
                getGroupComponent('dimensions_header', 'Image Dimensions', [
                    getRangeComponent(
                        'dimensions',
                        'Enter the minimum dimensions (in pixels)',
                        safeAccess(data, 'dimensions.width'),
                        safeAccess(data, 'dimensions.height'),
                        {
                            fromPlaceholder: 'Min Width',
                            toPlaceholder: 'Min Height',
                            minValue:0
                        }
                    ),
                ]),
                getRadioGroup(
                    `${id}_aspect_ratio`,
                    'Maintain Aspect Ratio',
                    safeAccess(data,'fixed_aspect_ratio') | 0,
                    [
                        getRadioComponent(1, 'True'),
                        getRadioComponent(0, 'False'),
                    ]
                ),
            ];
        },

        validateForm(formData){
            if(safeAccess(formData, 'brand_logo.brand_logo_aspect_ratio')){
                if(!safeAccess(formData, 'brand_logo.dimensions_header.dimensions.from') || ! safeAccess(formData, 'brand_logo.dimensions_header.dimensions.to')){
                    return "Brand logo dimensions must be positive Numbers";
                }
            }
            if(safeAccess(formData, 'brand_landscape_banner.brand_landscape_banner_aspect_ratio')){
                if(!safeAccess(formData, 'brand_landscape_banner.dimensions_header.dimensions.from') || ! safeAccess(formData, 'brand_landscape_banner.dimensions_header.dimensions.to')){
                    return "Brand Landscape Banner dimensions must be positive Numbers";
                }
            }
            if(safeAccess(formData, 'brand_portrait_banner.brand_portrait_banner_aspect_ratio')){
                if(!safeAccess(formData, 'brand_portrait_banner.dimensions_header.dimensions.from') || ! safeAccess(formData, 'brand_portrait_banner.dimensions_header.dimensions.to')){
                    return "Brand Portrait Banner dimensions must be positive Numbers";
                }
            }
        }
    },
};
</script>
