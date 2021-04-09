<template>
    <!-- click to call  -->
    <nitrozen-dialog
        class="add-attachment"
        ref="addAttachmentNitrozenDialog"
        :title="title"
    >
        <template slot="body">
            <div class="form-row">
                <nitrozen-dropdown
                    :searchable="false"
                    :label="'Type'"
                    v-model="attachment.type"
                    :items="types"
                ></nitrozen-dropdown>
            </div>
            <div class="form-row">
                <nitrozen-input
                    :searchable="false"
                    :label="'Slug'"
                    v-model="attachment.value"
                ></nitrozen-input>
            </div>
        </template>
        <template slot="footer">
            <nitrozen-button
                theme="secondary"
                v-flat-btn
                @click="addAttachment"
                :showProgress="isLoadingDetails"
            >
                Add
            </nitrozen-button>
        </template>
    </nitrozen-dialog>
</template>

<script>
import {
    NitrozenButton,
    NitrozenDialog,
    NitrozenRadio,
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';
import SupportService from './../../../services/support.service';

export default {
    name: 'add-attachment-dialog',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-radio': NitrozenRadio,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown
    },
    props: {
        shouldShowProduct: {
            type: Boolean
        },
        company_id: {
            type: String
        }
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {
        //
    },
    data: function() {
        return {
            title: 'Add Attachment',
            types: [
                {
                    text: 'Shipment',
                    value: 'shipment'
                }
            ],
            attachment: {
                type: 'product',
                value: ''
            },
            isLoadingDetails: false
        };
    },
    mounted() {
        if (this.shouldShowProduct) {
            this.types.push({
                text: 'Product',
                value: 'product'
            });
        }

        this.attachment.type = this.types[0].value;
    },
    methods: {
        open(data) {
            this.$refs.addAttachmentNitrozenDialog.open({
                showCloseButton: true,
                width: '600px'
            });
        },
        close(reason) {
            this.$refs.addAttachmentNitrozenDialog.close(reason);
            this.$emit('close', reason);
        },
        addAttachment() {
            if (!this.attachment.value || this.attachment.value == '') {
                return;
            }

            this.isLoadingDetails = true;

            if (this.attachment.type == 'product') {
                SupportService.fetchProductInfo(this.attachment.value)
                    .then((res) => {
                        this.attachment.details = res.data;
                        this.attachment.display = res.data.name;
                        this.close(this.attachment);
                    })
                    .catch((error) => {
                        //
                    })
                    .finally(() => {
                        this.isLoadingDetails = false;
                    });
            } else if (this.attachment.type == 'shipment') {
                SupportService.fetchShipmentInfo(
                    this.attachment.value,
                    this.company_id
                )
                    .then((res) => {
                        // this.attachment.details = res.data.orders[0];
                        this.attachment.details = res.data.items[0];
                        this.attachment.display = 'Shipment';
                        this.close(this.attachment);
                    })
                    .catch((error) => {
                        //
                    })
                    .finally(() => {
                        this.isLoadingDetails = false;
                    });
            }
        }
    }
};
</script>

<style lang="less" scoped>
.add-attachment {
    ::v-deep .nitrozen-dialog {
        .nitrozen-dialog-body {
            overflow: unset;
            .form-row {
                width: 48%;
                float: left;
                margin: 1%;
            }
        }
        .nitrozen-dialog-footer {
            padding-top: 12px;
        }
    }
}
</style>
