<template>
    <div
        class="mirage-list-card-container coupon-card-container"
        @click="onClick"
    >
        <div class="card-avatar banner-image">
            <img :src="'/public/admin/assets/pngs/default_icon_listing.png'" />
        </div>
        <div class="card-content-section left-container">
            <div class="card-content-line-1">
                {{ coupon.display_meta.title }}
            </div>
            <div class="darker-xs card-content-line-2 coupon-code">
                {{ coupon.code.toUpperCase() }}
                <span @click="onCopyCode">
                    <inline-svg
                        title="Click to copy"
                        :src="'copy'"
                        class="copy-code"
                    ></inline-svg>
                </span>
            </div>
            <div class="card-content-line-3">
                {{
                    `Created on ${new Date(
                        coupon.date_meta.created_on
                    ).toDateString()}`
                }}
                <span v-if="showNextSchedule()">
                    |
                    <span class="show-next-schedule">
                        {{ showNextSchedule() }}
                    </span>
                </span>
            </div>
        </div>
        <div class="card-badge-section right-container">
            <div class="states">
                <nitrozen-badge v-if="live" state="success"
                    >Live</nitrozen-badge
                >
                <nitrozen-badge v-else>Not Live</nitrozen-badge>
                <nitrozen-badge v-if="!coupon.state.is_archived" state="success"
                    >Active</nitrozen-badge
                >
                <nitrozen-badge v-else>Inactive</nitrozen-badge>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.coupon-card-container {
    .banner-image {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        @media @mobile {
            width: 15%;
            height: 75%;
        }
        img {
            width: auto;
            height: 100%;
        }
    }
    .left-container {
        .coupon-code {
            display: flex;
            position: relative;
            align-items: center;
            .copy-code {
                width: 14px;
                padding-left: 5px;
                /deep/ svg {
                    pointer-events: none;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .show-next-schedule {
            color: #00c853;
        }
    }
    .right-container {
        flex: 0.5;
        position: relative;
        @media @mobile {
            flex: none;
        }
        ::v-deep .nitrozen-badge {
            pointer-events: none;
        }
    }
}
</style>

<script>
import moment from 'moment';
import InlineSvg from '@/components/administrator/common/ukt-inline-svg.vue';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import { copyToClipboard } from '@/helper/utils';
import { isLive, nextSchedule } from '@/helper/util.js';

export default {
    name: 'coupon-list-card',
    components: {
        'nitrozen-badge': NitrozenBadge,
        'inline-svg': InlineSvg,
    },
    props: {
        coupon: {
            type: Object
        }
    },
    computed: {
        live() {
            return (
                isLive(this.coupon._schedule) && !this.coupon.state.is_archived
            );
        }
    },
    methods: {
        onClick(event) {
            this.$emit('click', event);
        },
        onCopyCode(event) {
            copyToClipboard(this.coupon.code.toUpperCase());
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
            event.stopPropagation();
            event.preventDefault();
        },
        showNextSchedule() {
            let scheduleText = '';
            if (this.coupon.state.is_archived) return ''; // 'Deactivated';
            const live = isLive(this.coupon._schedule);
            const showLiveNowText = () => {};
            if (live) {
                scheduleText = ''; //'Live Now';
            }
            const ns = nextSchedule(this.coupon._schedule);
            if (live && ns.end) {
                scheduleText = `Live till ${this.toDateTimeString(ns.end)}`;
            } else if (!live)
                scheduleText =
                    ns != null
                        ? `Next Schedule: ${this.toDateTimeString(ns.start)}`
                        : 'Not Scheduled';
            return scheduleText;
        },
        toDateTimeString(date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }
    }
};
</script>
