<template>
    <div>
        <page-header
            :title="'Add New Category'"
            @backClick="goBack"
            :noContextMenu="true"
        >
            <div
                :class="{
                    'add-category-button': true,
                    // show the opaque class only if the flag is true
                    opaque: isButtonDisabled
                }"
            >
                <nitrozen-button
                    theme="secondary"
                    title="Save"
                    @click="onSave"
                    :disabled="isButtonDisabled"
                >
                    Save
                </nitrozen-button>
            </div>
        </page-header>
        <div class="create-category-container">
            <!-- ** Do not remove the ref -->
            <create-category ref="createCategory" />
        </div>
    </div>
</template>

<script>
import PageHeader from '../../components/common/layout/page-header.vue';
import CreateCategory from '../../components/packaging/create-category.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
export default {
    name: 'create-category-home',
    components: {
        CreateCategory,
        PageHeader,
        NitrozenButton
    },
    data() {
        return {
            isButtonDisabled: true
        };
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Calls the child function to get form data
         * And then uses dispatch method to save the category
         */
        onSave() {
            // call function to get request object
            const reqObj = this.$refs.createCategory.handleSave();
            // TODO do something here
        },
        /**
         * @description Go back to previous route
         */
        goBack() {
            this.$router.back();
        }
    }
};
</script>
<style lang="less">
@import '../../less/packaging/create-category-home.less';
</style>
