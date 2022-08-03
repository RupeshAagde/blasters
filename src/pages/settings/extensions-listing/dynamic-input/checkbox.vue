<template>
    <div class="text-container">
        <nitrozen-checkbox v-model="mValue" @change="onChange($event)">
            {{ prop_schema.label }}
            <span>
                <nitrozen-tooltip :position="'bottom'" v-if="prop_schema.info">
                    <span class="desc">{{ prop_schema.info }}</span>
                </nitrozen-tooltip>
            </span>
        </nitrozen-checkbox>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenCheckBox, NitrozenTooltip
} from '@gofynd/nitrozen-vue';

export default {
    name: 'dynamic-input-checkbox',
    components: {
        'nitrozen-checkbox': NitrozenCheckBox, 
        NitrozenTooltip
    },
    props: ['prop_schema', 'prop', 'name'],
    mounted() {
        if (typeof this.prop.value == 'boolean') {
            this.mValue =
                typeof this.prop.value !== 'undefined'
                    ? this.prop.value
                    : this.prop_schema.default;
        } else {
            this.mValue = this.prop_schema.default;
        }
    },
    watch: {
        prop: {
            deep: true,
            handler() {
                if (typeof this.prop.value == 'boolean') {
                    this.mValue =
                        typeof this.prop.value !== 'undefined'
                            ? this.prop.value
                            : this.prop_schema.default;
                } else {
                    this.mValue = this.prop_schema.default;
                }
            }
        }
    },
    data() {
        return {
            mValue: false
        };
    },
    methods: {
        onChange(e) {
            this.$emit('change', {
                type: this.prop_schema.type,
                value: e.target.checked
            });
        }
    }
}
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