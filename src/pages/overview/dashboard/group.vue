<template>
    <div>
        <div v-for="graph in components" :key="graph.graph_id" class="graphs">
            <graph-titlebar
                v-if="graph.graph_loaded"
                :graph="graph"
                @show-csv="openCSVViewer($event)"
                @filter-graph="filterGraph($event)"
                :tooltiptext="description[graph.key]"
            ></graph-titlebar>

            <div v-if="!graph.graph_loaded" class="shimmer"></div>
            <div v-if="graph.type !== 'text-blocks'" class="dashboard-chart">
                <div class="dashboard-canvas">
                    <canvas
                        :id="graph.graph_id"
                        width="0px"
                        height="0px"
                    ></canvas>
                </div>
                <div class="dashboard-canvas-content" v-if="graph.graph_loaded">
                    <span class="bold-xs cl-Mako">Description</span>
                    <p>{{ description[graph.key] }}</p>
                </div>
            </div>
            <div v-else :id="graph.graph_id" class="text-block">
                <div class="dashboard-div" v-if="graph.graph_data">
                    <div
                        class="dashboard-card"
                        v-for="(block, id) in graph.graph_data.data.data"
                        :key="'text_block_' + id"
                    >
                        <!-- <div>{{ block.display }}</div>
                        <div>
                            {{ block.value }}
                        </div>-->
                        <div class="dashboard-block">
                            <div class="dashboard-card-header">
                                {{ block.display }}
                            </div>
                            <div class="dashboard-card-body">
                                {{ block.value }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <csv-viewer
            v-if="showCSVViewer"
            :csvLink="csvLink"
            :title="viewerTitle"
            @closedialog="showCSVViewer = false"
        ></csv-viewer>
    </div>
</template>

<style lang="less" scoped>
@import './../../less/form.less';
.graphs {
    padding: 24px;
    border-bottom: 1px solid @Iron;
    border-radius: 4px;
    background-color: @White;
    margin-bottom: 24px;
}
.dashboard-chart {
    display: flex;
    flex-wrap: wrap;
    margin-top: 24px;
    .dashboard-canvas {
        width: 40%;
        @media @mobile{
            width: 100%;
        }
    }
    .dashboard-canvas-content {
        width: 55%;
        margin: 24px 0 0 24px;
        @media @mobile{
            margin: 24px 0;
            width: 100%;
        }
        p {
            line-height: 1.5;
            color: @Mako;
            font-size: 14px;
            margin-top: 12px;
        }
    }
}
.text-block {
    margin-right: -24px;
    .dashboard-div {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        @media @mobile{
            display: block;
        }
    }
    .dashboard-card {
        // margin: 24px 0 0 0;
        flex: 0 25%;

        .dashboard-block {
            margin: 24px 24px 0 0;
            height: 110px;
            border: 1px solid #e1e1e1;
            border-radius: 4px;
            box-shadow: 0 8px 20px 0 rgba(0, 0, 0, 0.04);
            box-sizing: border-box;
        }
        .dashboard-card-header {
            height: 50%;
            border-bottom: 1px solid #e1e1e1;
            font-size: 16px;
            display: flex;
            align-items: center;
            padding: 0 24px;
            color: @Mako;
        }
        .dashboard-card-body {
            height: 50%;
            border-top: 1px solid #e1e1e1;
            font-size: 22px;
            display: flex;
            align-items: center;
            padding: 0 24px;
            font-weight: bold;
            color: @Mako;
        }
    }

    // > div {
    //     padding: 10px;
    //     margin: 10px;
    //     background: #ebedfb;
    //     border-radius: 7px;
    //     color: #2E31BE;
    //     cursor: default;
    //     min-width: 125px;
    //     line-height: 25px;
    //     text-align: center;
    // }
}
.shimmer {
    display: block;
    width: calc(100% - 80px);
    height: 300px;
    margin: 14px auto;
}
</style>

<script>
import VueCharts from 'vue-chartjs';
import isEmpty from 'lodash/isEmpty';
import { getCommonHeaderOptions } from '../../../../services/utils.service.js';
import Apiservice from './../../../../services/api.service.js';
import ADMIN_URLS from './../../../../services/admin/admin-url.service';
import loader from './../../../../components/admin/common/adm-loader.vue';
import adminlinesvg from './../../../../components/admin/common/adm-inline-svg.vue';
import csvViewer from './csv-viewer.vue';
import graphTitleBar from './graph-titlebar.vue';
import {
    transformRequestOptions,
    getURLSearchParams
} from '../../../../helper/utils';
import path from 'path';

import { DESCRIPTION } from './description';

export default {
    name: 'dashboard-group',
    components: {
        loader,
        'adm-inline-svg': adminlinesvg,
        'csv-viewer': csvViewer,
        'graph-titlebar': graphTitleBar
    },
    props: {
        refresh: {},
        group: '',
        queryData: ''
    },
    data() {
        return {
            components: [],
            groupName: '',
            showCSVViewer: false,
            showLoader: false,
            csvLink: '',
            viewerTitle: '',
            description: DESCRIPTION,
            applicationId: this.$route.params.applicationId
        };
    },
    watch: {
        $route(to, from) {
            // uncommenting as it refreshing whole chart on single component's filter refresh
            // if (
            //     this.$route.params.name &&
            //     this.$route.params.name !== this.groupName
            // ) {
            this.components = [];
            this.groupName = this.$route.params.name || this.group;
            this.fetchGroupData();
            // }
        },
        refresh() {
            if (this.refresh) {
                this.destroyCharts();
                setTimeout(() => {
                    this.fetchGroupData();
                }, 0);
            }
        }
    },
    mounted() {
        this.groupName = this.$route.params.name || this.group;
        this.fetchGroupData();
    },
    methods: {
        getId(index) {
            return `canvas${index}_${this.groupName}`;
        },
        resetChart(graph) {
            const graphElm = document.getElementById(graph.graph_id);
            if (graphElm) {
                graphElm.innerHTML = '';
            }
            if (graph.graph_inst) {
                graph.graph_inst.destroy();
            }
        },
        openCSVViewer(graph) {
            this.showCSVViewer = true;
            this.viewerTitle = graph.title;
            this.csvLink = graph.csvLink;
        },
        createChart(chartItem, chartData) {
            const canvasElm = document.getElementById(chartItem.graph_id);
            if (!canvasElm) return;
            canvasElm.width = 300;

            // if (chartData.data.labels.length > 350) canvasElm.height = 300;
            // else if (chartData.data.labels.length > 220) canvasElm.height = 250;
            // else if (chartData.data.labels.length > 80) canvasElm.height = 150;
            // else if (chartData.data.labels.length < 80) canvasElm.height = 70;
            canvasElm.height = 300;
            // if (Array.isArray(chartData.raw) && chartData.raw.length > 0) {
            let myChart = new Chart(canvasElm, {
                type: chartData.type,
                data: chartData.data,
                options: { ...chartData.options, maintainAspectRatio: 1 }
            });
            chartItem.graph_inst = myChart;
            // }
            // else {
            //     canvasElm.height = 50;
            //     canvasElm.width = 300;
            //     const ctx = canvasElm.getContext('2d');
            //     ctx.font = '20px Georgia';
            //     ctx.fillText('No Data Found', 10, 50);
            // }
        },
        filterGraph(item) {
            let { queryParams } = getURLSearchParams(item.graph.url);
            queryParams = Object.assign({}, queryParams, {
                [item.key]: item.identifier
            });
            const queryParam = Object.assign({}, this.$route.query, {
                [item.graph.key]: JSON.stringify(queryParams)
            });

            this.$router.replace({
                path: this.$route.path,
                // path.join(
                    // this.$basePath,
                    // '/dashboard/group/',
                    // this.groupName
                // ),
                query: queryParam
            });

            //update here
            this.resetChart(item.graph);
            item.graph.graph_loaded = false;
            const queryFilter = JSON.parse(queryParam[item.graph.key] || {});
            const apiURL =
                item.graph.graph_url +
                '?' +
                transformRequestOptions(queryFilter);
            Apiservice.get(
                ADMIN_URLS.GET_GRAPH_DATA(apiURL, this.applicationId),
                getCommonHeaderOptions()
            ).then(({ data }) => {
                this.setChartData(item.graph, data);
            });
        },
        setChartData(chartItem, data) {
            if (chartItem.type !== 'text-blocks') {
                // data.data.options.responsive = false;
                if (chartItem.type == 'chart.pie') {
                    data.data.options = {
                        tooltips: {
                            callbacks: {
                                title: function(tooltipItem, data) {
                                    let { datasets, labels } = data;
                                    return labels[tooltipItem[0].index];
                                },
                                label: function(tooltipItem, data) {
                                    let { datasets, labels } = data;
                                    datasets[0] = datasets[0] || {};
                                    let percent = (datasets[0].percent =
                                        datasets[0].percent || []);

                                    return (
                                        `${percent[tooltipItem.index]}%` ||
                                        labels[tooltipItem.index]
                                    );
                                }
                            }
                        }
                    };
                }
                this.createChart(chartItem, data.data);
            }
            chartItem.graph_loaded = true;
            chartItem.graph_data = data;
        },
        fetchGroupData() {
            this.showLoader = true;
            Apiservice.get(
                ADMIN_URLS.GET_GROUP(this.groupName, this.applicationId),
                getCommonHeaderOptions()
            )
                .then(({ data }) => {
                    let allGraphs = data.components || [];
                    this.components = allGraphs.map((it, index) => {
                        it.graph_id = this.getId(index);
                        it.graph_loaded = false;
                        it.graph_data = null;
                        it.graph_url = it.url;
                        const queryData = this.$route.query[it.key];
                        if (queryData) {
                            const queryObj = JSON.parse(queryData);
                            it.url =
                                it.url +
                                '?' +
                                transformRequestOptions(queryObj);
                        } else {
                            const defaultQuery = isEmpty(this.queryData) ? {} : Object.assign({}, JSON.parse(this.queryData));
                            for (let i = 0; i < it.filters.length; i++) {
                                if (
                                    Array.isArray(it.filters[i].enum) &&
                                    it.filters[i].enum.length > 0
                                ) {
                                    defaultQuery[it.filters[i].key] =
                                        it.filters[i].enum[0].identifier;
                                }
                            }
                            if (Object.keys(defaultQuery).length > 0) {
                                const strQ = transformRequestOptions(
                                    defaultQuery
                                );
                                if (strQ) {
                                    it.url = it.url + '?' + strQ;
                                }
                            }
                        }
                        return it;
                    });
                    return data;
                })
                .then(res => {
                    if (!res.components.length) this.showLoader = false;
                    res.components.forEach((chartItem, index) => {
                        Apiservice.get(
                            ADMIN_URLS.GET_GRAPH_DATA(chartItem.url, this.applicationId),
                            getCommonHeaderOptions()
                        )
                            .then(({ data }) => {
                                this.setChartData(chartItem, data);
                                this.showLoader = false;
                            })
                            .catch(err => {
                                this.showLoader = false;
                                chartItem.graph_loaded = true;
                                console.error(err);
                            });
                    });
                })
                .catch(err => {
                    this.showLoader = false;
                    console.error(err);
                });
        },
        destroyCharts() {
            this.components = [];
        }
    },
    destroyed() {
        this.destroyCharts();
    }
};
</script>
