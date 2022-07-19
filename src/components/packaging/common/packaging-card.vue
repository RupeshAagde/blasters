<template>
    <div class="packaging-card-container">
        <div class="packaging-card-info">
            <div class="packaging-card-info-image">
                <img
                    id="image-path"
                    :src="getImagePath(item.product)"
                    :alt="item.product.name"
                />
            </div>
            <div class="packaging-card-info-text">
                <div class="packaging-card-info-name" id="product-name">
                    {{ item.product.name }}
                </div>
                <div class="packaging-card-info-other">
                    <div id="product-dimension">
                        <inline-svg :src="'scale'" />{{
                            getDimensions(item.dimensions)
                        }}
                    </div>
                    <div class="line" id="pack-info">
                        <inline-svg :src="'pack-info'" />{{
                            getPackInfo(item.product)
                        }}
                    </div>
                </div>
            </div>
        </div>
        <div class="packaging-card-extra">
            <!-- Item code / packaging type -->
            <div class="extra-row">
                <span class="item-header">Package Type</span>
                <span id="item-code" class="item-value">{{
                    item.product.item_code
                }}</span>
            </div>
            <!-- default group categories name if exists -->
            <div class="extra-row" v-if="groupCategories.length > 0">
                <span class="item-header">Default category</span>
                <span
                    id="item-l3-value"
                    class="item-value item-ellipsis"
                    :title="getL3Names(item.l3_mapping)"
                    >{{ getL3Names(item.l3_mapping) }}</span
                >
            </div>
        </div>
        <div class="packaging-card-button-container">
            <div class="packaging-card-button" @click="editClick(item)">
                <inline-svg :src="'edit_new'" class="action-icon" />
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
        },
        groupCategories: {
            type: Array
        }
    },
    methods: {
        /**
         *
         * @param {*} l3List List of l3 mapping of the packaging product
         * @author Rohan Shah
         * @description Finds the name of the default category from the list
         * and then returns the combined names
         */
        getL3Names(l3List) {
            let nameList = [];
            l3List.forEach((group) => {
                // run only for default packaging material
                if (group.is_default_packaging_material) {
                    // find the category name
                    let categoryName = this.groupCategories
                        .map((groupCategory) => {
                            if (groupCategory._id == group.group_category)
                                return groupCategory.name;
                        })
                        .filter((a) => a !== undefined)[0];
                    // push to the name list
                    nameList.push(categoryName);
                }
            });
            // only if the nameList has value then join and return else return '-'
            return nameList.length ? nameList.join() : '-';
        },
        getImagePath(product) {
            if (product.media) {
                return product.media[0].url;
            }
            return '/public/assets/pngs/default_icon_listing.png';
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
                this.$router.push('/administrator/packaging/edit');
            });
        }
    }
};
</script>

<style lang="less">
@import '@/less/packaging/packaging-card.less';
</style>
