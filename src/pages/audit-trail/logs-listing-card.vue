<template>
    <div class="blaster-list-card-container" @click="onOpen">
        <div class="card-content-section">
            <div class="card-content-line-1">
                <div
                    :class="{ truncate: truncateTitle }"
                    v-if="safeGet(log, 'entity')"
                >
                    {{ capitalCase(log.entity.type) }}
                    {{ log.entity.action | capitalize }}
                </div>
            </div>
            <div v-if="safeGet(log, 'entity.id')" class="card-content-line-2">
                EntityId: {{ log.entity.id }}
            </div>
            <div class="flex card-content-line-2">
                <div>
                    {{ safeGet(log, 'modifier.user_details.first_name') }}
                </div>
                <div v-if="safeGet(log, 'modifier.as_administrator')">
                    &nbsp;(as administrator)
                </div>
                <div v-if="safeGet(log, 'modifier.user_details.email')">
                    &nbsp;| {{ safeGet(log, 'modifier.user_details.email') }}
                </div>
                <!-- <div v-if="safeGet(application, 'domain.name')">
                    &nbsp;| {{ safeGet(application, 'domain.name') }}
                </div> -->
            </div>
            <div v-if="safeGet(log, 'date')" class="card-content-line-2">
                {{ log.date | dateFormatter }}
            </div>
        </div>
        <div>
            <div v-if="safeGet(log, 'entity')">
                <nitrozen-badge>{{
                    capitalCase(log.entity.type)
                }}</nitrozen-badge>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import admTextAvatar from '@/components/common/text-avatar.vue';
import dateFormat from 'dateformat';
import { mapGetters } from 'vuex';
import { copyToClipboard } from '@/helper/utils.js';
import inlineSvg from '@/components/common/adm-inline-svg';
import capitalize from 'lodash/capitalize';
import words from 'lodash/words';
import get from 'lodash/get';
export default {
    name: 'log-listing-card',
    props: ['log', 'truncateTitle'],
    computed: {
        // application() {
        //     if (!this.companyApplications) {
        //         return;
        //     }
        //     if (this.companyApplications.length == 0) {
        //         return;
        //     }
        //     if (this.log.application) {
        //         return this.companyApplications.find((app) => {
        //             return app._id == this.log.application;
        //         });
        //     }
        //}
    },
    components: {
        'nitrozen-badge': NitrozenBadge,
        'adm-text-avatar': admTextAvatar,
        'adm-inline-svg': inlineSvg,
    },
    data() {
        return {
            contact: {
                display: '',
                searchable: '',
            },
        };
    },
    filters: {
        dateFormatter: function (value) {
            if (!value) return '';
            return dateFormat(value, 'dddd, mmmm dS, yyyy, h:MM TT');
        },
        capitalize: function (value) {
            if (!value) return '';
            value = value.toString();
            return value.charAt(0).toUpperCase() + value.slice(1);
        },
    },
    mounted() {
        let log = this.log;
    },
    methods: {
        capitalCase(string) {
            return capitalize(words(string).join(' '));
        },
        safeGet(obj, path, defaultValue) {
            return get(obj, path, defaultValue);
        },
        copyContactClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        onOpen() {
            this.$emit('openLog', this.log);
        },
    },
};
</script>

<style lang="less" scoped>
.flex {
    display: flex;
}
.mirage-list-card-container {
    align-items: center;
    min-height: 120px;
    line-height: 16px;
    box-sizing: border-box;
    height: unset;
    max-height: unset;
    .copy-icon {
        display: inline;
        vertical-align: middle;
        position: relative;
        top: 2px;
        /deep/svg {
            cursor: pointer;
            width: 16px;
            height: 16px;
            margin-left: 8px;
        }
    }
    .email-badge {
        color: #00c853;
        border-color: #00c853;
    }
    .sms-badge {
        color: #f8c149;
        border-color: #f8c149;
    }
    .high-color {
        color: #f8c149;
        border-color: #f8c149;
    }
    .group {
        font-size: 12px;
        text-align: left;
    }
    .group:nth-child(1) {
        width: 100%;
    }
    .tags-badge {
        margin-right: 6px;
        margin-bottom: 6px;
    }
    .group-last {
        width: 225px;
        margin-right: 24px;
        text-align: right;
    }
    .truncate {
        width: 350px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>
