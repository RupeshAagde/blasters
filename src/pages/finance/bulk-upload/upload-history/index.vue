<template>
    <div>
        <page-header
            title="Upload History"
            @backClick="$router.push({ name: 'bulk-upload' })"
        >
        </page-header>
        <div class="main-container">
            <div class="page-container">
                <upload-filters/>
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
        };
    },
    computed:{
        ...mapGetters({
            userData: GET_USER_INFO,
        }),
    },
    mounted() {
        this.getReportList();
        this.reportList = REPORT_LIST.items;
        //console.log(this.responseData);
    },
    methods: {
        getReportList(){
            let params = {
                "data": {
                    "start_date": "25-11-2022",
                    "end_date": "25-11-2022",
                    "page_size": 10,
                    "page": 1
                }
            };
            const reportList = FinanceService.getReportList(params);
            reportList
                .then((res) => {
                    this.reportList = REPORT_LIST.items;
                    //console.log()
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
        // width: 50%;
        // flex: 1;
        // &:nth-child(odd) {
        //     margin-left: 24px;
        // }
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
