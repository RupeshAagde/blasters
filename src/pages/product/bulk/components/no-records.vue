<template>
    <div class="img-container">
        <img :src="getImageURL" class="no-records" />
    </div>
</template>

<script>
export default {
    name: 'no-records',

    computed: {
        getImageURL() {
            return `/public/assets/admin/pngs/${this.image}.png`;
        }
    },

    props: {
        image: String,
        default: 'empty'
    },

    data() {
        return {};
    }
};
</script>

<style lang="less" scoped>
.img-container {
    text-align: center;

    img {
        margin-top: 30px;
    }
}
</style>
