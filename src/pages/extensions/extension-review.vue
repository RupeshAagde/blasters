<template>
    <div class="panel">
        <div class="page-header-position">
            <page-header
                @backClick="onCancel"
                :title="'Review Extension'"
            >
                <div class="button-box">
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm(true)"
                        v-flatBtn
                        >Approve</nitrozen-button
                    >
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm(false)"
                        v-strokeBtn
                        >Reject</nitrozen-button
                    >
                </div>
                <template slot="page-slot-mobile-footer">
                    <nitrozen-button
                        @click="saveForm(true)"
                        class="footer-actions"
                        v-flatBtn
                        theme="secondary"
                        >Approve</nitrozen-button
                    >
                    <nitrozen-button
                        :theme="'secondary'"
                        @click="saveForm(false)"
                        v-strokeBtn
                        >Reject</nitrozen-button
                    >
                </template>
            </page-header>
        </div>
        <loader v-if="pageLoading && !pageError"></loader>
        <page-error
            v-else-if="pageError && !pageLoading"
            @tryAgain="fetchExtension"
        ></page-error>
        <div class="main-container" v-else>
            <div class="page-container">
                <a class="cl-RoyalBlue" :href="`https://partners.fyndx0.de/extensions/preview/${extension_id}`" target="_blank" >Link to extension</a>
                <nitrozen-input
                    :disabled="true"
                    :type="'textarea'"
                    :label="'Review Instructions'"
                    v-model="extension_info.review_instructions"
                >
                </nitrozen-input>
                <nitrozen-input
                    class="nitrozen-form-input full-width"
                    :type="'textarea'"
                    :label="'Review Comments'"
                    v-model="review_data.review_comments"
                >
                </nitrozen-input>
                <nitrozen-error :class="{'hidden': !error_comments}">
                    {{ error_comments || "-" }}
                </nitrozen-error>
            </div>
            <loader v-if="inProgress" class="loading"></loader>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../pages/less/page-header.less';
@import '../../pages/less/page-ui.less';
@import '../../pages/less/form.less';

.nitrozen-form-input {
    margin-top: 12px;
}
.hidden {
    visibility: hidden;
}
.page-container {
    margin: 0;
    flex-direction: column;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError
} from '@gofynd/nitrozen-vue';

import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import ExtensionService from '@/services/extension.service';
export default {
    name: "extension-review",
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        'loader': loader
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            extension_info: {},
            review_data: {
                review_comments: "",
                current_status: "",
            },
            error_comments:""
        }
    },
    computed: {
        extension_id() {
            return this.extension_info.extension_id;
        },
        review_id() {
            return this.$route.params.review_id;
        }
    },
    mounted() {
        this.fetchExtension();
    },
    methods: {
        fetchExtension(){
            this.pageLoading=true;
            this.pageError=false;
            ExtensionService.getExtensionReviewInfo(this.review_id)
            .then(({data})=>{
                this.extension_info = data;
            })
            .catch(err=>{
                this.pageError=true;
                console.log(err);
                this.$snackbar.global.showError(`Failed to load extension information`);
            })
            .finally(()=>{
                this.pageLoading = false;
            });
        },
        saveForm(approve) {
            this.error_comments = "";
            this.review_data.current_status = approve? "published": "rejected";
            if(!approve && !this.review_data.review_comments) {
                this.error_comments = "Review comments required for rejecting extension changes"
                this.$snackbar.global.showError("Missing required data");
                return;
            }
            this.inProgress = true;
            //TODO: Add form dirty
            ExtensionService.updateExtensionReviewInfo(this.review_id, this.review_data)
            .then(({data})=>{
                this.$snackbar.global.showSuccess("Updated extension status");
                this.onCancel();
            })
            .catch(err=>{
                console.log(err);
                this.$snackbar.global.showError("Failed to update extension status");
            })
            .finally(()=>this.inProgress=false);
        },
        onCancel() {
            this.$router.push(
                `/administrator/extensions/review`
            )
            .catch(()=>{});
        },
    }
}
</script>