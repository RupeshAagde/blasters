<template>
    <div class="rules-history-table-container">
        <search-container
            :placeholder="'Search by Platform name'"
            :id="'rma-platform-search'"
            :value="platformSearchValue"
            :handleChange="searchPlatforms"
            :disabled="false"
        />
        <table>
            <thead>
                <tr class="header">
                    <td>Company Name</td>
                    <td>Sales Channel</td>
                    <td>Quality Check Configuration</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="(item, key) in tableData">
                    <tr
                        @click="redirectToPlatformDetails(item.platform)"
                        class="row"
                        :key="`${key}-values`"
                    >
                        <td class="rowBorderStart">{{ item.platform }}</td>
                        <td class="rowBorderMiddle">
                            {{ item.sales_channel }}
                        </td>
                        <td class="rowBorderEnd text-button-container">
                            <span>{{ item.qc_config }}</span>
                            <span
                                ><inline-svg
                                    title="edit hsn"
                                    src="arrow-right-black"
                                ></inline-svg
                            ></span>
                        </td>
                    </tr>
                    <tr :key="`${key}-break`">
                        <td><br /></td>
                    </tr>
                </template>
            </tbody>
        </table>
        <nitrozen-pagination
            name="Tags"
            id="pagination"
            v-model="pagination"
            @change="setPagination"
            :pageSizeOptions="[5, 10, 20, 50]"
        ></nitrozen-pagination>
    </div>
</template>

<script>
import SearchContainer from '@/components/packaging/common/search-container.vue';
import InlineSvg from '@/components/common/ukt-inline-svg';
import {
    NitrozenPagination,
    NitrozenButton,
    strokeBtn
} from '@gofynd/nitrozen-vue';

const PAGINATION = {
    limit: 0,
    current: 0,
    total: 0
};

export default {
    name: 'rules-history-table',
    components: {
        SearchContainer,
        'nitrozen-pagination': NitrozenPagination,
        'nitrozen-button': NitrozenButton,
        InlineSvg
    },
    directives: { strokeBtn },
    props: {
        tableData: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            pagination: { ...PAGINATION },
            platformSearchValue: ''
        };
    },
    methods: {
        setPagination(filter) {
            const { current, limit } = filter;
            filter = { page: current, limit };
            this.pagination = Object.assign({}, this.pagination, filter);
        },
        searchPlatforms(inputValue) {
            console.log(inputValue);
        },
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
