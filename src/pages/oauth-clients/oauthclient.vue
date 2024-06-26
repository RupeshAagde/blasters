!<template>
    <div class="panel">
        <div class="api-container">
            <nitrozen-input
                class="search-box"
                :showSearchIcon="true"
                type="search"
                placeholder="Search clients by name"
                v-model="searchTxt"
                @input="debounceInput({ name: searchTxt })"
            >
            </nitrozen-input>
        </div>
        <loader v-if="pageLoading"></loader>
        <page-error
            v-else-if="pageError && !pageLoading"
            @tryAgain="fetchOAuthClients"
        ></page-error>
        <div v-else>
            <div v-if="oAuthClients.length" class="clients-token-container">
                <client-card
                    class="clients-token"
                    v-for="client in getOAuthClients()"
                    :key="client._id"
                    :client="client"
                    v-on:deleteOAuthClient="deleteOAuthClient"
                    v-on:editOAuthClient="editOAuthClient"
                ></client-card>
            </div>
            <div v-else>
                <no-content :helperText="'No clients found'"></no-content>
            </div>
            <div class="pagination" v-if="oAuthClients.length > 0">
                <nitrozen-pagination
                    name="Clients"
                    v-model="paginationConfig"
                    @change="paginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                    id="pagination"
                ></nitrozen-pagination>
            </div>
            <nitrozen-dialog
                ref="confirm_delete_client"
                title="Delete Client"
                class="confirm_delete_client"
            >
                <template slot="body">
                    <p>
                        All the access tokens generated using oauth client to
                        “<span class="darker-sm">{{ clientName }}</span
                        >” will be deleted.
                    </p>
                    <p>
                        Do you really want to delete the client “<span
                            class="darker-sm"
                            >{{ clientName }}</span
                        >”?
                    </p>
                </template>
                <template slot="footer">
                    <nitrozen-button
                        class="mr24"
                        @click.stop="deleteClient($event)"
                        v-flatBtn
                        :theme="'secondary'"
                        >Delete</nitrozen-button
                    >
                    <nitrozen-button
                        @click="closeDeleteDialog"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </template>
            </nitrozen-dialog>
        </div>
    </div>
</template>

<script>
import {
    NitrozenDialog,
    NitrozenInput,
    NitrozenButton,
    NitrozenPagination,
    flatBtn,
    strokeBtn,
} from '@gofynd/nitrozen-vue';
import pageerror from '@/components/common/page-error.vue';
import client from '@/pages/oauth-clients/clients/client-card.vue';
import admNoContent from '@/components/common/adm-no-content';
import loader from '@/components/common/loader.vue';
import OAuthClientService from '../../services/oauth-client.service';
import { debounce } from '@/helper/utils';
export default {
    components: {
        'page-error': pageerror,
        'client-card': client,
        'nitrozen-dialog': NitrozenDialog,
        'no-content': admNoContent,
        'nitrozen-input': NitrozenInput,
        'nitrozen-pagination': NitrozenPagination,
        loader: loader,
        NitrozenButton,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            searchTxt: '',
            oAuthClients: [],
            pageLoading: false,
            pageError: false,
            paginationConfig: {
                limit: 10,
                current: 1,
                total: 0,
            },
            clientName: '',
            clientId: '',
        };
    },
    mounted() {
        this.populateFromURL();
        this.fetchOAuthClients();
    },
    methods: {
        populateFromURL() {
            const { search, page, limit } = this.$route.query;
            this.searchTxt = search || this.searchTxt;
            this.paginationConfig.current =
                +page || this.paginationConfig.current;
            this.paginationConfig.limit = +limit || this.paginationConfig.limit;
        },
        paginationChange(filter, action) {
            const { current, limit } = filter;
            this.paginationConfig.current = current;
            this.paginationConfig = Object.assign(
                {},
                this.paginationConfig,
                filter
            );
            this.fetchOAuthClients();
        },
        debounceInput: debounce(function (e) {
            this.setRouteQuery({ search: this.searchTxt });
            this.fetchOAuthClients();
        }, 200),
        setRouteQuery(query) {
            this.paginationConfig.current = 1;
            this.paginationConfig = { ...this.paginationConfig };
            query.page = this.paginationConfig.current;
            query.limit = 10;
            this.$router.push({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query,
                },
            });
            this.fetchOAuthClients();
        },
        fetchOAuthClients() {
            this.pageLoading = true;
            OAuthClientService.fetchClientListing({
                page_no: this.paginationConfig.current,
                page_size: this.paginationConfig.limit,
                is_active: true,
                search: this.searchTxt,
            })
                .then((res) => {
                    this.oAuthClients = res.data.items;
                    this.pageLoading = false;
                    this.paginationConfig = {
                        limit:  res.data.page.size,
                        current: res.data.page.current,
                        total: res.data.page.item_total,
                    };
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        getOAuthClients() {
            if (!this.searchTxt) {
                return this.oAuthClients;
            }
            let regex = new RegExp(this.searchTxt, 'gi');
            return this.oAuthClients.filter((client) => {
                return (
                    client.meta.name.match(regex) ||
                    client.client_id.match(regex)
                );
            });
        },
        deleteClient() {
            OAuthClientService.deleteClient(this.clientId)
                .then((res) => {
                    this.$snackbar.global.showSuccess(
                        'Client deleted successfully'
                    );
                    this.fetchOAuthClients();
                })
                .catch((err) => {
                    console.log(err);
                    this.$snackbar.global.showError(
                        'Error while deleting the client'
                    );
                });
            this.closeDeleteDialog();
        },
        deleteOAuthClient(client_id, client_name) {
            this.clientId = client_id;
            this.clientName = client_name;
            this.$refs['confirm_delete_client'].open({
                width: '500px',
                showCloseButton: false,
                dismissible: true,
            });
        },
        editOAuthClient(client_id) {
            this.$router.push({
                name: 'edit-oauth-client',
                params: { client_id: client_id },
            });
        },
        closeDeleteDialog() {
            this.clientId = '';
            this.clientName = '';
            this.$refs['confirm_delete_client'].close();
        },
    },
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';

.pagination {
    background: @White;
}
.api-container {
    flex-wrap: wrap;
    padding: 24px 0;
    background: @White;
}

.confirm_delete_client {
    .warning-text {
        margin: 5px 0 0;
        font-size: 9.8px;
        color: red;
    }
    /deep/.nitrozen-dialog-body {
        line-height: 30px;
    }
    /deep/.nitrozen-dialog-footer {
        margin-top: 10px;

        .mr24 {
            margin-right: 24px;
        }
    }
}

.clients-token-container {
    display: flex;
    flex-wrap: wrap;
    background: @White;
    .clients-token {
        + .clients-token:nth-child(even) {
            margin-left: 24px;
        }
    }
}
</style>