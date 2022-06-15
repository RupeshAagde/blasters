<template>
    <div class="packaging-card-container">
        <div class="packaging-card-info">
            <div class="packaging-card-info-image">
                <img :src="item.product.media[0]" :alt="item.product.name" />
            </div>
            <div class="packaging-card-info-text">
                <div class="packaging-card-info-name">
                    {{ item.product.name }}
                </div>
                <div class="packaging-card-info-other">
                    Dimension and pack
                </div>
            </div>
        </div>
        <div class="packaging-card-extra">
            <span>{{item.product.item_code}}</span>
        </div>
        <div class="packaging-card-button-container">
            <div class="packaging-card-button">
                <inline-svg :src="'edit'" class="action-icon" />
            </div>
        </div>
    </div>
</template>

<script>
import InlineSvg from '../../common/inline-svg.vue';
export default {
    name: 'packaging-card',
    components: {
        InlineSvg
    },
    props: {
        item: {
            type: Object
        }
    }
};
</script>

<style lang="less">
@import '@/less/packaging/packaging-card.less';
</style>
