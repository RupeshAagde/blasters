<template>
    <div>
        <page-header
            title="Footer"
            @backClick="$router.push({ name: 'settings' })"
        >
            <div
                class="publish-status status-text bold-xs"
                :class="{ 'publish-status-disabled': !published }"
                @click="published = !published; changeState()"
            >
                {{ published ? 'Published' : 'Unpublished' }}
            </div>
            <nitrozen-toggle-btn v-model="published" @change="changeState()"></nitrozen-toggle-btn>
            <span class="actions"
                ><nitrozen-button
                    class="actions"
                    @click="save"
                    v-flatBtn
                    theme="secondary"
                    ref="save-btn"
                >
                    Save
                </nitrozen-button></span
            >
        </page-header>
        <div class="form page-container">
            <div class="form-container">
                <section class="section">
                    <h3 class="cl-Mako bold-md">Details</h3>
                    <!-- Title -->
                    <div class="input">
                        <nitrozen-input
                            label="Title"
                            placeholder="Enter Page Title"
                            v-model="title.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="title.showerror"
                        >
                            {{ title.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- Description -->
                    <div class="input">
                        <nitrozen-input
                            type="textarea"
                            label="Description"
                            :maxlength="100"
                            placeholder="Enter Page Description"
                            v-model="description.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="description.showerror"
                        >
                            {{ description.errortext }}
                        </nitrozen-error>
                    </div>

                    <adm-form-input
                        class="custom-form-input"
                        label="Tags"
                        :custom="true"
                        name="tags"
                    >
                        <div class="input-text tags" @click="focusOnChipInput">
                            <nitrozen-chips
                                v-for="(item, index) in tags"
                                :key="'chips_' + index"
                            >
                                {{ item.display }}
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    v-on:click="removeChip(index)"
                                ></nitrozen-inline>
                            </nitrozen-chips>
                            <input
                                type="text"
                                placeholder="E.g. Featured"
                                ref="chipInput"
                                class="chip-input cl-Mako light-xs"
                                @blur="addChip"
                                @keydown.enter="addChip"
                                @keydown.tab="addChip"
                                v-model="chipInput"
                            />
                        </div>
                    </adm-form-input>
                </section>

                <!-- <section class="section">
                    <h3 class="cl-Mako bold-md">Advanced</h3>

                    <page-options
                        v-for="(pageCssOption, index) in pageCssOptions"
                        :options="pageCssOption"
                        :key="index"
                        @add-field="addOption"
                        @delete-field="deleteOption"
                    ></page-options>
                </section> -->
                <loader
                    v-if="inProgress || pageLoading"
                    class="loading"
                ></loader>
            </div>
            <div class="page-editor-wrapper" v-show="!pageLoading">
                <div class="page-editor">
                    <div>
                        <rawhtml-editor
                            v-model="content"
                            ref="rawhtml"
                        ></rawhtml-editor>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { PageHeader, FormInput, PageOptions, Loader } from '@/components/common/';
import rawhtmlEditor from './page-editor/rawhtml-editor';
import {
    NitrozenToggleBtn,
    NitrozenButton,
    strokeBtn,
    flatBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';
import InternalSettingsService from '@/services/internal-settings.service';

export default {
    name: 'custom-footer',
    components: {
        PageHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-form-input': FormInput,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline,
        'page-options': PageOptions,
        'rawhtml-editor': rawhtmlEditor,
        Loader
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            published: false,
            editMode: false,
            title: this.getInitialValue(''),
            description: this.getInitialValue(''),
            pageCssOptions: [
                {
                    key: 'width',
                    value: '',
                    unit: 'px',
                    units: [
                        {
                            text: 'px',
                            value: 'px'
                        },
                        { text: '%', value: '%' }
                    ]
                }
            ],
            tags: [],
            chipInput: '',
            pageLoading: false,
            inProgress: false,
            content: ''
        };
    },
    mounted() {
        this.pageLoading = true;
        this.getFooterList().then(({ data }) => {
            this.pageLoading = false;
            if (data._id) {
                this.customFooter = data;
                this.published = data.published;
                this.title.value = data.title;
                this.description.value = data.description;
                this.content = data.content[0].value;
                this.tags = data.tags;
            }
        });
    },

    methods: {
        getInitialValue(value = '') {
            return {
                showerror: false,
                value,
                errortext: ''
            };
        },
        focusOnChipInput() {
            this.$refs['chipInput'].focus();
        },
        addChip(event) {
            if (this.chipInput) {
                if (
                    this.tags.filter((it) => it.display === this.chipInput)
                        .length === 0
                )
                    this.tags.push({ display: this.chipInput });
                this.chipInput = '';
            }
            event.preventDefault();
        },
        removeChip(index) {
            this.tags.splice(index, 1);
        },
        addOption() {
            this.pageCss.push({ key: '', value: '' });
        },
        deleteOption(index) {
            this.pageCss.splice(index, 1);
        },
        getFooterList() {
            return InternalSettingsService.getFooterList();
        },
        save() {
            const body = {
                tags: this.tags || [],
                published: this.published,
                content: [
                    {
                        type: 'rawhtml',
                        value: this.content
                    }
                ],
                title: this.title && this.title.value || 'custom-footer',
                description: this.description && this.description.value || 'custom-footer',
                footer_meta: [],
                type: 'rawhtml'
            };
            this.inProgress = true
            if (this.customFooter && this.customFooter._id) {
                return InternalSettingsService.saveFooter(
                    body,
                    this.customFooter._id
                )
                    .then((res) => {
                        this.$snackbar.global.showSuccess('Saved Successfully');
                        this.$router.push({ name: 'settings' })
                    })
                    .catch((err) => {
                        this.$snackbar.global.showError('Failed to save');
                    }).finally(() => {
                        this.inProgress = false
                    })
            }
            return InternalSettingsService.createFooter(body)
                .then((res) => {
                    this.$snackbar.global.showSuccess('Saved Successfully');
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to save');
                }).finally(() => {
                        this.inProgress = false
                    })
        },
        changeState(){
            if(this.customFooter && this.customFooter._id){
                this.save();
            }
        }
    }
};
</script>
<style lang="less" scoped>
.publish-status {
    line-height: 56.5px;
    cursor: pointer;
    color: @RoyalBlue;
    -webkit-font-smoothing: antialiased;
    @media @mobile {
        line-height: 20px;
    }
}
.publish-status-disabled {
    color: @DustyGray2;
}
.actions {
    margin-top: 5px;
    padding-left: 24px;
}
.form.page-container {
    display: flex;
    flex-flow: row-reverse;
    width: 100%;
    margin: 58.4px 0px 24px 0px;
    background-color: @Alabaster2;
    padding: 0;
    @media @mobile {
        display: block;
        margin-top: 48px;
    }
}
.form-container {
    width: 298px;
    margin: 12px 24px 12px 12px;
    height: fit-content;
    @media @mobile {
        width: 100%;
        margin: 0;
    }
    .input {
        padding: 6px 0;
    }
    section.section {
        padding: 24px;
        background: #fff;
        border: 1px solid @WhiteSmoke;
        border-radius: 8px;
        margin: 12px 0;
    }
    ::v-deep .link-container {
        padding: 12px;
        border: 1px solid @LightGray;
        border-radius: 3px;
        .link {
            white-space: normal;
            word-break: break-all;
        }
    }
}
.tags {
    border: 1px solid @Iron;
    border-radius: 4px;
    min-height: 72px;
    .nitrozen-chip {
        margin: 5px;
        height: 30px;
        padding: 0 9px;
        font-size: 12px;
        line-height: 30px;
    }
    .chip-input {
    width: 92%;
    border: none;
    padding: 10px;
    }
}
.page-editor-wrapper {
    flex: 1;
    overflow: auto;
}

.page-editor {
    display: block;
    min-height: 450px;
    flex: 1;
    margin: 24px 12px 24px 24px;
    border: 1px solid @WhiteSmoke;
    border-radius: 8px;
    background-color: #ffffff;
}
</style>
