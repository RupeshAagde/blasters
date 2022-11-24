<template>
    <div class="img-container">
        <img src="/public/assets/admin/pngs/empty.png" class="no-records" />
    </div>
</template>

<script>
export default {
    name: 'no-records',

    data() {
        return {};
    }
};
</script>

<style lang="less" scoped>
.img-container {
    text-align: center;

    img {
        margin-top: 10px;
    }
}
</style>
