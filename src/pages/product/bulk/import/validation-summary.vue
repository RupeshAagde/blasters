<template>
    <div class="summary">
        <p class="cl-Mako darker-md">Validation Summary</p>
        <p class="cl-DustyGray2 regular-xxs total-records">
            Total Records: <span class="cl-Mako darker-xxs">0</span>
        </p>
        <div class="divider"></div>
        <div>
            <no-records></no-records>
        </div>
    </div>
</template>

<script>
import NoRecords from '../components/no-records.vue';
export default {
    name: 'validation-summary',
    components: {
        'no-records': NoRecords
    },

    data() {
        return {};
    }
};
</script>
<style lang="less" scoped>
.summary {
    margin: 24px;
    padding: 24px;
    background-color: #fff;
    border-radius: 4px;

    .total-records {
        padding-top: 8px;
    }

    .divider {
        margin-top: 16px;
        border: 1px solid #e0e0e0;
    }
}
</style>
