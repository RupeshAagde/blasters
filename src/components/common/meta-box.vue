<template>
    <div class="meta-box">
        <div class="meta-type" v-if="!showJsonOnly">
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
                        :type="meta.key.type === 'string' ? 'text' : 'number'"
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
                    <inline-svg
                        src="delete"
                        class="delete-icon"
                        title="Delete Range"
                        @click.stop.native="deletePair(index)"
                    ></inline-svg>
                </div>
            </div>
            <nitrozen-button class="add-btn" theme="secondary" @click="add"
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
    </div>
</template>

<script>
import inlinesvg from './adm-inline-svg';
import NoSSR from 'vue-no-ssr';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
const VJsoneditor = () => import('v-jsoneditor');

import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenInput,
    NitrozenRadio,
    strokeBtn
} from '@gofynd/nitrozen-vue';
export default {
    name: 'adm-meta-box',
    components: {
        'inline-svg': inlinesvg,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-radio': NitrozenRadio,
        VJsoneditor,
        'no-ssr': NoSSR
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
            type: [Array, Object],
            default: () => {
                return [];
            }
        },
        showJsonOnly: {
            type: Boolean,
            default: false
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
            json: [],
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
            if (isEmpty(this.meta) && this.arrMeta.length === 0) {
                this.arrMeta.push(this.newPair());
            }

            if (!isEmpty(this.meta)) {
                this.arrMeta = cloneDeep(this.meta);
            }
            this.json = cloneDeep(this.customJson);
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
            return this.arrMeta;
        },
        getJSON() {
            return this.json;
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
        ::v-deep .delete-icon svg {
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
