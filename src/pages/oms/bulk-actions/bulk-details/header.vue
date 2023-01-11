<template>
    <div class="header-container">
        <div class="item">
            <div class="label">Uploaded on</div>
            <div class="value">{{ uploadedDate }}</div>
        </div>
        <div class="item">
            <div class="label">Uploaded By</div> 
            <div class="value">{{ uploadedBy }}</div>
        </div>
        <div class="item" v-if="!isEmpty(details)">
            <div class="label">Status</div>
            <div class="status" v-if="details.status">
                <nitrozen-badge :state="badgeState">
                    {{ details.status }}
                </nitrozen-badge>
            </div>
        </div>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

/* Helper imports */
import { convertToOMSDate } from '@/helper/utils.js';

export default {
    name: 'bulk-details-header',
    components: {
        NitrozenBadge
    },
    props: {
        bulkData: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            details: cloneDeep(this.bulkData)
        }
    },
    computed: {
        uploadedDate() {
            if(!isEmpty(this.details) && this.details.uploaded_on) {
                return convertToOMSDate(this.details.uploaded_on);
            } else return '';
        },
        uploadedBy() {
            if(!isEmpty(this.details) && this.details.uploaded_by) {
                return `${this.details.uploaded_by}`;
            } else return '';
        },
        badgeState() {
            if(!isEmpty(this.details) && this.details.status) {
                let status = this.details.status;
                if(status === 'COMPLETED') return 'success';
                if(status === 'PARTIALLY COMPLETED') return 'warn';
                if(status === 'FAILED') return 'error';
            }
        }
    },
    methods: {
        isEmpty(obj) {
            return isEmpty(obj);
        }
    }
}
</script>

<style lang="less" scoped>
@import '../../../../less/common.less';
@import '../../../../less/theme.less';

.header-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    column-gap: 20px;
    row-gap: 1rem;
    margin-top: 24px;
}

.item {
    display: flex;
    flex-direction: column;
}

.label {
    color: rgb(65, 67, 76, 0.7) !important;
    font-weight: 400;
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 4px;
}

.value {
    color: #4D4D4E;
    font-weight: 600;
    font-size: 12px;
}

 ::v-deep .nitrozen-badge {
    padding: 2px 8px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.status {
    width: fit-content;
}
</style>
