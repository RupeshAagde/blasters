<template>
    <div class="loader">
        <!-- <adm-inline-svg :src="'Spinner-1s-100px'"></adm-inline-svg> -->
        <img src="/public/assets/loader.gif" />
    </div>
</template>
<script>
export default {
    name: 'loader'
};
</script>

<style lang="less" scoped>
.loader {
    img {
        height: 100px;
    }
}
</style>
