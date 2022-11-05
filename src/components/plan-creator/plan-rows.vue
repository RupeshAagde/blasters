<template>
    <table class="plan-table" v-if="plan">
        <tbody>
            <tr v-for="(component, index) in plan.components" :key="index">
                <td>{{ component.name }}</td>
                <td v-html="component.display_text"></td>
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
    name: 'plan-rows',
    props: {
        plan: {
            type: Object,
            default: null
        }
    }
};
</script>

<style lang="less" scoped>
.plan-table {
    width: 100%;
    tbody {
        line-height: 18px;
        tr:nth-child(odd) {
            background: #f8f8f870;
        }
        tr {
            border-bottom: 1px solid lightgray;
        }
        td {
            text-align: center;
            padding: 14px 5px;
        }
    }
}
</style>
