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
                    @click="onSave"
                >
                    Save
                </nitrozen-button>
            </div>
        </page-header>
        <div class="create-packaging-container">
            <!-- ** Do not remove the ref -->
            <packaging-create ref="createPackaging" />
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
                    @click="handleSuccessBtn"
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
import { SAVE_PACKAGING_PRODUCT } from '../../store/action.type';
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
            isModalOpen: false,
            showLoader: false
        };
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Closes the modal button and redirects user to packaging
         * home page
         */
        handleSuccessBtn() {
            this.isModalOpen = false;
            this.$router.push('/administrator/packaging/items/');
        },
        /**
         * @author Rohan Shah
         * @description Calls the child function to get form data
         * And then uses dispatch method to save the category
         */
        onSave() {
            this.showLoader = true;
            // call function to get request object
            const reqObj = this.$refs.createPackaging.savePackagingOrder();
            this.$store.dispatch(SAVE_PACKAGING_PRODUCT, reqObj).then((res) => {
                if (res.error) {
                    return this.$snackbar.global.showError(
                        'Something went wrong. Failed to add new Packaging product'
                    );
                }
                this.showLoader = false;
                this.isModalOpen = true;
            });
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
@import '../../less/packaging/create-packaging.less';
</style>
