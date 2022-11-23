<template>
    <div class="title">
        <div class="box">
            <span class="bold-sm box-title">{{ graph.title }}</span>
            <nitrozen-tooltip
                :position="'top'"
                class="tooltip"
                v-if="graph.type == 'text-blocks'"
                >{{ tooltiptext }}</nitrozen-tooltip
            >
        </div>
        <!-- <div class="box">
            <nitrozen-dropdown
                :items="downloadOptions"
                :label="'Download'"
                :placeholder="'Download'"
                class="download-dropdown"
                @change="changeDownload(graph)"
                v-model="selectedDownloadOption"
            ></nitrozen-dropdown>
        </div>
        <div class="box">
            <nitrozen-button :theme="'secondary'" @click="openCSVViewer(graph)" v-strokeBtn>Preview CSV</nitrozen-button>
        </div>-->
        <div class="box">
            <div v-if="graph.filters.length">
                <graph-filters
                    :filters="graph.filters"
                    :componentKey="graph.key"
                    @filter-graph="filterGraph($event)"
                ></graph-filters>
            </div>
            <span @click="openCSV(graph)">
                <adm-inline-svg
                    :src="'csv-file'"
                    class="csv-icon"
                    title="Download CSV"
                ></adm-inline-svg>
            </span>
            <span @click="openPDF(graph)">
                <adm-inline-svg
                    :src="'pdf-file'"
                    class="csv-icon"
                    title="Download PDF"
                ></adm-inline-svg>
            </span>
            <span @click="openCSVViewer(graph)">
                <adm-inline-svg
                    :src="'csv-viewer'"
                    class="csv-icon"
                    title="Preview Table"
                ></adm-inline-svg>
            </span>
        </div>
    </div>
</template>

<style lang="less" scoped>
.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box {
        display: flex;
        color: @Mako;
        span {
            display: flex;
            align-items: center;
        }
        .box-title {
            font-size: 24px;
            @media @mobile{
                font-size: 20px;
            }
        }
    }
}
.csv-icon {
    cursor: pointer;
    width: 16px;
    height: 16px;
    margin-left: 10px;
}
.download-dropdown {
    width: 120px;
}
::v-deep .nitrozen-dropdown-label {
    display: none;
}
::v-deep .nitrozen-select {
    border-color: #2E31BE;
}
::v-deep .nitrozen-select__trigger {
    color: #2E31BE;
}
::v-deep .nitrozen-inline-svg {
    svg {
        height: 20px;
        width: 20px;
    }
}
.tooltip {
    margin-left: 24px;
    margin-top: 6px;
    line-height: 1.5;
    @media @mobile{
        display: none;
    }
}
</style>

<script>
import uktinlinesvg from './../../../../components/common/ukt-inline-svg.vue';
import admInlineSvg from './../../../../components/admin/common/adm-inline-svg.vue';
import graphFilters from './graph-filters.vue';
import root from 'window-or-global';
import Apiservice from './../../../../services/api.service.js';
import ADMIN_URLS from './../../../../services/admin/admin-url.service';
import { saveAs } from 'file-saver';
import axios from 'axios';
import {
    transformRequestOptions,
    getURLSearchParams
} from '../../../../helper/utils';

import {
    NitrozenButton,
    NitrozenDropdown,
    NitrozenTooltip,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';
const config = root.config || {};
const envVars = root.env || {};

export default {
    name: 'graph-titlebar',
    components: {
        'ukt-inline-svg': uktinlinesvg,
        'adm-inline-svg': admInlineSvg,
        'graph-filters': graphFilters,
        'nitrozen-button': NitrozenButton,
        'nitrozen-dropdown': NitrozenDropdown,
        'nitrozen-tooltip': NitrozenTooltip
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    props: {
        graph: {},
        tooltiptext: ''
    },
    data() {
        return {
            downloadOptions: [
                {
                    text: 'CSV',
                    value: 'csv'
                },
                {
                    text: 'PDF',
                    value: 'pdf'
                }
            ],
            selectedDownloadOption: '',
            selectedFilter: '',
            applicationId: this.$route.params.applicationId
        };
    },
    methods: {
        createResourceUrl(graph, type) {
            const { baseLink, queryParams } = getURLSearchParams(graph.url);
            let strAPIEndpoint = baseLink;
            let queryObj = Object.assign(
                {},
                queryParams
            );

            return (
                ADMIN_URLS.GET_GRAPH_DATA(strAPIEndpoint, this.applicationId) +
                '.' +
                type +
                '?' +
                transformRequestOptions(queryObj)
            );
        },
        openCSV(graph) {
            // window.open(this.createResourceUrl(graph, 'csv'));
            Apiservice.get(
                // `${ADMIN_URLS.GET_GRAPH_DATA(graph.url, this.applicationId)}.csv`,
                this.createResourceUrl(graph, 'csv'),
                {}
            ).then(({ data }) => {
                // this.setChartData(item.graph, data);
                const file = new File(
                        [data],
                        `${graph.title}.csv`,
                        {
                            type: 'data:text/csv;charset=utf-8'
                        }
                    );
                saveAs(file);
            });
        },
        openPDF(graph) {
            
            // window.open(this.createResourceUrl(graph, 'pdf'));
            axios.get(
                `${ADMIN_URLS.GET_GRAPH_DATA(graph.url, this.applicationId)}.pdf`,
                {responseType: 'blob'}
            )
            // .then((res) => {
            //     // this.setChartData(item.graph, data);
            //     // const file = new File(
            //     //         [data],
            //     //         `${graph.title}.pdf`,
            //     //         {
            //     //             type: 'data:application/pdf;charset=base64'
            //     //         }
            //     //     );
            //     var blob = new Blob([res.data], {type: 'application/pdf'});
            //     saveAs(blob);
            //     // var blob=new Blob([data]);
            //     // var link=document.createElement('a');
            //     // link.href=window.URL.createObjectURL(blob);
            //     // link.download="file.pdf";
            //     // link.click();
            //     // console.log(data);
            // });
                .then(response => response.data)
            .then(blob => {
                saveAs(blob, `${graph.title}.pdf`);
            })
        },
        openCSVViewer(graph) {
            graph.csvLink = this.createResourceUrl(graph, 'csv');
            this.$emit('show-csv', graph);
        },
        filterGraph(item) {
            item.graph = this.graph;
            this.$emit('filter-graph', item);
        },
        changeDownload(graph) {
            if (this.selectedDownloadOption == 'csv') {
                this.openCSV(graph);
            } else if (this.selectedDownloadOption == 'pdf') {
                this.openPDF(graph);
            }
        }
    }
};
</script>
