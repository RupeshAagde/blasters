<template>
    <div class="section-prop-container">
        <component
            v-bind:is="require(`./${prop_schema.type}`).default"
            @change="onChange($event)"
            @search-input="onSearchInputChange($event)"
            v-bind="{ prop_schema, prop, name, page, items }"
            v-if="propSchema.display"
        ></component>
        <nitrozen-error v-if="error">{{error}}</nitrozen-error>
    </div>
</template>

<script>
import { NitrozenError } from "@gofynd/nitrozen-vue";
export default {
    props: {
        prop_schema: {
            type: Object,
            default: () => {}
        },
        prop: {
            type: Object,
            default: () => {}
        },
        page: {
            type: Object,
            default: () => {}
        },
        name: '',
        items: {
            type: Array,
            default: () => []
        },
        error: {
            type: String
        }
    },
    components: {
        'nitrozen-error' : NitrozenError
    },
    computed: {
        propSchema() {
            return this.prop_schema;
        }
    },
    methods: {
        onChange(e) {
            this.$emit('change', e);
        },
        onSearchInputChange(e) {
            this.$emit('searchInputChange', e);
        }
    }
}
</script>

<style lang="less" scoped>
.section-prop-container {
    .sections {
        width: 100%;
        .section {
            align-items: center;
            display: flex;
            padding: 15px 10px;
            height: 64px;
            box-sizing: border-box;
            border-bottom: 1px #dadada solid;
            .handle {
                height: 31px;
                cursor: grab;
            }
            .title {
                cursor: pointer;
            }
        }
    }
}
</style>