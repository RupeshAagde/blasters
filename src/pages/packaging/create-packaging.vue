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
                    'opaque-custom': isButtonDisabled
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
             <div class="loader-container" v-if="showLoader">
                <loader-vue/>
            </div>
            <!-- ** Do not remove the ref -->
            <packaging-create
                ref="createPackaging"
                :toggleBtn="toggleBtn"
                :showLoader="showLoader"
            />
        </div>
        <base-modal
            :isOpen="isModalOpen"
            :isCancelable="false"
            :modalClass="'custom-modal'"
        >
            <div class="modal-custom-body">
                <inline-svg :src="'modal_success'" />
                <p id="modal-body-text">
                    Packaging has been successfully
                    {{
                        Object.keys(editProduct).length
                            ? `updated`
                            : `added to the list`
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
import PackagingCreate from '../../components/packaging/packaging-create.vue';
import { NitrozenButton } from '@gofynd/nitrozen-vue';
import BaseModal from '../../components/common/dialogs/base-modal.vue';
import InlineSvg from '../../components/common/inline-svg.vue';
import { CLEAR_PRODUCT, SAVE_PACKAGING_PRODUCT } from '../../store/action.type';
import { mapGetters } from 'vuex';
import { GET_EDIT_PRODUCT } from '../../store/getters.type';
import LoaderVue from '../../components/common/loader.vue';
export default {
    name: 'create-packaging',
    components: {
        PackagingCreate,
        PageHeader,
        NitrozenButton,
        BaseModal,
        InlineSvg,
        LoaderVue
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
            editProduct: GET_EDIT_PRODUCT
        })
    },
    methods: {
        /**
         * @author Rohan Shah
         * @description Closes the modal button and redirects user to packaging
         * home page
         */
        handleSuccessBtn() {
            this.isModalOpen = false;
            this.$store.dispatch(CLEAR_PRODUCT);
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
                    this.showLoader = false;
                    // if the session is for update then create msg accordingly
                    let msg = `Something went wrong. Failed to ${
                        Object.keys(this.editProduct).length
                            ? 'update'
                            : 'add new'
                    } packaging product`;
                    // only if the schema error msg is string then update the error message
                    if (typeof res.message.error.errors == 'string') {
                        msg = res.message.error.errors;
                    } else if (res.message.message) {
                        msg = res.message.message;
                    }
                    return this.$snackbar.global.showError(msg);
                }
                this.showLoader = false;
                this.isModalOpen = true;
            });
        },
        /**
         * @description Go back to previous route
         */
        goBack() {
            this.$store.dispatch(CLEAR_PRODUCT);
            this.$router.back();
        },
        toggleBtn(flag) {
            this.isButtonDisabled = flag;
        }
    }
};
</script>
<style lang="less">
@import '../../less/packaging/create-packaging.less';
</style>
