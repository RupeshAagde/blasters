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
        <nitrozen-dropdown
            :items="prop_schema.options"
            v-model="mValue"
            @change="onChange($event)"
        ></nitrozen-dropdown>
    </div>
</template>

<script>
import { NitrozenDropdown, NitrozenTooltip } from '@gofynd/nitrozen-vue';

export default {
    components: {
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-dropdown': NitrozenDropdown
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
/deep/.nitrozen-dropdown-container .nitrozen-options {
    z-index: 6;
}
</style>
