<template>
    <div>
        <div class="details">
            <div class="details-header">
                <label class="bold-xs cl-Mako">Details</label>
                <div class="img-box">
                    <a
                        :href="
                            `https://platform.${fyndPlatformDomain}/company/${companyId}/profile/edit`
                        "
                        target="_blank"
                        class="menu"
                    >
                        <adm-inline-svg
                            class="verified-icon left-space-s"
                            :src="'edit'"
                            title="Edit"
                        ></adm-inline-svg>
                    </a>
                </div>
            </div>
            <div v-if="inProgress" class="shimmer"></div>
            <div class="details-body" v-if="!inProgress">
                <div class="detail-row">
                    <div class="row-1">
                        <label class="dark-xs cl-DustyGray2"
                            >Company Name</label
                        >
                        <div class="company-detail">
                            {{ profileDetails.name }}
                        </div>
                    </div>
                    <div class="row-1">
                        <label class="dark-xs cl-DustyGray2"
                            >Business Type</label
                        >
                        <div class="company-detail">
                            {{ profileDetails.business_type }}
                        </div>
                    </div>
                </div>

                <div class="detail-row">
                    <div class="row-1">
                        <label class="dark-xs cl-DustyGray2"
                            >Company Type</label
                        >
                        <div class="company-detail">
                            {{ profileDetails.company_type }}
                        </div>
                    </div>
                    <div class="row-1">
                        <label class="dark-xs cl-DustyGray2"
                            >Business Country</label
                        >
                        <div
                            class="company-detail"
                            v-if="profileDetails.business_country_info"
                        >
                            {{ profileDetails.business_country_info.country }}
                        </div>
                    </div>
                </div>

                <div class="detail-row" v-if="profileDetails.business_info">
                    <div class="row-1 row-full">
                        <label class="dark-xs cl-DustyGray2"
                            >Business Description</label
                        >
                        <div class="company-detail">
                            {{ profileDetails.reduced_business_info }}
                            <a
                                class="view-more"
                                @click="viewMoreDesc(!showLess)"
                                v-if="
                                    profileDetails.business_info.length >
                                        business_info_cutoff
                                "
                            >
                                <span v-if="!showLess">View More</span>
                                <span v-if="showLess">View Less</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div
                    class="detail-row"
                    v-if="
                        profileDetails.addresses &&
                            profileDetails.addresses.length
                    "
                >
                    <div class="row-1 row-full">
                        <label class="dark-xs cl-DustyGray2">Address</label>
                        <div class="company-detail">
                            {{ profileDetails.addresses[0].address1 }}
                        </div>
                    </div>
                </div>
                <div class="bottom-buttons">
                    <nitrozen-button
                        class="mr24"
                        v-if="profileDetails.stage != 'verified'"
                        @click="openApproveDialog()"
                        v-flatBtn
                        :theme="'secondary'"
                        >Approve</nitrozen-button
                    >
                    <!-- v-if="product.stage != 'rejected'" -->
                    <nitrozen-button
                        theme="secondary"
                        class="export-catalog"
                        v-if="profileDetails.stage != 'rejected'"
                        v-strokeBtn
                        @click="openRejectDialog()"
                        >Reject</nitrozen-button
                    >
                </div>
            </div>
        </div>
        <div class="documents">
            <div class="documents-header">
                <label class="bold-xs cl-Mako">Legal Documents</label>
                <div class="img-box">
                    <a
                        :href="
                            `https://platform.${fyndPlatformDomain}/company/${companyId}/profile/edit-documents`
                        "
                        target="_blank"
                        class="menu"
                    >
                        <adm-inline-svg
                            class="verified-icon left-space-s"
                            :src="'edit'"
                            title="Edit"
                        ></adm-inline-svg>
                    </a>
                </div>
            </div>
            <div v-if="inProgress" class="shimmer"></div>
            <div class="documents-body" v-if="!inProgress">
                <div v-if="profileDetails.documents.length > 0">
                    <div
                        class="document-row"
                        v-for="(item, index) in profileDetails.documents"
                        :key="'docs' + index"
                    >
                        <div class="document-type dark-xs cl-DustyGray2">
                            {{ item.type }}
                        </div>
                        <div class="document-value">{{ item.value }}</div>
                    </div>
                </div>
                <div v-else>Company have no documents</div>
            </div>
        </div>
        <nitrozen-dialog
            class="remove_staff_dialog"
            ref="company_approve_dialog"
            title="Approve Company"
        >
            <template slot="header" v-if="profileDetails">
                {{ profileDetails.name }}
            </template>
            <template slot="body" class="cust-dialog-body"
                >Are you sure you want to approve this company?</template
            >
            <template slot="footer">
                <div>
                    <nitrozen-button
                        class="mr24"
                        @click="approveCompany"
                        v-flatBtn
                        :theme="'secondary'"
                        >Approve</nitrozen-button
                    >
                    <nitrozen-button
                        @click="closeApproveDialog"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
        <nitrozen-dialog
            class="remove_staff_dialog"
            ref="company_reject_dialog"
            title="Reject Company"
        >
            <template slot="header" v-if="profileDetails">
                {{ profileDetails.name }}
            </template>
            <template slot="body" class="desc-dialog">
                <div>
                    <nitrozen-input
                        class="cust-inp"
                        type="textarea"
                        label="Rejection Reason*"
                        placeholder="Explain rejection reason properly..."
                        v-model="rejection_info.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        class="cust-inp"
                        v-if="rejection_info.showError"
                    >
                        {{ rejection_info.errortext }}
                    </nitrozen-error>
                </div>
                <div>Are you sure you want to reject this company?</div>
            </template>
            <template slot="footer">
                <div>
                    <nitrozen-button
                        class="mr24"
                        @click="rejectCompany"
                        v-flatBtn
                        :theme="'secondary'"
                        >Reject</nitrozen-button
                    >
                    <nitrozen-button
                        @click="closeRejectDialog"
                        v-strokeBtn
                        :theme="'secondary'"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>

