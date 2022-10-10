<template>
    <div class="panel">
        <transition name="fade" mode="out-in">
            <div
                id="adm-gjs"
                v-bind:class="[{ 'adm-gjs': editorLoaded }]"
            ></div>
        </transition>
        <loader v-if="inProgress" class="loading"></loader>
    </div>
</template>

<style lang="less" scoped>
@import '../../../pages/less/page-header.less';
@import '../../../pages/less/form.less';
@import '../../../pages/less/page-ui.less';
@import '../../../../node_modules/grapesjs/dist/css/grapes.min.css';
@import '../../../../node_modules/grapesjs-preset-newsletter/dist/grapesjs-preset-newsletter.css';
.panel {
    height: 100%;
}
.dummy-div {
    padding: 50px;
}
.adm-gjs {
    border: 3px solid #444;
    height: 100% !important;
    box-sizing: border-box;
}
/deep/.gjs-pn-btn {
    color: @White;
}
/deep/.gjs-block {
    color: @White;
}
/deep/.gjs-title {
    color: @White;
}
/deep/.gjs-title {
    font-size: 14px;
}
/deep/.gjs-one-bg {
    background-color: @Mako;
}
.loading {
    z-index: @dialog;
}
.continue-btn {
    margin-top: 20px;
}
</style>

<script>
import loader from './../../../components/common/loader.vue';

import urlJoin from 'url-join';
import { mapGetters } from 'vuex';
import { Promise } from 'q';
import constants from './../../../pages/gjs-css-styles';

export default {
    name: 'newsletter-grape-editor',
    components: {
        loader
    },
    props: ['input', 'id'],
    data: function() {
        return {
            editorLoaded: false,
            inProgress: false,
            pageData: {},
            editor: null,
            loading: true,
            showHtmlModal: false,
            htmlDoc: '',
            html:
                this.input ||
                '<table style="box-sizing: border-box; height: 150px; margin: 0 auto 10px auto; padding: 5px 5px 5px 5px; width: 100%;" width="100%" height="150"><tbody style="box-sizing: border-box;"><tr style="box-sizing: border-box;"><td style="box-sizing: border-box; font-size: 12px; font-weight: 300; vertical-align: top; color: rgb(111, 119, 125); margin: 0; padding: 0;" valign="top"><div style="box-sizing: border-box; padding: 10px;">This is a sample body</div></td></tr></tbody></table>'
        };
    },
    mounted() {
        this.loading = true;
        let grapesjs;
        let plugins = ['gjs-preset-newsletter', 'gjs-preset-webpage'];
        import('grapesjs')
            .then(res => {
                grapesjs = res;
                import('grapesjs-preset-webpage')
                return import('grapesjs-preset-newsletter');
            })
            .then(() => {
                let html = this.html;

                this.editor = grapesjs.init({
                    container: '#adm-gjs',
                    clearOnRender: true,
                    plugins: plugins,
                    // fromElement: true,
                    components: html,
                    pluginsOpts: {
                        'gjs-preset-newsletter': {
                            modalLabelImport:
                                'Paste all your code here below and click import',
                            modalLabelExport:
                                'Copy the code and use it wherever you want',
                            codeViewerTheme: 'material',
                            //defaultTemplate: templateImport,
                            importPlaceholder: html,
                            cellStyle: {
                                'font-size': '12px',
                                'font-weight': 300,
                                'vertical-align': 'top',
                                color: 'rgb(111, 119, 125)',
                                margin: 0,
                                padding: 0
                            }
                        },
                        'gjs-preset-webpage': {
                            modalImportTitle: 'Import Template',
                            modalImportLabel:
                                '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
                            customStyleManager: constants.STYLE_CONFIG
                        }
                    },
                    styleManager: {},
                    storageManager: {
                        type: null // Type of the storage
                        // id: 'gjs-' + this.id, // Prefix identifier that will be used on parameters
                        // autosave: true, // Store data automatically
                        // autoload: true, // Autoload stored data on init
                        // stepsBeforeSave: 1 // If autosave enabled, indicates how many changes are necessary before store method is triggered
                    }
                });
                //this.editor.render();
                //this.editor.on('load', () => {
                //    this.editorLoaded = true;
                //
                //    const panelManager = this.editor.Panels;
                //    panelManager.addButton({
                //        id: 'options',
                //        buttons: [
                //            {
                //                id: 'preview',
                //                className: 'fa fa-eye',
                //                command: 'preview',
                //                context: 'preview',
                //                attributes: { title: 'Preview' }
                //            }
                //        ]
                //    });
                //     this.editor.setComponents(this.html)
                //}); // todo emit event
                this.loading = false;
            })
            .catch(err => {
                this.loading = false;
                // emit error here
                console.log(err);
            });
    },
    methods: {
        getHtmlData() {
            return this.editor.getHtml();
        },
        saveEdits() {
            let inlineHtml = this.editor.runCommand('gjs-get-inlined-html');
            return inlineHtml;
        }
    }
};
</script>
