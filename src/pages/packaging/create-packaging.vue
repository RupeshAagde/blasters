<template>
    <div>
        <page-header
            :title="'Add Packaging'"
            @backClick="goBack"
            :noContextMenu="true"
        >
            <div
                id="save-packaging-btn"
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
        <base-modal
            :isOpen="isModalOpen"
            :isCancelable="false"
            :modalClass="'custom-modal'"
        >
            <div class="modal-custom-body">
                <inline-svg :src="'modal-success'" />
                <p id="modal-body-text">
                    Packaging has been succesfully added to the list
                </p>
                <nitrozen-button
                    :title="'Thank you'"
                    class="modal-custom-button"
                    theme="secondary"
                    id="modal-btn"
                    >Thank you</nitrozen-button
                >
            </div>
        </base-modal>
    </div>
</template>

<script>
import PageHeader from '../../components/common/layout/page-header.vue';
import PackagingCreate from '../../components/packaging/packaging-create.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
import BaseModal from '../../components/common/dialogs/base-modal.vue';
import InlineSvg from '../../components/common/inline-svg.vue';
export default {
    name: 'create-packaging',
    components: {
        PackagingCreate,
        PageHeader,
        NitrozenButton,
        BaseModal,
        InlineSvg
    },
    data() {
        return {
            isButtonDisabled: true,
            isModalOpen: false
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
