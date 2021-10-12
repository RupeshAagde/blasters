<template>
  <div class="container">
        <div class="header-position">
            <page-header :title="pageTitle" @backClick="redirectToListing">
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        theme="secondary"
                        v-flatBtn
                    >
                        Save
                    </nitrozen-button>
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading || inProgress" class="loading"></loader>
        <div class="main-container">
            <div class="form-container">
                <div class="cl-Mako bold-md">Details</div>
                <div class="form-row">
                    <nitrozen-input
                        label="Name *"
                        placeholder="Enter tag name"
                        v-model="name.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        class="nitrozen-error"
                        v-if="name.showerror"
                    >
                        {{ name.errortext }}
                    </nitrozen-error>
                </div>
                <div class="form-row">
                    <nitrozen-dropdown
                        label="Choose file type"
                        placeholder="Choose filetype"
                        :items="supportedFileTypes"
                        v-model="fileType.value"
                        tooltip="File type of tags to inject"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="fileType.showerror">
                        {{ fileType.errortext }}
                    </nitrozen-error>
                </div>
                <div class="form-row">
                    <nitrozen-dropdown
                        label="Choose sub type"
                        placeholder="Choose sub type"
                        :items="supportedSubTypes"
                        v-model="subType.value"
                        tooltip="Sub type of file, if External enter the url and if Inline then use the code editor"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="subType.showerror">
                        {{ subType.errortext }}
                    </nitrozen-error>
                </div>
                <div class="form-row">
                    <nitrozen-dropdown
                        label="Choose Tag Position"
                        placeholder="Choose position"
                        :items="supportedPositionTypes"
                        v-model="position.value"
                        tooltip="Position of tag"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="position.showerror">
                        {{ position.errortext }}
                    </nitrozen-error>
                </div>
                <div class="meta-container">
                    <div v-for="(meta, index) in arrAttribute" :key="index">
                        <div class="meta-pair inline">
                            <!-- key -->
                            <nitrozen-input
                                class="cell-key"
                                v-model="meta.key"
                                label="Key"
                                type="text"
                            />
                            <!-- value -->
                            <nitrozen-input
                                class="cell-value"
                                v-model="meta.value"
                                label="Value"
                                type="text"
                            />
                            <!-- delete pair -->
                            <ukt-inline-svg
                                src="delete"
                                class="delete-icon"
                                title="Delete Attribute"
                                @click.stop.native="deletePair(index)"
                            ></ukt-inline-svg>
                        </div>
                    </div>
                    <nitrozen-error v-if="errAttributes.showerror">
                        {{ errAttributes.errortext }}
                    </nitrozen-error>
                    <nitrozen-error v-if="errAttributes.emptyerror">
                        {{ errAttributes.emptytext }}
                    </nitrozen-error>
                    <nitrozen-button
                        class="add-btn"
                        theme="secondary"
                        @click="add"
                        >Add Attribute
                    </nitrozen-button>
                </div>
            </div>
            <div class="editor-container">
                <div class="cl-Mako bold-md subtype">Sub Type</div>
                <div
                    v-if="subType.value !== 'inline'"
                    class="form-row cst-width row-height"
                >
                    <nitrozen-input
                        label="URL *"
                        placeholder="Enter external file url"
                        v-model="url.value"
                        @input="isUrl(url.value)"
                    ></nitrozen-input>
                    <nitrozen-error class="nitrozen-error" v-if="url.showerror">
                        {{ url.errortext }}
                    </nitrozen-error>
                    <nitrozen-error class="nitrozen-error" v-if="noUrl">
                        Not a valid URL
                    </nitrozen-error>
                </div>
                <div v-if="subType.value === 'inline'" class="row-height">
                    <div class="cs-disp">
                        <div class="cst-label">Code *</div>
                        <div>
                            <nitrozen-error v-if="functionCode.showerror">
                                {{ functionCode.errortext }}
                            </nitrozen-error>
                        </div>
                    </div>
                    <code-mirror
                        class="editor"
                        v-model="functionCode.value"
                        placeholder="Codemirror Loading..."
                        :options="cmOptions"
                        ref="codemirror-editor"
                    >
                    </code-mirror>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import PageEmpty from '@/components/common/page-empty.vue';
import Shimmer from '@/components/common/shimmer';
import {PageHeader,Loader} from '@/components/common/';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';



