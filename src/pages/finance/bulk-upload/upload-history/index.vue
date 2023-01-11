<template>
    <div>
        <page-header
            title="Upload History"
            @backClick="$router.push({ name: 'bulk-upload' })"
        >
        </page-header>
        <div class="main-container">
            <div class="page-container">
                <upload-filters @dates="setDates" @dateschanged="changedDates" />
                <div v-for="data in reportList" :key="data.id" class="report-list-container">
                    <list-cards
                        :data="data"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    NitrozenButton,
    flatBtn,
    NitrozenCheckBox,
    NitrozenToggleBtn,
    NitrozenInput,
    NitrozenError
} from '@gofynd/nitrozen-vue';
import moment from 'moment';
import PageError from '@/components/common/page-error';
import { Loader, PageHeader, ImageUploaderTile } from '@/components/common/';
import InlineSvg from '@/components/common/inline-svg';
import UploadFilters from './filters.vue';
import ListCards from './list-cards.vue';
import FinanceService from '@/services/finance.service.js';
import { GET_USER_INFO } from '@/store/getters.type';

/** Mock Import */
import REPORT_LIST from '../fixtures/report-list.json';

import { validUrl } from '@/helper/utils';

export default {
    name: 'upload-history',
    components: {
        NitrozenButton,
        NitrozenCheckBox,
        NitrozenToggleBtn,
        NitrozenInput,
        NitrozenError,
        PageError,
        PageHeader,
        ImageUploaderTile,
        Loader,
        InlineSvg,
        UploadFilters,
        ListCards
    },
    directives: {
        flatBtn
    },
    data() {
        return {
            reportList: [],
            responseData: {},
            inProcess: false,
            startDate:'',
            endDate:'',
        };
    },
    computed:{
        ...mapGetters({
            userData: GET_USER_INFO,
        }),
    },
    mounted() {
        this.getReportList();
    },
    methods: {
        setDates(data){
            this.startDate =  moment(data[0]).format('DD-MM-YYYY');
            this.endDate = moment(data[1]).format('DD-MM-YYYY');
        },
        changedDates(e){
            this.setDates(e);
            this.getReportList();
        },
        getReportList(){
            let params = {
                "data": {
                    "start_date": this.startDate,
                    "end_date": this.endDate,
                    "page_size": 10,
                    "page": 1
                }
            };
            const reportList = FinanceService.getReportList(params);
            reportList
                .then((res) => {
                    this.reportList = res.data.items;

                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(()=> {
                    this.inProcess = false
                })
        }
    }
};
</script>

<style lang="less" scoped>
@import '../../../less/page-header.less';

.main-container {
    margin-top: 64px;
    .content-container {
        display: block;
        .input-form {
            margin-top: 16px;
        }
    }

    .report-list-container {
        width: 100%;
        margin-bottom: 1rem;
    }

}
</style>
