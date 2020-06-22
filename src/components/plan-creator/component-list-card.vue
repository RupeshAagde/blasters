<template>
  <div class="bombshell-list-card-container" @click="onClick">
    <div class="card-avatar">
      <text-avatar :text="component.name"></text-avatar>
    </div>
    <div class="card-content-section">
      <div class="card-content-line-1">
        {{ component.name }}
      </div>
      <div class="card-content-line-2">
        <span class="info-highlight">
          Group: {{ component.group.toUpperCase() }}
        </span>
      </div>
      <div class="card-content-line-3">
        {{ `Created on ${new Date(component.created_at).toDateString()}` }}
      </div>
    </div>
    <div class="card-badge-section">
      <nitrozen-badge v-if="component.is_visible" state="success"
        >Visible</nitrozen-badge
      >
      <nitrozen-badge v-else state="default">Not Visible</nitrozen-badge>
      <nitrozen-badge v-if="component.is_active" state="success"
        >Active</nitrozen-badge
      >
      <nitrozen-badge v-else state="default">Inactive</nitrozen-badge>
    </div>
  </div>
</template>

<style lang="less" scoped>
.bombshell-list-card-container {
  .info-highlight {
    font-size: 12px;
    color: #00c853;
  }
  .card-avatar {
    overflow: hidden;
  }
}
</style>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import { TextAvatar } from '../common/';

export default {
  name: 'component-list-card',
  components: {
    'nitrozen-badge': NitrozenBadge,
    'text-avatar': TextAvatar
  },
  props: {
    component: {
      type: Object
    },
    page_options: {
      type: Array
    }
  },
  methods: {
    onClick(event) {
      this.$emit('click', event);
    },
    toDateTimeString(date) {
      return moment(date).format('MMMM Do YYYY, h:mm:ss a');
    }
  }
};
</script>
