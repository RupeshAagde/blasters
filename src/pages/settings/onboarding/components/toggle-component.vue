<template>
    <div :class="`margin ${textClass}`">
        <div :class="`text inline apart ${textClass}`">
            <div class="inline v-center">
                <template
                    v-if="
                        lineItem.additionalParams &&
                            lineItem.additionalParams.logo
                    "
                >
                    <img
                        :src="lineItem.additionalParams.logo"
                        class="card-avatar"
                        alt="logo"
                    />
                </template>
                <div>
                    {{ lineItem.text }}
                    <nitrozen-tooltip
                        v-if="
                            lineItem.additionalParams &&
                                lineItem.additionalParams.infoText
                        "
                        :position="'top'"
                        :tooltipText="lineItem.additionalParams.infoText"
                    />
                </div>
            </div>
            <nitrozen-toggle
                v-model="lineItem.data.currentValue"
                :disabled="
                    lineItem.additionalParams
                        ? lineItem.additionalParams.disabled
                        : false
                "
            />
        </div>
        <div v-if="showLineItems" class="border-top nested-class">
            <div
                v-for="nestedItem in lineItem.data.lineItems"
                :key="nestedItem.id"
                class="nested-item"
            >
                <component-factory
                    ref="getData"
                    :lineItem="nestedItem"
                    :parentState="lineItem.data.currentValue"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { NitrozenToggleBtn, NitrozenTooltip } from '@gofynd/nitrozen-vue';
import safeAccess from 'safe-access';

export default {
    name: 'toggle-component',
    components: {
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-toggle': NitrozenToggleBtn,
        ComponentFactory: () => import('./component-factory.vue')
    },
    props: {
        lineItem: {
            type: Object
        },
        parentState: {
            type: Boolean
        },
        textClass: {
            type: String
        },
        alwaysDisplayLineItems: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        showLineItems() {
            return (
                this.alwaysDisplayLineItems ||
                (safeAccess(this.lineItem, 'data.currentValue') &&
                    safeAccess(this.lineItem, 'data.lineItems[0]'))
            );
        }
    },
    watch: {
        parentState: function(newVal) {
            if (!newVal) {
                this.lineItem.data.currentValue = newVal;
            } else {
                this.lineItem.data.currentValue = this.lineItem.data.isSelected;
            }
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            this.lineItem.data.currentValue =
                this.lineItem.data.currentValue && this.parentState;
        },
        saveForm() {
            let data = {
                enabled: this.lineItem.data.currentValue
            };
            if (
                this.lineItem.data.currentValue &&
                this.lineItem.data.lineItems
            ) {
                this.lineItem.data.lineItems.map((item, index) => {
                    data[item.id] = this.$refs.getData[index].saveForm();
                });
            }
            return data;
        }
    }
};
</script>

<style lang="less" scoped>
.margin {
    margin: 16px 0px;
}

.text {
    font-weight: 400;
    font-size: 14px;
    margin: 0px 24px;
    &.group-header {
        margin: 16px 24px;
        font-weight: 600;
        font-size: 14px;
    }
}
.inline {
    display: flex;

    &.apart {
        justify-content: space-between;
    }
    &.v-center {
        align-items: center;
    }
}

.border-top {
    margin-top: 10px;
    border-top: 1px solid @Iron;
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

.group-header {
    font-weight: 600;
    font-size: 14px;
}
::v-deep .nitrozen-tooltiptext {
    background-color: #333333;
    color: @White;
    width: 300px;
    text-align: left;
    font-size: 12px;
    font-weight: 400;
}
</style>
