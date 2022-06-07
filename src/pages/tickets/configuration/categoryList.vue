<template>
    <div class="panel">
        <page-header
            title="Configure Customer Support Category"
            @backClick="$router.push({ name: 'support' })"
        >
        </page-header>
        <div class="container">
            <div v-if="list.length" class="category">
                <div
                    v-for="(category, index) in list"
                    v-bind:key="index"
                    class="category-list"
                    @click="selected(category)"
                >
                    <div class="card-content-section">
                        <span class="category-name">{{ category.name }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenButton, NitrozenInput } from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
export default {
    name: 'category-list',
    components: {
        NitrozenButton,
        PageHeader,
        'nitrozen-input': NitrozenInput,
    },
    data() {
        return {
            list: [
                {
                    name: 'System categories',
                },
                {
                    name: 'General configurations',
                },
                {
                    name: 'Choose integration type',
                },
            ],
        };
    },
    methods: {
        selected(category) {
            if (category.name === 'System categories') {
                this.$router.push({
                    path: `/administrator/support/category/add-category`,
                });
            }
            if (category.name === 'General configurations') {
                this.$router.push({
                    path: `/administrator/support/category/general-configure`,
                });
            }
            if (category.name === 'Choose integration type') {
                this.$router.push({
                    path: `/administrator/support/category/choose-integration`,
                });
            }
        },
    },
};
</script>

<style lang="less" scoped>
.container {
    position: relative;
    margin: 24px;
    padding: 0px 24px 24px;
    top: 56.5px;
}
.category-list {
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 16px;
    margin-top: 24px;
    cursor: pointer;
}
.category-list:hover {
    box-shadow: 5px 5px 5px 0 rgba(221, 221, 221, 0.5);
}
.panel {
    display: flex;
    flex-direction: column;
}
</style>
