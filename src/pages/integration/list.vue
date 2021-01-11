<template>
    <div class="panel">
        <div class="main-container">
            <div class="custom-header">
                <jumbotron
                    :title="'Integrations'"
                    btnLabel="Add Integration"
                    :desc="'Manage integrations'"
                    @btnClick="addIntegration"
                ></jumbotron>
            </div>
            <div class="integration-list-container">
                <div class="integration-filters"></div>
                <adm-shimmer
                    v-if="pageLoading && !pageError"
                    :count="4"
                ></adm-shimmer>
                <div
                    v-else-if="!pageLoading && !pageError"
                    class="integration-card-list"
                >
                    <div
                        v-for="(integration, index) in integrationsList"
                        :key="index"
                        class="container"
                        @click="editIntegration(integration)"
                    >
                        <div class="card-avatar">
                            <img
                                :src="getIntegartionImage(integration)"
                                alt="icon"
                                @error="$set(integration, 'icon', default_img)"
                            />
                        </div>
                        <div class="card-content-section">
                            <div class="card-content-line-1 full-name">
                                Name: {{ integration.name }}
                            </div>
                            <div class="card-content-line-2">
                                Token: {{ integration.token }}
                            </div>
                            <div class="card-content-line-2">
                                Owner: {{ integration.owner }}
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <adm-no-content
                        :helperText="'No Integrations found'"
                    ></adm-no-content>
                </div>
                <nitrozen-pagination
                    v-if="integrationsList.length"
                    name="Integrations"
                    v-model="pagination"
                    :pageSizeOptions="[5, 10, 25, 50, 100]"
                    @change="paginationChange"
                ></nitrozen-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Jumbotron from '@/components/common/jumbotron';
import Shimmer from '@/components/common/shimmer';
import pageerror from '@/components/common/page-error';
import admInlineSVG from '@/components/common/adm-inline-svg';
import IntegrationService from '@/services/integration.service';
import admNoContent from '@/components/common/page-empty';
const DEFAULT_IMAGE = '/public/assets/admin/pngs/default-profile.png';

import {
    NitrozenInput,
    NitrozenDropdown,
    NitrozenPagination,
    strokeBtn,
    flatBtn,
    NitrozenBadge,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
const PAGINATION = {
    limit: 10,
    total: 0,
    current: 1
};
export default {
    name: 'integration-list',
    components: {
        'adm-inline-svg': admInlineSVG,
        'page-error': pageerror,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dialog': NitrozenDialog,
        NitrozenDropdown,
        Jumbotron,
        'adm-no-content': admNoContent,
        'adm-shimmer': Shimmer
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            pagination: { ...PAGINATION },
            integrationsList: []
        };
    },
    computed: {
        default_img() {
            return DEFAULT_IMAGE;
        }
    },
    mounted() {
        this.getIntegrations();
    },
    methods: {
        getIntegrations() {
            this.pageLoading = true;
            const params = {
                page: this.pagination.current,
                limit: this.pagination.limit
            };
            return IntegrationService.getIntegrationsList(params)
                .then(({ data }) => {
                    this.pageLoading = false;
                    this.integrationsList = data.docs;
                    this.pagination.total = data.total;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    // console.log(err);
                });
        },
        paginationChange(filter) {
            const { current, limit } = filter;
            this.pagination.current = current;
            this.pagination = Object.assign({}, this.pagination, filter);
            this.getIntegrations();
        },
        addIntegration() {
            this.$router.push({
                path: `/administrator/integration/create`
            });
        },
        editIntegration(integartion) {
            this.$router.push({
                path: `/administrator/integration/edit/${integartion._id}`
            });
        },
        getIntegartionImage(integration) {
            let image = DEFAULT_IMAGE;
            return integration.icon || image;
        }
    }
};
</script>

<style lang="less" scoped>
.main-container {
    background-color: white;
    margin: 24px;
    padding: 24px;
    .integration-list-container {
        width: 100%;
        word-break: break-all;
        position: relative;
        .integration-filters {
            display: flex;
            .search {
                flex: 1;
                max-width: 400px;
                margin-top: 22px;
            }
            .dropdown-filters {
                display: flex;
                flex: 1;
                justify-content: flex-end;
                > div {
                    padding-left: 10px;
                }
            }
        }

        .nitrozen-pagination-container,
        .integration-card-list {
            margin-top: 12px;
            .container {
                border: 1px solid #e4e5e6;
                height: 70px;
                display: flex;
                overflow: visible;
                max-height: 70px;
                padding: 24px;
                border-radius: 3px;
                margin-bottom: 16px;
                transition: box-shadow 0.3s;
                cursor: pointer;
                &:hover {
                    box-shadow: 0px 9px 13px 0px rgba(221, 221, 221, 0.5);
                }
                .disabled {
                    background: @WhiteSmoke;
                    opacity: 0.5;
                    pointer-events: none;
                }
                .text-ellipsis {
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .card-avatar {
                    display: flex;
                    align-items: center;
                    margin-right: 24px;
                    width: 60px;
                    height: 60px;
                    align-self: center;
                    border-radius: 50%;
                    border: 1px solid #e4e5e6;
                    img {
                        min-height: 60px;
                        max-height: 60px;
                        min-width: 60px;
                        max-width: 60px;
                        border-radius: 50%;
                    }
                }
                .card-content-section {
                    display: flex;
                    flex: 1;
                    flex-direction: column;
                    justify-content: center;

                    .card-content-line-2 {
                        color: #9b9b9b;
                        line-height: 22px;
                        font-size: 12px;
                        display: flex;
                    }
                }
            }
        }
    }
}
</style>
