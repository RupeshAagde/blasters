<template>
    <div class="markdown-container">
        <mavon-editor
            ref="mEditor"
            v-model="markdown"
            language="en"
            :defaultOpen="defaultOpen"
            :subfield="subfield"
            :toolbarsFlag="true"
            :toolbars="toolBars"
            @fullScreen="$fullScreen"
            @previewToggle="$previewToggle"
            @save="$emit('save', $event)"
            class="markdown"
        >
            <!-- @imgAdd="onImgAdd" -->
            <template slot="left-toolbar-after">
                <span data-v-548e2160="" class="op-icon-divider"></span>
                <!-- <button
                    @click="openURLBuilder"
                    type="button"
                    aria-hidden="true"
                    title="Link (ctrl+l)"
                    class="op-icon fa fa-mavon-link"
                ></button> -->
                <div
                    @click="$refs.image_uploader_dialog.open()"
                    type="button"
                    aria-hidden="true"
                    class="op-icon fa fa-mavon-picture-o"
                ></div>
            </template>
        </mavon-editor>
        <loader v-if="inProgress" class="loading"></loader>
        <markdown-preview-modal
            :markdownText="markdown"
            :pageData="pageData"
            :showMdModal="showMdModal"
            @closedialog="closeMdModal"
        ></markdown-preview-modal>

        <blaster-image-uploader-dialog
            ref="image_uploader_dialog"
            aspectRatio="*"
            mediaFolder="page"
            @save="replaceImageUrl(null, $event)"
            v-model="currentImageURL"
            :fileName="'Page Image'"
            namespace="page-image"
        ></blaster-image-uploader-dialog>

        <!-- <nitrozen-dialog
            class="url-builder-dialog"
            ref="url_builder_dialog"
            title="Build Link"
            @close="urlBuilderDialogClose"
        >
            <template slot="body">
                <adm-url-builder
                    ref="url_builder"
                    :enableCustomLink="true"
                    :enableLinkText="true"
                    :allowShortlink="true"
                    :enableDomainSelection="true"
                ></adm-url-builder>
            </template>
        </nitrozen-dialog> -->
    </div>
</template>

<style lang="less" scoped>
@import './../../../../node_modules/mavon-editor/dist/css/index.css';
::v-deep .markdown-body {
    z-index: 1;
    height: 800px;
}
::v-deep .markdown-body.fullscreen {
    height: 100vh;
}
.markdown-container {
    max-height: 850px;
    width: 100%;
    ::v-deep .nitrozen-dialog {
        overflow: unset;
        max-height: 95%;
        .nitrozen-dialog-body {
            // overflow: auto;
        }
    }
    ::v-deep .nitrozen-dialog-backdrop {
        z-index: 1501;
    }
}
::v-deep .v-note-wrapper {
    z-index: 0;
    box-shadow: none;
}
::v-deep .modal {
    z-index: 1501;
}

.url-builder-dialog {
    ::v-deep .nitrozen-dialog {
        transition: height 0.5s;
        max-height: 95%;
        .nitrozen-dialog-body {
            overflow: visible;
        }
    }
}

</style>

<script>
import { mavonEditor } from 'mavon-editor';
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
import blasterimageuploaderdialog from '@/components/common/image-uploader/dialog.vue';
//import urlBuilder from '@/components/common/url-builder/index.vue';
import markdownPreviewModal from '@/components/pages/md-preview-modal.vue';
import loader from '@/components/common/loader.vue';

import root from 'window-or-global';

const config = root.config || {};

export default {
    name: 'markdown-page-editor',
    components: {
        'mavon-editor': mavonEditor,
        'markdown-preview-modal': markdownPreviewModal,
        'blaster-image-uploader-dialog': blasterimageuploaderdialog,
        'nitrozen-dialog': NitrozenDialog,
        loader
    },
    props: {
        value: {
            type: String,
            required: true
        }
    },
    data: function() {
        return {
            inProgress: false,
            editor: null,
            markdownText: '',
            subfield: false,
            defaultOpen: 'edit',
            pageData: {},
            imageAdd: true,
            showMdModal: false,
            toolBars: {
                bold: true,
                italic: true,
                header: true,
                underline: true,
                strikethrough: true,
                mark: true,
                superscript: true,
                subscript: true,
                quote: true,
                ol: true,
                ul: true,
                link: false,
                imagelink: false,
                code: true,
                table: true,
                fullscreen: true,
                readmodel: false,
                htmlcode: false,
                help: false,
                save: false,
                undo: true,
                redo: true,
                trash: true,
                subfield: false,
                preview: true
            },
            currentImageURL: ''
        };
    },
    computed: {
        markdown: {
            get: function() {
                return this.value;
            },
            set: function(v) {
                this.$emit('input', v);
            }
        }
    },
    mounted() {
        // console.log(this.$refs.mEditor);
        this.editor = this.$refs.mEditor;
        if (this.$route.query.fullscreen == 'true') {
            this.$refs.mEditor.toolbar_right_click('fullscreen');
        }
        this.defaultOpen =
            this.$route.query.preview == 'true' ? 'preview' : 'edit';
    },
    methods: {
        // image upload
        // onImgAdd(pos, file) {
        //     const formData = new FormData();
        //     formData.append('file', file.miniurl ? file.miniurl : file);
        //     const options = {
        //         folder: `applications/${'app_' +
        //             config.application._id}/media/page`,
        //         tags: ['app_' + config.application._id],
        //         context: {
        //             alt: 'This is page markdown image'
        //             // caption:
        //         }
        //     };

        //     this.inProgress = true;
        //     CloudinaryService.createCloudinaryURL(formData, options)
        //         .then(({ data }) => {
        //             this.replaceImageUrl(pos, data.secure_url);
        //         })
        //         .catch(ex => {
        //             this.$snackbar.global.showError(
        //                 `Failed to add Image ${
        //                     ex && ex.message ? ' : ' + ex.message : ''
        //                 }`
        //             );
        //         })
        //         .finally(() => {
        //             this.inProgress = false;
        //         });
        // },
        replaceImageUrl(pos, imageUrl) {
            if (pos && imageUrl) {
                this.$refs.mEditor.$img2Url(pos, imageUrl);
                return true;
            } else {
                this.editor.insertText(this.editor.getTextareaDom(), {
                    prefix: '![](',
                    subfix: ')',
                    str: imageUrl
                });
            }
            return false;
        },
        // url builder
       
       
        $previewToggle(preview) {
            if (preview) {
                this.addQuery(['preview']);
            } else {
                this.removeQuery(['preview']);
            }
        },
        $fullScreen(fullScreen) {
            this.subfield = fullScreen;
            if (fullScreen) {
                this.defaultOpen = 'preview';
                this.addQuery(['fullscreen', 'preview']);
            } else {
                this.defaultOpen = 'edit';
                this.removeQuery(['fullscreen', 'preview']);
            }
        },
        showPreview() {
            this.showMdModal = true;
        },
        closeMdModal() {
            this.showMdModal = false;
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
