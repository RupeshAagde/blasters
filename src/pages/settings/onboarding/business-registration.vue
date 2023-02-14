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
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 24px;
}
</style>

<script>
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';
import {
    getCheckboxComponent,
    getToggleComponent,
    getBadge,
    getGroupComponent,
} from '@/helper/admin-config.util';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';
import Loader from '@/components/common/loader';

import CompanyService from '@/services/company-admin.service';
import InternalSettings from '@/services/internal-settings.service';
import InternalMarketplaceAdminService from '@/services/internal-marketplaces.service';

import ComponentFactory from './components/component-factory.vue';
import safeAccess from 'safe-access';

export default {
    name: 'business-registration',
    components: {
        'nitrozen-button': NitrozenButton,
        'page-header': PageHeader,
        loader: Loader,
        'page-error': PageError,
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
            pageLoading: true,
            pageError: false,
            pageTitle: 'Business Registration',
            lineItems: [],
            availableSalesChannels: [],
            availableOptInApplications: [],
            serverConfigIdentifier: 'business-registration',
        };
    },
    methods: {
        init() {
            this.pageLoading = true;
            this.pageError = false;
            Promise.all([
                this.getMarketPlacesList(),
                this.getOptInApplicationsList(),
            ])
                .then((res) => {
                    return this.getSavedDetails();
                })
                .then((storedConfig) => {
                    this.pageLoading = false;
                    this.lineItems = [
                        this.getCompositeTaxPayerComponent(storedConfig),
                        this.getAutoVerificationComponent(storedConfig),
                        this.getSalesChannelComponent(storedConfig),
                        this.getReferralCodeComponent(storedConfig),
                        ...this.getOptInComponent(storedConfig),
                        this.getExtensionsComponent(storedConfig),
                        this.getGenericBrandComponent(storedConfig),
                        this.getBusinessLocationComponent(storedConfig),
                    ];
                })
                .catch((error) => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        saveForm() {
            let formData = {};
            this.lineItems.map((data, index) => {
                formData[data.id] = this.$refs.getData[index].saveForm();
            });

            let preinstalledExtensions =
                safeAccess(formData, 'extensions.preinstalled_extensions') ||
                [];

            let updateData = {
                configuration: {
                    composite_tax_payer: {
                        enabled:
                            safeAccess(
                                formData,
                                 'composite_tax_payer.enabled'
                             ) || false,
                     },
                    business_verification: {
                        auto_verify:
                            safeAccess(
                                formData,
                                'business_verification.auto_verify'
                            ) || false,
                        verified_bank_required:
                            safeAccess(
                                formData,
                                'business_verification.verified_bank_required'
                            ) || false,
                    },
                    sales_channel: {
                        enabled:
                            safeAccess(formData, 'sales_channel.enabled') ||
                            false,
                        auto_create_website: safeAccess(
                            formData,
                            'sales_channel.auto_create_website'
                        ),
                        channels: safeAccess(
                            formData,
                            'sales_channel.channels'
                        ),
                    },
                    referral_code: {
                        enabled:
                            safeAccess(formData, 'referral_code.enabled') ||
                            false,
                    },
                    generic_brand_auto_optin: {
                        enabled:
                            safeAccess(formData, 'generic_brand.enabled') ||
                            false,
                    },
                    business_location_auto_create: {
                        enabled:
                            safeAccess(formData, 'business_location.enabled') ||
                            false,
                    },
                    preinstalled_extensions: {
                        enabled:
                            safeAccess(formData, 'extensions.enabled') || false,
                        extensions: preinstalledExtensions.map((extension) => {
                            return {
                                id: extension.id,
                                seller_panel: extension.sellerPanel,
                            };
                        }),
                    },
                    optin_application: {
                        show_application:
                            safeAccess(
                                formData,
                                'show_opt_in_application.enabled'
                            ) || false,
                        applications:
                            this.getOptInApplicationsSaveRequest(formData),
                    },
                },
            };
            InternalSettings.saveAdminConfig(
                this.serverConfigIdentifier,
                updateData
            )
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess(
                        'Config Updated Successfully',
                        { duration: 2000 }
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to Update Config', {
                        duration: 2000,
                    });
                });
        },

        // to fetch all available marketplaces / sales channels
        getMarketPlacesList() {
            const query = {
                choice_type: 'marketplaces',
            };
            return CompanyService.fetchChoiceType(query).then(({ data }) => {
                this.availableSalesChannels = data.items.map((item) => {
                    return {
                        id: item.value,
                        name: item.key,
                        logo: item.logo,
                    };
                });
            });
        },
        // to fetch all available opt in application
        getOptInApplicationsList() {
            let params = {
                page_no: 1,
                page_size: 100,
            };
            return InternalMarketplaceAdminService.fetchMarketplaces(
                params
            ).then(({ data }) => {
                this.availableOptInApplications = data.items.map((item) => {
                    return {
                        id: item.app_id,
                        name: item.name,
                        logo: item.logo,
                    };
                });
            });
        },
        // to fetch pre-saved admin configuration for 'business-registration'
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

        getAutoVerificationComponent(apiConfig) {
            return getGroupComponent(
                'business_verification',
                'Conditions for Seller Verification',
                [
                    getCheckboxComponent(
                        'verified_bank_required',
                        'Needs to have one verified bank account',
                        safeAccess(apiConfig, 'business_verification.verified_bank_required')
                    ),
                    getBadge(
                        'note',
                        'Note: GSTIN & PAN are necessary for seller verification'
                    ),
                    getCheckboxComponent(
                        'auto_verify',
                        'Auto-verify the seller',
                        safeAccess(apiConfig, 'business_verification.auto_verify')
                    ),
                ]
            );
        },
        getSalesChannelComponent(apiConfig) {
            return getToggleComponent(
                'sales_channel',
                'Preferred Sales Channels',
                safeAccess(apiConfig, 'sales_channel.enabled'),
                [
                    getCheckboxComponent(
                        'auto_create_website',
                        'Auto-create website application',
                        safeAccess(apiConfig, 'sales_channel.auto_create_website')
                    ),
                    getGroupComponent(
                        'channels',
                        'Sales Channel',
                        this.availableSalesChannels.map((salesChannel) => {
                            return getCheckboxComponent(
                                salesChannel.id,
                                salesChannel.name,
                                safeAccess(
                                    apiConfig,
                                    `sales_channel.channels.${salesChannel.id}`
                                ),
                                undefined,
                                { logo: salesChannel.logo }
                            );
                        })
                    ),
                ]
            );
        },
        getReferralCodeComponent(apiConfig) {
            return getToggleComponent(
                'referral_code',
                'Referral Code',
                safeAccess(apiConfig, 'referral_code.enabled')
            );
        },
        getCompositeTaxPayerComponent(apiConfig) {
            return getToggleComponent(
                'composite_tax_payer',
                'Allow Composite tax-payer type seller to register',
                safeAccess(apiConfig, 'composite_tax_payer.enabled')
            );
        },
        getOptInComponent(apiConfig) {
            return [getGroupComponent('opt_in', 'Auto Opt-in Application', [
                getGroupComponent(
                    'applications',
                    'Application',
                    this.availableOptInApplications.map((optInApplication) => {
                        return getToggleComponent(
                            optInApplication.id,
                            optInApplication.name,
                            safeAccess(apiConfig,`optin_application.applications.${optInApplication.id}`) || false,
                            undefined,
                            { logo: optInApplication.logo }
                        );
                    })
                ),
            ]),
            getToggleComponent(
                'show_opt_in_application',
                'Show Opt-in Applications in Seller Panel',
                safeAccess(apiConfig, 'optin_application.show_application')
            )]
        },
        getGenericBrandComponent(apiConfig) {
            return getToggleComponent(
                'generic_brand',
                'Auto Opt-in Generic Brand',
                safeAccess(apiConfig, 'generic_brand_auto_optin.enabled')
            );
        },
        getBusinessLocationComponent(apiConfig) {
            return getToggleComponent(
                'business_location',
                'Auto-create Business Location',
                safeAccess(apiConfig, 'business_location_auto_create.enabled'),
                null,
                {
                    infoText:
                        'Enabling this option will automatically create a selling location whose address will be same as the business address registered by the seller',
                }
            );
        },
        getExtensionsComponent(apiConfig) {
            let installedExtensions =
                safeAccess(apiConfig, 'preinstalled_extensions.extensions') ||
                [];
            return getToggleComponent(
                'extensions',
                'Pre-Install Extensions',
                safeAccess(apiConfig, 'preinstalled_extensions.enabled'),
                [
                    {
                        id: 'preinstalled_extensions',
                        type: 'extensions',
                        data: {
                            selectedData: installedExtensions.map(
                                (extension) => {
                                    return {
                                        id: extension.id,
                                        sellerPanel: extension.seller_panel || false,
                                    };
                                }
                            ),
                        },
                    },
                    getBadge(
                        'note',
                        'Note: All pre-installed extensions are free'
                    ),
                ]
            );
        },
        getOptInApplicationsSaveRequest(formData) {
            let applications = safeAccess(formData, 'opt_in.applications');
            let data = {};
            Object.keys(applications).map((application) => {
                data[application] = applications[application].enabled;
            });
            return data;
        },
    },
};
</script>

