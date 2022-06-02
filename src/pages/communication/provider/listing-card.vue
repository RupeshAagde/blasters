<template>
    <div class="mirage-list-card-container" @click="onEdit">
        <div class="card-avatar">
            <adm-text-avatar :text="provider.name"></adm-text-avatar>
        </div>
        <div class="card-content-section">
            <div class="card-content-line-1">{{ provider.name }}</div>
            <div class="card-content-line-2">
                {{ provider.description }}
            </div>
            <div class="card-content-line-3">
                Created on
                {{ new Date(provider.created_at).toDateString() }}
            </div>
        </div>
        <div class="card-badge-section">
            <nitrozen-badge
                v-if="provider.provider"
                class="low-color tags-badge"
                >{{ provider.provider }}</nitrozen-badge
            >
        </div>
    </div>
</template>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import admTextAvatar from '@/components/common/text-avatar.vue';

export default {
    props: ['provider'],
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
            this.$emit('editProvider', this.provider);
        }
    }
};
</script>

<style lang="less" scoped>
.completed {
    color: #00c853;
    border-color: #00c853;
}
.active-color {
    color: #f8c149;
    border-color: #f8c149;
}
.tags-badge {
    margin-right: 6px;
    margin-bottom: 6px;
}
</style>
