<template>
    <div
        class="html-container"
        ref="html-container"
        :class="{ fullscreen: fullScreen }"
    >
        <div class="toolbar">
            <span
                class="toolbar-icon"
                @click="toggleFullscreen"
                :title="fullScreen ? 'Exit Fullscreen' : 'Fullscreen'"
            >
                <adm-inline-svg
                    :src="fullScreen ? 'collapse' : 'expand'"
                ></adm-inline-svg>
            </span>

            <span class="toolbar-icon" @click="previewClick" title="Preview">
                <adm-inline-svg :src="preview ? 'eye-open' : 'eye-close'">
                </adm-inline-svg>
            </span>
        </div>
        <no-ssr placeholder="Codemirror Loading...">
            <div :class="{ 'part-editor': preview && fullScreen }">
                <code-mirror
                    v-model="content"
                    placeholder="Codemirror Loading..."
                    class="editor"
                    :options="cmOptions"
                    ref="codemirror-editor"
                >
                </code-mirror>
                <div v-if="preview && fullScreen" class="page-preview">
                    <div class="preview-header">
                        <h2>Webpage Preview</h2>
                    </div>
                    <iframe id="htmlpreview"></iframe>
                </div>
            </div>
        </no-ssr>
        <html-preview-modal
            v-if="showHtmlModal"
            v-bind="getHtmlData()"
            @closedialog="closeHtmlModal"
        ></html-preview-modal>
    </div>
</template>

<style lang="less" scoped>
@import '~codemirror/lib/codemirror.css';
@import '~codemirror/theme/ambiance.css';
.html-container {
    .toolbar {
        position: relative;
        display: flex;
        flex-direction: row-reverse;
        top: 6px;
        color: white;
        z-index: 2;
        right: 6px;
        height: 0;
        .toolbar-icon {
            background-color: #fff;
            margin: 3px 6px;
            height: 16px;
            width: 16px;
            padding: 2px;
            cursor: pointer;
            border-radius: 2px;
            ::v-deep svg {
                height: 16px;
                width: 16px;
            }
            ::v-deep svg * {
                stroke: @Mako;
            }
        }
    }
    .part-editor {
        display: flex;
        background-color: white;
        ::v-deep .editor {
            flex: 1;
            max-width: 50vw;
        }
    }
    .editor {
        border: 1px solid @Iron;
        ::v-deep .CodeMirror {
            height: 750px;
            z-index: 0;
        }
    }
    .page-preview {
        flex: 1;
        height: 100vh;
        .preview-header {
            padding: 6px;
            font-weight: 500;
            border-bottom: 1px solid @Gray;
            line-height: 23px;
        }
        iframe#htmlpreview {
            width: 100%;
            height: 100vh;
        }
    }
}
.fullscreen {
    position: fixed;
    top: 0;
    z-index: 999;
    right: 0;
    bottom: 0;
    left: 0;
}
.fullscreen {
    .editor {
        ::v-deep .CodeMirror {
            height: 100vh;
        }
    }
}
::v-deep .CodeMirror {
    .CodeMirror-vscrollbar {
        .mirage-scrollbar {
    /* scrollbar */
    &::-webkit-scrollbar {
        width: 5px;
        height: 5px;
        background-color: @White;
    }
    /* Track */
    &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
        background-color: @White;
    }
    /* Handle */
    &::-webkit-scrollbar-thumb {
        border-radius: 2.5px;
        background-color: @DoveGray;
    }
}
    }
}
</style>

<script>
import loader from '@/components/common/loader';
import htmlPreviewModal from '../../../components/pages/html-preview-modal.vue';
import noSsr from 'vue-no-ssr';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import { isBrowser } from 'browser-or-node';
if (isBrowser) {
    require('codemirror/mode/xml/xml.js');
    require('codemirror/addon/edit/closetag.js');
    require('codemirror/addon/selection/active-line.js');
}
export default {
    name: 'rawhtml-editor',
    components: {
        'code-mirror': () =>
            import(
                /*webpackChunkName:"vue-codemirror" */ 'vue-codemirror'
            ).then(x => {
                return x.codemirror;
            }),
        'html-preview-modal': htmlPreviewModal,
        loader,
        'no-ssr': noSsr,
        'adm-inline-svg': adminlinesvg
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            pageData: {},
            fullScreen: false,
            preview: false,
            showHtmlModal: false,
            cmOptions: {
                styleActiveLine: true,
                autoCloseTags: true,
                tabSize: 4,
                mode: 'text/html',
                theme: 'ambiance',
                lineNumbers: true,
                line: true,
                lineWrapping: true
            }
        };
    },
    computed: {
        content: {
            get: function() {
                return this.value;
            },
            set: function(v) {
                this.$emit('input', v);
            }
        }
    },
    watch: {
        content() {
            if (this.preview && this.fullScreen) {
                this.loadPreview();
            }
        }
    },
    mounted() {
        this.fullScreen = this.$route.query.fullscreen == 'true';
        this.preview = this.$route.query.preview == 'true';
        // console.log(this.$refs['html-container']);
    },
    methods: {
        previewClick() {
            if (!this.fullScreen) {
                this.showPreview();
                return;
            }
            this.preview = !this.preview;
            if (this.preview) {
                this.addQuery(['preview']);
                setTimeout(() => {
                    this.loadPreview();
                }, 0);
            } else {
                this.removeQuery(['preview']);
            }
        },
        loadPreview() {
            const iframe = document.getElementById('htmlpreview');
            if (iframe) {
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(this.content);

                iframe.contentWindow.document.close();
            }
        },
        toggleFullscreen() {
            this.fullScreen = !this.fullScreen;
            if (this.fullScreen) {
                this.preview = true;
                this.addQuery(['fullscreen', 'preview']);
                setTimeout(() => {
                    this.loadPreview();
                }, 0);
            } else {
                this.preview = false;
                this.removeQuery(['fullscreen', 'preview']);
            }
        },
        closeHtmlModal() {
            this.showHtmlModal = false;
        },
        showPreview() {
            this.showHtmlModal = true;
        },
        getHtmlData() {
            return { html: this.content };
        },
        addQuery(q) {
            let query = Object.assign({}, this.$route.query);
            for (let i = 0; i < q.length; i++) {
                query[q[i]] = true;
            }
            this.$router.replace({ query });
        },
        removeQuery(q) {
            let query = Object.assign({}, this.$route.query);
            for (let i = 0; i < q.length; i++) {
                delete query[q[i]];
            }
            this.$router.replace({ query });
        }
    }
};
</script>
