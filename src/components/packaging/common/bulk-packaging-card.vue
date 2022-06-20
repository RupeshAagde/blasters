<template>
    <div class="bulk-card-container">
        <div class="bulk-card-info">
            <span>Group {{ currentIndex + 1 }}</span>
            <div @click="handleDelete(currentIndex)">
                <inline-svg :src="'delete'" class="delete-icon" />
            </div>
        </div>
        <div class="bulk-card-header">
            <nitrozen-dropdown
                :label="'Choose the Categories Config'"
                :tooltip="
                    'Select the category whose products can make use of this packaging material in case of a bulk order'
                "
                :placeholder="'Select'"
                :items="searchableCategoryList"
                @change="(val) => handleDropDownSelect(currentIndex, val)"
            />
            <div class="default-container">
                Default
                <nitrozen-toggle-btn
                    :value="inputs.toggle.val"
                    @change="
                        handleToggleChange(currentIndex, inputs.toggle.val)
                    "
                    :disabled="inputs.toggle.disabled"
                />
            </div>
        </div>
        <div class="bulk-card-body">
            <div class="bulk-card-textfield-group">
                <p>
                    Volumetric Weight
                    <nitrozen-tooltip
                        position="top"
                        tooltipText="The approx. weight of the bulk package, where max. weight is (Length*Breadth*Height/5000) in kg."
                    />
                </p>
                <div class="row-group">
                    <div
                        v-for="(input, index) of Object.keys(
                            inputs.volumetricWeight
                        )"
                        :key="'volumetric-field' + index"
                        :id="'volumetric-field' + index"
                        class="row-group-input"
                    >
                        <nitrozen-input
                            class="input w-l"
                            :label="inputs.volumetricWeight[input].label"
                            :required="true"
                            :placeholder="
                                inputs.volumetricWeight[input].placeholder
                            "
                            v-model="inputs.volumetricWeight[input].value"
                            type="number"
                            @blur="
                                handleBlur(
                                    'volumetricWeight',
                                    input,
                                    currentIndex
                                )
                            "
                            @input="
                                (val) =>
                                    handleChange(
                                        'volumetricWeight',
                                        input,
                                        val,
                                        currentIndex
                                    )
                            "
                        />
                        <nitrozen-error
                            v-if="inputs.volumetricWeight[input].error"
                        >
                            {{ inputs.volumetricWeight[input].error }}
                        </nitrozen-error>
                    </div>
                </div>
            </div>
            <div class="bulk-card-textfield-group">
                <p>
                    Quantity
                    <nitrozen-tooltip
                        position="top"
                        tooltipText="The min. and max. quantity of products belonging to the category, that would fit together in the bulk package"
                    />
                </p>
                <div class="row-group">
                    <div
                        v-for="(input, index) of Object.keys(inputs.quantity)"
                        :key="'quantity-field' + index"
                        :id="'quantity-field' + index"
                        class="row-group-input"
                    >
                        <nitrozen-input
                            class="input w-l"
                            :label="inputs.quantity[input].label"
                            :required="true"
                            :placeholder="inputs.quantity[input].placeholder"
                            v-model="inputs.quantity[input].value"
                            type="number"
                            @blur="handleBlur('quantity', input, currentIndex)"
                            @input="
                                (val) =>
                                    handleChange(
                                        'quantity',
                                        input,
                                        val,
                                        currentIndex
                                    )
                            "
                        />
                        <nitrozen-error v-if="inputs.quantity[input].error">
                            {{ inputs.quantity[input].error }}
                        </nitrozen-error>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenToggleBtn,
    NitrozenDropdown,
    NitrozenTooltip
} from '@gofynd/nitrozen-vue';
import InlineSvg from '../../common/inline-svg.vue';
export default {
    name: 'bulk-packaging-card',
    components: {
        NitrozenInput,
        NitrozenError,
        NitrozenToggleBtn,
        NitrozenDropdown,
        InlineSvg,
        NitrozenTooltip
    },
    props: {
        inputs: {
            type: Object
        },
        currentIndex: {
            type: Number
        },
        handleChange: {
            type: Function
        },
        handleBlur: {
            type: Function
        },
        handleDelete: {
            type: Function
        },
        handleDropDownSelect: {
            type: Function
        },
        handleToggleChange: {
            type: Function
        }
    }
};
</script>

<style lang="less">
@import '../../../less/packaging/bulk-packaging-card.less';
</style>
