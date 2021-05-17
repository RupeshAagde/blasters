<template>
    <div class="panel">
        <div class="main-container">
            <div style="width: 100%">
                <jumbotron
                    :title="'Invoices'"
                    :desc="'View All Invoices'"
                ></jumbotron>
                <invoice-listing style="margin-top:24px"></invoice-listing> 
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
import InvoiceListing from "./invoice-listing";

export default {
    name:'invoice-listing-main',
    components:{
        jumbotron: Jumbotron,
        'invoice-listing':InvoiceListing,
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