<style lang="less" scoped>
.bottom-buttons {
    align-self: end;
    justify-content: flex-end;
    margin-bottom: 12px;
}
.cust-inp {
    margin-bottom: 24px;
}
::v-deep .nitrozen-dialog-body {
    margin-bottom: 24px;
}
.details {
    .details-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
        .bold-xs {
            font-size: 18px;
        }
    }
    .details-body {
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .row-1 {
                flex: 0.5;
                .company-detail {
                    color: @Mako;
                    margin: 12px 0;
                    font-size: 14px;
                    line-height: 1.5;
                    font-weight: 500;
                    .view-more {
                        color: @RoyalBlue;
                        font-weight: 600;
                        padding-left: 8px;
                        cursor: pointer;
                    }
                }
                &.row-full {
                    flex: 1;
                }
            }
        }
    }
}
.documents {
    position: absolute;
    width: calc(100% + 24px);
    background: @White;
    padding: 12px;
    margin-top: 24px;
    margin-left: -24px;
    border-radius: 3px;
    .documents-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .bold-xs {
            font-size: 18px;
        }
    }
    .documents-body {
        margin-top: 4px;
        .document-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            line-height: 2.5;
            .document-type {
                text-transform: uppercase;
            }
            .document-value {
                color: @Mako;
                font-weight: 500;
            }
        }
    }
}
.shimmer {
    display: block;
    width: 100%;
    height: 120px;
    margin-bottom: 24px;
}
</style>

