<template>
    <div class="bombshell-list-card-container" @click="onClick">
        <div class="card-content-section">
            <div class="card-content-line-1">
                {{ sub_rule.data.name || 'Default Rule' }}
            </div>
            <div class="card-content-line-2">
                <span class="info-highlight"
                    >Start Date-End Date: {{ dateRange }}</span
                >
            </div>
            <div class="card-content-line-3">
                {{
                    `Created on ${new Date(sub_rule.created_at).toDateString()}`
                }}
            </div>
        </div>
        <div class="card-badge-section">
            <nitrozen-badge v-if="sub_rule.auto_verify" state="success"
                >Verified</nitrozen-badge
            >
            <nitrozen-badge v-else state="warn">Unverified</nitrozen-badge>
            <nitrozen-badge v-if="sub_rule.is_active" state="success"
                >Active</nitrozen-badge
            >
            <nitrozen-badge v-else state="default">Inactive</nitrozen-badge>
        </div>
    </div>
</template>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';

export default {
    name: 'subscription-match',
    props: {
        sub_rule: {
            type: Object
        }
    },
    components: {
        'nitrozen-badge': NitrozenBadge
    },
    computed: {
        dateRange() {
            return this.sub_rule.data.rule_start_date
                ? `${this.sub_rule.data.rule_start_date} - ${this.sub_rule.data.rule_end_date}`
                : 'NA';
        }
    },
    methods: {
        onClick(event) {
            this.$emit('click', event);
        }
    }
};
</script>

<style></style>
