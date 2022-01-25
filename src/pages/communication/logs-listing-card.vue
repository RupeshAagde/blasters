<template>
    <div class="blaster-list-card-container" @click.stop="onOpen">
        <div class="card-content-section">
            <div class="card-content-line-1">
                {{ contact.display }}
                <adm-inline-svg
                    v-if="contact.display"
                    class="copy-icon"
                    :src="'copy'"
                    title="Click to copy"
                    @click.stop.native="
                        copyContactClipboard(contact.searchable)
                    "
                ></adm-inline-svg>
            </div>
            <div v-if="log.email" class="card-content-line-2">
                Email | {{ log.step }} | {{ log.email.template }}
            </div>
            <div v-if="log.sms" class="card-content-line-2">
                SMS | {{ log.step }} | {{ log.sms.template }}
            </div>
            <div class="card-content-line-3">
                {{ log.created_at | dateFormatter }}
            </div>
        </div>
        <div class="card-badge-section">
            <nitrozen-badge state="success" v-if="log.status == 'success'"
                >Success</nitrozen-badge
            >
            <nitrozen-badge state="warn" v-if="log.status == 'error'"
                >Error</nitrozen-badge
            >
        </div>
    </div>
</template>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import admTextAvatar from '@/components/common/text-avatar.vue';
import dateFormat from 'dateformat';
import { copyToClipboard } from '@/helper/utils.js';
import admInlineSvg from '@/components/common/adm-inline-svg.vue';

export default {
    name: 'log-listing-card',
    props: ['log'],
    components: {
        'nitrozen-badge': NitrozenBadge,
        'adm-text-avatar': admTextAvatar,
        'adm-inline-svg': admInlineSvg
    },
    data() {
        return {
            contact: {
                display: '',
                searchable: ''
            }
        };
    },
    filters: {
        dateFormatter: function(value) {
            if (!value) return '';
            return dateFormat(value, 'dddd, mmmm dS, yyyy, h:MM TT');
        }
    },
    mounted() {
        let log = this.log;
        this.contact.display =
            log.email && log.email.to
                ? log.email.to
                : log.sms && log.sms.phone_number
                ? log.sms.country_code + ' ' + log.sms.phone_number
                : '';
        this.contact.searchable =
            log.email && log.email.to
                ? log.email.to
                : log.sms && log.sms.phone_number
                ? log.sms.phone_number
                : '';
    },
    methods: {
        copyContactClipboard(text) {
            copyToClipboard(text);
            this.$snackbar.global.showInfo('Copied to clipboard', 1000);
        },
        onOpen() {
            this.$emit('openLog', this.log);
        }
    }
};
</script>

<style lang="less" scoped>
.blaster-list-card-container {
    align-items: center;
    min-height: 120px;
    line-height: 16px;
    box-sizing: border-box;
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
}
</style>
