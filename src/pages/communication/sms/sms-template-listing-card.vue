<template>
    <div class="mirage-list-card-container" @click="onEdit">
        <div class="card-avatar">
            <adm-text-avatar :text="smsTemplate.name"></adm-text-avatar>
        </div>
        <div class="card-content-section">
            <div class="card-content-line-1">{{ smsTemplate.name }}</div>
            <div class="card-content-line-2">
                {{ smsTemplate.description }}
            </div>
            <div class="card-content-line-3">
                Created on {{ new Date(smsTemplate.created_at).toDateString() }}
            </div>
        </div>
        <div class="card-badge-section">
            <nitrozen-badge
                v-for="(item, index) in smsTemplate.tags"
                :key="index"
                class="tags-badge"
                >{{ item }}</nitrozen-badge
            >
            <nitrozen-badge
                v-if="smsTemplate.priority == 'low'"
                class="low-color tags-badge"
                >Low</nitrozen-badge
            >
            <nitrozen-badge
                v-if="smsTemplate.priority == 'high'"
                class="high-color tags-badge"
                >High</nitrozen-badge
            >
        </div>
    </div>
</template>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import admTextAvatar from '@/components/common/text-avatar.vue';
export default {
    props: ['smsTemplate'],
    components: {
        'nitrozen-badge': NitrozenBadge,
        'adm-text-avatar': admTextAvatar
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        onEdit() {
            this.$emit('editSmsTemplate', this.smsTemplate);
        }
    }
};
</script>

<style lang="less" scoped>
.low-color {
    color: #00c853;
    border-color: #00c853;
}
.high-color {
    color: #f8c149;
    border-color: #f8c149;
}
.tags-badge {
    margin-right: 6px;
    margin-bottom: 6px;
}
</style>
