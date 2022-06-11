<template>
    <div class="panel">
        <div class="page-container">
            <div class="provider-container">
                <adm-jumbotron
                    :title="'Provider'"
                    :desc="
                        'Use this section to configure the communication provider for email and messaging services. Here, you can swiftly integrate your service infrastructure through SMTP or API.'
                    "
                    btnLabel="Create"
                    @btnClick="createProvider"
                >
                    <nitrozen-button
                        v-flatBtn
                        :theme="'secondary'"
                        @click="setDefault"
                        class="btn-wrapper no-padding m-l-24"
                        >Set Default</nitrozen-button
                    >
                </adm-jumbotron>
                <loader v-if="pageLoading" class="loading"></loader>
                <div class="main-container">
                    <div class="group-name-container">
                        <nitrozen-tab
                            class="group-tab"
                            :activeIndex="activeGroupIndex"
                            @tab-change="changeGroupIndex"
                            :tabItem="tabs"
                            :label="'name'"
                        ></nitrozen-tab>
                    </div>
                </div>
            </div>
            <div
                class="search-box"
                v-if="
                    pageLoading ||
                        searchText !== '' ||
                        (this.activeGroupIndex == 0
                            ? emailProvidersStore &&
                              emailProvidersStore.items &&
                              emailProvidersStore.items.length != 0
                            : this.activeGroupIndex == 1
                            ? smsProvidersStore &&
                              smsProvidersStore.items &&
                              smsProvidersStore.items.length != 0
                            : null)
                "
            >
                <div
                    v-if="pageLoading && isInitialLoad"
                    class="input-shimmer shimmer"
                ></div>
                <template v-else>
                    <nitrozen-input
                        class="search-input"
                        :showSearchIcon="true"
                        type="search"
                        placeholder="Search template by name or tags"
                        v-model="searchText"
                        @keyup.enter="searchTemplate()"
                        @input="debounceInput"
                    ></nitrozen-input>
                </template>
            </div>
           

            <adm-modal
                :isOpen="showCreateModal"
                id="1"
                :title="'Select Provider'"
                @closeModal="closeCreateModal"
                :sidebarData="providersFiltered"
                @selectItem="onCreateModalSelect"
                @proceedClick="onCreateModalProceedClick"
                
            >
                <template slot="sidebar">
                    <nitrozen-input
                        :showSearchIcon="true"
                        placeholder="Search provider"
                        v-model="wizardSidebarSearch"
                        @keyup="onSearchInputChange"
                        class="modal-search"
                    >
                    </nitrozen-input>
                </template>
                <template slot="body">
                    <div v-if="wizardSelectedItem" class="flex">
                        <div
                            v-if="
                                PROVIDER_WIZARD_DETAILS[
                                    wizardSelectedItem.group
                                ][wizardSelectedItem.child.id]
                            "
                            class="logo"
                        >
                            <img
                                v-if="
                                    PROVIDER_WIZARD_DETAILS[
                                        wizardSelectedItem.group
                                    ][wizardSelectedItem.child.id].logo
                                "
                                class="logo"
                                :src="
                                    PROVIDER_WIZARD_DETAILS[
                                        wizardSelectedItem.group
                                    ][wizardSelectedItem.child.id].logo
                                "
                            />
                            <div v-else class="text-logo">
                                {{
                                    PROVIDER_WIZARD_DETAILS[
                                        wizardSelectedItem.group
                                    ][wizardSelectedItem.child.id].title
                                }}
                            </div>
                        </div>
                        <div class="provider-wrapper">
                            <div
                                v-if="
                                    PROVIDER_WIZARD_DETAILS[
                                        wizardSelectedItem.group
                                    ][wizardSelectedItem.child.id]
                                "
                                class="title"
                            >
                                {{
                                    PROVIDER_WIZARD_DETAILS[
                                        wizardSelectedItem.group
                                    ][wizardSelectedItem.child.id].title
                                }}
                            </div>
                            <div
                                v-if="
                                    PROVIDER_WIZARD_DETAILS[
                                        wizardSelectedItem.group
                                    ][wizardSelectedItem.child.id]
                                "
                                class="description"
                            >
                                <component
                                    :is="
                                        PROVIDER_WIZARD_DETAILS[
                                            wizardSelectedItem.group
                                        ][wizardSelectedItem.child.id]
                                            .description
                                    "
                                >
                                </component>
                            </div>
                        </div>
                    </div>
                </template>
            </adm-modal>
           
            <adm-shimmer
                v-if="pageLoading"
                class="provider-shimmer"
                :count="5"
            ></adm-shimmer>
            <page-error
                v-else-if="!pageLoading && pageError"
                @tryAgain="fetchDataBasedOnGroupIndex"
            ></page-error>
            <ul
                class="provider-lists-container"
                v-if="
                    activeGroupIndex == 0 &&
                        emailProvidersStore &&
                        emailProvidersStore.items &&
                        emailProvidersStore.items.length != 0
                "
            >
                <li
                    v-for="(emailProvider, index) in emailProvidersStore.items"
                    :key="index"
                >
                    <listing-card
                        v-bind:provider="emailProvider"
                        @editProvider="editProvider"
                    ></listing-card>
                </li>
            </ul>
            <ul
                class="provider-lists-container"
                v-else-if="
                    activeGroupIndex == 1 &&
                        smsProvidersStore &&
                        smsProvidersStore.items &&
                        smsProvidersStore.items.length != 0
                "
            >
                <li
                    v-for="(smsProvider, index) in smsProvidersStore.items"
                    :key="index"
                >
                    <listing-card
                        v-bind:provider="smsProvider"
                        @editProvider="editProvider"
                    ></listing-card>
                </li>
            </ul>
            <adm-no-content
                v-else
                :title="'No providers found'"
            ></adm-no-content>
            <div class="pagination">
                <nitrozen-pagination
                    name="Providers"
                    v-model="pagination"
                    :pageSizeOptions="[5, 10, 20, 50]"
                >
                </nitrozen-pagination>
            </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
