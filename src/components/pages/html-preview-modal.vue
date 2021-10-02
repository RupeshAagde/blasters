<template>
    <ukt-modal
        :isOpen="true"
        :isCancelable="true"
        @closedialog="closeModal"
        :title="'HTML Preview'"
    >
        <iframe id="preview"></iframe>
    </ukt-modal>
</template>

<style lang="less" scoped>
::v-deep .modal-container {
    min-height: 40% !important;
    max-height: 80% !important;
    min-width: 70% !important;
    &::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.4);
        background-color: @White;
    }
    &::-webkit-scrollbar {
        width: 5px;
        background-color: @White;
    }
    &::-webkit-scrollbar-thumb {
        background-color: @DarkGray;
    }
}
iframe {
    height: 610px;
    width: 100%;
    overflow: hidden;
}
</style>

<script>
import uktModal from '../common/utk-modal.vue'
import markdownViewer from '../common/ukt-markdown-viewer.vue';

export default {
    name: 'html-preview-modal',
    components: {
        'ukt-modal': uktModal,
        'markdown-viewer': markdownViewer
    },
    props: {
        html: '',
        css: '',
        js: ''
    },
    mounted() {
        this.showPreview();
    },
    methods: {
        showPreview() {
            if (this.html) this.appendHTML(this.html, 'preview');
            if (this.css) this.appendCSS(this.css, 'preview');
        },
        closeModal() {
            this.$emit('closedialog');
        },
        appendHTML(html, iframeId) {
            const ctPageIframElm = document.getElementById(iframeId);
            if (ctPageIframElm) {
                ctPageIframElm.contentWindow.document.open();
                ctPageIframElm.contentWindow.document.write(html);
                if (ctPageIframElm.contentWindow.document.body) {
                    ctPageIframElm.contentWindow.document.body.onload = this.onIframeBodyLoad.bind(
                        this
                    );
                } else {
                    ctPageIframElm.contentWindow.onload = this.onIframeBodyLoad.bind(
                        this
                    );
                }
                ctPageIframElm.contentWindow.document.close();
            }
        },
        onIframeBodyLoad(iframeId, event) {
            const ctPageIframElm = document.getElementById(iframeId);
            if (ctPageIframElm) {
                //add javascript here
                if (this.js) this.appendJS(this.js);
            }
        },
        appendCSS(css, iframeId) {
            const ctPageIframElm = document.getElementById(iframeId);
            if (ctPageIframElm) {
                const styleElement = document.createElement('style');
                styleElement.setAttribute('type', 'text/css');
                styleElement.textContent = css;

                const container = ctPageIframElm.contentWindow.document.querySelector(
                    'head'
                );
                container.appendChild(styleElement);
            }
        },
        appendJS(js, iframeId) {
            const ctPageIframElm = document.getElementById(iframeId);
            if (ctPageIframElm) {
                const scriptElement = document.createElement('script');
                scriptElement.setAttribute('type', 'text/javascript');
                scriptElement.textContent = js;

                const container = ctPageIframElm.contentWindow.document.querySelector(
                    'head'
                );
                container.appendChild(scriptElement);
            }
        }
    }
};
</script>
