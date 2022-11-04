<template>
    <div class="rules-history-table-container">
        <table>
            <thead>
                <tr class="header">
                    <td>Company Name</td>
                    <td>Sales Channel</td>
                    <td>Quality Check Configuration</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="item in tableData">
                    <tr
                        @click="redirectToPlatformDetails(item.display_name)"
                        class="row"
                        :key="item.uid"
                    >
                        <td class="rowBorderStart">{{ item.display_name }}</td>
                        <td class="rowBorderMiddle">
                            {{ item.channel ? item.channel : '0' }}
                        </td>
                        <td class="rowBorderEnd text-button-container">
                            <span>{{ item.total ? item.total : '0' }}</span>
                            <span
                                ><inline-svg
                                    title="edit hsn"
                                    src="arrow-right-black"
                                ></inline-svg
                            ></span>
                        </td>
                    </tr>
                    <tr :key="`${item.uid}-break`">
                        <td><br /></td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
import InlineSvg from '@/components/common/ukt-inline-svg';
import { NitrozenButton, strokeBtn } from '@gofynd/nitrozen-vue';

export default {
    name: 'rules-history-table',
    components: {
        'nitrozen-button': NitrozenButton,
        InlineSvg
    },
    directives: { strokeBtn },
    props: {
        tableData: {
            type: Array,
            required: true
        },
    },
    methods: {
        redirectToPlatformDetails(company) {
            this.$router.push({ path: `/administrator/rma/rules/${company}` });
        }
    }
};
</script>

<style lang="less" scoped>
@import './../less/page-header.less';
@import './../less/page-ui.less';

.rules-history-table-container {
    display: flex;
    flex-direction: column;

    table {
        border-collapse: separate;
        border-spacing: 0;

        .header {
            color: #9b9b9b;
            line-height: 22px;
            font-size: 14px;

            td {
                padding: 15px;
            }
        }
        .row {
            cursor: pointer;
            &:hover {
                background-color: @Iron;
            }
        }

        .rowBorderStart {
            border: 1px solid #e0e0e0;
            border-right: 0px;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
            padding: 15px;
            vertical-align: middle;
        }

        .rowBorderMiddle {
            border: 1px solid #e0e0e0;
            border-left: 0px;
            border-right: 0px;
            padding: 15px;
            vertical-align: middle;
        }

        .rowBorderEnd {
            border: 1px solid #e0e0e0;
            border-left: 0px;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
            padding: 15px;
            vertical-align: middle;
        }

        .text-button-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
    }
}
</style>
