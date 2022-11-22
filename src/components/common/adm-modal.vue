<template>
    <ukt-modal
        :isOpen="isOpen"
        :title="title"
        :childHandleFocus="true"
        @closedialog="closeModal()"
        class="wizard-container"
    >
        <div class="left">
            <div class="sidebar">
                <slot name="sidebar"></slot>
                <div
                    class="group"
                    :key="parentIndex"
                    v-for="(parent, parentIndex) in sidebarData"
                >
                    <div v-if="parent.group" class="groupNameContainer">
                        <div class="groupName">{{ parent.group }}</div>
                    </div>
                    <div
                        v-bind:class="{
                            childSelected:
                                selectedItem &&
                                selectedItem.parentIndex == parentIndex &&
                                selectedItem.childIndex == childIndex
                        }"
                        class="childNameContainer"
                        :key="childIndex"
                        v-for="(child, childIndex) in parent.children"
                        @click.stop="
                            onSelectChild(
                                parentIndex,
                                childIndex,
                                parent,
                                child
                            )
                        "
                    >
                        <div class="childName">{{ child.name }}</div>
                        <inline-svg
                            class="child-linked"
                            v-if="child.configured"
                            src="linked"
                            title="configured"
                        ></inline-svg>
                    </div>
                </div>
                <adm-no-content
                    v-if="!sidebarData.length"
                    helperText="No Results Found"
                ></adm-no-content>
            </div>
        </div>
        <div class="right">
            <div class="body">
                <slot name="body"></slot>
            </div>
            <div class="footer">
                <slot name="footer">
                    <nitrozen-button
                        theme="secondary"
                        v-flatBtn
                        @click="onProceedClick"
                        class="btn-wrapper"
                        >Select &amp; Proceed</nitrozen-button
                    >
                </slot>
            </div>
        </div>
    </ukt-modal>
</template>

<script>

import { NitrozenButton, flatBtn, NitrozenDialog } from '@gofynd/nitrozen-vue';
import admNoContent from '@/components/common/adm-no-content.vue';
import InlineSvg from '@/components/common/inline-svg.vue';
import uktModal from '@/components/common/utk-modal.vue';

export default {
    name: 'adm-wizard-modal',
    components: {
        'ukt-modal': uktModal,
        'adm-no-content': admNoContent,
        'nitrozen-button': NitrozenButton,
        InlineSvg
    },
    directives: {
        flatBtn
    },
    props: {
        id: {
            type: String,
            default: Math.random()
                .toString(36)
                .slice(4)
        },
        isOpen: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: ''
        },
        selectedParentIndex: {
            type: Number,
            default: 0
        },
        selectedChildIndex: {
            type: Number,
            default: 0
        },
        sidebarData: {
            type: Array,
            default: [
                // {
                //     group:"Order",
                //     children : [
                //         {
                //             id: 1,
                //             name : "a",
                //             configured: true, //this puts a "linked" icon besides the child name
                //         },
                //         {
                //             id: 2,
                //             name : "b"
                //         }
                //     ]
                // },
                // {
                //     group:"Refund",
                //     children : [
                //         {
                //             id: 1,
                //             name : "a"
                //         },
                //         {
                //             id: 2,
                //             name : "b"
                //         }
                //     ]
                // }
            ]
        }
    },
    data() {
        return {
            selectedItem: {
                parentIndex: this.selectedParentIndex,
                childIndex: this.selectedChildIndex
            }
        };
    },
    methods: {
        onProceedClick() {
            if (this.selectedItem) {
                let { parentIndex, childIndex } = this.selectedItem;
                let obj = {
                    group: this.sidebarData[parentIndex].group,
                    child: this.sidebarData[parentIndex].children[childIndex]
                };
                this.$emit('proceedClick', this.id, obj);
            }
            this.closeModal();
        },
        closeModal() {
            this.$emit('closeModal', this.id);
        },
        onSelectChild(parentIndex, childIndex, parent, child) {
            this.selectedItem = {
                parentIndex,
                childIndex
            };
            let obj = {
                group: parent.group,
                child: child
            };
            this.$emit('selectItem', this.id, obj);
        }
    }
};
</script>

<style lang="less" scoped>
.wizard-container.modal {
    ::v-deep .modal-container {
        width: 1100px;
        height: 600px;
        max-width: 1100px;
        max-height: 1100px;
        padding: 0px;
        box-sizing: border-box;
        .modal-header {
            border-bottom: 1px solid #d0d0d0;
        }
        .modal-body {
            height: calc(100% - 45px);
            display: flex;
            @media @mobile {
                display: block;
            }
            .left {
                flex-basis: 300px;
                border-right: 1px solid #d0d0d0;
                overflow: auto;
                padding-top: 12px;
                .sidebar {
                    .group {
                        margin-bottom: 12px;
                    }
                    .groupNameContainer {
                        padding: 6px 0px;
                        width: 100%;
                        color: #9b9b9b;
                        font-family: Inter;
                        font-size: 12px;
                        letter-spacing: 0;
                        line-height: 17px;
                        .groupName {
                            margin: 0px 12px;
                        }
                    }
                    .childNameContainer {
                        display: flex;
                        padding: 6px 6px;
                        color: #212121;
                        font-family: Inter;
                        font-size: 14px;
                        letter-spacing: 0;
                        line-height: 23px;
                        cursor: pointer;
                        .childName {
                            margin: 0px 12px;
                            flex: 4;
                        }
                        .child-linked {
                            flex: 1;
                        }
                    }
                    .childNameContainer:hover {
                        background-color: rgba(92, 107, 221, 0.12);
                    }
                    .childSelected {
                        background-color: rgba(92, 107, 221, 0.12);
                    }
                    .page-error {
                        width: auto;
                        img {
                            width: 100%;
                            height: auto;
                        }
                    }
                }
            }
            .right {
                flex-basis: 100%;
                display: flex;
                height: 100%;
                flex-direction: column;
                .body {
                    overflow: auto;
                    height: auto;
                    max-height: 100%;
                    padding: 24px;
                    flex-basis: 100%;
                    border-bottom: 1px solid #d0d0d0;
                    .mirage-scrollbar;
                }
                .footer {
                    height: 80px;
                    .btn-wrapper {
                        float: right;
                        margin-top: 12px;
                        margin-bottom: 12px;
                        margin-right: 24px;
                    }
                }
            }
        }
    }
}
</style>
