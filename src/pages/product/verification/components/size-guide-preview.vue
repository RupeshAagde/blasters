<template>
    <nitrozen-dialog ref="dialog" :title="`Preview Size guide`">
        <template slot="body">
            <div class="page-container preview-container">
                <div class="preview-size-guide">
                    <div class="title-class">
                        <h4>{{ title }}</h4>
                    </div>
                    <div class="subtitle-class">
                        <label>{{ subtitle }}</label>
                    </div>
                    <div class="preview-toggle">
                        <div class="can-toggle">
                            <template id="vue-toggle">
                                <div class="btn-group">
                                    <button
                                        type="button"
                                        v-for="(key, val) in values"
                                        :key="key"
                                        @click="changeSelectedMetric(key)"
                                        :class="[
                                            'btn',
                                            `btn-${key}`,
                                            {
                                                'btn-danger':
                                                    previewSelectedMetric === key,
                                                'btn-default':
                                                    previewSelectedMetric !== key
                                            }
                                        ]"
                                    >
                                        {{ val }}
                                    </button>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="table-preview">
                        <table class="table">
                            <thead class="thead">
                                <th
                                    v-for="(value, key, index) in tableObj"
                                    :key="index"
                                >
                                    {{ value['value'] }}
                                </th>
                            </thead>
                            <tbody class="tbody">
                                <tr
                                    v-for="(item, arrIndex) in table"
                                    :key="'arr' + arrIndex"
                                >
                                    <td
                                        v-for="(value,
                                        key,
                                        objIndex) in tableObj"
                                        :key="'obj' + objIndex"
                                    >
                                        <!-- {{ item[key] }} -->
                                        {{
                                            value.convertable
                                            ? convertMetrics(item[key])
                                            : item[key]
                                        }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="preview-img-cls">
                        <span v-html="description"></span>
                    </div>
                    <div class="preview-img-cls">
                        <img
                            class="img-class"
                            :src="imageUrl | imagetransform({ width: 270 })"
                        />
                    </div>
                </div>
            </div>
        </template>
    </nitrozen-dialog>
</template>

<style lang="less" scoped>
.preview-size-guide {
    width: 100%;
    .sg-title {
        display: flex;
        margin-bottom: 20px;
        color: @DustyGray2;
    }
    .title-class {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
    .subtitle-class {
        display: flex;
        justify-content: center;
    }
    .preview-toggle {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
        // pointer-events: none;
        .btn-group {
            display: flex;
            justify-content: center;
            margin-top: 20px;
        }
        .btn {
            display: inline-block;
            padding: 6px 12px;
            margin-bottom: 0;
            font-size: 14px;
            font-weight: 400;
            line-height: 1.42857143;
            text-align: center;
            white-space: nowrap;
            vertical-align: middle;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            cursor: pointer;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-image: none;
            border: 1px solid transparent;
            border-radius: 4px;
        }
        .btn-cm {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }
        .btn-in {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
        .btn-default {
            color: @Mako;
            background-color: @White;
            border-color: @Iron;
        }
        .btn-danger {
            color: @White;
            background-color: @RoyalBlue;
            border-color: @RoyalBlue;
        }
    }
    .table-preview {
        margin-bottom: 20px;

        .table {
            width: 100%;
            color: @Mako;
            .thead {
                th {
                    border: 1px solid @Iron;
                    padding: 12px;
                    font-weight: bold;
                }
            }
            .tbody {
                text-align: center;
                tr {
                    td {
                        border: 1px solid @Iron;
                        padding: 12px;
                    }
                }
            }
        }
    }
    .description-cls{
            display: flex;
            justify-content: center;
            margin-bottom: 20px
    }
    .preview-img-cls {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }
}
</style>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
export default {
    name: 'size-guide-preview',
    components: {
        'nitrozen-dialog': NitrozenDialog
    },
    data() {
        return {
            title: '',
            subtitle: '',
            table: [],
            tableObj: [],
            imageUrl: '',
            selectedMetric: 'cm',
            previewSelectedMetric: 'cm',
            description: '',
            values: {
                cm: 'cm',
                inches: 'in'
            },
            touched: false,
        };
    },
    methods: {
        open(size_guide_tag, size_guide_meta) {
            this.$refs['dialog'].open({
                width: '800px',
                height: '90%',
                showCloseButton: true,
                dismissible: true,
                neutralButtonLabel: ''
            });
            this.title = size_guide_meta.title || 'Size Guide Title';
            this.subtitle = size_guide_meta.subtitle || 'Size Guide Subtitle';
            this.tableObj = size_guide_meta.guide.meta.headers;
            this.table = size_guide_meta.guide.meta.values;
            this.selectedMetric = size_guide_meta.guide.meta.unit;
            this.previewSelectedMetric = size_guide_meta.guide.meta.unit;
            this.imageUrl = size_guide_meta.image;
            this.description = size_guide_meta.description;
        },
        changeSelectedMetric(val, type) {
            this.previewSelectedMetric = val;
            if (this.selectedMetric === this.previewSelectedMetric){
                this.touched = false;
            }
            else {
                this.touched = true;
            }
        },
        convertMetrics(val){
            if (this.previewSelectedMetric == 'cm' && this.touched) {
                let finalVal = '';
                val = val.split('-');
                for(let i = 0; i < val.length; i++){
                    if(i != 0 && i<val.length){
                        finalVal += '-'
                    }
                    if(!isNaN(Number(val[i]))){
                        finalVal += (Number(val[i]) * 2.54).toFixed(2); //cm to inches
                    }
                    else{
                        finalVal += val[i];
                    }
                }
                return finalVal;
            }
            if (this.previewSelectedMetric == 'in' && this.touched) {
                let finalVal = '';
                val = val.split('-');
                for(let i = 0; i < val.length; i++){
                    if(i != 0 && i<val.length){
                        finalVal += '-'
                    }
                    if(!isNaN(Number(val[i]))){
                        finalVal += (Number(val[i]) / 2.54).toFixed(2); //inches to cm
                    }
                    else{
                        finalVal += val[i];
                    }
                }
                return finalVal;
            }
            return val;
        }
    }
};
</script>
