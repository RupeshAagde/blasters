<template>
    <div>
        <page-header
            :title="'Add New Category'"
            @backClick="goBack"
            :noContextMenu="true"
        >
            <div
                id="save-category-btn"
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
        <base-modal
            :isOpen="isModalOpen"
            :isCancelable="false"
            :modalClass="'custom-modal'"
        >
            <div class="modal-custom-body">
                <inline-svg :src="'modal-success'" />
                <p id="modal-body-text">
                    Category has been succesfully added to the list
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
import CreateCategory from '../../components/packaging/create-category.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
import BaseModal from '../../components/common/dialogs/base-modal.vue';
import InlineSvg from '../../components/common/inline-svg.vue';
import { SAVE_CATEGORY } from '../../store/action.type';
export default {
    name: 'create-category-home',
    components: {
        CreateCategory,
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
         * @description Closes the modal button and redirects user to category configuration
         * home page
         */
        handleSuccessBtn() {
            this.isModalOpen = false;
            this.$router.push(
                '/administrator/packaging/category-configuration/'
            );
        },
        /**
         * @author Rohan Shah
         * @description Calls the child function to get form data
         * And then uses dispatch method to save the category
         */
        onSave() {
            this.showLoader = true;
            // call function to get request object
            const reqObj = this.$refs.createCategory.handleSave();
            this.$store.dispatch(SAVE_CATEGORY, reqObj).then((res) => {
                if (res.error) {
                    return this.$snackbar.global.showError(
                        'Something went wrong. Failed to add new Category'
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
@import '../../less/packaging/create-category-home.less';
</style>
