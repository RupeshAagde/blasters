<template>
    <div class="blaster-list-card-container card-list-wrapper" v-if="extension">
        <div class="card-content-section">
            <div >
                Reason: {{ extension.reason }}
            </div>
            <div class="card-content-line-2">
                Modified at : {{ toDateTimeString(extension.modified_at) }}
            </div>
                <div
                    class="card-content-line-3"
                    v-if="extension.status !== 'pending'"
                >
                    <span v-if="extension.status === 'approved'"
                        >Published</span
                    >
                    <span v-if="extension.status === 'cancelled'"
                        >Rejected</span
                    >
                    On: {{ toDateTimeString(extension.modified_at) }}
                </div>
        </div>
        <div class="rightside-card-section">
                <div>
                    <nitrozen-button theme="secondary" v-flatBtn @click="vieDetailsDialog()">View Details</nitrozen-button>
                </div>
        <!--Confirmation dailog -->
        <nitrozen-dialog ref="view-details-dialog" title="Plan Details">
            <template slot="body">
                <p>Are you sure you want to delete rate?</p>
            </template>
            <template slot="footer">
                <div class="footer-actions-buttons">
                    <nitrozen-button
                        theme="secondary"
                        @click="updateSubscription('cancelled')"
                        v-strokeBtn
                        >Cancelled
                    </nitrozen-button>
                    <nitrozen-button
                        theme="secondary"
                        class="mr-24"
                        @click="updateSubscription('approved')"
                        v-flatBtn
                        ref="delete-btn"
                        >Approved
                    </nitrozen-button>
                </div>
            </template>
        </nitrozen-dialog>
        <div class="card-badge-section">
            <nitrozen-badge
                v-if="extension.status === 'pending'"
                state="warn"
            >
                Pending
            </nitrozen-badge>
            <nitrozen-badge
                v-if="extension.status === 'cancelled'"
                state="error"
            >
             Cancelled
            </nitrozen-badge>
            <nitrozen-badge
                v-if="extension.status === 'approved'"
                state="success"
            >
             Approved
            </nitrozen-badge>
        </div>
        </div>
    </div>
</template>
<style lang="less" scoped>
.rightside-card-section{
    display: flex;
    align-items: center;
}
.blaster-list-card-container.card-list-wrapper{
    cursor: default;
}
</style>

<script>
import moment from 'moment';
import inlineSvg from '@/components/common/inline-svg.vue';
import {
    NitrozenBadge,
    NitrozenButton,
    NitrozenMenu,
    NitrozenMenuItem,
    NitrozenDialog
} from '@gofynd/nitrozen-vue';
import { GET_CURRENT_ACTIVE_SUBSCRIPTION } from '@/store/getters.type';
import { mapGetters } from 'vuex';
import get from 'lodash/get';

export default {
    name: 'seller-request-card',
    components: {
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-button': NitrozenButton,
        'nitrozen-menu': NitrozenMenu,
        'nitrozen-menu-item': NitrozenMenuItem,
        'inline-svg': inlineSvg,
        'nitrozen-dialog': NitrozenDialog
    },
    props: {
        extension: {
            type: Object
        }
    },
    computed:{
        ...mapGetters({
            currentActivePlan: GET_CURRENT_ACTIVE_SUBSCRIPTION
        }),

    },
    methods: {
        vieDetailsDialog(data) {
            this.$refs['view-details-dialog'].open({
                width: '400px',
                height: '215px',
                showCloseButton: true,
            });
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm a');
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
    }
};
</script>
