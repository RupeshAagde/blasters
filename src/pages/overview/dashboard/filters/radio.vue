<template>
    <div>
        <adm-radio-group
            v-model="selectedOption"
            :options="options"
            :selectedOpt="getSelectedOpt"
            :align="HORIZANTAL"
        ></adm-radio-group>
        <div>{{ selectedOption }}</div>
    </div>
</template>

<style lang="less" scoped></style>

<script>
import uktinlinesvg from './../../../../../components/common/ukt-inline-svg.vue';
import admRadioGroup, {
    ALIGN
} from './../../../../../components/admin/common/adm-radio-group.vue';

export default {
    name: 'graph-filter-radio',
    components: {
        'ukt-inline-svg': uktinlinesvg,
        'adm-radio-group': admRadioGroup
    },
    props: {
        enum: {}
    },
    computed: {
        getSelectedOpt() {
            return { value: this.selectedOption };
        },
        HORIZANTAL() {
            return ALIGN.HORIZONTAL;
        }
    },
    data() {
        return {
            selectedOption: '',
            options:
                this.enum.length > 0 &&
                this.enum
                    .map(it => {
                        it.value = it.identifier;
                        return it;
                    })
                    .slice(0, 5)
        };
    }
};
</script>