// @import '../common/common.less';
// @import '../../less/page-ui.less';
// @import './../../less/page-header.less';
// @import './../../less/form.less';
.provider-shimmer {
    width: 100%;
}
.input-shimmer {
    height: 40px;
    width: 400px;
}
.cursor-pointer {
    cursor: pointer;
}
.inline {
    display: flex;
    align-items: center;
}
.provider-lists-container {
    width: 100%;
}
/deep/.modal-container {
    /deep/.modal-search {
        margin: 0px 6px 24px 6px;
        position: relative;
    }
}
.wizard-container {
    /deep/.modal-container {
        min-width: 720px;
        min-height: 400px;
        /deep/.modal-body {
            .provider-container {
                margin-top: 24px;
            }
            .provider-card {
                border: 1px solid #e4e5e6;
                display: inline-block;
                padding: 12px;
                width: 50%;
                text-align: center;
                cursor: pointer;
                margin-bottom: 12px;
            }
            /deep/.provider-wrapper {
                margin-left: 36px;
                /deep/.title {
                    color: #212121;
                    font-family: Inter;
                    font-size: 16px;
                    font-weight: 500;
                    letter-spacing: 0;
                    line-height: 23px;
                    margin-bottom: 12px;
                }
                /deep/.description {
                    color: #9b9b9b;
                    font-family: Inter;
                    font-size: 14px;
                    letter-spacing: 0;
                    line-height: 20px;
                }
            }
            /deep/.flex {
                display: flex;
            }
            /deep/.text-logo {
                font-size: 25px;
                color: #2E31BE;
                text-align: center;
                padding: 10px 5px;
                border-radius: 5px;
                font-weight: 500;
            }
            /deep/.logo {
                width: 125px;
            }
            /deep/.flex-1 {
                flex: 1;
            }
            /deep/.flex-2 {
                flex: 2;
            }
            /deep/.flex-3 {
                flex: 3;
            }
        }
    }
}

