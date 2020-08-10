<template>
    <div>
        <div class="card-content-line-3">
            <span class="tooltip cl-Mako reviewer">
                <span v-if="showPrepo">by</span>
                <a
                    @mouseover="
                        getUserInfo(
                            (reviewItem &&
                                reviewItem.created_by &&
                                reviewItem.created_by.id) ||
                                userId
                        )
                    "
                    @mouseout="userHoverOut()"
                >
                    {{
                        (reviewItem &&
                            reviewItem.created_by &&
                            reviewItem.created_by.name) ||
                            userInfo.name ||
                            '-'
                    }}
                </a>
                <div class="tooltiptext" :class="position">
                    <div v-if="userInfo">
                        <div v-if="userInfo.email" class="userInfo">
                            <span class="dark-xxs cl-Mako">Email: &nbsp;</span>
                            <span class="text-overflow cl-Mako dark-xxs">{{
                                userInfo.email
                            }}</span>
                            <div
                                id="pageLink"
                                class="copy"
                                @click="copyToClipboard(userInfo.email, $event)"
                            >
                                <inline-svg src="copy"></inline-svg>
                            </div>
                        </div>
                        <div v-if="userInfo.phone" class="userInfo">
                            <span class="dark-xxs cl-Mako">Phone: &nbsp;</span>
                            <span class="text-overflow cl-Mako dark-xxs">{{
                                userInfo.phone
                            }}</span>
                            <div
                                id="pageLink"
                                class="copy"
                                @click="copyToClipboard(userInfo.phone, $event)"
                            >
                                <inline-svg src="copy"></inline-svg>
                            </div>
                        </div>
                        <div v-if="userInfo.gender">
                            <span class="dark-xxs cl-Mako gender"
                                >Gender: &nbsp;</span
                            >
                            <span class="capitalize cl-Mako dark-xxs">{{
                                userInfo.gender
                            }}</span>
                        </div>
                        <div v-if="userInfo.date">
                            <span class="dark-xxs cl-Mako gender">
                                {{
                                    dateType === 'created'
                                        ? 'Creation Date'
                                        : 'Modified Date'
                                }}: &nbsp;
                            </span>
                            <span class="capitalize cl-Mako dark-xxs">{{
                                userInfo.date
                            }}</span>
                        </div>
                    </div>
                    <div v-else-if="!userError">
                        <div class="shimmer userinfo-shimmer"></div>
                        <div class="shimmer userinfo-shimmer"></div>
                        <div class="shimmer userinfo-shimmer"></div>
                    </div>
                    <div v-else>Failed to fetch user information</div>
                </div>
            </span>
            <span v-if="showDate">{{ getDate() }}</span>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../../../pages/less/page-header.less';
@import './../../../pages/less/page-ui.less';
@import './../../../pages/less/form.less';
.reviewer {
    color: @DustyGray2;
    line-height: 16px;
    position: relative;
}
.userinfo-shimmer {
    margin: 6px 0px 2px 0px;
    padding: 6px 0px;
    width: 100%;
    box-sizing: border-box;
    border-radius: 5px;
}
.userInfo {
    display: flex;
    align-items: center;
}
.copy {
    padding: 2px 0px 7px 8px;
    cursor: pointer;
    /deep/ svg {
        width: 16px;
        height: 16px;
    }
}
.tooltip {
    text-transform: none;
    position: relative;
    .right {
        top: 100%;
        left: 50%;
        margin-left: -20px;
        &::after {
            bottom: 100%; /* At the top of the tooltip */
            left: 30%;
            margin-left: -45px;
            transform: rotate(180deg);
        }
    }
    .left {
        top: 100%;
        // left: 50%;
        right: 25%;
        margin-left: -20px;
        &::after {
            bottom: 100%; /* At the top of the tooltip */
            // left: 30%;
            right: 20px;
            margin-left: -45px;
            transform: rotate(180deg);
        }
    }
    .tooltiptext {
        cursor: pointer;
        visibility: hidden;
        color: black;
        border-radius: 6px;
        padding: 15px;
        border: 1px solid @Iron;
        position: absolute;
        z-index: @layer;
        max-width: 350px;
        min-width: 200px;
        line-height: 1.7;
        background-color: #ebedfb;
        // box-shadow: 0px 2px 4px 0px black;
        max-height: 90px;
        // margin-left: -70px;
        // margin-left: 0px;
        &::after {
            content: ' ';
            position: absolute;
            border-style: solid;
            border-color: #ebedfb transparent transparent transparent;
            border-width: 5px;
        }
    }
    a {
        color: @RoyalBlue;
        cursor: pointer;
    }
}
.tooltip:hover .tooltiptext {
    visibility: visible;
}
.capitalize {
    text-transform: capitalize;
}
.text-overflow {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 130px;
}
.mirage-list-card-container {
    overflow: visible;
    .card-content-section {
        .date {
            color: @DustyGray2;
        }
        .product-link {
            color: @PurpleHeart;
            text-transform: capitalize;
        }
    }
    .modal-icon {
        width: 100px;
        margin: auto 0px;
        /deep/.details svg {
            width: 40px;
            height: 40px;
        }
    }
}
</style>

