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
                    'opaque-custom': isButtonDisabled
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
            <create-category ref="createCategory" :toggleBtn="toggleBtn" />
        </div>
        <base-modal
            :isOpen="isModalOpen"
            :isCancelable="false"
            :modalClass="'custom-modal'"
        >
            <div class="modal-custom-body">
                <inline-svg :src="'modal_success'" />
                <p id="modal-body-text">
                    Category has been succesfully
                    {{
                        Object.keys(selectedCategory).length
                            ? 'updated'
                            : 'added to the list'
                    }}
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
import { mapGetters } from 'vuex';
import { GET_EDIT_CATEGORY } from '../../store/getters.type';
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
    computed: {
        ...mapGetters({
            selectedCategory: GET_EDIT_CATEGORY
        })
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
            let requestData = {
                data: reqObj
            };
            // only for edit add the flag and slug name
            if (Object.keys(this.selectedCategory).length) {
                requestData.isEdit = true;
                requestData.slug = this.selectedCategory.slug;
            }
            this.$store.dispatch(SAVE_CATEGORY, requestData).then((res) => {
                if (res.error) {
                    // create msg based on if session is for edit or create
                    let msg = `Something went wrong. Failed to ${
                        Object.keys(this.selectedCategory).length
                            ? 'update Category'
                            : 'add new Category'
                    }`;
                    return this.$snackbar.global.showError(
                        // only if the status code is 409 show the duplicate error else show generic error
                        res.statusCode == 409 ? res.msg : msg
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
        },
        toggleBtn(flag) {
            this.isButtonDisabled = flag;
        }
    }
};
</script>
<style lang="less">
@import '../../less/packaging/create-category-home.less';
</style>
