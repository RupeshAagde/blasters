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
                        <inline-svg
                            src="arrow-dropdown-black"
                            class="forward-icon"
                        ></inline-svg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenButton, NitrozenInput } from '@gofynd/nitrozen-vue';
import { PageHeader } from '@/components/common';
import inlineSvgVue from '@/components/common/inline-svg.vue';
export default {
    name: 'category-list',
    components: {
        'inline-svg': inlineSvgVue,
        NitrozenButton,
        PageHeader,
        'nitrozen-input': NitrozenInput,
    },
    data() {
        return {
            list: [
                {
                    name: 'System categories',
                    path: 'add-category',
                },
                {
                    name: 'General configurations',
                    path: 'general-configure',
                },
                // {
                //     name: 'Choose integration type',
                //     path: 'choose-integration',
                // },
            ],
        };
    },
    methods: {
        selected(category) {
            this.$router.push({
                path: `/administrator/support/category/${category.path}`,
            });
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
.forward-icon {
    transform: rotate(270deg);
}
.category-name {
    padding: 16px;
}
.card-content-section {
    display: flex;
    justify-content: space-between;
}
</style>
