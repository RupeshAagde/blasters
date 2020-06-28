<template>
    <div class="card-body" @click="$emit('click')">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'base-card'
};
</script>

<style lang="less" scoped>
.card-body {
    border: 1px solid @Iron;
    border-radius: 3px;
    height: 100px;
    display: flex;
    cursor: pointer;
    margin: 24px 24px 0 0;
    &:hover {
        box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.1);
    }
}
</style>
