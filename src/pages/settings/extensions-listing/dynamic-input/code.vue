<template>
    <div class="code">
        <div class="title">
            <span
                >{{ prop_schema.label }}
                <nitrozen-tooltip :position="'bottom'" v-if="prop_schema.info">
                    <span class="desc">{{ prop_schema.info }}</span>
                </nitrozen-tooltip>
            </span> 

            <div class="expand-icon" @click="openCodeDialog">
                <img src="/public/admin/assets/admin/pngs/expand.png" alt="" />
            </div>
        </div>

        <code-mirror
            v-model="code"
            placeholder="Codemirror Loading..."
            class="codemirror-mini-editor"
            :options="cmOptions"
            @input="onChange"
            ref="codemirror-editor"
        ></code-mirror>

        <nitrozen-dialog ref="codeDialog" :title="'Custom HTML'">
            <template slot="body">
                <code-mirror
                    v-model="code"
                    placeholder="Codemirror Loading..."
                    class="editor"
                    :options="cmOptions"
                    @input="onChange"
                    ref="codemirror-editor"
                >
                </code-mirror>
            </template>
            <template class="dialog__footer" slot="footer"> </template>
        </nitrozen-dialog>
    </div>
</template>

<script>
/* Package imports */
import { NitrozenTooltip, NitrozenDialog } from '@gofynd/nitrozen-vue';
import dedent from 'dedent';

import { isBrowser } from 'browser-or-node';
if (isBrowser) {
    require('codemirror/mode/xml/xml.js');
    require('codemirror/addon/edit/closetag.js');
    require('codemirror/addon/selection/active-line.js');
}
// language

// theme css

export default {
    name: 'code-input',
    props: ['prop_schema', 'prop', 'name'],
    components: {
        'nitrozen-dialog': NitrozenDialog,
        'nitrozen-tooltip': NitrozenTooltip,
        'code-mirror': () =>
            import(
                /*webpackChunkName:"vue-codemirror" */ 'vue-codemirror'
            ).then(x => {
                return x.codemirror;
            })
    },
    mounted() {
        this.code = this.prop.value || this.prop_schema.default || '';
        this.code = dedent`${this.code}`;
    },
    data() {
        return {
            code: dedent`
          //
          //  code here
          //

          
        `,
            cmOptions: {
                styleActiveLine: true,
                autoCloseTags: true,
                tabSize: 4,
                mode: 'text/html',
                theme: 'cobalt',
                lineNumbers: true,
                line: true,
                lineWrapping: true
            }
        };
    },
    methods: {
        onChange(e) {
            this.$emit('change', {
                type: this.prop_schema.type,
                value: e
            });
        },
        openCodeDialog: function() {
            this.$refs['codeDialog'].open({
                width: '80vw',
                height: '80vh',
                showCloseButton: true,
                dismissible: false
            });
        },
        closeDialog: function() {
            this.$refs['codeDialog'].close();
        }
    }
}
</script>

<style lang="less" scoped>
@import '~codemirror/lib/codemirror.css';
@import '~codemirror/theme/cobalt.css';
.editor {
    height: 100%;
}
.codemirror-mini-editor {
    min-height: 260px;
}
.title {
    margin-bottom: 7px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/deep/ .CodeMirror {
    min-height: 260px;
    height: 100%;
}
/deep/ .CodeMirror-scroll {
    min-height: 260px;
}
.expand-icon {
    width: 30px;
    height: 30px;
    padding: 5px;
    box-sizing: border-box;
    transition: all 0.4s;
    img {
        width: 100%;
    }
    &:hover {
        cursor: pointer;
        background-color: #fff;
    }
}
.nitrozen {
    &__button {
        margin-top: 20px;
    }
}
</style>
