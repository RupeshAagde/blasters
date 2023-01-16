<template>
    <div>
        <page-header
            title="History"
            @backClick="$router.push({ name: 'bulk-upload' })"
        >
        </page-header>
        <div class="main-container">
            <div class="page-container">
                <div class="heading">
                    <span class="left-head">Upload History</span>
                    <span
                        class="right-head"
                        @click="refreshPage"
                    >
                        <inline-svg src="refresh"></inline-svg>
                        Refresh
                    </span>
                </div>
                <upload-filters @dates="setDates" @dateschanged="changedDates" />
                <div v-for="data in reportList" :key="data.id" class="report-list-container">
                    <list-cards
                        :data="data"
                    />
                </div>
                <nitrozen-pagination
                    v-model="paginationObj"
                    @change="onPaginationChange"
                    :pageSizeOptions="[5, 10, 20, 50]"
                />
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
    NitrozenError,
    NitrozenPagination
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
        NitrozenPagination,
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
            paginationObj: {
                total: 0,
                current: 1,
                limit: 10,
            },
            params: {
                start_date: moment().subtract(1, 'weeks').format('DD-MM-YYYY'),
                end_date: moment().format('DD-MM-YYYY')
            }
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
            /* let params = {
                "data": {
                    "start_date": this.startDate,
                    "end_date": this.endDate,
                    "page_size": 10,
                    "page": 1
                }
            }; */
            let newParams = this.params;
            let finalParams = {
                    "data": {
                    page_size: this.paginationObj.limit,
                    page: this.paginationObj.current,
                    ...newParams
                }
            };

            const reportList = FinanceService.getReportList(finalParams);
            reportList
                .then((res) => {
                    this.reportList = res.data.items;
                    this.paginationObj = {
                        ...res.data.page,
                        limit: res.data.page.size,
                        total: res.data.page.item_count
                    };

                    console.log(this.paginationObj);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(()=> {
                    this.inProcess = false
                })
        },
        onPaginationChange(event) {
            this.paginationObj = event
            this.getReportList();
        },
        refreshPage(){
            this.getReportList();
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

    .heading{
        width: 100%;
        display: flex;
        justify-content: space-between;
        .left-head{
            font-size: 18px;
            font-weight: 600;
            color: #41434C;
        }
        .right-head{
            display: flex;
            gap: 4px;
            color: #2E31BE;
        }
    }

    .report-list-container {
        width: 100%;
        margin-bottom: 1rem;
    }

}
</style>
