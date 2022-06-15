<template>
    <div class="category-card-container">
        <div class="category-card-name" :id="'item-name'">
            {{ item.name }}
        </div>
        <div class="category-card-config-container">
            <div class="category-config-container">
                <div class="extra-count" id="extra-count-value">
                    {{ item.categories.length }}
                    {{ item.categories.length > 1 ? 'Categories' : 'Category' }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'category-card',
    props: {
        item: {
            type: Object
        }
    },
    mounted() {
        // call function to set state
        this.setDisplayCategories();
    },
    data() {
        return {
            displayCount: 6,
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
            let tempArr = this.item.categories;
            this.splicedCategoryConfig = tempArr.slice(0, count);
            this.extraCount = tempArr.length - count;
        }
    }
};
</script>

<style lang="less">
@import '@/less/packaging/category-card.less';
</style>
