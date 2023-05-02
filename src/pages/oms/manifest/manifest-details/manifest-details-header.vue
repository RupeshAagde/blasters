<template>
    <adm-page-header
        class="titlize details-header"
        :showBackButton="true"
        @backClick="onAppBack"
        :title="manifestId"
        :noContextMenu="true"
    >
        <div class="header-bar">
            <div class="manifest-status-icon">
                <span v-if="hasAttachment">
                    <ukt-inline-svg src="attachment"/>
                </span>
                <span>
                    <nitrozen-badge :class="manifestStatus !== 'complete' ? 'active-badge' : 'closed-badge'">
                        {{ manifestStatus !== 'complete' ? 'Active' : 'Closed' }}
                    </nitrozen-badge>
                </span>
            </div>

            <!-- <div v-if="manifestStatus !== 'complete'" class="action-btns">
                <nitrozen-button
                    :theme="'secondary'"
                    :disabled="!showSaveProcessButtons"
                    v-strokeBtn
                    class="header-btn"
                    @click="saveProcessManifest('save')">
                    Save
                </nitrozen-button>
                <nitrozen-button
                    :disabled="selectedShipmentCount == 0"
                    :theme="'secondary'"
                    v-flatBtn
                    class="header-btn"
                    @click="saveProcessManifest('process')">
                    Process
                </nitrozen-button>
            </div> -->
        </div>
    </adm-page-header>
</template>

<script>
/* Package imports */
import {
    NitrozenBadge, NitrozenButton, flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

/* Component imports */
import AdmPageHeader from '@/components/common/layout/adm-page-header.vue';
import UktInlineSvg from '@/components/common/ukt-inline-svg.vue';

export default {
    name: 'manifest-details-header',
    components: {
        AdmPageHeader,
        UktInlineSvg,
        NitrozenBadge,
        NitrozenButton
    },
    props: {
        hasAttachment: {
            type: Boolean,
            default: false
        },
        manifestId: String,
        showSaveProcessButtons:{
            type: Boolean,
            default: false
        },
        manifestStatus:{
            type: String,
        },
        selectedShipmentCount:{
            type: Number
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    methods: {
        downloadDoc() {
            this.$emit('download');
        },
        onAppBack() {
            this.$emit('back');
        },
        saveProcessManifest(action) {
            this.$emit('saveProcess',action);
        },

    }
}
</script>

<style lang="less" scoped>
@import '../../../less/page-header.less';
@import '../../../less/page-ui.less';

::v-deep .page-header {
    padding: 6px 0;
}

.header-bar {
    display: flex;
    justify-content: space-between;

    .manifest-status-icon {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 5rem;
    }
}

.more-filters {
    position: absolute;
    right: 48px;
    // top: 230px;
    border: 1px solid @Iron;
    border-radius: 4px;
    padding: 12px;
    background: @White;
    box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
    z-index: 1;

    .more-filter-item {
        margin-bottom: 10px;
    }
}

.action-btns {
    display: flex;
    column-gap: 12px;
}

.header-btn {
    border-radius: 4px;
}

.active-badge {
    color: #219653;
    border-color: #219653;
}

.closed-badge {
    color: #EB5757;
    border-color: #EB5757;
}
</style>