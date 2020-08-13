<template>
    <div class="settings-body" @click="$emit('click')">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Card'
};
</script>

<style lang="less" scoped>
.settings-body {
    border: 1px solid @Iron;
    border-radius: 3px;
    display: flex;
    cursor: pointer;
    margin: 24px 24px 0 0;
    height: 100px;
    transition: box-shadow 0.3s;
    &:hover {
        box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.1);
    }
}
</style>
