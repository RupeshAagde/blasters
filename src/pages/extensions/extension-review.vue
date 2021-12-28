<template>
    <div class="panel">
        <div class="page-header-position">
            <page-header @backClick="onCancel" :title="getExtensionName">
                <!--  <img  :src="extension_info.listing_info.icon"
                class="default-image circle-clip" /> -->

                <div class="button-box">
                    <nitrozen-button
                        v-if="extension_info.current_status==='pending'"
                        :theme="'secondary'"
                        @click="saveForm(true)"
                        v-flatBtn
                        >Approve</nitrozen-button
                    >
                    <nitrozen-button
                        v-if="extension_info.current_status==='pending'"
                        :theme="'secondary'"
                        @click="saveForm(false)"
                        v-strokeBtn
                        >Reject</nitrozen-button
                    >
                    <nitrozen-badge v-if="extension_info.current_status!=='pending'" :state="extension_info.current_status==='rejected'? 'error': 'success'">{{extension_info.current_status}}</nitrozen-badge>
                </div>
                <template v-if="extension_info.current_status==='pending'" slot="page-slot-mobile-footer">
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

        <div class="main-container" v-if="extension_info.listing_info">
            <div class="page-container">
                <div class="content-container">
                    <div class="left-container">
                        <div class="cl-Mako bold-md">Extension Info</div>
                        <div class="extension-info">
                            <span>Extension Tagline:</span>
                            {{ extension_info.listing_info.tagline }}
                        </div>
                        <div class="extension-info">
                            <span>Requsted By:</span>
                            {{
                                extension_info.contact_info
                                    .review_notification_email
                            }}
                        </div>
                        <div class="extension-info">
                            <span>Requested On:</span>
                            {{ toDateTimeString(extension_info.created_at) }}
                        </div>
                        <div class="extension-info">
                            <span>Organization Name:</span>
                            {{ extension_info.organization_name }}
                        </div>
                    </div>
                    <div
                        class="right-container"
                        v-if="extension_info.current_status !== 'pending' && (reviewer_name && reviewer_email && reviewer_phone)"
                    >
                    <div class="cl-Mako bold-md">Reviewed By:</div>
                        <div class="extension-info">
                            <span>Reviewer Name:</span>
                            {{ reviewer_name }}
                        </div>
                        <div class="extension-info" >
                            <span>Reviewer Email:</span>
                            {{ reviewer_email }}
                        </div>
                        <div class="extension-info" >
                            <span>Reviewer Phone:</span>
                            {{ reviewer_phone }}
                        </div>
                        
                    </div>
                </div>
            </div>
            <!-- <div class="left-container card-content-line-2">
                <div>
                    <div>{{ extension_info.listing_info.tagline }}</div>
                    <div>{{ extension_info.contact_info.review_notification_email }}</div>
                    {{ toDateTimeString(extension_info.created_at) }}
                    {{ extension_info.organization_id }}
                </div>

                <div
                    class="right-container card-content-line-2"
                    v-if="extension_info.current_status !== 'pending'"
                >
                    {{ extension_info.reviewed_by }}
                </div>
                
            </div> -->

            <div class="page-container">
                <a
                    class="cl-RoyalBlue"
                    :href="`https://partners.${fynd_platform_domain}/extensions/preview/${extension_id}`"
                    target="_blank"
                    >Link to extension</a
                >
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
                <nitrozen-error :class="{ hidden: !error_comments }">
                    {{ error_comments || '-' }}
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
    margin: 0 0 24px 0;
    flex-direction: column;
    width: calc(100% - 48px);
    .content-container {
        display: flex;

        .left-container {
            width: 50%;
        }
        .right-container {
            flex: 1;
            margin-left: 24px;
        }
        .extension-info {
            margin-top: 24px;
            font-size: 14px;
            color: @Mako;
            span {
                font-weight: bold;
            }
        }
    }
}
.default-image {
    width: auto;
    height: 60px;
    position: absolute;
    left: -10px;
    top: 0px;
}
.circle-clip {
    clip-path: circle(30px at center);
}

