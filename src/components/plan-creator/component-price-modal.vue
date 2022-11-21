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
        <div class="footer">
            <nitrozen-button
                :theme="'secondary'"
                v-flatBtn
                @click="closeDialog"
            >
                {{ isEditOnly ? 'Save' : 'Create' }}
            </nitrozen-button>
        </div>
    </base-modal>
</template>

<style lang="less" scoped>
::v-deep .modal {
    .modal-container {
        width: 1100px;
        height: 600px;
        .modal-body {
            padding: 0;
            .price-form {
                padding: 24px;
                overflow: auto;
                height: calc(100% - 70px);
                .blaster-scrollbar;
            }
            .footer {
                width: 100%;
                display: flex;
                justify-content: flex-end;
                padding: 15px 24px;
                box-sizing: border-box;
            }
        }
    }
}
</style>

<script>
import { BaseModal } from '../common/';
import PriceModelPage from '../../pages/plan-creator/component-price.vue';
import { NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';

export default {
    name: 'price-modal',
    components: {
        'base-modal': BaseModal,
        'price-model-page': PriceModelPage,
        'nitrozen-button': NitrozenButton
    },
    directives: {
        flatBtn
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
            this.$emit('closedialog', null);
        }
    }
};
</script>
