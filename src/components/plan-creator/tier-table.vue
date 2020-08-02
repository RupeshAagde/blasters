<template>
    <div>
        <div style="width: calc(80% - 25px);" class="form-row">
            <div class="form-item">
                <nitrozen-dropdown
                    :label="'Currency'"
                    style="width:180px;"
                    :items="currentCurrency"
                    v-model="formData.currency"
                    :searchable="true"
                    @searchInputChange="
                        (e) => (this.searchCurrency = e && e.text ? e.text : '')
                    "
                ></nitrozen-dropdown>
            </div>
            <div class="form-item right-align">
                <div class="text-btn cl-RoyalBlue bold-xs" @click="addTier">
                    + ADD TIER
                </div>
            </div>
        </div>
        <div style="width: 80%;" class="tier-table">
            <div class="tb-row">
                <div class="tb-cell tb-head"></div>
                <div class="tb-cell tb-head">FROM USAGE</div>
                <div class="tb-cell tb-head">USAGE UPTO</div>
                <div class="tb-cell tb-head">PER UNIT</div>
                <div class="tb-cell tb-head">FLAT FEES</div>
                <div class="tb-cell tb-head remove-clm">
                    <span>
                        <inline-svg src="delete"></inline-svg>
                    </span>
                </div>
            </div>
            <div class="tb-row" v-for="(tier, index) in value" :key="index">
                <div class="tb-cell">{{ getFirstColumn(index) }}</div>
                <div class="tb-cell">
                    <nitrozen-input
                        :type="'number'"
                        :value="
                            value[index - 1] ? value[index - 1].up_to + 1 : 0
                        "
                        :disabled="true"
                    ></nitrozen-input>
                </div>
                <div class="tb-cell">
                    <nitrozen-input
                        v-if="value.length - 1 > index"
                        :type="'number'"
                        v-model="tier.up_to"
                        :allowNegative="false"
                    ></nitrozen-input>
                    <nitrozen-input
                        v-else
                        :value="'∞'"
                        :disabled="true"
                    ></nitrozen-input>
                </div>
                <div class="tb-cell">
                    <nitrozen-input
                        v-model="tier.unit_amount"
                        :type="'number'"
                        :allowNegative="false"
                        :showPrefix="true"
                        :prefix="currency"
                    ></nitrozen-input>
                </div>
                <div class="tb-cell">
                    <nitrozen-input
                        v-model="tier.flat_amount"
                        :type="'number'"
                        :allowNegative="false"
                        :showPrefix="true"
                        :prefix="currency"
                    ></nitrozen-input>
                </div>
                <div class="tb-cell remove-clm">
                    <span
                        :class="{ hidden: index < 2 }"
                        @click="removeTier(index)"
                    >
                        <inline-svg src="cross-black"></inline-svg>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.hidden {
    visibility: hidden;
}
.tier-table {
    .nitrozen-dropdown-label {
        display: none;
    }
    .tb-row {
        display: flex;
        .tb-head {
            text-align: left;
            line-height: 27px;
            &.tb-cell:last-child {
                background-color: transparent;
                span {
                    visibility: hidden;
                }
            }
        }
        &:first-child {
            .tb-cell {
                background-color: #f7fafc;
            }
        }
        .tb-cell {
            display: flex;
            .font-size(@font-xxxs);
            flex: 1;
            align-items: center;
            box-sizing: border-box;
            ::v-deep .nitrozen-input-prefix {
                background-color: transparent;
                border-right-color: transparent;
                padding-top: 12px;
            }
            &:first-child {
                padding-left: 6px;
                background-color: #f7fafc;
            }
            > span {
                cursor: pointer;
            }
            &.remove-clm {
                flex: 0;
            }
        }
    }
}
</style>

<script>
import { NitrozenInput, NitrozenDropdown } from '@gofynd/nitrozen-vue';
import { InlineSvg } from '../../components/common/';
export default {
    name: 'tier-table',
    props: {
        formData: {
            type: Object
        },
        value: {
            type: Array
        },
        graduated: {
            type: Boolean
        },
        currency: {
            type: String
        },
        currencies: {
            type: Array
        }
    },
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-dropdown': NitrozenDropdown,
        'inline-svg': InlineSvg
    },
    data() {
        return {
            searchCurrency: ''
        };
    },
    mounted() {
        this.addTier();
        this.addTier();
    },
    unmounted() {
        this.value.length = 0;
    },
    computed: {
        currentCurrency() {
            if (!this.searchCurrency) {
                return this.currencies;
            }
            const regex = new RegExp(this.searchCurrency, 'gi');
            return this.currencies.filter((it) => regex.test(it.text));
        }
    },
    methods: {
        addTier() {
            this.value.push({
                up_to: 0,
                unit_amount: 0,
                flat_amount: 0
            });
        },
        removeTier(index) {
            this.value.splice(index, 1);
        },
        getFirstColumn(index) {
            if (!this.graduated) {
                return 'TOTAL UNITS';
            }
            return `FOR THE ${!index ? 'FIRST' : 'NEXT'}`;
        }
    }
};
</script>
