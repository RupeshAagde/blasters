<template>
    <div class="packaging-card-container">
        <div class="packaging-card-info">
            <div class="packaging-card-info-image">
                <img :src="item.image" :alt="item.name" />
            </div>
            <div class="packaging-card-info-text">
                <div class="packaging-card-info-name">
                    {{ item.name }}
                </div>
                <div class="packaging-card-info-other">
                    Dimension and pack
                </div>
            </div>
        </div>
        <div class="packaging-card-extra">
            <span>POLYB_M_1411P5</span>
            <span>FY625FEC16</span>
            <span>Clothing, Packaging Polybag</span>
        </div>
        <div class="packaging-card-button-container">
            <div class="packaging-card-button">
                <inline-svg :src="'edit'" class="action-icon" />
            </div>
            <div class="packaging-card-button">
                <inline-svg :src="'delete'" class="action-icon" />
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
