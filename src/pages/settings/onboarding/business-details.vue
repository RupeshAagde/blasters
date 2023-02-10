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
.cursor-pointer {
    cursor: pointer;
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
import {
    NitrozenButton,
    flatBtn,
} from '@gofynd/nitrozen-vue';
import {
    getCheckboxComponent,
    getToggleComponent,
    getGroupComponent
} from '@/helper/admin-config.util';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';

import Loader from '@/components/common/loader';
import CompanyService from '@/services/company-admin.service';
import ComponentFactory from './components/component-factory.vue';
import InternalSettings from '@/services/internal-settings.service';
import safeAccess from 'safe-access';

const SIGNATURE_KEY = "digital-signature"

export default {
    name: 'business-details',
    components: {
        'nitrozen-button': NitrozenButton,
        'page-error': PageError,
        'page-header': PageHeader,
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
            pageTitle: 'Business Details',
            lineItems: [],
            serverConfigIdentifier: 'business-details',
            businessTypes:[],
            companyTypes:[]
        };
    },
    methods: {
        init() {
            this.pageLoading = true;
            this.pageError = false
            Promise.all([
                this.fetchChoices('business_type'),
                this.fetchChoices('company_type'),
            ]).then(res => {
                this.businessTypes = res[0].items;
                this.companyTypes = res[1].items;
                return this.getSavedDetails();
            }).then((res) => {
                this.pageLoading = false;
                this.lineItems = [
                    this.getBusinessDocumentsComponent(safeAccess(res, 'legal_documents')),
                    this.getCompanyTypeComponent(safeAccess(res, 'company_type')),
                    this.getAnnualTurnoverComponent(safeAccess(res, 'annual_turnover')),
                    this.getAboutBusinessComponent(safeAccess(res, 'about_business')),
                    this.getWebsiteUrlComponent(safeAccess(res, 'website_url')),
                    this.getCompositeTaxationComponent(safeAccess(res, 'composite_taxation')),
                ];
            }).catch((error) => {
                console.log(error, 'error')
                this.pageLoading = false;
                this.pageError = true
            });
        },
        fetchChoices(choiceType){
            const query = {
                choice_type: choiceType,
            };
            return CompanyService.fetchChoiceType(query).then(({ data }) => {
                return data;
            });
        },

        getSavedDetails() {
            return new Promise((resolve, reject) => {
                InternalSettings.getAdminConfig(this.serverConfigIdentifier)
                    .then(({ data }) => {
                        return resolve(data.configuration);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        saveForm() {
            let formData = {};
            let companyTypesUpdatedData = {};
            let businessTypesUpdatedData = {};

            this.lineItems.map((data, index) => {
                formData[data.id] = this.$refs.getData[index].saveForm();
            });

            this.companyTypes.map(companyType => {
                companyTypesUpdatedData[companyType.key] = safeAccess(formData, `company_type.company_type.${companyType.key}`)|| false;
            });
            this.businessTypes.map(businessType => {
                businessTypesUpdatedData[businessType.key] = this.getUpdatedDocuments(formData, businessType.key)
            });

                
            let updateData = {
                configuration: {
                    legal_documents:{
                        enabled: safeAccess(formData, 'legal_documents.enabled') || false,
                        ...businessTypesUpdatedData,
                    },
                    company_type: {
                        enabled: safeAccess(formData, 'company_type.enabled')|| false,
                        types: companyTypesUpdatedData
                    },
                    annual_turnover: {
                        enabled: safeAccess(formData, 'annual_turnover.enabled')|| false,
                        mandatory:  safeAccess(formData, 'annual_turnover.mandatory')|| false,
                    },
                    about_business: {
                        enabled: safeAccess(formData, 'about_business.enabled')|| false,
                        mandatory:  safeAccess(formData, 'about_business.mandatory')|| false,
                    },
                    website_url: {
                        enabled: safeAccess(formData, 'website_url.enabled')|| false,
                        mandatory:  safeAccess(formData, 'website_url.mandatory')|| false,
                    },
                    composite_taxation: {
                        enabled: safeAccess(formData, 'composite_taxation.enabled')|| false,
                    }
                }
            }
            InternalSettings.saveAdminConfig(this.serverConfigIdentifier, updateData)
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess('Config Updated Successfully',{duration: 2000});
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to Update Config',{duration: 2000});
                });

        },
        getBusinessDocumentsComponent(legal_documents) {
            return getToggleComponent(
                'legal_documents',
                'Legal Documents',
                safeAccess(legal_documents, 'enabled') || false,
                [
                    {
                        id: 'documents',
                        type: 'documents',
                        text: 'Select Business Type',
                        data: {
                            lineItems: this.businessTypes.map(businessType => {
                                return getCheckboxComponent(
                                    businessType.key,
                                    businessType.value, 
                                    true,
                                    this.getDocumentsGroup(businessType, safeAccess(legal_documents, businessType.key))
                                )
                            })
                        },
                    },
                ]
            );
        },
        getCompanyTypeComponent(company_type) {
            return getToggleComponent(
                'company_type',
                'Company Type',
                safeAccess(company_type,'enabled'),
                [
                    getGroupComponent(
                        'company_type',
                        'Select Company Type',
                        this.companyTypes.map(companyType => {
                                return getCheckboxComponent(
                                    companyType.key,
                                    companyType.value,
                                    safeAccess(company_type,`types.${companyType.key}`),
                                )
                            })
                    ),
                ]
            );
        },
        getAnnualTurnoverComponent(annual_turnover) {
            return getToggleComponent(
                'annual_turnover',
                'Annual Turnover',
                safeAccess(annual_turnover,'enabled'),
                [
                    getCheckboxComponent(
                        'mandatory',
                        'Make this field mandatory',
                        safeAccess(annual_turnover,'mandatory'),
                    ),
                ]
            );
        },
        getAboutBusinessComponent(about_business) {
            return getToggleComponent(
                'about_business',
                'About Business',
                safeAccess(about_business,'enabled'),
                [
                    getCheckboxComponent(
                        'mandatory',
                        'Make this field mandatory',
                        safeAccess(about_business,'mandatory'),
                    ),
                ]
            );
        },
        getWebsiteUrlComponent(website_url) {
            return getToggleComponent(
                'website_url',
                'Website URL',
                 safeAccess(website_url,'enabled'),
                [
                    getCheckboxComponent(
                        'mandatory',
                        'Make this field mandatory',
                        safeAccess(website_url,'mandatory'),
                    ),
                ]
            );
        },
        getCompositeTaxationComponent(composite_taxation) {
            return getToggleComponent(
                'composite_taxation',
                'Composite Taxation',
                safeAccess(composite_taxation,'enabled'),
            );
        },


        // Business Type List
        getDocumentsGroup(businessType, savedDocumentsData) {
            return businessType.documents && businessType.documents.map(documentClass => {
                let matchingBusinessDocument = {};
                if (savedDocumentsData) {
                    savedDocumentsData.map(savedDocument => {
                        if (savedDocument.key == documentClass.key) {
                            matchingBusinessDocument = savedDocument
                        }
                    })
                }
                return this.getDocumentComponent(documentClass, matchingBusinessDocument);
            });
        },

        getDocumentComponent(documentClass, savedDocumentData) {
            let documentField = {
                "url": function (isSelected) { return getCheckboxComponent('url', 'Make document upload mandatory', isSelected) },
                "value": function (isSelected) { return getCheckboxComponent('value', 'Collect ID Number', isSelected) },
                "legal_name": function (isSelected) { return getCheckboxComponent('legal_name', 'Collect Name as per ID', isSelected) }
            }
            let isMandatory = documentClass.required;
            let isEnabled = isMandatory || savedDocumentData.enabled

            // TODO clean up, Improve readability
            let lineItems = documentClass.schema.required.map(field => {
                let isSelected = savedDocumentData.required && savedDocumentData.required.includes(field) ? true : false;
                return documentField[field](isSelected);
            })

            if (documentClass) {
                // TODO: HARD CODING Special logic since we are getting additional field from backend, to be removed once deleted from backend
                if (documentClass.key === SIGNATURE_KEY) {
                    lineItems = []
                }
            }
            return getToggleComponent(documentClass.key, documentClass.value, isEnabled, lineItems, { disabled: isMandatory }
            );
        },

        getUpdatedDocuments(formData, businessType) {
            let rawDocuments = safeAccess(formData, `legal_documents.documents.${businessType}`);
            let processedDocumentsData = [];
            if (rawDocuments) {
                processedDocumentsData = Object.keys(rawDocuments).map(documentKey => {
                    let documentClass = rawDocuments[documentKey];
                    let processedDocumentClass = {
                        key: documentKey,
                        enabled: documentClass.enabled || false,
                        required: []
                    }
                    if (documentKey === SIGNATURE_KEY && documentClass.enabled) {
                        // TODO cleanup speacial case handling 
                        processedDocumentClass.required.push("url")
                    } else {
                        Object.keys(documentClass).map(documentClassKey => {
                            if (documentClassKey != "enabled" && documentClass[documentClassKey]) {
                                processedDocumentClass.required.push(documentClassKey);
                            }
                        })
                    }

                    return processedDocumentClass;
                })
            }
            return processedDocumentsData
        }
    },
};
</script>
