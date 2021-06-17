<template>
    <div class="no-data" v-if="isEmpty(groupSchemas)">
        No Attributes configured for this Product Template.
    </div>
    <div v-else>
        <div v-for="(schema, grpName) in groupSchemas" :key="grpName">
            <json-to-form
                class="form"
                ref="form"
                v-if="!isEmpty(schema)"
                :schema="schema"
                v-model="values[grpName]"
                input-wrapping-class="input-wrapping-class"
            ></json-to-form>
        </div>
    </div>
</template>

<style lang="less" scoped>
//@import './../less/page-header.less';
//@import './../less/page-ui.less';
.no-data {
    padding: 24px;
    width: 100%;
    text-align: center;
    color: @DustyGray2;
    font-size: 14px;
}
.form {
    margin-top: 24px;
}
</style>

<style lang="less">
form {
    display: flex;
    flex-wrap: wrap;
}
.input-wrapping-class {
    margin: 12px 10px 0 0;
    width: 45%;
    @media @mobile{
        width: 90%;
    }
}
</style>

<script>
import { parseDynamicAttributes } from './util';
import JsonToForm from '@/components/common/json-to-form';
// import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import map from 'lodash/map';
import Ajv from 'ajv';

export default {
    name: 'dynamic-attribute',
    components: {
        JsonToForm
    },
    data() {
        return {
            groupSchemas: {},
            values: {}
        };
    },
    props: {
        schema: {
            type: Object,
            default: () => {
                return {};
            }
        },
        value: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    computed: {},
    mounted() {
        this.init();
    },
    methods: {
        isEmpty: isEmpty,
        init(schema = {}) {
            
            const parsed = parseDynamicAttributes(this.schema, this.value, {
                appendRequiredAsterisk: true
            });
            this.groupSchemas = {};
            this.values = {};
            this.$nextTick(() => {
                this.groupSchemas = parsed.schemas;
                this.values = parsed.values;
            })
        },
        validateForm() {
            let isValid = true;
            const value = this.getFormData();

            var ajv = new Ajv();
            if (!ajv.validate(this.schema, value)) {
                isValid = false;
                // $forceUpdate is called so that during re-render validation functions
                // will run and set error messages for every field.
                this.$refs['form'].forEach(form => form.$forceUpdate());
            }
            return isValid;
        },
        getFormData() {
            let value = {};
            map(this.values, grp => {
                // pickBy identity will remove falsy values
                Object.assign(value, pickBy(grp, identity));
            });
            return value;
        }
    }
};
</script>
