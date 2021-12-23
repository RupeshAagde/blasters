<template>
    <div class="top">
         <div class="search-box">
            <nitrozen-button
               id="cod"
                :theme="'secondary'"
                @click="fetchcodconfig"
                v-flatBtn
                >COD Config</nitrozen-button
            >
            <div class="filter">
                <label class="label">Filter</label>
                <nitrozen-dropdown
                    class="filter-dropdown"
                    :items="filters"
                    v-model="selectedFilter"
                    @change="()=>{setRouteQuery().then(()=>{getReviewList()})}"
                ></nitrozen-dropdown>
            </div>
        </div>
        <page-empty v-if="noContent" > </page-empty>
        <shimmer v-if="loading" :count="4"></shimmer>
        <div v-if="!loading && reviewDetails && reviewDetails.data && reviewDetails.data.length">
           
            <div v-for="item in reviewDetails.data[0]" :key="item.id">
                <div class="container">
                    <div class="card-top" id="removedialog" @click="openRejectDialog(item)">
                        <div class="left-container">
                            <div>
                                <div
                                    class="
                                        capitalize
                                        card-content-line-1
                                        txt-company-heading
                                    "
                                >
                                    {{ item.payment_gateway }}
                                </div>

                                <div class="txt-arrange">
                                    <div class="txt-description-heading column1">
                                        API Key :
                                    </div>
                                    <div class="txt-details-by column">
                                        {{ item.api_key }}
                                    </div>
                                </div>
                                <div class="txt-arrange">
                                    <div class="txt-description-heading column1">
                                        Refund by :
                                    </div>
                                    <div class="txt-details-by capitalize column">
                                        {{ item.refund_by }}
                                    </div>
                                </div>
                                <div class="txt-arrange">
                                    <div class="txt-description-heading column1">
                                        Collect by :
                                    </div>
                                    <div class="txt-details-by capitalize column">
                                        {{ item.refund_by }}
                                    </div>
                                </div>
                                <div
                                    v-if="selectedFilter === 'true'"
                                    class="txt-arrange"
                                >
                                    <div class="txt-description-heading column1">
                                        Reviewer :
                                    </div>
                                    <div class="txt-details-by capitalize column">
                                        {{ item.reviewer }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="item.is_reviewed" class="card-badge-section">
                            <nitrozen-badge state="success"
                                >Approved</nitrozen-badge
                            >
                        </div>
                        <div
                            v-if="!item.is_reviewed"
                            class="card-badge-section"
                        >
                            <nitrozen-badge class="review" state="error"
                                >Under Review</nitrozen-badge
                            >
                        </div>
                    </div>
                </div>
            </div>
            <nitrozen-dialog
                class="remove_staff_dialog"
                ref="company_reject_dialog"
                title="Reject Company"
            >
                <template slot="header">
                    <div class="capitalize">
                        {{ modalProps.payment_gateway }}
                    </div>
                </template>
                <template slot="header">
                    <div class="cross" @click="closeDialog">
                        <inline-svg :src="'cross-black'"></inline-svg>
                    </div>
                </template>
                <template slot="body" class="desc-dialog">
                    <div class="b1">
                        <div>
                            <div>
                                <nitrozen-check-box v-model="fyndSubAcc">
                                    <div class="check">
                                        <span class="cst-1">FYND Sub Merchant Account</span> <nitrozen-tooltip class="cst-space-left">
                <div class="custom-tooltip-txt">Select this checkbox if this account creds belongs to Fynd  submerchant account. Otherwise leave it unchecked. Fynd submerchant account means your transaction amount get settled in Fynd bank account.</div>
            </nitrozen-tooltip>
                                    </div>
                                </nitrozen-check-box>
                            </div>
                            <div class="sub-acc">
                                
                            </div>
                        </div>
                        <div>
                            <div class="comm">
                                <nitrozen-input
                                    type="textarea"
                                    label="Comments"
                                    :required="true"
                                    placeholder="Any Comments..."
                                    v-model="comments"
                                    @blur="checkRequired()"
                                ></nitrozen-input>
                                <nitrozen-error v-if="errors.name">
                                    {{ errors.name }}
                                </nitrozen-error>
                            </div>
                        </div>
                        <nitrozen-input
                            class="search"
                            type="password"
                            label="Password"
                            placeholder="Enter password to change creds"
                            v-model="password"
                            :required="true"
                            @blur="checkRequired()"
                        ></nitrozen-input>
                        <nitrozen-error v-if="errors.password">
                            {{ errors.password }}
                        </nitrozen-error>
                    </div>
                </template>
                <template slot="footer">
                    <div>
                        <nitrozen-button
                            v-flatBtn
                            class="mr24"
                            id="approve"
                            :theme="'secondary'"
                            @click="postReviewedAccept()"
                            :disabled="false"
                            >Approve</nitrozen-button
                        >
                        <nitrozen-button v-strokeBtn class="mr24" :theme="'secondary'"
                            >Decline</nitrozen-button
                        >
                    </div>
                </template>
            </nitrozen-dialog>
            <nitrozen-dialog
                class="remove_staff_dialog"
                ref="cod_dialog"
                title="Reject Company"
            >
                <template slot="header">
                    <div class="capitalize">COD Config</div>
                </template>
                <template slot="header">
                    <div class="cross" @click="closeDialogCod">
                        <inline-svg :src="'cross-black'"></inline-svg>
                    </div>
                </template>
                <template slot="body" class="desc-dialog">
                    <div class="">
                        <div>
                            <div class="filter-type">
                                <label class="label eng">Collected By *</label>
                                <nitrozen-dropdown
                                    :items="typeList"
                                    v-model="typeSelectedCollect"
                                ></nitrozen-dropdown>
                            </div>
                            <div class="filter-type extra">
                                <label class="label eng">Refunded By *</label>
                                <nitrozen-dropdown
                                    :items="typeList"
                                    v-model="typeSelectedRefund"
                                ></nitrozen-dropdown>
                            </div>
                            <nitrozen-input
                                class="search"
                                id="blurE"
                                type="password"
                                label="Password"
                                placeholder="Enter password to change COD config"
                                v-model="password"
                                :required="true"
                                @blur="checkRequired()"
                            ></nitrozen-input>
                            <nitrozen-error v-if="errors.password">
                                {{ errors.password }}
                            </nitrozen-error>
                        </div>
                        <div></div>
                    </div>
                </template>
                <template slot="footer">
                    <div @click="postcodconfig">
                        <nitrozen-button v-flatBtn id="codPost" class="mr24" :theme="'secondary'"
                            >Save</nitrozen-button
                        >
                    </div>
                </template>
            </nitrozen-dialog>
        </div>
    </div>
</template>
<script>
import inlinesvg from '../../components/common/inline-svg.vue';
import { mapGetters } from 'vuex';
import { GET_USER_INFO } from '../../store/getters.type';
import Shimmer from '@/components/common/shimmer';
import Jumbotron from '@/components/common/jumbotron';
import PageEmpty from '@/components/common/page-empty';

import PaymentServices from '../../services/gringotts.service';
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenInput,
    NitrozenDialog,
    NitrozenCheckBox,
    NitrozenDropdown,
    NitrozenError,
    flatBtn,
    strokeBtn,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';

const ROLE_FILTER = [
    { value: 'true', text: 'Approved' },
    { value: 'false', text: 'Under Review' },
];

const TYPE_FILTER = [
    { value: 'fynd', text: 'FYND' },
    { value: 'self', text: 'Self' },
];

export default {
    name: 'adm-pg-configuration',
    components: {
        Shimmer,
        NitrozenCheckBox,
        NitrozenDropdown,
        NitrozenError,
        'nitrozen-input': NitrozenInput,
        'nitrozen-button': NitrozenButton,
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-dialog': NitrozenDialog,
        'inline-svg': inlinesvg,
        Jumbotron,
        'page-empty' : PageEmpty,
        NitrozenTooltip
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            reviewDetails: null,
            param: {
                companyId: this.$route.params.companyId,
                app_id: this.$route.params.appId,
            },
            loading: true,
            modalProps: {},
            reviewerEmail: '',
            password: '',
            comments: '',
            fyndSubAcc: false,
            filters: [...ROLE_FILTER],
            selectedFilter: 'false' ,
            errors: { name: '', password: '' },
            typeList: [...TYPE_FILTER],
            typeSelectedCollect: '',
            typeSelectedRefund: '',
            noContent: false
        };

    },
    methods: {
        openRejectDialog: function (item) {
            this.password = ''
            this.errors.name = '';
            this.errors.password = '';
            this.$refs['company_reject_dialog'].open({
                width: '500px',
            });
            this.modalProps = item;
            this.getReviewerMail();
        },
        closeDialog: function () {
            this.$refs['company_reject_dialog'].close();
        },
        closeDialogCod() {
            this.$refs['cod_dialog'].close();
        },
        getReviewList: function () {
            if (this.$route.query.status) {
                this.selectedFilter = this.$route.query.status;
            }
            PaymentServices.getReviewDetails(
                this.param,
                this.selectedFilter
            ).then(({data}) => {
                // if(this.$route.params.status === false){
                //     this.selectedFilter = this.filters[0]
                // }
                this.noContent = false;

                this.reviewDetails = data;
                if(this.reviewDetails.data[0].length === 0){
                    this.noContent = true;
                }
                this.loading = false;
            })
            .catch(err=>{
                console.log(err);
            })
        },
        postReviewedAccept: function () {
            if(this.comments == ''){
                return
            }
            const payload = {
                payment_gateway: this.modalProps.payment_gateway,
                is_reviewed: 'true',
                reviewer: this.reviewerEmail,
                comments: this.comments,
                is_active: 'true',
                is_sub_fynd_account: this.fyndSubAcc ,
                password: this.password , 
                // unicron@admin@fynd#2021
            };
             
            const ids = {
                ...this.param,
                paymentId: this.modalProps.id,
                email: this.reviewerEmail ,
            };
            this.checkRequired()
            PaymentServices.postPgReview(ids, payload)
                .then((data) => {
                   this.getReviewList();
                    this.closeDialog();
                    this.$snackbar.global.showSuccess('PG cred Approved');
                    this.password = '';
                })
                .catch((err) => {
                    //console.log(err);
                    this.$snackbar.global.showError(err);
                });
        },
        getReviewerMail: function () {
            //console.log(this.currentUserInfo);
            let mails = this.currentUserInfo.user.emails;
            //console.log(mails);
            for (let i of mails) {
                if (i.active && i.primary) {
                    //console.log(i.email);
                    this.reviewerEmail = i.email;
                }
            }
        },
        setRouteQuery() {
            let query = { status: this.selectedFilter };
            //console.log(this.$route.query);
            //console.log(query);
            return this.$router.replace({
                path: this.$route.path,
                query: {
                    ...this.$route.query,
                    ...query,
                },
            })
            .catch(()=>{});
        },
        checkRequired() {
            if (this.comments == '') {
                this.errors.name = 'field is required';
            }
            if (this.comments !== '') {
                this.errors.name = '';
            }
            if (this.password == '') {
                this.errors.password = 'field is required';
            }
            if (this.password !== '') {
                this.errors.password = '';
            }
            // if(this.errors.name.length && this.errors.password.length  ){
            //     this.valid = true
            // }
            // valid
        },
        fetchcodconfig() {
            PaymentServices.getCOD(this.param).then((a) => {
                
                this.typeSelectedRefund = a.data.delivery_config.cod.refund_by;
                this.typeSelectedCollect = a.data.delivery_config.cod.collect_by;
            })
            .catch(e=>{
                console.log(e);
            })
            this.$refs['cod_dialog'].open({
                width: '500px',
            });
        },
        postcodconfig() {
            let data = {
    delivery_config: {
        cod: {
            refund_by : this.typeSelectedRefund ,
            collect_by: this.typeSelectedCollect
        }
    },
    password: this.password
}
this.checkRequired()
            
            PaymentServices.postCOD(this.param, data)
                .then((res) => {
                    this.$snackbar.global.showSuccess('COD config Saved');
                    this.password= ''
                    this.comments = ''
                    //console.log(res);
                })
                .catch((err) => {
                    this.$snackbar.global.showError(err);
                    //console.log(err);
                });
        },
    },
    computed: {
        ...mapGetters({
            currentUserInfo: GET_USER_INFO,
        }),
    },
    mounted() {
        //console.log("Mounting",this.$route.params)
        this.getReviewList();
        //this.fetchcodconfig();
    },
};
</script>
<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.container {
    background-color: white;
    border: 1px solid #e4e5e6;
    cursor: pointer;
    min-height: 120px;
    padding: 0px 24px;
    border-radius: 3px;
    margin-bottom: 16px;
    transition: box-shadow 0.3s;
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
    .card-top {
        display: flex;
        height: auto;
        margin-top: 24px;
        margin-bottom: 12px;
        .left-container {
            // display: flex;
            // flex: 2;
            // position: relative;
            // width: calc(100% - 60px);

            .txt-arrange {
                display: flex;
            }

            .txt-company-heading {
                color: #2e31be;
                font-weight: 600;
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
                line-height: 22px;
                margin-bottom: 6px;
            }
            .txt-description-heading {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
            .txt-details-by {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
                display: flex;
            }
            .txt-country {
                margin-left: 24px;
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
            }
            .txt-details-on {
                color: #9b9b9b;
                line-height: 22px;
                font-size: 12px;
                margin-left: 57px;
            }

            .card-avatar {
                min-height: 60px;
                min-width: 60px;
                max-height: 60px;
                max-width: 60px;
                display: flex;
                align-items: center;
                img {
                    width: 100%;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }
            .offer-details {
                padding: 0px 24px;
                line-height: 24px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: calc(100% - 100px);
            }
        }
        .right-container {
            flex: 1;
            display: flex;
            flex: 1;
            flex-direction: row;
            position: relative;
            align-items: center;

            ::v-deep.continue-arrow svg {
                width: 40px;
                height: 40px;
            }
            ::v-deep.status-container {
                display: flex;

                padding: 0px 12px;
            }
        }
    }
    .card-bottom {
        line-height: 19px;
        margin-top: 12px;
        display: flex;
        flex-wrap: wrap;
        .size {
            width: auto;
            height: 40px;
            padding: 0 12px;
            margin: 12px 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            transition: background-color 0.3s;
            &:hover {
                background-color: @WhiteSmoke;
            }
            .line-1 {
                color: @Mako;
                font-weight: 500;
            }
        }
    }
}
.cust-margin {
    margin-bottom: 15px;
}
.text-margin {
    margin-bottom: 24px;
    margin-top: 18px;
}
.cross {
    span {
        cursor: pointer;
    }
}
.review {
    border: 1px solid #fab000;
    color: #fab000;
}
.capitalize {
    text-transform: capitalize;
}
.check {
    display: flex;
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 14px;
    font-weight: 500;
    -webkit-box-flex: 1;
}
.filter-dropdown {
    width: 200px;
}

.filter {
    display: flex;
    align-items: center;

    .label {
        margin-right: 24px;
    }
}
.search-box {
    margin: 24px 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin-top: 0px;
    .filter {
        display: flex;
        align-items: center;
    }
    .label {
        font-family: Inter;
        color: @Mako;
        font-size: 14px;
        line-height: 20px;
        font-weight: 500;
    }
    .filter-dropdown {
        width: 200px;
        margin-left: 12px;
    }
}
.top {
    //width: 100%;
    background-color: white;
    padding: 24px;
}
.sub-acc {
    padding-left: 28px;
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    -webkit-box-flex: 1;
    margin-bottom: 15px;
}

.comm {
    margin-bottom: 15px;
}
.filter-type {
    width: 100%;
    margin-bottom: 25px;
}
.extra {
    margin-bottom: 20px;
}
.eng {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
    -webkit-box-flex: 1;
}
.custom-tooltip-txt {
    line-height: 20px;
    font-family: Inter;
    font-size: 12px;
    text-align: left;
    min-width: 200px;
    padding: 6px 12px;
}
.cst-space-left {
    margin-left: 10px;
    margin-top: 2px
}
.column{
    width: 40%
}
.column1{
    width: 15%
}

</style>