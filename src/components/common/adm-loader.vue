<template>
    <div class="loader">
        <!-- <adm-inline-svg :src="'Spinner-1s-100px'"></adm-inline-svg> -->
        <img src="/public/assets/adm-loader.gif" />
    </div>
</template>
<script>
import adminlinesvg from './adm-inline-svg';

export default {
    name: 'adm-loader',
    components: {
        'adm-inline-svg': adminlinesvg
    }
};
</script>

<style lang="less" scoped>
.loader {
    img {
        height: 100px;
    }
}
</style>
