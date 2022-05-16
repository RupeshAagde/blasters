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
        <nitrozen-radio
            :name="name"
            v-model="mValue"
            :radioValue="option.value"
            :value="option.value"
            :title="option.text"
            v-for="(option, index) in prop_schema.options"
            :key="index"
            @change="onChange($event)"
            >{{ option.text }}</nitrozen-radio
        >
    </div>
</template>

<script>
import { NitrozenRadio, NitrozenTooltip } from '@gofynd/nitrozen-vue';

export default {
    components: {
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-radio': NitrozenRadio
    },
    props: ['prop_schema', 'prop', 'name'],
    mounted() {
        this.mValue = this.prop.value || this.prop_schema.default || '';
    },
    watch: {
        prop: {
            deep: true,
            handler() {
                this.mValue = this.prop.value || this.prop_schema.default || '';
            }
        }
    },
    data() {
        return {
            mValue: ''
        };
    },
    methods: {
        onChange(e) {
            this.$emit('change', {
                type: this.prop_schema.type,
                value: e
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
