<template class="main">
    <transition name="modal">
        <nitrozen-dialog ref="dialog" title="Meta" @close="close">
            <template slot="body">
                <div class="meta-type">
                    <nitrozen-radio
                        name="metaType"
                        class="radio-spacing"
                        :radioValue="'json'"
                        v-model="metaType"
                    >
                        <span class="regular-xs dark-Mako">JSON</span>
                    </nitrozen-radio>
                    <nitrozen-radio
                        name="metaType"
                        class="radio-spacing"
                        :radioValue="'meta'"
                        v-model="metaType"
                        ><span class="regular-xs dark-Mako">Meta</span>
                    </nitrozen-radio>
                </div>
                <div class="meta-container" v-if="metaType === 'meta'">
                    <div v-for="(meta, index) in arrMeta" :key="index">
                        <div class="meta-pair inline">
                            <!-- key -->
                            <nitrozen-input
                                class="cell-key"
                                v-model="meta.key.value"
                                label="Key"
                                :showSuffix="true"
                                :custom="true"
                                :type="
                                    meta.key.type === 'string'
                                        ? 'text'
                                        : 'number'
                                "
                            >
                                <nitrozen-dropdown
                                    class="datatype-dropdown"
                                    :items="dataType"
                                    v-model="meta.key.type"
                                ></nitrozen-dropdown>
                            </nitrozen-input>
                            <!-- value -->
                            <nitrozen-input
                                class="cell-value"
                                v-model="meta.value"
                                label="Value"
                            />
                            <!-- delete pair -->
                            <ukt-inline-svg
                                src="delete"
                                class="delete-icon"
                                title="Delete Range"
                                @click.stop.native="deletePair(index)"
                            ></ukt-inline-svg>
                        </div>
                    </div>
                    <nitrozen-button
                        class="add-btn"
                        theme="secondary"
                        @click="add"
                        >Add
                    </nitrozen-button>
                </div>
                <div v-else-if="metaType === 'json'" class="meta-container">
                    <no-ssr>
                        <VJsoneditor
                            class="vjson-editor-container"
                            v-model="json"
                            :options="options"
                            :plus="false"
                            height="350px"
                            @error="onError"
                        ></VJsoneditor>
                    </no-ssr>
                </div>
            </template>
        </nitrozen-dialog>
    </transition>
</template>

<script>
import uktinlinesvg from '@/components/common/ukt-inline-svg';

import _ from 'lodash';
const VJsoneditor = () => import('v-jsoneditor');

import {
    NitrozenDialog,
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenRadio,
    strokeBtn
} from '@gofynd/nitrozen-vue';
export default {
    name: 'adm-meta-dialog',
    components: {
        'ukt-inline-svg': uktinlinesvg,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-radio': NitrozenRadio,
        VJsoneditor
    },
    directives: {
        strokeBtn
    },
    props: {
        meta: {
            type: Array,
            default: () => {
                return [];
            }
        },
        customJson: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    data() {
        return {
            arrMeta: [],
            dataType: [
                {
                    text: 'String',
                    value: 'string'
                },
                {
                    text: 'Number',
                    value: 'number'
                }
            ],
            json: {},
            options: {
                mode: 'code',
                enableSort: false,
                enableTransform: false
            },
            metaType: 'json'
        };
    },
    methods: {
        populateData() {
            if (_.isEmpty(this.meta) && this.arrMeta.length === 0) {
                this.arrMeta.push(this.newPair());
            }

            if (!_.isEmpty(this.meta)) {
                this.arrMeta = _.cloneDeep(this.meta);
                // _.map(this.meta, (value, key) => {
                //     return { key, value };
                // });
            }
            this.json = _.cloneDeep(this.customJson);
        },
        open() {
            this.$refs['dialog'].open({
                width: '700px',
                height: '500px',
                showCloseButton: true,
                dismissible: false,
                neutralButtonLabel: 'Cancel',
                positiveButtonLabel: 'Save'
            });
        },
        close(e) {
            if (e === 'Save') {
                this.$emit('save', { meta: this.getMeta(), json: this.json });
                return;
            }
            this.$emit('close', e);
        },
        newPair() {
            return {
                key: {
                    type: 'string',
                    value: ''
                },
                value: ''
            };
        },
        add() {
            this.arrMeta.push(this.newPair());
        },
        getMeta() {
            // const meta = {};
            // this.arrMeta.forEach(m => {
            //     meta[m.key] = m.value;
            // });
            // return meta;
            return this.arrMeta;
        },
        deletePair(index) {
            this.arrMeta.splice(index, 1);
        },
        onError() {}
    }
};
</script>

<style lang="less" scoped>
.meta-type {
    display: flex;
    padding-bottom: 15px;
}
.radio-spacing {
    margin-right: 30px;
}
.meta-container {
    padding-bottom: 15px;
    .inline {
        display: flex;
        margin-top: 12px;
        .cell-key {
            flex: 0.5;
        }
        .cell-value {
            margin-left: 12px;
            flex: 0.5;
        }
        ::v-deep.delete-icon svg {
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin: 21px 0px 0px 12px;
        }
        .datatype-dropdown {
            min-width: 105px;
        }
    }
    .add-btn {
        float: right;
        margin-top: 16px;
    }
}
</style>