.text-logo {
    font-size: 25px;
    color: #2E31BE;
    text-align: center;
    padding: 10px 5px;
    border-radius: 5px;
    font-weight: 500;
}
.logo {
    width: 125px;
    margin-right: 24px;
}
.page-container {
    margin: 24px;
    width: auto;
    @media @mobile {
        margin: 0;
    }
    .search-box {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-top: 24px;
        .search-input {
            width: 400px;
        }
        .label {
            font-family: Inter;
            color: @Mako;
            font-size: 14px;
            line-height: 20px;
            width: 44px;
            margin: auto 0;
            font-weight: 500;
        }
    }
    /deep/.pagination {
        margin-top: 40px;
        width: 100%;
        .pagination-container {
            .regular-xxs {
                font-size: 15px;
            }
            .items-select {
                font-size: 15px;
            }
        }
    }
    .provider-lists-container {
        width: 100%;
    }
    .provider-container {
        width: 100%;
        .main-container {
            background-color: @White;
            display: block;
            margin: 24px 0px;
            .group-name-container {
                margin-bottom: 24px;
                .group-tab {
                    border-bottom: 1px solid #e4e5e6;
                    /deep/.nitrozen-tab {
                        padding: 0px;
                    }
                }
            }
        }
    }
}
</style>
<script>
import loader from '@/components/common/loader';
import Jumbotron from '@/components/common/jumbotron';

import {
    NitrozenTab,
    NitrozenInput,
    NitrozenPagination,
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDialog,
} from '@gofynd/nitrozen-vue';
import admNoContent from '@/components/common/adm-no-content.vue';
import admModal from '@/components/common/adm-modal.vue';
import CommunicationServices from '../../../services/pointblank.service';

import listingCard from './listing-card.vue';
import Shimmer from '@/components/common/shimmer';
import uktNotFound from '@/components/common/ukt-not-found.vue';
import uktModal from '@/components/common/utk-modal.vue';
import { titleCase, toggleString, debounce } from '@/helper/utils';
import cloneDeep from 'lodash/cloneDeep';

import path from 'path';
//import admWizardModal from '../../../../components/admin/common/adm-wizard-modal.vue';
import pageerror from '@/components/common/page-error';

