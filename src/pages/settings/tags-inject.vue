<template>
    <div class="main-container">
        <jumbotron :title="'Tags'" :desc="'Inject Script/CSS'">
            <div>
                <nitrozen-button v-flatBtn theme="secondary" @click="createTag">
                    Create
                </nitrozen-button>
            </div>
        </jumbotron>
        <div>
            <no-content
                v-if="noResults"
                helperText="No items found"
            ></no-content>
            <shimmer
                    v-if="inProgress"
                    class="page-shimmer"
                    :count="3"
                ></shimmer>
            <loader v-if="isLoading" class="loading"></loader>
            <div v-if="tagList.length" class="page-container">
                <div v-for="(item, index) in tagList" :key="index">
                    <div class="blaster-list-card-container extra" @click="openTag(item)" >
                        <div class="card-content-section">
                            <div class="card-content-line-1">
                                <span class="cst-clr"> {{ item.name }}</span>
                            </div>

                            <div class="card-content-line-3">
                                <div v-if="item.type" class="mt-6">
                                    <span>Type :</span>
                                    <span class="ml-6">{{ item.type }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-badge-section" id="delete" @click="openDeleteDialog(item,$event)">
                            <ukt-inline-svg
                                src="delete"
                                class="delete-icon"
                            ></ukt-inline-svg>
                        </div>
                    </div>
                </div>
                <nitrozen-pagination
                        name="Tags"
                        id="pagination"
                        v-model="pagination"
                        @change="setPagination"
                        :pageSizeOptions="[5, 10, 20, 50]"
                    ></nitrozen-pagination>
            </div>
        </div>
        <nitrozen-dialog ref="tag_delete_dialog" :title="'Delete'" @close="closeDeleteDialog">
            <template slot="body">
                <div>Are you sure you want to delete this tag?</div>
            </template>
            <template slot="footer">
                <div>
                    <nitrozen-button class="mr24" v-flatBtn :theme="'secondary'" id="del" @click="deleteTag"
                        >Delete</nitrozen-button
                    >
                    <nitrozen-button v-strokeBtn :theme="'secondary'" @click="closeDeleteDialog"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
        
    </div>
</template>
<script>
import Jumbotron from '@/components/common/jumbotron';
import PageEmpty from '@/components/common/page-empty.vue';
import Shimmer from '@/components/common/shimmer';
import { Loader } from '@/components/common/';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';
import InternalSettingsService from '@/services/internal-settings.service';


const PAGINATION = {
    limit: 0,
    current: 0,
    total: 0,
};

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDialog,
    NitrozenPagination
} from '@gofynd/nitrozen-vue';
export default {
    name: 'tags-inject',
    components: {
        Jumbotron,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-pagination': NitrozenPagination,
        'adm-inline-svg': adminlinesvg,
        'ukt-inline-svg': inlinesvg,
        'no-content': PageEmpty,
        Shimmer,
        Loader,
        flatBtn,
        strokeBtn,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            tagList: [],
            isLoading: false,
            pageerror: false,
            activeTag : null,
            pagination: { ...PAGINATION },
            noResults: false,
            inProgress: false,

        };
    },
    methods: {
         openDeleteDialog(item,event) {
            event.stopPropagation();
            event.preventDefault();
            
            this.activeTag = item._id;
            this.$refs.tag_delete_dialog.open({
                width: '500px',
                showCloseButton: true,
                dismissible: true,
            });
        },
        openTag(item) {
            if (item) {
                this.$router.push({
                    path: `/administrator/settings/platform/update-tag/${item._id}`
                })
                .catch(()=>{})
            }
        },
        createTag(){
            this.$router.push({
                    path: `/administrator/settings/platform/create-tag`
                });

        },
        getPages(){
            this.inProgress = true;
          InternalSettingsService.getCustomTags({ page_no: this.pagination.current,
                    page_size: this.pagination.limit})
          .then(res=>{
              //console.log(res.data.items);
              this.tagList = res.data.items;
               this.pagination = {
                        limit: res.data.page.size,
                        total: res.data.page.item_total,
                        current: res.data.page.current,
                    };
                if (!res.data.items || res.data.items.length === 0){
                        this.noResults = true; }
              //console.log(res);
          })
          .finally(() => {
                    this.inProgress = false;
                });
        },
        deleteTag() {
                this.isLoading = true;
                InternalSettingsService.deleteTag(this.activeTag)
                    .then((res) => {
                        this.isLoading = false;
                        this.$snackbar.global.showSuccess(
                            `Tag removed successfully`,
                            {
                                duration: 2000,
                            }
                        );
                        this.closeDeleteDialog();
                        this.getPages();
                    })
                    .catch((err) => {
                        this.closeDeleteDialog();
                        this.isLoading = false;
                    });
            
        },
        closeDeleteDialog: function () {
            this.$refs.tag_delete_dialog.close();
        },
        setPagination(filter) {
            const { current, limit } = filter;
            filter = { page: current, limit };
            this.pagination = Object.assign({}, this.pagination, filter);
            this.setRouteQuery(filter);
        },
        setRouteQuery(query) {
            this.$router
                .push({
                    path: this.$route.path,
                    query: {
                        ...this.$route.query,
                        ...query,
                    },
                })
                .catch(() => {});
            this.getPages();
        },
        populateFromURL() {
            const { page, limit } = this.$route.query;
            
            this.pagination.current = +page || this.pagination.current;
            this.pagination.limit = +limit || this.pagination.limit;
        }
    },
    mounted(){
        this.populateFromURL();
        this.getPages()
    }
};
</script>
<style lang="less" scoped>
.page-container {
    .list {
        overflow-y: auto;
        .mirage-scrollbar;
        &.h-md {
            max-height: 400px;
        }
        &.h-xl {
            max-height: 100%;
        }

        .drag-box {
            max-width: 100%;
            border: 1px solid #e4e5e6;
            border-radius: 4px;
            margin-right: auto;
            margin-left: auto;
            margin-bottom: 12px;
            height: 50px;
            display: flex;
            align-items: center;
            padding: 12px;
            color: #41434c;
            font-size: 14px;
            font-weight: 500;
            background: #fff;

            .ic-box {
                cursor: grab;
            }

            .txt-box {
                padding: 14px 0 14px 24px;
                cursor: pointer;
                flex: 1;
                line-height: 20px;
                color: #9b9b9b;
                font-size: 13px;
                font-weight: 400;
            }

            .del-box {
                padding: 0 15px;
                box-sizing: border-box;
                cursor: pointer;
            }
        }
    }
    display: block;
    margin: 24px 0px;
    padding: 0px 0px;
    width: 100%;
}
.main-container {
    cursor: pointer;
    background-color: white;
    margin: 24px;
    padding: 24px;
    position: relative;
}

.mt-6 {
    margin-top: 6px;
}
.ml-6 {
    margin-left: 6px;
}
.ml8 {
    margin-left: 20px;
}
.cs-red {
    color: red;
}
.cst-clr {
    color: #2e31be;
    font-size: 16px;
    font-weight: 600;
}
.cst-mtb {
    margin-bottom: 36px;
    cursor: pointer;
    color: #2e31be;
    font-size: 14px;
    font-weight: 700;
    text-align: right;
    // margin-right: 24px;
    display: flex;
    justify-content: flex-end;

    span {
        cursor: pointer;
    }
}
.extra {
    padding: 0px 15px;
}
</style>