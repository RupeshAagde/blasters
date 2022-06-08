<template>
    <div>
        <page-header
            :title="'Add Packaging'"
            @backClick="goBack"
            :noContextMenu="true"
        >
            <div
                :class="{
                    'add-packaging-button': true,
                    opaque: isButtonDisabled
                }"
            >
                <nitrozen-button
                    theme="secondary"
                    title="Save"
                    :disabled="isButtonDisabled"
                >
                    Save
                </nitrozen-button>
            </div>
        </page-header>
        <div class="create-packaging-container">
            <packaging-create />
        </div>
    </div>
</template>

<script>
import PageHeader from '../../components/common/layout/page-header.vue';
import PackagingCreate from '../../components/packaging/packaging-create.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
export default {
    name: 'create-packaging',
    components: {
        PackagingCreate,
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
         * @description Go back to previous route
         */
        goBack() {
            this.$router.back();
        }
    }
};
</script>
<style lang="less">
@import '../../less/packaging/create-packaging.less';
</style>