const PROVIDER_WIZARD_DETAILS = {
    Email: {
        pepipost: {
            title: 'Pepipost',
            description: {
                template:
                    '<div>In order to setup Pepipost provider, you would need the Pepipost API Key</div>'
            },
            logo:
                `assets/admin/pngs/pepipost-logo.png`
        },
        falconide: {
            title: 'Falconide',
            description: {
                template:
                    '<div>In order to setup Falconide provider, you would need the Falconide API Key</div>'
            },
            logo:
                `/public/admin/assets/admin/pngs/falconide-logo.png`
        },
        smtp: {
            title: 'SMTP',
            description: {
                template:
                    '<div>To set up SMTP provider, you would need to keep the below details handy -<li>Host</li><li>Port</li><li>Username</li><li>Password</li></div>'
            },
            logo: ''
        }
    },
    SMS: {
        netcore: {
            title: 'Netcore',
            description: {
                template:
                    '<div>For setting up Netcore, you would need to get the below details from Netcore - <li>Feed id</li><li>Username</li><li>Password</li><li>Sender id</li></div>'
            },
            logo:
                `/public/admin/assets/admin/pngs/netcore-logo.png`
        },
        smpp: {
            title: 'SMPP',
            description: {
                template:
                    '<div>For setting up SMPP, you would need to get the below details from your SMPP provider - <li>Host</li><li>Port</li><li>Username</li><li>Password</li></div>'
            },
            logo: ''
        },
        telspiel: {
            title: 'Telspiel',
            description: {
                template:
                    '<div>For setting up Telspiel, you would need to get the below details from Telspiel - <li>Sender id</li><li>Username</li><li>Auth Key</li></div>'
            },
            logo:
                `/public/admin/assets/admin/pngs/telspiel-logo.png`
        },
        vivaconnect: {
            title: 'Viva Connect',
            description: {
                template:
                    '<div>For setting up Viva Connect, you would need to get the below details from Viva Connect - <li>Sender id</li><li>Username</li><li>Password</li><li>CDMA Header</li></div>'
            },
            logo:
                `/public/admin/assets/admin/pngs/vivaconnect-logo.png`
        },
        timesinternet: {
            title: 'Times Internet',
            description: {
                template:
                    '<div>For setting up Times Internet, you would need to get the below details from Times Internet - <li>Sender id</li><li>Username</li><li>Password</li></div>'
            },
            logo:
                ``
        },
    }
};
export default {
    name: 'provider',
    components: {
        loader,
        'adm-jumbotron': Jumbotron,
        'listing-card': listingCard,
        'adm-shimmer': Shimmer,
        'ukt-not-found': uktNotFound,
        'nitrozen-pagination': NitrozenPagination,
        'page-error': pageerror,
        'ukt-modal': uktModal,
        'adm-no-content': admNoContent,
        'nitrozen-tab': NitrozenTab,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
        'adm-modal' : admModal
    },
    directives: {
        flatBtn,
        strokeBtn
    },

    data() {
        return {
            PROVIDER_WIZARD_DETAILS,
            pageLoading: false,
            pageError: false,
            isInitialLoad: true,
            searchText: '',
            tabs: [{ name: 'Email' }, { name: 'SMS' }],
            providersList: [
                {
                    group: 'Email',
                    children: [
                        { id: 'pepipost', name: 'Pepipost', type: 'email' },
                        { id: 'falconide', name: 'Falconide', type: 'email' },
                        { id: 'smtp', name: 'SMTP', type: 'email' }
                    ]
                },
                {
                    group: 'SMS',
                    children: [
                        { id: 'netcore', name: 'Netcore', type: 'sms' },
                        { id: 'smpp', name: 'SMPP', type: 'sms' },
                        { id: 'telspiel', name: 'Telspiel', type: 'sms' },
                        { id: 'vivaconnect', name: 'Viva Connect', type: 'sms' },
                        { id: 'timesinternet', name: 'Times Internet', type: 'sms' },
                    ]
                }
            ],
            providersFiltered: [],
            wizardSidebarSearch: '',
            wizardSelectedItem: null,
            pageLoading: false,
            showCreateModal: false,
            activeGroupIndex: 0,
            jumbotronData: {
                jumbotronTitle: 'Provider',
                jumbotronBody: 'Work in progress'
            },

            pagination: {
                limit: 10,
                current: 1,
                total: 0
            },
            emailProvidersStore: [],
            smsProvidersStore: []
        };
    },
    mounted() {
        this.fetchSmsProviders()
        this.fetchEmailProviders()
        this.providersFiltered = Object.assign([], this.providersList);
        this.wizardSelectedItem = {
            group: this.providersFiltered[0].group,
            child: this.providersFiltered[0].children[0]
        };

        
    },
    computed: {
       
    },
     methods: {
         createProvider() {
            this.showCreateModal = true;
        },
        closeCreateModal() {
            //this.showCreateModal = false;
        },
         openModal() {
            this.$refs['provider_create_dialog'].open({
                width: '1100px',
                height: '600px',
            });
        },
        closeModal() {
            this.$refs['provider_create_dialog'].close();
        },
        setDefault() {
            this.$router.replace({
                name: 'providerDefault'
            });
        },
    //     changePage(e) {
    //         this.pagination = {
    //             limit: e.limit,
    //             total: e.total,
    //             current: e.current
    //         };
    //         this.fetchDataBasedOnGroupIndex();
    //     },
        searchTemplate() {
            this.$router.replace({
                name: 'providerList',
                query: { ...this.$route.query, searchText: this.searchText }
            });
            this.resetPagination();
            this.fetchDataBasedOnGroupIndex();
        },
        debounceInput: debounce(function(e) {
            if (this.searchText.length === 0) {
                this.searchTemplate();
            }
        }, 200),
    //     toggleString,
        fetchDataBasedOnGroupIndex() {
            if (this.activeGroupIndex == 0) {
                this.fetchEmailProviders();
            } else if (this.activeGroupIndex == 1) {
                this.fetchSmsProviders();
            }
        },
        editProvider(item) {
            let providerType = ''
            this.activeGroupIndex == 1 ? providerType = 'sms' : providerType = 'email'
            this.$router.push({
                path: `/administrator/communication/provider/${providerType}/edit/${item._id}?type=${item.provider}`
            });
        },
        onSearchInputChange(e) {
            let searchText = e.target.value;
            searchText = searchText.toLowerCase();
            if (searchText == '') {
                this.providersFiltered = this.providersList;
            } else {
                let providersList = cloneDeep(this.providersList);
                this.providersFiltered = [];
                providersList.forEach(providerGroup => {
                    let children = providerGroup.children.filter(child => {
                        return (
                            child.name.toLowerCase().indexOf(searchText) > -1
                        );
                    });
                    if (children.length > 0) {
                        providerGroup.children = children;
                        this.providersFiltered.push(providerGroup);
                    }
                });
            }
        },
        onCreateModalSelect(id, item) {
            this.wizardSelectedItem = item;
        },
        onCreateModalProceedClick(id, item) {
            // this.$router.push({
            //     path: path.join(
            //         this.$basePath,
            //         `/provider/${item.child.type}/create?type=${item.child.id}`
            //     ) 
            // });
            this.$router.push({ path: `/administrator/communication/provider/${item.child.type}/create?type=${item.child.id}` });

        },
        fetchEmailProviders() {
           this.pageLoading = true;
                CommunicationServices.getEmailProvider({
                        page_size: this.pagination.limit,
                        page_no: this.pagination.current,
                        sort: JSON.stringify({ created_at: -1 }),
                        ...(this.searchText
                            ? {
                                  query: JSON.stringify({
                                      $or: [
                                          {
                                              name: {
                                                  $regex: this.searchText,
                                                  $options: 'ig'
                                              }
                                          },
                                          {
                                              tags: {
                                                  $regex: this.searchText,
                                                  $options: 'ig'
                                              }
                                          }
                                      ]
                                  })
                              }
                            : {})
                    })
                .then(data => {
                    this.pageLoading = false;
                    this.pageError = false;
                    this.emailProvidersStore = data.data
                    //this.setPagination();
                })
                .finally(() => {
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        },
        fetchSmsProviders() {
            this.pageLoading = true;
                CommunicationServices.getSmsProvider({
                        page_size: this.pagination.limit,
                        page_no: this.pagination.current,
                        sort: JSON.stringify({ created_at: -1 }),
                        ...(this.searchText
                            ? {
                                  query: JSON.stringify({
                                      $or: [
                                          {
                                              name: {
                                                  $regex: this.searchText,
                                                  $options: 'ig'
                                              }
                                          },
                                          {
                                              tags: {
                                                  $regex: this.searchText,
                                                  $options: 'ig'
                                              }
                                          }
                                      ]
                                  })
                              }
                            : {})
                    })
                .then(data => {
                    this.pageLoading = false;
                    this.pageError = false;
                    this.smsProvidersStore = data.data
                    //this.setPagination();
                })
                .finally(() => {
                    this.isInitialLoad && (this.isInitialLoad = false);
                });
        },
        setPagination() {
            if (this.activeGroupIndex == 0) {
                this.pagination = {
                    limit: this.emailProvidersStore.page.size,
                    total: this.emailProvidersStore.page.item_total,
                    current: this.emailProvidersStore.page.current
                };
            } else if (this.activeGroupIndex == 1) {
                this.pagination = {
                    limit: this.smsProvidersStore.page.size,
                    total: this.smsProvidersStore.page.item_total,
                    current: this.smsProvidersStore.page.current
                };
            }
            this.$router.replace({
                name: 'providerList',
                query: {
                    ...this.$route.query,
                    limit: this.pagination.limit,
                    current: this.pagination.current
                }
            });
        },
        changeGroupIndex(item) {
            this.activeGroupIndex = item.index;
            this.resetPagination();
            if (this.activeGroupIndex == 0) {
                this.fetchEmailProviders();
            } else if (this.activeGroupIndex == 1) {
                this.fetchSmsProviders();
            }
        },
    //     closeCreateModal() {
    //         this.showCreateModal = false;
    //     },
    //     editJob(item) {
    //         this.$router.push('/admin/provider/view/' + item._id);
    //     },
        resetPagination() {
            this.pagination = {
                limit: 10,
                current: 1,
                total: 0
            };
        },
    //     createProvider() {
    //         if (detectMobileWidth()) {
    //             this.$__restrictWebView.open();
    //             return;
    //         }
    //         this.showCreateModal = true;
    //     }
     }
};
</script>