import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDialog,
    NitrozenError,
        NitrozenInput,
        NitrozenDropdown

} from '@gofynd/nitrozen-vue';
export default {
    name: "tag-update",
    components: {
             PageHeader,  
         'nitrozen-button': NitrozenButton,
         NitrozenError,
        NitrozenInput,
        NitrozenDropdown,
        // 'nitrozen-dialog': NitrozenDialog,
        // 'adm-inline-svg': adminlinesvg,
         'ukt-inline-svg': inlinesvg,
        // 'no-content': PageEmpty,
        // Shimmer,
         Loader,
          flatBtn,
         strokeBtn,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data(){
        return{
        update: false,
            uid: null,
            noUrl: false,
            tagList: [],
            tagData: {},
            pageTitle: 'Create Tag',
            pageLoading: false,
            inProgress: false,
            saveText: 'Tag saved successfully',
            metaType: 'json',
            // testCode: ToolsService.defaultAdvanceTagCode,
            // functionCode: {
            //     value: ToolsService.defaultAdvanceTagCode,
            //     showerror: false,
            //     errortext: "Empty code content can't be saved.",
            // },
            cmOptions: {
                autoCloseTags: true,
                highlightNonStandardPropertyKeywords: true,
                extraKeys: {
                    Ctrl: 'autocomplete',
                    F11(cm) {
                        cm.setOption('fullScreen', !cm.getOption('fullScreen'));
                    },
                    Esc(cm) {
                        if (cm.getOption('fullScreen'))
                            cm.setOption('fullScreen', false);
                    },
                },
                foldGutter: true,
                gutters: [
                    'CodeMirror-linenumbers',
                    'CodeMirror-foldgutter',
                    'CodeMirror-lint-markers',
                ],
                highlightSelectionMatches: {
                    showToken: /\w/,
                    annotateScrollbar: true,
                },
                hintOptions: {
                    completeSingle: false,
                },
                line: true,
                lineNumbers: true,
                lineWrapping: true,
                lint: {
                    strict: 'implied',
                    esversion: 6,
                    globals: { _: true, jsonata: true, console: true },
                },
                lintOnChange: true,
                matchBrackets: true,
                mode: 'text/javascript',
                enableCodeFormatting: true,
                selfContain: true,
                showCursorWhenSelecting: true,
                styleActiveLine: true,
                tabSize: 4,
                theme: 'ambiance',
            },
            supportedFileTypes: [
                {
                    text: 'CSS',
                    value: 'css',
                },
                {
                    text: 'JavaScript',
                    value: 'js',
                },
            ],
            supportedSubTypes: [
                {
                    text: 'External',
                    value: 'external',
                },
                {
                    text: 'Inline',
                    value: 'inline',
                },
            ],
            supportedPositionTypes: [
                {
                    text: 'Head',
                    value: 'head',
                },
                {
                    text: 'Body Top',
                    value: 'body-top',
                },
                {
                    text: 'Body Bottom',
                    value: 'body-bottom',
                },
            ],
            showUrl: false,
            name: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            fileType: {
                value: 'css',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            subType: {
                value: 'external',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            url: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            position: {
                value: 'head',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            arrAttribute: [],
            errAttributes: {
                showerror: false,
                errortext: 'Please fill the key, value pair',
                emptyerror: false,
                emptytext: 'Atleast one tag is required',
            },

    }
    },
     mounted() {
        if (this.$route.query.id) {
            this.update = true;
            this.pageTitle = 'Update Tag';
            this.uid = this.$route.query.id;
            this.getList();
        } else {
            this.update = false;
        }
    },
    methods: {
        redirectToListing() {
            this.$router.push({ path: 'list-tags' });
        },
        add() {
            this.arrAttribute.push(this.newPair());
        },
            newPair() {
            return {
                key: '',
                value: '',
            };
        }
    }
    
}
</script>
<style lang="less" scoped>
 .main-container {
    display: flex;
    flex-flow: row-reverse;
    width: auto;
    background-color: @Alabaster2;

    .editor-container {
        flex: 1;
        margin-right: 24px;
        height: fit-content;
        background-color: white;
        border-radius: 4px;
        margin: 24px 12px 24px 24px;
        overflow: hidden;
        padding: 24px 0 24px 24px;

        ::v-deep .CodeMirror {
            height: 750px;
            font-size: 14px;
            .CodeMirror-vscrollbar {
                .mirage-scrollbar;
            }
        }
    }

    .form-container {
        padding: 24px;
        background-color: white;
        height: fit-content;
        border-radius: 4px;
        width: 300px;
        min-width: 300px;
        margin: 24px 24px 24px 12px;
        .form-row {
            margin: 20px 0;
        }
    }
}
.header-position {
    height: 58.5px;
    .button-box {
        display: flex;
        align-items: center;
        .pad-left {
            margin-left: 12px;
        }
    }
}
.meta-container {
    padding-bottom: 15px;
    .inline {
        display: flex;
        margin-top: 12px;
        .cell-key {
            width: 40%;
        }
        .cell-value {
            margin-left: 12px;
            width: 40%;
        }
        ::v-deep.delete-icon svg {
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin: 21px 0px 0px 12px;
        }
        .datatype-dropdown {
            min-width: 105px;
        }
    }
    .add-btn {
        float: right;
        margin-top: 16px;
    }
}
.subtype{
margin-bottom: 10px;
}


</style>