<script>
import loader from '@/components/common/loader.vue';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import uktRating from '@/components/common/ukt-rating.vue';
import { copyToClipboard } from '@/helper/utils.js';
import CompanyService from '@/services/company-admin.service';
import admTextAvatar from '@/components/common/text-avatar.vue';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import * as _ from 'lodash';

// import starRating from 'vue-star-rating';

export default {
    name: 'review-rating-item',
    components: {
        'inline-svg': inlinesvg,
        'adm-inline-svg': adminlinesvg,
        loader
    },
    props: {
        reviewItem: {},
        showDate: '',
        showPrepo: '',
        // userObj: '',
        userId: '',
        position: {
            type: String,
            default: 'right'
        },
        dateType: '',
        date: ''
    },
    data() {
        return {
            userInfo: '',
            userError: '',
            userHover: false
        };
    },
    mounted() {
        if (this.userId) {
            this.getUserInfo(this.userId);
            // this.userHover = true;
        }
    },
    methods: {
        copyToClipboard(data, event) {
            copyToClipboard(data);
            this.$snackbar.global.showInfo('Copied to clipboard');
            event.stopPropagation();
        },
        getDate() {
            let date = this.reviewItem.date_meta.modified_on;
            return date ? ` on ${new Date(date).toDateString()}` : '';
        },
        userHoverOut() {
            this.userHover = false;
            // console.log(`userhove out : ${this.userHover}`);
        },
        getUserInfo(userId, userType) {
            if (this.userInfo || this.userHover || !userId) return;
            this.userHover = true;
            // console.log(`userhove In: ${this.userHover}`);
            // if (this.reviewerInfo.userId === userId) return;
            CompanyService.searchUser({ query: userId })
                .then((res) => {
                    if (res.data.length) {
                        this.userInfo = {
                            email: this.getEmail(res.data[0]),
                            phone: this.getPhone(res.data[0]),
                            name: `${res.data[0].firstName} ${res.data[0].lastName}`,
                            gender: res.data[0].gender,
                            userId
                        };
                        if (this.dateType) {
                            let dateString = new Date(this.date).toDateString();
                            this.userInfo.date = dateString
                                .split(' ')
                                .splice(1)
                                .join(' ');
                        }
                    } else {
                        this.userError = true;
                    }
                })
                .catch((err) => {
                    this.userError = true;
                    console.log(err);
                });
        },
        getEmail: function(userObj) {
            if (
                userObj &&
                Array.isArray(userObj.emails) &&
                userObj.emails.length
            ) {
                let priEmail = userObj.emails.filter((email) => {
                    return email.primary;
                });
                if (priEmail.length) return priEmail[0].email;
                else {
                    return userObj.emails[0].email;
                }
            }
        },
        getPhone: function(userObj) {
            if (
                userObj &&
                Array.isArray(userObj.phoneNumbers) &&
                userObj.phoneNumbers.length
            ) {
                let priPhone = userObj.phoneNumbers.filter((phone) => {
                    return phone.primary;
                });
                if (priPhone.length)
                    return `+${priPhone[0].countryCode} ${priPhone[0].phone}`;
                else {
                    return `+${userObj.phoneNumbers[0].countryCode} ${userObj.phoneNumbers[0].phone}`;
                }
            }
        }
    }
};
</script>