<script>
import path from 'path';
import CompanyService from '@/services/company-admin.service';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
import admInlineSVG from '@/components/common/adm-inline-svg';
import {
    strokeBtn,
    flatBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
const env = root.env || {};

export default {
    name: 'adm-company-details',
    components: {
        'nitrozen-button': NitrozenButton,
        'adm-inline-svg': admInlineSVG,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            profileDetails: {},
            companyId: this.$route.params.companyId,
            business_info_cutoff: 300,
            showLess: false,
            rejection_info: {
                showError: false,
                errortext: 'Please explain rejection reason properly.',
                value: ''
            }
        };
    },
    computed: {
        fyndPlatformDomain(type) {
            return env.FYND_PLATFORM_DOMAIN;
        }
    },
    mounted() {
        this.getProfileDetails();
    },
    methods: {
        getProfileDetails: function() {
            let params = {
                uid: this.companyId
                // phase: 'company_detail'
            };
            this.inProgress = true;
            CompanyService.fetchCompanyProfile(params)
                .then((res) => {
                    this.inProgress = false;
                    this.pageError = false;
                    this.profileDetails = res.data.data;
                    this.profileDetails.reduced_business_info = this.profileDetails.business_info;
                    if (
                        this.profileDetails.business_info &&
                        this.profileDetails.business_info.length >
                            this.business_info_cutoff
                    ) {
                        this.profileDetails.reduced_business_info = this.profileDetails.reduced_business_info.slice(
                            0,
                            this.business_info_cutoff
                        );
                    }
                })
                .catch((err) => {
                    this.pageError = true;
                    this.inProgress = false;
                    console.error(err);
                });
        },
        openApproveDialog: function() {
            this.$refs['company_approve_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true
            });
        },
        closeApproveDialog: function() {
            this.$refs['company_approve_dialog'].close();
        },
        openRejectDialog: function() {
            this.rejection_info.showError = false;
            this.$refs['company_reject_dialog'].open({
                width: '500px',
                showCloseButton: true,
                dismissible: true
            });
        },
        closeRejectDialog: function() {
            this.$refs['company_reject_dialog'].close();
            this.rejection_info.showError = false;
            this.rejection_info.value = '';
        },
        approveCompany() {
            const obj = {
                uid: this.profileDetails.uid,
                stage: 'verified'
            };
            CompanyService.adminActionCompany(obj)
                .then((res) => {
                    this.closeApproveDialog();
                    this.getProfileDetails();
                    this.$snackbar.global.showSuccess(
                        'Company Approved Successfully',
                        {
                            duration: 2000
                        }
                    );
                    setTimeout(() => {
                        this.onCancel();
                    }, 2000);
                })
                .catch((error) => {
                    console.error(error);
                    this.$snackbar.global.showError(
                        `${
                            error.response.data
                                ? error.response.data.errors.error
                                : ''
                        }`,
                        {
                            duration: 2000
                        }
                    );
                    this.closeApproveDialog();
                })
                .finally(() => {
                    this.inProgress = false;
                });
        },
        rejectCompany() {
            if (this.rejection_info.value.length > 0) {
                const obj = {
                    uid: this.profileDetails.uid,
                    reject_reason: this.rejection_info.value,
                    stage: 'rejected'
                };
                CompanyService.adminActionCompany(obj)
                    .then((res) => {
                        this.closeRejectDialog();
                        this.rejection_info.value = '';
                        this.rejection_info.showError = false;
                        this.getProfileDetails();
                        this.$snackbar.global.showSuccess(
                            'Company Rejected Successfully',
                            {
                                duration: 2000
                            }
                        );
                        setTimeout(() => {
                            this.onCancel();
                        }, 2000);
                    })
                    .catch((error) => {
                        console.error(error);
                        this.$snackbar.global.showError(
                            `${
                                error.response.data
                                    ? error.response.data.errors.error
                                    : ''
                            }`,
                            {
                                duration: 2000
                            }
                        );
                        this.closeRejectDialog();
                    })
                    .finally(() => {
                        this.inProgress = false;
                    });
            } else {
                this.rejection_info.showError = true;
            }
        },
        viewMoreDesc: function(flag) {
            this.showLess = flag;
            if (flag) {
                this.profileDetails.reduced_business_info = this.profileDetails.business_info;
            } else {
                this.profileDetails.reduced_business_info = this.profileDetails.reduced_business_info.slice(
                    0,
                    this.business_info_cutoff
                );
            }
        },

        edit: function(params) {
            this.$router.push({
                path: path.join(this.$basePath, '/profile/edit')
            });
        },
        editDocuments: function() {
            this.$router.push({
                path: path.join(this.$basePath, '/profile/edit-documents')
            });
        }
    }
};
</script>
