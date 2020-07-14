<template>
  <div class="bombshell-list-card-container" @click="onClick">
    <div class="card-avatar">
      <text-avatar :text="plan.name"></text-avatar>
    </div>
    <div class="card-content-section">
      <div class="card-content-line-1">
        {{ plan.name }}
      </div>
      <div class="card-content-line-2">
        <span class="info-highlight"> Amount: {{ plan.amount }} </span>
      </div>
      <div class="card-content-line-3">
        {{ `Created on ${new Date(plan.created_at).toDateString()}` }}
      </div>
    </div>
    <div class="card-badge-section">
      <nitrozen-badge v-if="plan.is_visible" state="success"
        >Visible</nitrozen-badge
      >
      <nitrozen-badge v-else state="default">Not Visible</nitrozen-badge>
      <nitrozen-badge v-if="plan.is_active" state="success"
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
  name: 'plan-list-card',
  components: {
    'nitrozen-badge': NitrozenBadge,
    'text-avatar': TextAvatar
  },
  props: {
    plan: {
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
