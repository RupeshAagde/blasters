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
        <vue-slider
            :tooltip="'always'"
            :value="settings.value"
            :min="settings.min"
            :max="settings.max"
            :interval="settings.interval"
            :contained="settings.contained"
            :tooltipPlacement="'bottom'"
            :tooltip-formatter="`{value} ${settings.unit}`"
            @change="onChange($event)"
        ></vue-slider>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component';
import 'vue-slider-component/theme/default.css';
import { NitrozenTooltip } from '@gofynd/nitrozen-vue';

export default {
    props: ['prop_schema', 'prop', 'name'],
    components: {
        'nitrozen-tooltip': NitrozenTooltip,
        'vue-slider': VueSlider
    },
    mounted() {
        this.mValue = this.prop.value || this.prop_schema.default || 0;
        this.settings = this.transformPropToSettings(this.prop);
    },
    watch: {
        prop: {
            deep: true,
            handler() {
                this.mValue = this.prop.value || this.prop_schema.default || 0;
                this.settings = this.transformPropToSettings(this.prop);
            }
        }
    },
    data() {
        return {
            mValue: '',
            settings: {}
        };
    },
    methods: {
        transformPropToSettings(prop) {
            return {
                value: prop.value || this.prop_schema.default,
                min: this.prop_schema.min,
                max: this.prop_schema.max,
                interval: this.prop_schema.step,
                unit: this.prop_schema.unit || '',
                contained: true
            };
        },
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
