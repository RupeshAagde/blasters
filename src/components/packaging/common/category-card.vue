<template>
    <div class="category-card-container">
        <div class="category-card-name" :id="'item-name'">
            {{ item.name }}
            <span class="slug-name" :id="'slug-name' + cardIndex"
                >Slug: {{ item.slug }}</span
            >
        </div>
        <div class="category-card-config-container">
            <div class="category-config-container">
                <span id="category-name">Categories: </span>
                <div
                    v-for="(item, index) of splicedCategoryConfig"
                    :key="'category' + index"
                    class="config-item"
                >
                    <span
                        class="config-item-ellipsis"
                        :title="item.name"
                        :id="'item-name-row' + index"
                    >
                        {{ item.name }}</span
                    >
                </div>
                <div
                    class="extra-count"
                    id="extra-count-value"
                    v-if="extraCount"
                >
                    + {{ extraCount }}
                </div>
            </div>
            <div
                @click="handleEditClicked(item)"
                id="edit-click"
                class="icon-wrapper"
            >
                <inline-svg :src="'edit_new'" class="edit-icon" />
            </div>
        </div>
    </div>
</template>

<script>
import InlineSvg from '../../common/inline-svg.vue';
export default {
    name: 'category-card',
    components: {
        InlineSvg
    },
    props: {
        item: {
            type: Object
        },
        handleEditClicked: {
            type: Function
        },
        l3CategoryList: {
            type: Object
        },
        cardIndex: {
            type: Number
        }
    },
    mounted() {
        // call function to set state
        this.setDisplayCategories();
    },
    data() {
        return {
            displayCount: 4,
            splicedCategoryConfig: [],
            extraCount: 0
        };
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Creates a new array only for display purpose based on the display count
         * default display count is taken from state
         */
        setDisplayCategories(count = this.displayCount) {
            let tempArr = [];
            this.item.categories.forEach((id) => {
                tempArr.push({ name: this.l3CategoryList[id] });
                // let categoryObj = this.l3CategoryList
                //     .map((a) => {
                //         if (a.uid == id) return a;
                //     })
                //     .filter((a) => a !== undefined)[0];
                // if (categoryObj) tempArr.push(categoryObj);
            });
            this.splicedCategoryConfig = tempArr;
            if (tempArr.length > count) {
                this.splicedCategoryConfig = tempArr.slice(0, count);
                this.extraCount = tempArr.length - count;
            }
        }
    }
};
</script>

<style lang="less">
@import '@/less/packaging/category-card.less';
</style>
