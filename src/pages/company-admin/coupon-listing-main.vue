<template>
    <div class="panel">
        <div class="main-container">
            <div style="width: 100%">
                <jumbotron
                    :title="'Coupons'"
                    :desc="'View All Coupons'"
                ></jumbotron>
                <coupon-listing style="margin-top:24px"></coupon-listing> 
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';
.main-container {
    background-color: white;
    margin: 24px;
    padding: 24px;
}

.custom-header {
    ::v-deep .n-flat-button-secondary {
        margin-top: 110px !important;
    }
}

</style>

<script>
import Jumbotron from '@/components/common/jumbotron';
import CouponsListing from "./coupons-listing";

export default {
    name:'coupon-listing-main',
    components:{
        jumbotron: Jumbotron,
        'coupon-listing':CouponsListing,
    },
    computed:{

    },
    data(){
        return {}
    },
    mounted(){

    },
    methods:{

    }
}
</script>