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
            :placeholder="placeholder"
            @change="onChange($event)"
            :multiple="multipleEnabled"
            :searchable="searchEnabled"
            :value="(prop || {}).value"
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
    props: ['prop_schema', 'prop', 'name', 'items', 'item_details'],
    data() {
        return {
            selectedValues: [...this.item_details]
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
        },
        selectedItems() {
            return this.selectedValues.map(opt=>opt.extension_id || opt._id);
        }
    },
    methods: {
        onChange(e) {
            if(this.multipleEnabled) {
                /* Update addedValues and selectedValues with the values added or removed */
                for(let idx in this.selectedItems) {
                    let id = this.selectedItems[idx];
                    if(!e.includes(id)) {
                        this.selectedValues.splice(idx, 1);
                    }
                }
                
                /* Add new values to the addedValues and selectedValues array */
                let remainingValues = e.filter(id => !this.selectedItems.includes(id));
                for(let id of remainingValues) {
                    let detail = this.prop_schema.options.find(option => option._id === id);
                    if(!detail && this.prop_schema.id === 'extension') {
                        detail = this.prop_schema.options.find(option => option.extension_id === id);
                    }
                    this.selectedValues.push(detail);
                }

                this.$emit('change', {
                    type: this.prop_schema.type,
                    value: e,
                    details: this.selectedValues
                });
            } else {
                let detail = this.prop_schema.options.find(option => option._id === e);
                this.$emit('change', {
                    type: this.prop_schema.type,
                    value: e,
                    details: detail
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
