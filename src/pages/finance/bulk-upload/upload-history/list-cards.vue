<template>
    <div class="list-card-container" v-if="!isEmpty(reportData)">
        <!-- v-if="!isEmpty(invoiceData)" @click.stop="onCardClick" -->
        <div class="left-section">
            <div class="type-logo-container">
                <img :src="'/assets/admin/pngs/csv_icon.png'" class="type-logo" />
                <no-content
                    class="type-logo"
                    :icon="'/assets/admin/pngs/csv_icon.png'"
                    :helperText="''"
                />
            </div>
            <div class="invoice-info">
                <p class="title">{{ reportData.name }}</p>
                <p class="file-status-info">
                    <!-- {{ +reportData.total_count >= 0 ? `Total ${reportData.total_count}` : '' }} - 
                    {{ +reportData.successful_sh_count >= 0 ? `${reportData.successful_sh_count} success` : '' }} 
                    {{ +reportData.failed_sh_count >= 0 ? `, ${reportData.failed_sh_count} failed` : ''}}  -->
                    <span class="status-info" v-if="reportData.status === 'Complete'">
                        <adm-inline-svg :src="'check-circle'" /> {{ `success` }}
                    </span>
                    <span class="status-info" v-else-if="reportData.status === 'Fail'">
                        <inline-svg :src="'red-warning-icon'" /> {{ `fail` }}
                    </span>
                    <span class="status-info" v-else>
                        {{ reportData.reason }}
                    </span>
                </p>
                <p class="upload-info">
                    Uploaded by: {{ reportData.created_by }} • 
                    Uploaded on: {{ toDateTimeString(reportData.created_at) }}
                </p>
            </div>
        </div>
        <div class="right-section">
            <div class="badge-status">
                <nitrozen-badge :state="badgeState">
                    {{ reportData.status }}
                </nitrozen-badge>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import { 
    NitrozenBadge, NitrozenButton, NitrozenDialog, 
    NitrozenMenu, NitrozenMenuItem, NitrozenRadio,
    flatBtn
} from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import NoContent from '../../../../components/common/adm-no-content.vue';

/* Component imports */
import AdmInlineSVG from '@/components/common/adm-inline-svg';
import inlineSvgVue from '@/components/common/inline-svg.vue';

/* Services imports */

export default {
    name: 'list-card',
    components: {
        'adm-inline-svg': AdmInlineSVG,
        'inline-svg': inlineSvgVue,
        'no-content' : NoContent,
        NitrozenBadge,
        NitrozenButton,
        NitrozenDialog,
        NitrozenMenu,
        NitrozenMenuItem,
        NitrozenRadio
    },
    props: {
        data: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            reportData: {},
        }
    },
    directives: {
        flatBtn
    },
    mounted() {
        if(!isEmpty(this.data)) this.reportData = cloneDeep(this.data);
    },
    computed: {
        badgeState() {
            let invoiceStatus = this.reportData.status;
            if(invoiceStatus.toLowerCase() === 'complete') return 'success';
            if(invoiceStatus.toLowerCase() === 'in process') return 'info';
            if(invoiceStatus.toLowerCase() === 'fail') return 'error';
        },
        /*  Can be used in next release
        imgSrc() {
            if(this.reportData.file_name.slice(-4) === '.csv') return '/public/admin/assets/admin/pngs/csv_icon.png';
            if(this.reportData.file_name.slice(-4) === 'xlsx') return '/public/admin/assets/admin/pngs/xls_icon.png';
        } */
    },
    methods: {
        /**
         * A reference method to call lodash's isEmpty method
         */
        isEmpty,
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm a');
        },
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';


.list-card-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border: 1px solid #F3F3F3;
    border-radius: 8px;
    background: @White;
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
    cursor: pointer;
}

.left-section,
.right-section {
    display: flex;
    align-items: center;
    column-gap: 8px;
}

.left-section {
    flex-grow: 1;
}

.badge-status {
    ::v-deep .nitrozen-badge {
        padding: 2px 8px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.type-logo-container {
    background: #F5F8FF;
    border-radius: 50%;
    height: 60px;
    width: 60px;
    position: relative;

    .type-logo {
        height: 100%;
    }
}

.invoice-info {
    display: flex;
    flex-direction: column;
    row-gap: 8px;
}

.title {
    color: @Black;
    font-weight: 500;
    text-transform: uppercase;
}

.file-status-info {
    font-weight: 500;
    color: #4D4D4E;
    .status-info{
        display: flex;
        gap: 7px;
    }
}

.upload-info {
    color: #828282;
    font-weight: 400;
}
</style>