.main-container {
    flex-direction: column;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';

import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import ExtensionService from '@/services/extension.service';
import root from 'window-or-global';
import moment from 'moment';
import CompanyService from '@/services/company-admin.service';

const env = root.env || {};

export default {
    name: 'extension-review',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-badge': NitrozenBadge,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        loader: loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            extension_info: {},
            review_data: {
                review_comments: '',
                current_status: '',
            },
            error_comments: '',
            fynd_platform_domain: 'fynd.com',
            reviewer_name:'',
            reviewer_email:'',
            reviewer_phone:'',
        };
    },
    computed: {
        extension_id() {
            return this.extension_info.extension_id;
        },
        review_id() {
            return this.$route.params.review_id;
        },
        getExtensionName() {
            return (
                (this.extension_info &&
                    this.extension_info.listing_info &&
                    this.extension_info.listing_info.name) ||
                'Extension Name'
            );
        },
    },
    mounted() {
        this.fynd_platform_domain =
            env.FYND_PLATFORM_DOMAIN || this.fynd_platform_domain;
        this.fetchExtension();

    },
    methods: {
        fetchExtension() {
            this.pageLoading = true;
            this.pageError = false;
            ExtensionService.getExtensionReviewInfo(this.review_id)
                .then(({ data }) => {
                    this.extension_info = data;
                    if(this.extension_info.current_status!=='pending')
                    {
                        this.getUserInfo(this.extension_info.reviewed_by);
                    }
                })
                .catch((err) => {
                    this.pageError = true;
                    console.log(err);
                    this.$snackbar.global.showError(
                        `Failed to load extension information`
                    );
                })
                .finally(() => {
                    this.pageLoading = false;
                });
        },
        saveForm(approve) {
            this.error_comments = '';
            this.review_data.current_status = approve
                ? 'published'
                : 'rejected';
            if (!approve && !this.review_data.review_comments) {
                this.error_comments =
                    'Review comments required for rejecting extension changes';
                this.$snackbar.global.showError('Missing required data');
                return;
            }
            this.inProgress = true;
            //TODO: Add form dirty
            ExtensionService.updateExtensionReviewInfo(
                this.review_id,
                this.review_data
            )
                .then(({ data }) => {
                    this.$snackbar.global.showSuccess(
                        'Updated extension status'
                    );
                    this.onCancel();
                })
                .catch((err) => {
                    console.log(err);
                    this.$snackbar.global.showError(
                        'Failed to update extension status'
                    );
                })
                .finally(() => (this.inProgress = false));
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/review`)
                .catch(() => {});
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        },
        backClick() {
            this.$emit('backClick');
        },
        getUserInfo(userId) {
            
            CompanyService.searchUser({ query: userId })
                .then((res) => { 

                   if (res.data.users.length) {
                    
                            this.reviewer_name=res.data.users[0].first_name+" "+res.data.users[0].last_name;
                        for(let i=0;i<res.data.users[0].emails.length;i++){
                            if(res.data.users[0].emails[i].primary===true){
                               this.reviewer_email=res.data.users[0].emails[i].email;
                            }
                            
                        }
                        for(let i=0;i<res.data.users[0].phone_numbers.length;i++){
                        
                        if(res.data.users[0].phone_numbers[i].primary===true){
                               this.reviewer_phone= "+"+res.data.users[0].phone_numbers[i].country_code+" "+res.data.users[0].phone_numbers[i].phone;
                            }
                        }
                    
                    }
                    //   
                    //     if (this.dateType) {
                    //         let dateString = new Date(this.date).toDateString();
                    //         this.userInfo.date = dateString
                    //             .split(' ')
                    //             .splice(1)
                    //             .join(' ');
                    //     }
                    // }
                })
                .catch((err) => {
                    
                    console.log(err);
                });
        },
    },
};
</script>