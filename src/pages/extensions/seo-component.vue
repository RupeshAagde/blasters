<template>
    <div>
        <div class="fields" v-if="!isCollapsed">
            <div class="left-panel">
                <div class="input-wrapper">
                    <nitrozen-input
                        label="Title"
                        :value="value.title"
                        class="input title"
                        @input="update({ title: $event })"
                    ></nitrozen-input>
                    <div class="n-input-label-container">
                        <label class="n-input-label">
                            {{ (value.title && value.title.length) || '0' }} of
                            70 characters used
                        </label>
                    </div>
                </div>
                <div class="input-wrapper">
                    <nitrozen-input
                        label="Description"
                        :value="value.description"
                        type="textarea"
                        class="input input-description"
                        @input="update({ description: $event })"
                    ></nitrozen-input>
                    <div class="n-input-label-container">
                        <label class="n-input-label">
                            {{
                                (value.description &&
                                    value.description.length) ||
                                '0'
                            }}
                            of 320 characters used
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <div class="vue-google-serp">
            <div class="n-input-label-container">
                <label class="n-input-label"> Preview </label>
            </div>
            <div class="preview">
                <h3>{{ titlePreview || 'Title' }}</h3>
                <cite>{{ url || 'https://' }} </cite>
                <p>{{ descriptionPreview || 'Breif description about the' }}</p>
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.fields {
    display: flex;
    flex-direction: row;
    .left-panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 620px;
        .input-wrapper {
            margin: 10px 0px;
            .input {
                margin-bottom: 5px;
            }
        }
    }
}

.vue-google-serp {
    font-family: arial, sans-serif !important;
    margin: 10px 0px;
    padding: 0;
    .preview {
        padding: 10px;
        max-width: 600px;
        border: 1px solid #ddd;
        border-radius: 5px;
    }
    h3 {
        word-break: break-word;
        font-family: arial, sans-serif !important;
        margin: 0;
        color: rgb(26, 13, 171);
        font-size: 18px;
        font-weight: 400;
        line-height: 26px;
    }
    p {
        word-break: break-word;
        font-family: arial, sans-serif !important;
        margin: 0;
        color: rgb(84, 84, 84);
        font-size: 14px;
        line-height: 22.12px;
    }
    cite {
        word-break: break-word;
        font-family: arial, sans-serif !important;
        margin: 0;
        font-style: normal;
        height: 14px;
        color: rgb(0, 102, 33);
        font-size: 14px;
        line-height: 18.2px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>

<script>
import { NitrozenInput } from '@gofynd/nitrozen-vue';

export default {
    name: 'seo-component',
    components: {
        'nitrozen-input': NitrozenInput,
    },
    props: {
        value: {
            type: Object,
            default() {
                return {
                    title: '',
                    description: '',
                };
            },
        },
        url: {
            type: String,
            default: '',
        },
        isCollapsed: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        titlePreview() {
            if (this.value.title && this.value.title.length > 70) {
                return this.value.title.substr(0, 69) + '…';
            }
            return this.value.title;
        },
        descriptionPreview() {
            if (this.value.description && this.value.description.length > 320) {
                return this.value.description.substr(0, 319) + '…';
            }
            return this.value.description;
        },
    },
    methods: {
        update(data) {
            this.$emit('input', { ...this.value, ...data });
        },
    },
};
</script>
