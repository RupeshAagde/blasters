<template>
    <div class="text-container">
        <span class="title">
            {{ prop_schema.label }}
            <span>
                <nitrozen-tooltip :position="'bottom'" v-if="prop_schema.info">
                    <span class="desc">{{ prop_schema.info }}</span>
                </nitrozen-tooltip>
            </span>
        </span>
        <input
            type="text"
            class="n-input input-text"
            :value="mValue"
            @input="onChange($event)"
        />
    </div>
</template>

<script>
import { NitrozenTooltip } from '@gofynd/nitrozen-vue';

export default {
    props: ['prop_schema', 'prop', 'name'],
    components: {
        'nitrozen-tooltip': NitrozenTooltip
    },
    mounted() {
        this.mValue = ((this.prop.value === null || this.prop.value === undefined)? this.prop_schema.default: this.prop.value) || '';
    },
    data() {
        return {
            mValue: ''
        };
    },
    methods: {
        onChange(e) {
            this.mValue = e.target.value;
            this.$emit('change', {
                type: this.prop_schema.type,
                value: e.target.value
            });
        }
    }
};
</script>

<style lang="less" scoped>
.text-container {
    .title {
        margin-bottom: 7px;
        display: inline-block;
    }
    padding: 15px 7px;
}
</style>
