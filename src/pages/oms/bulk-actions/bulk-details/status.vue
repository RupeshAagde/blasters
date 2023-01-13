<template>
    <div class="details-status-container">
        <div class="header">
            <div class="title">Status</div>
            <div class="download-link-container" @click="downloadSourceFile">
                <img src="/public/admin/assets/admin/pngs/download_alt.png" />
                <span class="download-link-text">Source File</span>
            </div>
        </div>
        <div class="status-container" v-if="!isEmpty(details)">
            <div class="status-box">
                <div class="label">Total</div>
                <div class="value">{{ details.total_shipments_count }}</div>
            </div>
            <div class="status-box">
                <div class="label">Success</div>
                <div class="value">{{ details.successful_shipments_count }}</div>
            </div>
            <div class="status-box">
                <div class="label">Failed</div>
                <div class="value">{{ details.failed_shipments_count }}</div>
            </div>
        </div>
    </div>
</template>

<script>
/* Package import */
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import InlineSvg from '@/components/common/inline-svg.vue';

export default {
    name: 'bulk-details-status',
    components: {
        InlineSvg
    },
    props: {
        bulkData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            details: cloneDeep(this.bulkData.data[0])
        }
    },
    methods: {
        downloadSourceFile() {
            this.$snackbar.global.showInfo('Your download will begin shortly');
            const url = this.bulkData.excel_url;
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('click', '_blank');
            document.body.appendChild(link);
            link.click();
            this.$snackbar.global.showSuccess('Your file has been successfully downloaded', 3000);
        },
        isEmpty(obj) {
            return isEmpty(obj);
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.details-status-container {
    margin-bottom: 33px;
}

.header {
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
}

.title {
    font-weight: 600;
    font-size: 14px;
    color: #4D4D4E;
}

.status-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 1rem;
}

.status-box {
    background: #FFFFFF;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    padding: 12px 16px;

    .label {
        color: rgb(65, 67, 76, 0.6) !important;
        font-weight: 400;
        font-size: 12px;
        margin-bottom: 8px;
    }

    .value {
        color: #4D4D4E;
        font-weight: 600;
        font-size: 14px;
    }
}

.download-link-container {
    font-size: 12px;
    color: @RoyalBlue;
    cursor: pointer;
}
</style>
