<template>
    <div class="page-container">
        <div class="cl-Mako bold-md top-headers">Details</div>
        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :label="'Name *'"
                    v-model="formData.name"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['name'] }">{{
                    errors['name'] || '-'
                }}</nitrozen-error>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <nitrozen-input
                    :label="'Description'"
                    v-model="formData.description"
                ></nitrozen-input>
                <nitrozen-error v-bind:class="{ visible: errors['desc'] }">{{
                    errors['desc'] || '-'
                }}</nitrozen-error>
            </div>
        </div>

        <div class="form-row">
            <div class="form-item">
                <div>
                    <span class="nitrozen-label">Tags</span>
                </div>
                <div class="input-text tags">
                    <div class="chips-input">
                        <nitrozen-chip
                            class="chip-wrapper"
                            v-for="(item, index) in tags"
                            :key="index"
                        >
                            {{ item }}
                            <nitrozen-inline
                                :icon="'cross'"
                                class="nitrozen-icon"
                                v-on:click="removeChip(index)"
                            ></nitrozen-inline>
                        </nitrozen-chip>
                        <input
                            placeholder="For e.g. order (upto 2 tags)"
                            ref="chipInput"
                            type="text"
                            class="chip-input cl-Mako light-xs"
                            @keydown.enter="addChip"
                            @keydown.tab="addChip"
                            @keydown.space="addChip"
                            v-model="chipInput"
                        />
                    </div>
                </div>
                <nitrozen-error>-</nitrozen-error>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
input:focus,
textarea:focus,
select:focus {
    outline: none;
}
.nitrozen-label {
    color: #9b9b9b;
    font-family: Poppins, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}

.tags {
    border: 1px solid @Iron;
    border-radius: 4px;
    min-height: 72px;
    padding: 6px;
    .nitrozen-chip {
        margin: 5px;
        height: 30px;
        padding: 0 9px;
        font-size: 12px;
        line-height: 30px;
    }
    .chip-input {
        width: 200px;
        border: none;
        font-family: Poppins, sans-serif;
        font-size: 11px;
        font-weight: 400;
    }
}
</style>

<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';

export default {
    name: 'detail-section',
    components: {
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-checkbox': NitrozenCheckBox,
        'nitrozen-chip': NitrozenChips,
        'nitrozen-inline': NitrozenInline
    },
    props: {
        formData: {
            type: Object
        },
        errors: {
            type: Object
        }
    },
    data() {
        return {
            chipInput: ''
        };
    },
    computed: {
        tags() {
            return this.formData.tags;
        }
    },
    methods: {
        removeChip(index) {
            this.tags.splice(index, 1);
        },
        addChip(event) {
            if (this.chipInput) {
                if (
                    this.tags.filter((it) => it === this.chipInput).length ===
                        0 &&
                    this.tags.length < 2
                )
                    this.tags.push(this.chipInput);
                this.chipInput = '';
            }
            event.preventDefault();
        }
    }
};
</script>
