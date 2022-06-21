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
            :placeholder="placeholder"
            @change="onChange($event)"
            :multiple="multipleEnabled"
            :searchable="searchEnabled"
            :value="mValue"
            @input="onInput($event)"
            @searchInputChange="onSearchInputChange($event)"
        ></nitrozen-dropdown>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenDropdown, NitrozenTooltip, NitrozenChips } from '@gofynd/nitrozen-vue';

/* Helper imports */
import { debounce } from '@/helper/utils';

export default {
    components: {
        'nitrozen-tooltip': NitrozenTooltip,
        'nitrozen-dropdown': NitrozenDropdown
    },
    props: ['prop_schema', 'prop', 'name', 'items'],
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
            mValue: '',
            selectedValues: [],
            addedValues: []
        };
    },
    computed: {
        multipleEnabled() {
            return this.prop_schema.multiple || false;
        },
        searchEnabled() {
            return this.prop_schema.search || false;
        },
        placeholder() {
            return this.prop_schema.placeholder || '';
        }
    },
    methods: {
        onChange(e) {
            if(this.multipleEnabled) {
                /* Update addedValues and selectedValues with the values added or removed */
                for(let idx in this.addedValues) {
                    let id = this.addedValues[idx];
                    if(!e.includes(id)) {
                        this.addedValues.splice(idx, 1);
                        this.selectedValues.splice(idx, 1);
                    }
                }

                if(this.addedValues.length === 0) {
                    /* If addedValues is empty */
                    for(let id of e) {
                        let detail = this.prop_schema.options.find(option => option._id === id);
                        if(!detail && this.prop_schema.id === 'extension') {
                            detail = this.prop_schema.options.find(option => option.extension_id === id);
                        }
                        this.selectedValues.push(detail);
                        this.addedValues.push(id);
                    }
                } else {
                    /* Add new values to the addedValues and selectedValues array */
                    let remainingValues = e.filter(id => !this.addedValues.includes(id));
                    for(let id of remainingValues) {
                        this.selectedValues.push(this.prop_schema.options.find(option => option._id === id));
                        this.addedValues.push(id);
                    }
                }

                this.$emit('change', {
                    type: this.prop_schema.type,
                    value: e,
                    details: this.selectedValues
                });
            } else {
                this.$emit('change', {
                    type: this.prop_schema.type,
                    value: e
                });
            }
        },
        onInput(e) {
            this.$emit('input', {
                type: this.prop_schema.type,
                value: e
            });
        },
        onSearchInputChange(e) {
            debounce(() => {
                this.$emit('search-input', {
                    type: this.prop_schema.type,
                    value: e
                });
            }, 500)();
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
