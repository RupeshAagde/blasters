<template>
    <div class="packaging-card-container">
        <div class="packaging-card-info">
            <div class="packaging-card-info-image">
                <img
                    :src="getImagePath(item.product)"
                    :alt="item.product.name"
                />
            </div>
            <div class="packaging-card-info-text">
                <div class="packaging-card-info-name">
                    {{ item.product.name }}
                </div>
                <div class="packaging-card-info-other">
                    <div>{{ getDimensions(item.dimensions) }}</div>
                    <div class="line">{{ getPackInfo(item.product) }}</div>
                </div>
            </div>
        </div>
        <div class="packaging-card-button-container">
            <div class="packaging-card-extra">
                <span>{{ item.product.item_code }}</span>
            </div>
            <div class="packaging-card-button" @click="editClick(item)">
                <inline-svg :src="'edit'" class="action-icon" />
            </div>
        </div>
    </div>
</template>

<script>
import { EDIT_PRODUCT } from '../../../store/action.type';
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
    },
    methods: {
        getImagePath(product) {
            if (product.media) {
                return product.media[0].url;
            }
            return '';
        },
        /**
         * @author Rohan Shah
         * @returns String
         * @description Create a string with dimension data
         */
        getDimensions(dimensions) {
            let dimensionData = '';
            // loop through the object keys
            Object.keys(dimensions).map((key, index) => {
                // only if the key is not the last key do not add 'x'
                dimensionData += `${dimensions[key]}${
                    index != Object.keys(dimensions).length - 1 ? 'x' : ''
                }`;
            });
            // append 'inch' to the return value
            return dimensionData + ' inch';
        },
        /**
         * @author Rohan Shah
         * @param {*} product
         * @description if the product name has pack info then show else 'NA'
         */
        getPackInfo(product) {
            let pack = product.name.split('-')[1];
            return pack ? pack.trim() : 'NA';
        },
        /**
         *
         * @param {*} item  Item info
         * @author Rohan Shah
         * @description Save product in store and redirect to create / update screen
         */
        editClick(item) {
            this.$store.dispatch(EDIT_PRODUCT, item).then(() => {
                this.$router.push('/administrator/packaging/create');
            });
        }
    }
};
</script>

<style lang="less">
@import '@/less/packaging/packaging-card.less';
</style>
