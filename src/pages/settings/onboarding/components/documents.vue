<template>
    <div class="document-section">
        <div
            class="inline apart document-list"
            v-for="(item, index) in lineItem.data.lineItems"
            :key="index"
        >
            <div class="inline">
                <div class="vertical">
                    <div class="cl-Mako dark-xs mr-xs">
                        {{ item.text }}
                    </div>
                    <div class="subtitle">
                        <span v-if="selectedDocuments[item.id].length">
                            {{ selectedDocuments[item.id].join(', ') }}
                        </span>
                        <span v-else> Documents List Here </span>
                    </div>
                </div>
            </div>
            <div class="inline" @click="openDialog(index, $event)">
                <nitrozen-badge v-if="parentState" state="info" class="badge">
                    Configure
                </nitrozen-badge>
                <nitrozen-slide-dialog
                    ref="dialog"
                    :title="item.text"
                    @close="close(item, $event)"
                    :id="item.id"
                >
                    <template slot="header">
                        <div class="inline apart header">
                            <div class="inline listed">
                                <div>{{ item.text }}</div>
                                <div class="cl-Mako dark-xs mr-xs">
                                    Select the required documents to collect
                                    from the seller
                                </div>
                            </div>
                        </div>
                    </template>
                    <div slot="body" class="dialog-body">
                        <div
                            v-for="nestedItem in item.data.lineItems"
                            :key="nestedItem.id"
                            class="border"
                        >
                            <component-factory
                                :lineItem="nestedItem"
                                ref="getData"
                                :parentState="parentState"
                                textClass="group-header"
                            ></component-factory>
                        </div>
                    </div>
                </nitrozen-slide-dialog>
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenBadge } from '@gofynd/nitrozen-vue';
import Slider from '@/components/common/slider-dialog.vue';

export default {
    name: 'documents',
    components: {
        ComponentFactory: () => import('./component-factory.vue'),
        'nitrozen-badge': NitrozenBadge,
        'nitrozen-slide-dialog': Slider
    },
    props: ['lineItem', 'parentState'],
    computed: {
        selectedDocuments() {
            let data = {};
            this.lineItem.data.lineItems.map((item) => {
                let selectedDocuments = [];
                item.data.lineItems.map((subItem) => {
                    if (subItem.data.currentValue) {
                        selectedDocuments.push(subItem.text);
                    }
                });
                data[item.id] = selectedDocuments;
            });
            return data;
        }
    },
    watch: {
        parentState: function(newVal) {
            if (!newVal) {
                this.lineItem.data.lineItems.map((item) => {
                    item.data.currentValue = newVal;
                });
            } else {
                this.lineItem.data.lineItems.map((item) => {
                    item.data.currentValue = item.data.isSelected;
                });
            }
        }
    },
    methods: {
        openDialog(id) {
            this.$refs.dialog[id].open({
                width: '505px',
                showCloseButton: true,
                dismissible: true,
                positiveButtonLabel: 'Save',
                negativeButtonLabel: 'Cancel',
                neutralButtonLabel: false
            });
        },
        close(item, event) {
            if (event == 'Cancel' || event == 'close') {
                if (item.data.lineItems) {
                    item.data.lineItems.map((lineItem) => {
                        lineItem.data.currentValue = lineItem.data.isSelected;
                    });
                }
            }
        },
        saveForm() {
            let data = {};
            let counter = 0;
            this.lineItem.data.lineItems.map((businessType) => {
                data[businessType.id] = {};
                businessType.data.lineItems.map((documentType) => {
                    data[businessType.id][documentType.id] = this.$refs.getData[
                        counter
                    ].saveForm();
                    counter++;
                });
            });
            return data;
        }
    }
};
</script>
<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';

.p-md {
    padding: 12px 0px;
}

.header {
    padding-bottom: 12px;
}

.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }

    &.listed {
        flex-direction: column;
    }
}

.subtitle {
    padding-top: 10px;
    font-weight: 400;
    font-size: 12px;
    color: @DustyGray2;
}

.vertical {
    flex-direction: column;
}

.border {
    border: 1px solid @Iron;
    margin: 24px 0px;
    border-radius: 8px;
}

.document-list {
    padding-bottom: 16px;
    margin: 16px 24px;
    border-bottom: 1px solid @Iron;
}

.document-list:last-child {
    border-bottom: none;
    padding-bottom: 0px;
}

.badge {
    text-transform: capitalize;
}
</style>
