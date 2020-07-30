<template>
    <div class="rating">
        <div
            class="top-layer"
            v-bind:style="{ width: rating * starWidth + '%' }"
        >
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
        </div>
        <div class="bottom-layer">
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
            <span>★</span>
        </div>
    </div>
</template>
<style lang="less" scoped>
.rating {
    unicode-bidi: bidi-override;
    color: #c5c5c5;
    font-size: 20px;
    height: 20px;
    width: 110px;
    position: relative;
    padding: 0;
    text-shadow: 0px 1px 0 #a2a2a2;
    white-space: nowrap;
    .top-layer {
        color: #e7711b;
        padding: 0;
        position: absolute;

        display: block;
        top: 0;
        left: 0;
        overflow: hidden;
        height: inherit;
    }
    .bottom-layer {
        padding: 0;
        display: block;
        z-index: 0;
    }
}
</style>
<script>
export default {
    name: 'uktRating',
    props: {
        rating: {
            type: Number,
            required: true
        },
        starWidth: {
            type: Number,
            default: 20
        }
    }
};
</script>
