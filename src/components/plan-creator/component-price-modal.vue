<template>
    <base-modal
        :isOpen="isOpen"
        :isCancelable="true"
        :title="(isEditOnly ? 'Edit' : 'Create') + ' Component Price'"
        @closedialog="closeDialog"
    >
        <price-model-page
            :baseComponent="baseComponent"
            :priceModel="priceModel"
            :isClone="isClone"
        >
        </price-model-page>
    </base-modal>
</template>

<style lang="less" scoped>
::v-deep.modal {
    .modal-container {
        width: 1100px;
        height: 600px;
        .modal-body {
            padding: 24px;
        }
    }
}
</style>

<script>
import { BaseModal } from '../common/';
import PriceModelPage from '../../pages/plan-creator/component-price.vue';

export default {
    name: 'price-modal',
    components: {
        'base-modal': BaseModal,
        'price-model-page': PriceModelPage
    },
    props: {
        isOpen: {
            type: Boolean
        },
        isClone: {
            type: Boolean,
            default: false
        },
        baseComponent: {
            type: Object
        },
        priceModel: {
            type: Object
        }
    },
    computed: {
        isEditOnly() {
            return this.priceModel && !this.isClone;
        }
    },
    methods: {
        closeDialog() {
            console.log('closed');
            this.$emit('closedialog', null);
        }
    }
};
</script>
