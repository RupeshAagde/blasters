<template>
    <loader v-if="pageLoading"></loader>
    <div class="margin" v-else>
        <div class="title">Extensions</div>
        <div>
            <nitrozen-dropdown
                class="input-search"
                :items="choicesList"
                v-model="selectedExtensionIdsList"
                :required="true"
                :multiple="true"
                :searchable="true"
                @searchInputChange="setAttributesList"
                :disabled="!parentState"
                placeholder="Search And Add Extensions"
            ></nitrozen-dropdown>
        </div>
        <template v-if="selectedExtensionIdsList.length">
            <draggable
                class="list nested-class"
                v-model="selectedExtensionIdsList"
                handle=".reorder"
                @start="drag = true"
                @end="drag = false"
            >
                <div
                    class="item space-between inline apart"
                    v-for="(extension, index) of selectedExtensionList"
                    :key="index"
                >
                    <div class="inline v-center">
                        <img :src="extension.logo && extension.logo.small" class="card-avatar" alt="logo" />
                        <div v-if="extension.name">
                            {{ extension.name }}
                        </div>
                        <div v-else>
                            {{ `unknown extension, extension id: ${extension._id}` }}
                        </div>
                    </div>

                    <div class="inline v-center">
                       <div class="inline seller-panel">
                            <nitrozen-checkbox
                                :checkboxValue="true"
                                v-model="extension.sellerPanel"
                                :id="extension._id"
                                :disabled="isSellerPanelDisabledExtension(extension)"
                            >
                                Show in Seller Panel
                            </nitrozen-checkbox>
                        </div>
                        <inline-svg
                            title="Remove Attribute"
                            class="cross-icon pointer"
                            src="plus-black"
                            @click.stop.native="
                                selectedExtensionIdsList.splice(index, 1)
                            "
                        ></inline-svg>
                    </div>
                </div>
            </draggable>
        </template>
    </div>
</template>

<style lang="less" scoped>
@import '../../../../pages/less/page-header.less';
@import '../../../../pages/less/page-ui.less';

.margin {
    margin: 24px 24px 0px;
}

.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }

    &.v-center {
        align-items: center;
    }

    .inline-right {
        flex: 1;
        margin-left: 24px;
    }
}

.cross-icon {
    padding-left: 20px;
    ::v-deep svg {
        -ms-transform: rotate(20deg); /* IE 9 */
        transform: rotate(45deg);
        width: 28px;
        height: 28px;
    }
}

.list {
    // max-height: 200px;
    overflow-y: auto;
    margin-top: 16px;
    .blaster-scrollbar;
    .item {
        border: 1px solid @Iron;
        border-radius: 4px;
        height: 24px;
        display: flex;
        align-items: center;
        padding: 12px;
        color: @Mako;
        font-size: 14px;
        font-weight: 400;
    }
}

.card-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    width: 24px;
    height: 24px;
    align-self: center;
    img {
        align-items: center;
        min-height: 24px;
        max-height: 24px;
        min-width: 24px;
        max-width: 24px;
    }
}

.input-search {
    background: #f8f8f8;
    border-radius: 4px;
    padding: 8px;
    max-width: calc(100% - 16px);
}

.seller-panel {
    ::v-deep .nitrozen-checkbox-container {
        font-weight: 400;
        font-size: 14px;
        color: @Black;
    }
}
.title {
    font-weight: 400;
    font-size: 14px;
    color: @Black;
    margin-bottom: 16px;
}
</style>

<script>
import Draggable from 'vuedraggable';
import {
    NitrozenDropdown,
    NitrozenBadge,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';

import InlineSvg from '@/components/common/ukt-inline-svg';
import ExtensionService from '@/services/extension.service';
import Loader from '@/components/common/loader';

export default {
    name: 'extension-component',
    components: {
        NitrozenDropdown,
        NitrozenBadge,
        Draggable,
        InlineSvg,
        Loader,
        'nitrozen-checkbox': NitrozenCheckBox,
    },
    props: ['lineItem', 'parentState'],
    data() {
        return {
            pageLoading: true,
            extensionsData: {},
            choicesList: [],
            selectedExtensionIdsList: [],
            sellerPanelDisabledExtensionNames: ['jiomart'],  // TODO need to add jioMart Extension here. Since this will keep changing based on the environment, we will need to come up with a maintainable approach
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            Promise.all([
                this.fetchExtensions(),
                this.fetchSelectedExtensionData(),
            ]).then((res) => {
                this.updateExtensionsList(res[0]);
                this.updateExtensionsList(res[1]);
                this.pageLoading = false;
            });
            this.lineItem.data.selectedData.map((extension) => {
                this.selectedExtensionIdsList.push(extension.id);
                /**here adding additional property sellerpanel for preselected extension
                 * adding _id property so we can show it in case extension isn't available in upcoming time
                 */
                this.extensionsData[extension.id] = {
                    sellerPanel: extension.sellerPanel,
                    _id: extension.id,
                };
            });
        },
        fetchExtensions() {
            return new Promise((resolve, reject) => {
                const query = {
                    page_size: 10,
                    page_no: 1,
                    extension_type: "public"
                };
                ExtensionService.getExtensionsList(query)
                    .then(({ data }) => {
                        this.choicesList = this.getDropDownChoiceList(
                            data.items
                        );
                        return resolve(data.items);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        fetchSelectedExtensionData() {
            return new Promise((resolve, reject) => {
                let data = [];
                this.lineItem.data.selectedData.map((extension) => {
                    if (extension.id) data.push(extension.id)
                });
                if (!data.length){
                    return resolve([])
                }
                const query = {
                    _id: data,
                };
                ExtensionService.getExtensionsList(query)
                    .then(({ data }) => {
                        return resolve(data.items);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        typeAhead(text) {
            return new Promise((resolve, reject) => {
                const query = {
                    page_size: 10,
                    page_no: 1,
                    name: text,
                    extension_type: "public"
                };
                ExtensionService.getExtensionsList(query)
                    .then(({ data }) => {
                        return resolve(data);
                    })
                    .catch((err) => {
                        return reject(err);
                    });
            });
        },
        getDropDownChoiceList(items) {
            return items.map((item) => {
                return {
                    text: item.name,
                    value: item._id,
                };
            });
        },
        updateExtensionsList(items) {
            items.map((item) => {
                if (!this.extensionsData[item._id]) {
                    this.extensionsData[item._id] = item;
                } else {
                    this.extensionsData[item._id] = Object.assign(
                        this.extensionsData[item._id],
                        item
                    );
                }
            });
        },
        setAttributesList(e = {}) {
            this.typeAhead(e.text).then((res) => {
                this.updateExtensionsList(res.items);
                this.choicesList = this.getDropDownChoiceList(res.items);
            });
        },
        saveForm() {
            return this.selectedExtensionList.map((extension) => {
                return {
                    id: extension._id,
                    sellerPanel: extension.sellerPanel || false,
                };
            });
        },
        isSellerPanelDisabledExtension(extension) {
            try {
                let isDisable =
                    !this.parentState ||
                    this.sellerPanelDisabledExtensionNames.includes(
                        extension.name && extension.name.toLowerCase()
                    );
                return isDisable;
            } catch (err) {
                console.log(err);
                return true;
            }
        }
    },
    computed: {
        selectedExtensionList() {
            const list = [];
            this.selectedExtensionIdsList.forEach((extensionId) => {
                list.push(this.extensionsData[extensionId]);
            });
            return list;
        },
    },
};
</script>

