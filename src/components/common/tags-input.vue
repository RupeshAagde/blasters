<template>
    <div>
        <div>
            <span class="nitrozen-label n-input-label">{{ label }}</span>
        </div>
        <div class="input-text tags" @click="focusTextbox">
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
                    :placeholder="placeHolder"
                    ref="chipInput"
                    type="text"
                    class="chip-input cl-Mako light-xs"
                    @keydown="handleKeyDown"
                    v-model="chipInput"
                />
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
    cursor: text;
    .nitrozen-chip {
        margin: 5px;
        height: 30px;
        padding: 0 9px;
        line-height: 30px;
    }
    .chip-input {
        width: 200px;
        border: none;
        font-family: Poppins, sans-serif;
        font-weight: 400;
    }
}
</style>

<script>
import { NitrozenChips, NitrozenInline } from '@gofynd/nitrozen-vue';

export default {
    name: 'tags-input',
    props: {
        value: {
            type: Array
        },
        label: {
            type: String,
            default: 'Tags'
        },
        maxTags: {
            type: Number,
            default: 2
        }
    },
    components: {
        'nitrozen-chip': NitrozenChips,
        'nitrozen-inline': NitrozenInline
    },
    data() {
        return {
            tags: this.value,
            chipInput: ''
        };
    },
    computed: {
        placeHolder() {
            return !this.tags.length
                ? 'For e.g. order (upto ' + this.maxTags + ' tags)'
                : '';
        }
    },
    methods: {
        handleKeyDown(evt) {
            if (
                event.keyCode == 32 ||
                event.keyCode == 13 ||
                event.keyCode == 44 ||
                event.keyCode == 9 ||
                event.keyCode == 188
            ) {
                this.addChip(evt);
            }
            if (event.keyCode == 8 && !this.chipInput) {
                if (this.tags.length) {
                    this.tags.pop();
                }
            }
        },
        removeChip(index) {
            this.tags.splice(index, 1);
            this.$emit('input', this.tags);
        },
        addChip(event) {
            if (this.chipInput) {
                if (
                    this.tags.filter((it) => it === this.chipInput).length ===
                        0 &&
                    this.tags.length <= this.maxTags
                )
                    this.tags.push(this.chipInput);
                this.chipInput = '';
            }
            event.preventDefault();
            this.$emit('input', this.tags);
        },
        focusTextbox(e) {
            this.$refs['chipInput'].focus();
        }
    }
};
</script>
