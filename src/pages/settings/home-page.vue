<template>
    <nitrozen-dialog ref="home-page" title="Home Page">
        <template slot="body">
            <div class="custom-home-page">
                <div class="alert-box" v-if="!isCustomHomePage">
                    No Custom Home Page is configured
                </div>
                <div class="custom-pages">
                    <nitrozen-dropdown
                        :items="customPages"
                        label="Page"
                        v-model="customHomePage"
                        :searchable="true"
                        @searchInputChange="pageSearch"
                    ></nitrozen-dropdown>
                </div>
                <div class="info">
                    This will change Fynd Platform home page
                </div>
            </div>
            <loader v-if="isLoading"></loader>
        </template>
        <template slot="footer">
            <div class="custom-footer">
                <nitrozen-button
                    theme="secondary"
                    v-if="isCustomHomePage"
                    ref="default-btn"
                    @click="setDefault"
                    >Switch to default</nitrozen-button
                >
                <nitrozen-button
                    theme="secondary"
                    ref="save-btn"
                    class="ml-12"
                    @click="save"
                    :disabled="!customHomePage"
                    v-flatBtn
                    >Save</nitrozen-button
                >
            </div>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenError,
    strokeBtn,
    flatBtn,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import { Loader } from '@/components/common/';
import InternalSettingsService from '@/services/internal-settings.service';
import { debounce } from '@/helper/utils';

export default {
    name: 'home-page-dialog',
    components: {
        NitrozenDialog,
        NitrozenError,
        NitrozenDropdown,
        NitrozenButton,
        Loader
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            customPages: [],
            isCustomHomePage: false,
            customHomePage: '',
            homePageRes: null,
            isLoading: false
        };
    },
    mounted() {},
    methods: {
        open() {
            this.$refs['home-page'].open({
                width: '500px',
                height: '500px',
                showCloseButton: true
            });
            Promise.all([this.getHomePage(), this.getCustomPages()])
                .then((res) => {
                    this.isCustomHomePage = res[0].data.slug ? true : false;
                    this.homePageRes = res[0].data;
                    if (this.isCustomHomePage) {
                        this.customHomePage = res[0].data.slug;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getCustomPages(q = '') {
            this.isLoading = true
            const params = {
                page_size: 200,
                page_no: 1,
                published: true,
                q
            };
            this.customPages = []
            return InternalSettingsService.getCustomPages(params).then(
                (res) => {
                    this.isLoading = false
                    res.data.items.map((ele) => {
                        this.customPages.push({
                            text: `${ele.title} (${ele.slug})`,
                            value: `${ele.slug}`
                        });
                    });
                }
            );
        },
        getHomePage() {
            return InternalSettingsService.getHomePage();
        },
        save() {
            const body = {
                slug: this.customHomePage
            };
            if (this.homePageRes._id) {
                body._id = this.homePageRes._id;
            }
            return InternalSettingsService.setHomePage(body)
                .then((res) => {
                    this.close();
                    this.$snackbar.global.showSuccess('Saved Successfully');
                })
                .catch((err) => {
                    console.log(err, 'error');
                    this.$snackbar.global.showError('Failed to save');
                });
        },
        setDefault() {
            const body = {
                slug: this.customHomePage,
                archived: true,
                _id: this.homePageRes._id
            };
            return InternalSettingsService.setHomePage(body)
                .then((res) => {
                    this.close();
                    this.$snackbar.global.showSuccess('Saved Successfully');
                })
                .catch((err) => {
                    console.log(err, 'default error');
                    this.$snackbar.global.showError('Failed to save');
                });
        },
        close() {
            this.customHomePage = '';
            this.$refs['home-page'].close();
        },
        pageSearch: debounce(function(e) {
            this.getCustomPages(e.text);
        }, 200)
    }
};
</script>

<style lang="less" scoped>
.custom-home-page {
    .alert-box {
        padding: 12px;
        line-height: 20px;
        background-color: #fffaf0;
        color: #f5a300;
        border: 1px solid #f5a300;
        border-radius: 4px;
        margin-bottom: 12px;
    }
    .info {
        margin-top: 24px;
        font-weight: bold;
        font-size: 16px;
        color: @Required;
    }
}
.custom-footer {
    .ml-12 {
        margin-left: 12px;
    }
}
</style>
