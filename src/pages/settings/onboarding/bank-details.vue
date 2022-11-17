<template>
    <div class="panel">
        <div class="header-position">
            <page-header :title="pageTitle" @backClick="$router.push({ name: 'settings' })" :noContextMenu="true">
                <div class="button-box">
                    <nitrozen-button class="pad-left" :theme="'secondary'" v-flatBtn ref="save-button" id="save"
                        @click="saveForm">Save</nitrozen-button>
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading"></loader>
        <page-error v-else-if="pageError"></page-error>
        <div class="page-container" v-else>
            <!-- Details -->
            <div class="form-container">
                <div v-for="item in lineItems" :key="item.id" class="border">
                    <component-factory :lineItem="item" :parentState="true" ref="getData" textClass="group-header">
                    </component-factory>
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
    getRadioGroup,
    getRadioComponent,
    getCheckboxComponent
} from '@/helper/admin-config.util';
import PageHeader from '@/components/common/layout/page-header';
import PageError from '@/components/common/page-error';

import Loader from '@/components/common/loader';
import GringottsSettings from '@/services/gringotts.service';
import ComponentFactory from './components/component-factory.vue';
import safeAccess from 'safe-access';
export default {
    name: 'bank-config',
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
            pageTitle: 'Bank Details',
            lineItems: [],
        };
    },
    methods: {
        init() {
            this.pageLoading = true;
            this.pageError = false
            this.fetchData().then((storedConfig) => {
                this.lineItems = [
                    this.getCancelledChequeComponent(storedConfig),
                    this.getPennyDropComponent(storedConfig)
                ];
                this.pageLoading = false;
            }).catch((error) => {
                console.log(error);
                this.pageLoading = false;
                this.pageError = true
            });
        },
        fetchData() {
            return new Promise((resolve, reject) => {
                GringottsSettings.getPlatformConfig()
                    .then(({ data }) => {
                        return resolve(data);
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError('Failed to Load Config', { duration: 2000 });
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
                cancelled_cheque: {
                    enabled: safeAccess(formData, 'cancelled_cheque.enabled'),
                    document_mandatory:  safeAccess(formData, 'cancelled_cheque.document_mandatory'),
                },
                penny_drop: {
                    enabled: safeAccess(formData, 'penny_drop.enabled'),
                    service_provider: safeAccess(formData, 'penny_drop.service_provider')
                }
            };
            console.log(updateData);
            GringottsSettings.savePlatformConfig(updateData)
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess('Config Updated Successfully', { duration: 2000 });
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to Update Config', { duration: 2000 });
                });
        },
        getCancelledChequeComponent(storedConfig) {
            return getToggleComponent(
                'cancelled_cheque',
                'Ask for cancelled cheque',
                safeAccess(storedConfig, 'cancelled_cheque.enabled'),
                [
                    getCheckboxComponent(
                        'document_mandatory',
                        'Make document upload mandatory',
                        safeAccess(storedConfig, 'cancelled_cheque.document_mandatory'),
                    )
                ]
            );
        },
        getPennyDropComponent(storedConfig) {
            return getToggleComponent(
                'penny_drop',
                'Trigger Penny Drop Test',
                safeAccess(storedConfig, 'penny_drop.enabled'),
                [
                    getRadioGroup(
                        'service_provider',
                        'Select a Service Provider',
                        safeAccess(storedConfig, 'penny_drop.service_provider'),
                        storedConfig.service_providers.map(service_provider => {
                            return getRadioComponent(service_provider.code, service_provider.display_name, []);
                        })                            
                        
                    ),
                ]
            );
        }
    },
};
</script>
