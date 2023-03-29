<template>
    <div class="list-gateways">
        <adm-page-header
            :showBackButton="false"
            :title="'Payment Gateways (PG)'"
        ></adm-page-header>

        <div class="main-container">
            <div class="page-container">
                <div class="search-box">
                    <div
                        v-if="pageLoading && isInitialLoad"
                        class="input-shimmer shimmer"
                    ></div>
                    <template v-else>
                        <div
                            class="search-filter"
                            v-if="
                                !pageLoading ||
                                initialGatewayList.length > 0 ||
                                !pageError
                            "
                        >
                            <nitrozen-input
                                :ref="'search-payment-gateway'"
                                :showSearchIcon="true"
                                class="search"
                                type="search"
                                placeholder="Search by Name"
                                v-model="searchText"
                                @input="searchGateway"
                            ></nitrozen-input>
                        </div>
                    </template>
                </div>

                <div class="content-container">
                    <shimmer
                        v-if="pageLoading && !pageError"
                        :count="4"
                    ></shimmer>
                    <page-error
                        v-else-if="pageError && !pageLoading"
                        @tryAgain="getPaymentGateways"
                    ></page-error>
                    <div
                        v-else-if="
                            paymentGatewayList && paymentGatewayList.length
                        "
                    >
                        <div class="gateway-main">
                            <div
                                class="gateway-menu"
                                v-for="(item, index) in paymentGatewayList"
                                :key="index"
                                @click="editPaymentGateway(item)"
                            >
                                <card>
                                    <span class="gateway-icon">
                                        <div class="card-avatar">
                                            <img
                                                :src="item.logos['small'] || '/public/assets/pngs/logo.png'"
                                                alt="Logo"
                                            />
                                        </div>
                                    </span>
                                    <span class="gateway-content">
                                        <div class="card-content-section">
                                            <div
                                                class="card-content-line-1 full-name"
                                            >
                                                {{ item.name }}
                                            </div>
                                            <div class="cust-toggle">
                                                <nitrozen-badge v-if="item.is_active" state="success">
                                                    Active
                                                </nitrozen-badge>
                                                <nitrozen-badge v-else>
                                                    Inactive
                                                </nitrozen-badge>
                                            </div>
                                        </div>
                                    </span>
                                </card>
                            </div>
                        </div>
                    </div>
                    <page-empty
                        v-else
                        :text="'No payment gateway found'"
                    ></page-empty>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenDropdown,
    NitrozenInput,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';

/* Component imports */
import loader from '@/components/common/loader.vue';
import Shimmer from '@/components/common/shimmer.vue';
import PageError from '@/components/common/page-error';
import PageEmpty from '@/components/common/page-empty';
import PageHeader from '@/components/common/layout/adm-page-header.vue';
import Card from '@/components/common/layout/card.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import PaymentService from '../../services/gringotts.service';

export default {
    name: 'list-gateways',
    components: {
        NitrozenInput,
        NitrozenDropdown,
        NitrozenBadge,
        'adm-page-header': PageHeader,
        Shimmer,
        PageEmpty,
        PageError,
        Card,
        InlineSvg,
        loader,
    },
    data() {
        return {
            searchText: '',
            pageLoading: false,
            isInitialLoad: false, // TODO: change it to true and set to false after mounting
            pageError: false,
            initialGatewayList: [],
            paymentGatewayList: [],
        };
    },
    mounted() {
        this.getPaymentGateways();
    },
    methods: {
        editPaymentGateway(item) {
            if (item && item.id) {
                this.$router.push({
                    path: `/administrator/payments/gateways/edit/${item.id}`
                });
            }
        },
        getPaymentGateways() {
            this.pageLoading = true;
            this.pageError = false;
            PaymentService.getPaymentGateways()
                .then((res) => {
                    this.initialGatewayList = res.data.items || [];
                    this.paymentGatewayList = res.data.items || [];
                    this.pageLoading = false;
                })
                .catch((error) => {
                    this.pageLoading = false;
                    this.pageError = true;
                    console.error(error);
                });
        },
      
        searchGateway() {
            if(this.searchText.trim().length){
                this.paymentGatewayList = this.initialGatewayList.filter((item) => {
                return item.name
                    .toLowerCase()
                    .includes(this.searchText.trim().toLowerCase());
                });
            }else{
                this.paymentGatewayList = [...this.initialGatewayList];
            }
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.input-shimmer {
    height: 40px;
    width: 400px;
}

.page-container {
    box-sizing: border-box;
    height: 100%;
    @media @mobile {
        width: calc(100% - 48px);
        margin-top: 48px;
    }

    .content-container {
        width: 100%;
        // margin-top: 12px;
    }
    .search-box {
        width: 100%;
        margin-bottom: 24px;

        .search-filter {
            display: flex;
            align-items: baseline;

            .search {
                width: 100%;
            }

            // .filter {
            //     display: flex;
            //     justify-content: flex-start;
            //     align-items: center;

            //     .filter-dropdown {
            //         margin-left: 24px;
            //     }
            // }
        }
    }
}

.gateway-main {
    display: flex;
    flex-wrap: wrap;
    @media @mobile {
        display: block;
    }
    .gateway-menu {
        flex: 0 50%;
    }
    .gateway-icon {
        display: flex;
        align-items: center;
        padding: 0px 24px;
        border-right: 0.5px solid @Mercury;
        .card-avatar {
            display: flex;
            align-items: center;
            padding: 8px;
            border-radius: 8px;
            img {
                display: flex;
                justify-content: center;
                max-width:65px;
                min-width: 65px;
                max-height:65px;
            }
        }
        
    }
    .gateway-content {
        background-color: @White;
        width: 70%;
        padding: 16px;
        .card-content-section {
            display: flex;
            flex: 1;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            color: @Mako;
            .full-name {
                font-weight: 600;
                font-size: 16px;
                -webkit-font-smoothing: antialiased;
            }

            .cust-toggle {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
}

.list-gateways {
    position: relative;
}

.main-container {
    margin: 0 !important;
}
</style>
