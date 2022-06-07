<template>
    <div class="bulk-card-container">
        <div class="bulk-card-info">
            <span>Group {{ currentIndex + 1 }}</span>
            <div @click="handleDelete(currentIndex)">
                <inline-svg :src="'delete'" class="delete-icon" />
            </div>
        </div>
        <div class="bulk-card-header">Category config and toggle</div>
        <div class="bulk-card-body">
            <div class="bulk-card-textfield-group">
                <p>Volumetric Weight</p>
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
                <p>Quantity</p>
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
    NitrozenDropdown
} from '@gofynd/nitrozen-vue';
import InlineSvg from '../../common/inline-svg.vue';
export default {
    name: 'bulk-packaging-card',
    components: {
        NitrozenInput,
        NitrozenError,
        NitrozenToggleBtn,
        NitrozenDropdown,
        InlineSvg
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
        }
    }
};
</script>

<style lang="less">
@import '../../../less/packaging/bulk-packaging-card.less';
</style>
