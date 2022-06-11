<template>
    <div class="mirage-list-card-container" @click="onEdit">
        <div class="card-avatar">
            <adm-text-avatar :text="emailTemplate.name"></adm-text-avatar>
        </div>
        <div class="card-content-section">
            <div class="card-content-line-1">{{ emailTemplate.name }}</div>
            <div class="card-content-line-2">
                {{ emailTemplate.description }}
            </div>
            <div class="card-content-line-3">
                Created on
                {{ new Date(emailTemplate.created_at).toDateString() }}
            </div>
        </div>
        <div class="card-badge-section">
            <nitrozen-badge
                v-for="(item, index) in emailTemplate.tags"
                :key="index"
                class="tags-badge"
                >{{ item }}</nitrozen-badge
            >
            <nitrozen-badge
                v-if="emailTemplate.priority == 'low'"
                class="low-color tags-badge"
                >Low</nitrozen-badge
            >
            <nitrozen-badge
                v-if="emailTemplate.priority == 'high'"
                class="high-color tags-badge"
                >High</nitrozen-badge
            >
        </div>
    </div>
</template>

<script>
import omitForClone from './services/omit-for-clone';
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import admTextAvatar from '@/components/common/text-avatar.vue';
export default {
    props: ['emailTemplate'],
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
            this.$emit('editEmailTemplate', this.emailTemplate);
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
