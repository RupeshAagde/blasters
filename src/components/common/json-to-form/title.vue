<template>
    <div>
        <slot class="title"></slot>
    </div>
</template>

<script>
export default {
    name: 'JsonToFormTitle'
};
</script>

<style lang="less" scoped>
.title {
    font-size: 16px;
    font-weight: 600;
}
</style>
