import {DASHBOARD_PAGE_PANELS, GRAPH_HEADER_STATE} from "@/constants/chart/dashboardConstants";
import {
    ADMIN_CHANGE_GRAPH_FILTER,
    ADMIN_CHANGE_TAB,
    ADMIN_CHECK_STATUS_OF_SALES_DUMP,
    ADMIN_CLEAR_FILTERS,
    ADMIN_CLONE_GLOBAL_FILTERS,
    ADMIN_EXPORT_TABLE,
    ADMIN_FETCH_DASHBOARD_DATA,
    ADMIN_FETCH_REPORT_DATA,
    ADMIN_FLOAT_INDIVIDUAL_CHART_DATA,
    ADMIN_FLOAT_INDIVIDUAL_FILTER_CARD_DATA,
    ADMIN_LAYOUT_FOR_EXTRA_LARGER_DEVICE,
    ADMIN_LAYOUT_FOR_LARGER_DEVICE,
    ADMIN_LAYOUT_FOR_MOBILE_DEVICE,
    ADMIN_LOAD_FILTER_DROPDOWN_VALUES,
    ADMIN_MAKE_STAGING_FILTERS_LIVE,
    ADMIN_REQUEST_SALES_DUMP,
    ADMIN_RESET_ALL_REFRESH_TOKENS,
    ADMIN_RESET_DASHBOARD_LAYOUT,
    ADMIN_RESET_DROPDOWN_SEED_FILTERS_FOR_DUNZO_DASHBOARD,
    ADMIN_RESET_INDIVIDUAL_CHART_DATA,
    ADMIN_RESET_INDIVIDUAL_FILTER_CARD_DATA,
    ADMIN_RESIZE_REPORT_PAGE,
    ADMIN_SALES_DUMP_CANCEL,
    ADMIN_SALES_DUMP_INITIATE_REQUEST,
    ADMIN_SALES_DUMP_RETRY,
    ADMIN_SAVE_DASHBOARD_DRAGGABLE,
    ADMIN_SAVE_FILTERS,
    ADMIN_SAVE_PAGINATION_CHANGE,
    ADMIN_SET_ACTIVE_TAB,
    ADMIN_SET_IS_DEFAULT_FLAG,
    ADMIN_START_COMPONENT_SPECIFIC_DOWNLOAD,
    ADMIN_TOGGLE_REFRESH_TOKENS
} from "../action.type";
import {
    ACTION_ON_SALES_DUMP_STATUS,
    ADMIN_SET_DASHBOARD_DATA,
    ADMIN_SET_REPORT_DATA,
    CANCEL_SALES_DUMP,
    CHANGE_PAGES_SIZE,
    CLEAR_FILTERS,
    CLEAR_SALES_DUMP,
    CLONE_GLOBAL_FILTERS,
    CLOSE_THE_CARD,
    LAYOUT_FOR_EXTRA_LARGER_DEVICE,
    LAYOUT_FOR_LARGER_DEVICE,
    LAYOUT_FOR_MOBILE_DEVICE,
    LOAD_GROWTH_FACTOR,
    LOAD_INDIVIDUAL_FILTER_CARD_DATA,
    LOAD_INDIVIDUAL_GRAPH_DATA,
    MAKE_STAGING_FILTERS_LIVE,
    NAVIGATE_PAGE,
    REQUEST_SALES_DUMP,
    RESET_FILTERS,
    RESET_INDIVIDUAL_GRAPH_DATA,
    RESET_REFRESH_TOKENS,
    RESET_SEED_FILTERS_ON_EVENT,
    RESIZE_REPORT_PAGE,
    SAVE_ALL_FILTERS,
    SAVE_COMPONENT_SPECIFIC_FILTERS,
    SAVE_DASHBOARD_FILTER_ORDER,
    SAVE_DASHBOARD_GRID_ORDER,
    SAVE_SEED_FILTER_FOR_DROPDOWNS,
    SET_ADDITIONAL_FILTERS,
    SET_IS_DEFAULT_LAYOUT,
    SET_NAV_LINK,
    SET_PAGINATION,
    SET_REFRESH_TOKENS,
    SET_REPORT_FILTERS_SEED_DATA,
    SET_SALES_CHANNELS_INFO,
    SET_SALES_DUMP_STATUS,
    SET_SEED_FILTERS,
    SET_SELECTED_TAB,
    SET_STAGED_FILTERS,
    SET_STAGES,
    SET_TAB_MODEL,
    TOGGLE_LAYOUT_HEADER_GRAPH,
    TOGGLE_REFRESH_FOR_ALL_FILTERS,
    TURN_PAGINATION_CONTROL_FLAG
} from "../mutation.type";
import {ChartData} from "@/components/generic-graphs/data/data";
import AdminAnalyticsService from "@/services/admin-analytics.service";
import {
    ANALYTICS_PAGES,
    CANVAS_HEIGHT,
    HTTP_STATUS_CODES,
    REPORT_PAGE_PANELS
} from "@/components/generic-graphs/data/constants";
import {
    checkIfDashboardCategory,
    cleanFilters,
    filterDataPoints,
    getSalesChannelIds,
    saveSeedFilters,
    setDashboardData,
    setDefaultRefreshTokens,
    setDefaultValuesForPages,
    spliceIndices
} from "@/helper/analytics-helper";
import {
    GET_ADDITIONAL_FILTER_NAMES,
    GET_ALL_FILTERS,
    GET_DASHBOARD_CARD_NAV_LINK,
    GET_GLOBAL_FILTERS,
    GET_GLOBAL_SEED_FILTERS,
    GET_GLOBALLY_STAGED_FILTER,
    GET_IS_DEFAULT_LAYOUT_FLAG,
    REPORT_GRAPH_FILTER_INDEX,
    REPORT_SELECTED_DATE_FILTERS,
    SALES_DUMP_DOWNLOAD_STATUS,
    SALES_DUMP_TRACKER,
    TABLE_FILTERS_SEED_DATA
} from "../getters.type";
import {constructFilterControlFlags, organiseDataForReports} from "@/components/generic-graphs/utils/reportDataUtil";
import {FILTER_CONDITIONS} from "@/constants/chart/reportConstants";
import {cloneDeep} from "lodash";
import {pickValues} from "../../helper/utils";
import {constructAnalyticsBeginningUrl, preparePayloads} from "../../helper/analytics-helper";

export const ANALYTICS_STATE = {
    DASHBOARD_DATA: "DASHBOARD_DATA",
    REPORT_DATA: "REPORT_DATA",
    REPORT_STAGES: "REPORT_STAGES",
    REPORT_FILTERS: "REPORT_FILTERS",
    DASHBOARD_FILTERS: "DASHBOARD_FILTERS",
    REFRESH_ALL_PAGE: "REFRESH_TOKENS",
    REPORT_TAB_MODEL: "REPORT_TAB_MODEL",
    REPORT_FILTERS_SEED_DATA: "REPORT_FILTERS_SEED_DATA",
    REPORTS_SELECTED_TAB: "REPORTS_SELECTED_TAB",
    PAGINATION: "PAGINATION",
    FILTER_CONTROL_FLAGS: "FILTER_CONTROL_FLAGS",
    IS_DEFAULT_LAYOUT: "IS_DEFAULT_LAYOUT",
    SEED_FILTERS: 'SEED_FILTERS',
    ADDITIONAL_FILTERS: 'ADDITIONAL_FILTERS',
    STAGED_FILTERS: 'STAGED_FILTERS',
    SALES_DUMP_EXPORT: 'SALES_DUMP_EXPORT',
    ACTIVE_SALES_DUMPS: 'ACTIVE_SALES_DUMPS',
    SALES_CHANNEL_TYPES: 'SALES_CHANNEL_TYPES',
};

export const SALES_DUMP_STATUSES = {
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED',
    DEFAULT: 'DEFAULT',
}
export const SALES_DUMP_KEYS = {
    TRACKER: 'TRACKER',
};

export const GLOBAL_FILTERS_MODEL = {
    START_DATE: "start_date",
    END_DATE: "end_date",
    COMPARE_START_DATE: "compare_start_date",
    COMPARE_END_DATE: "compare_end_date"
};
export const PAGINATION_MODEL = {
    CURRENT: "current",
    SIZE: "size",
    ITEM_TOTAL: "item_total",
    TOTAL_PAGE: "total_page",
    HAS_NEXT: "has_next",
    HAS_PREV: "has_previous",
};


export const FILTER_TYPES = {
    GLOBAL_FILTERS: "globalFilters",
    CARD_SELECTED: "card_selected",
    CARD_NAV_LINK: "CARD_NAV_LINK",
    GRAPH_FILTERS: "graphFilter",
    TIME_FILTERS: "time_frame_unit",
    TABLE_FILTERS: 'conditional_filters',
    COMPONENT_SPECIFIC: 'component_specific',
};
export const REPORT_FILTERS = {
    GRAPH_TYPE: "graph_type", TIME_FILTER: "time_filter", CONDITIONAL_FILTER: "conditional_filter"
};

export const SALES_CHANNEL_TYPE = {
    MARKET_PLACES: 'marketplaces',
    FYND_STORE: 'fynd_store',
    E_COMM: 'e_comm',
}

const getDefaultState = () => {
    return {
        [ANALYTICS_STATE.DASHBOARD_DATA]: {},
        [ANALYTICS_STATE.REPORT_DATA]: null,
        [ANALYTICS_STATE.REPORT_STAGES]: [],
        [ANALYTICS_STATE.DASHBOARD_FILTERS]: {
            [FILTER_TYPES.GLOBAL_FILTERS]: {
                [GLOBAL_FILTERS_MODEL.START_DATE]: '',
                [GLOBAL_FILTERS_MODEL.END_DATE]: '',
                [GLOBAL_FILTERS_MODEL.COMPARE_START_DATE]: '',
                [GLOBAL_FILTERS_MODEL.COMPARE_END_DATE]: ''
            }
        },
        [ANALYTICS_STATE.REPORT_FILTERS]: {
            [FILTER_TYPES.GLOBAL_FILTERS]: {
                [GLOBAL_FILTERS_MODEL.START_DATE]: '',
                [GLOBAL_FILTERS_MODEL.END_DATE]: '',
                [GLOBAL_FILTERS_MODEL.COMPARE_START_DATE]: '',
                [GLOBAL_FILTERS_MODEL.COMPARE_END_DATE]: ''
            }
        },
        [ANALYTICS_STATE.REFRESH_ALL_PAGE]: setDefaultRefreshTokens(ANALYTICS_PAGES),
        [ANALYTICS_STATE.REPORT_FILTERS_SEED_DATA]: {},
        [ANALYTICS_STATE.REPORT_TAB_MODEL]: {},
        [ANALYTICS_STATE.PAGINATION]: {},
        [ANALYTICS_STATE.FILTER_CONTROL_FLAGS]: {},
        [ANALYTICS_STATE.REPORTS_SELECTED_TAB]: null,
        [ANALYTICS_STATE.IS_DEFAULT_LAYOUT]: setDefaultValuesForPages(ANALYTICS_PAGES, true),
        [ANALYTICS_STATE.SEED_FILTERS]: setDefaultValuesForPages(ANALYTICS_PAGES, {}),
        [ANALYTICS_STATE.ADDITIONAL_FILTERS]: setDefaultValuesForPages(ANALYTICS_PAGES, []),
        [ANALYTICS_STATE.STAGED_FILTERS]: setDefaultValuesForPages(ANALYTICS_PAGES, {
            [GLOBAL_FILTERS_MODEL.START_DATE]: '',
            [GLOBAL_FILTERS_MODEL.END_DATE]: '',
            [GLOBAL_FILTERS_MODEL.COMPARE_START_DATE]: '',
            [GLOBAL_FILTERS_MODEL.COMPARE_END_DATE]: ''
        }),
        [ANALYTICS_STATE.SALES_DUMP_EXPORT]: setDefaultValuesForPages(ANALYTICS_PAGES, {}),
        [ANALYTICS_STATE.ACTIVE_SALES_DUMPS]: setDefaultValuesForPages(ANALYTICS_PAGES, {}),
        [ANALYTICS_STATE.SALES_CHANNEL_TYPES]: {},
    };
};
const MAX_RETRY_TIMES = 100;
const TIME_INTERVAL_IN_SECS = 2;

const state = getDefaultState();


const getters = {
    [ANALYTICS_STATE.DASHBOARD_DATA](state) {
        return state[ANALYTICS_STATE.DASHBOARD_DATA];
    },
    [ANALYTICS_STATE.REPORT_DATA](state) {
        return state[ANALYTICS_STATE.REPORT_DATA];
    },
    [ANALYTICS_STATE.REPORT_STAGES](state) {
        return state[ANALYTICS_STATE.REPORT_STAGES];
    },
    [GET_ALL_FILTERS](state) {
        return {
            [ANALYTICS_STATE.DASHBOARD_FILTERS]: state[ANALYTICS_STATE.DASHBOARD_FILTERS],
            [ANALYTICS_STATE.REPORT_FILTERS]: state[ANALYTICS_STATE.REPORT_FILTERS]
        };
    },
    [TABLE_FILTERS_SEED_DATA](state) {
        return state[ANALYTICS_STATE.REPORT_DATA].table.filters.data.reduce((a, x) => {
            a[x.id] = x;
            return a;
        }, {});
    },
    [ANALYTICS_STATE.REFRESH_ALL_PAGE](state) {
        return state[ANALYTICS_STATE.REFRESH_ALL_PAGE];
    },
    [ANALYTICS_STATE.REPORT_FILTERS_SEED_DATA](state) {
        return state[ANALYTICS_STATE.REPORT_FILTERS_SEED_DATA];
    },
    [ANALYTICS_STATE.REPORT_TAB_MODEL](state) {
        return state[ANALYTICS_STATE.REPORT_TAB_MODEL];
    },
    [ANALYTICS_STATE.PAGINATION](state) {
        return state[ANALYTICS_STATE.PAGINATION];
    },
    [REPORT_SELECTED_DATE_FILTERS](state) {
        return state[ANALYTICS_STATE.REPORT_FILTERS];
    },
    [REPORT_GRAPH_FILTER_INDEX](state) {
        const filter = state[ANALYTICS_STATE.REPORT_FILTERS][FILTER_TYPES.GRAPH_FILTERS];
        const index = state[ANALYTICS_STATE.REPORT_FILTERS_SEED_DATA].graphFilters.findIndex(x => x.id === filter);
        return index < 0 ? 0 : index;
    },
    [GET_DASHBOARD_CARD_NAV_LINK](state) {
        return function (pageName) {
            const page = checkIfDashboardCategory(pageName) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
            return state[page][FILTER_TYPES.CARD_NAV_LINK];
        };
    },
    [GET_IS_DEFAULT_LAYOUT_FLAG](state) {
        return function (pageName) {
            return state[ANALYTICS_STATE.IS_DEFAULT_LAYOUT][pageName];
        };
    },
    [GET_GLOBAL_SEED_FILTERS](state) {
        return function (pageName) {
            return state[ANALYTICS_STATE.SEED_FILTERS][pageName][FILTER_TYPES.GLOBAL_FILTERS];
        };
    }, [GET_GLOBAL_FILTERS](state) {
        return function (pageName, filterName = null) {
            const page = checkIfDashboardCategory(pageName) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS
            if (!pageName || !state[page] || !state[page][FILTER_TYPES.GLOBAL_FILTERS]) {
                return '';
            }
            return filterName ? state[page][FILTER_TYPES.GLOBAL_FILTERS][filterName] : state[page][FILTER_TYPES.GLOBAL_FILTERS];
        };
    },
    [GET_ADDITIONAL_FILTER_NAMES](state) {
        return function (pageName) {
            if (!state[ANALYTICS_STATE.ADDITIONAL_FILTERS] || !state[ANALYTICS_STATE.ADDITIONAL_FILTERS][pageName]) {
                return [];
            }
            return state[ANALYTICS_STATE.ADDITIONAL_FILTERS][pageName];
        };
    },
    [GET_GLOBALLY_STAGED_FILTER](state) {
        return function (pageName, filterName = null, locationUrl = FILTER_TYPES.GLOBAL_FILTERS) {
            if (!state[ANALYTICS_STATE.STAGED_FILTERS] || !state[ANALYTICS_STATE.STAGED_FILTERS][pageName] || !pickValues(state[ANALYTICS_STATE.STAGED_FILTERS][pageName], locationUrl)) {
                return '';
            }
            return filterName ? pickValues(state[ANALYTICS_STATE.STAGED_FILTERS][pageName], [...locationUrl, filterName]) : pickValues(state[ANALYTICS_STATE.STAGED_FILTERS][pageName], locationUrl);
        };
    },
    [SALES_DUMP_DOWNLOAD_STATUS](state) {
        return state[ANALYTICS_STATE.SALES_DUMP_EXPORT];
    }, [SALES_DUMP_TRACKER](state) {
        const pageName = ANALYTICS_PAGES.REPORTS;
        let jobId = null;
        const jobIdBeta = Object.keys(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][pageName])[0];
        if (jobIdBeta)
            jobId = jobIdBeta;
        if (!jobId)
            return state[ANALYTICS_STATE.SALES_DUMP_EXPORT][pageName][SALES_DUMP_KEYS.TRACKER];
        return state[ANALYTICS_STATE.SALES_DUMP_EXPORT][pageName][SALES_DUMP_KEYS.TRACKER][jobId];
    },
};
const initialData = ChartData;

const actions = {
    [ADMIN_FETCH_DASHBOARD_DATA]({commit, state}, {
        appId,
        emailId,
        mobileNumber,
        pageName = ANALYTICS_PAGES.DASHBOARD
    }) {
        const salesChannelType = state[ANALYTICS_STATE.SALES_CHANNEL_TYPES][appId] && state[ANALYTICS_STATE.SALES_CHANNEL_TYPES][appId].type;
        return AdminAnalyticsService.getLayoutDataById(appId, emailId, mobileNumber, pageName, salesChannelType)
            .then(res => {
                setDashboardData(res, commit);
                // console.log('state: ', state);
            }).catch(() => {
                commit(ADMIN_SET_DASHBOARD_DATA, null);
                let screen_width = screen.width;
                if (screen_width < 1050) {
                    commit(LAYOUT_FOR_MOBILE_DEVICE);
                } else if (screen_width > 1200) {
                    commit(LAYOUT_FOR_EXTRA_LARGER_DEVICE, screen_width);
                } else if (screen_width < 1220) {
                    commit(LAYOUT_FOR_LARGER_DEVICE);
                }
            });
        // setDashboardData({data: ninjaJson}, commit);
    },
    [ADMIN_FETCH_REPORT_DATA]({commit, state}, {appId, emailId, mobileNumber}) {
        const salesChannelType = state[ANALYTICS_STATE.SALES_CHANNEL_TYPES][appId].type;
        return AdminAnalyticsService.getLayoutDataById(appId, emailId, mobileNumber, ANALYTICS_PAGES.REPORTS, salesChannelType)
            .then(res => {
                const {rlayout: data, seedFilters} = res.data;
                const tabName = state[ANALYTICS_STATE.REPORTS_SELECTED_TAB] || Object.keys(data)[0];
                const selectedGraphFilter = state[ANALYTICS_STATE.REPORT_FILTERS][FILTER_TYPES.GRAPH_FILTERS] || '';
                // const selectedTimeFilter = state[ANALYTICS_STATE.REPORT_FILTERS][FILTER_TYPES.TIME_FILTERS];
                const {
                    reportData,
                    stages,
                    graphFilters,
                    timeFilters
                } = organiseDataForReports(data, tabName, selectedGraphFilter);
                commit(SET_STAGES, stages);
                commit(ADMIN_SET_REPORT_DATA, reportData);
                commit(SET_REPORT_FILTERS_SEED_DATA, {graphFilters, timeFilters});
                commit(SET_TAB_MODEL, data);
                commit(SET_SELECTED_TAB, tabName);
                commit(SAVE_ALL_FILTERS, {pageName: ANALYTICS_PAGES.REPORTS, graphFilter: selectedGraphFilter});
                saveSeedFilters(commit, seedFilters, ANALYTICS_PAGES.REPORTS);
            })
            .catch((err) => {
                console.error(err);
                commit(ADMIN_SET_REPORT_DATA, {layoutHeader: null, table: null});
            })
            .finally(() => {
                let screen_width = screen.width;
                commit(RESIZE_REPORT_PAGE, {screenWidth: screen_width});
                return initialData;
            });

    },
    [TOGGLE_LAYOUT_HEADER_GRAPH]({commit}, data) {
        commit(TOGGLE_LAYOUT_HEADER_GRAPH, data);
    },
    [ADMIN_LAYOUT_FOR_MOBILE_DEVICE]({commit}, data) {
        commit(LAYOUT_FOR_MOBILE_DEVICE, data);
    },
    [ADMIN_LAYOUT_FOR_LARGER_DEVICE]({commit}, data) {
        commit(LAYOUT_FOR_LARGER_DEVICE, data);
    },
    [ADMIN_LAYOUT_FOR_EXTRA_LARGER_DEVICE]({commit}, data) {
        commit(LAYOUT_FOR_EXTRA_LARGER_DEVICE, data);
    },
    [ADMIN_FLOAT_INDIVIDUAL_CHART_DATA]({commit, state}, {
        panelIndex, cardIndex, url, pageName, appId, allFilters, chartId, graphType
    }) {
        let {filters, page} = preparePayloads(pageName, allFilters, state, chartId, graphType);
        return AdminAnalyticsService.getChartOrStatData(url, appId, cleanFilters(filters), page).then(res => {
            const data = res.data;
            if (res.status === 204) {
                commit(LOAD_INDIVIDUAL_GRAPH_DATA, {
                    graphData: {columns: [], rows: [], xAxes: [], yAxes: []},
                    panelIndex,
                    cardIndex,
                    pageName,
                    url,
                    statusCode: res.status
                });
                commit(SET_PAGINATION, {graphId: chartId});
            }
            if (res.status === 200) {
                commit(LOAD_INDIVIDUAL_GRAPH_DATA, {
                    graphData: data,
                    panelIndex,
                    cardIndex,
                    pageName,
                    url,
                    statusCode: res.status
                });
                commit(SET_PAGINATION, {graphId: chartId, ...data.page});
            }
        }).catch(err => {
            console.error(err);
            commit(LOAD_INDIVIDUAL_GRAPH_DATA, {
                graphData: {columns: [], rows: [], xAxes: [], yAxes: []},
                panelIndex,
                cardIndex,
                pageName,
                url,
                statusCode: 500
            });
            commit(SET_PAGINATION, {graphId: chartId});
        }).finally(() => {
            commit(SET_REFRESH_TOKENS, {key: url, toggleValue: false, page: pageName});
            commit(TURN_PAGINATION_CONTROL_FLAG, {pageName: pageName, toggleValue: false});
        });
    },
    [ADMIN_RESET_INDIVIDUAL_CHART_DATA]({commit}, {panelIndex, cardIndex, pageName}) {
        const data = null;
        commit(RESET_INDIVIDUAL_GRAPH_DATA, {graphData: data, panelIndex, cardIndex, pageName});
    },
    [ADMIN_FLOAT_INDIVIDUAL_FILTER_CARD_DATA]({commit}, {
        url, appId, allFilters, panelIndex, cardIndex, pageName, forGrowth = false
    }) {
        const filters = allFilters[checkIfDashboardCategory(pageName) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS][FILTER_TYPES.GLOBAL_FILTERS];
        return AdminAnalyticsService.getChartOrStatData(url, appId, filters)
            .then(res => {
                const data = res.data;
                if (forGrowth) {
                    commit(LOAD_GROWTH_FACTOR, {graphData: data, panelId: panelIndex, cardIndex});
                } else {
                    commit(LOAD_INDIVIDUAL_FILTER_CARD_DATA, {graphData: data, panelId: panelIndex, cardIndex});
                }
            })
            .catch()
            .finally(() => {
                commit(SET_REFRESH_TOKENS, {key: url, toggleValue: false, page: pageName});
            });
    },
    [ADMIN_RESET_INDIVIDUAL_FILTER_CARD_DATA]({commit}, {
        panelIndex, cardIndex, forGrowth = false
    }) {
        if (forGrowth) {
            commit(LOAD_GROWTH_FACTOR, {panelId: panelIndex, cardIndex});
        } else {
            commit(LOAD_INDIVIDUAL_FILTER_CARD_DATA, {panelId: panelIndex, cardIndex});
        }
    },
    [ADMIN_RESIZE_REPORT_PAGE]({commit}, data) {
        commit(RESIZE_REPORT_PAGE, data);
    },
    [ADMIN_SAVE_DASHBOARD_DRAGGABLE]({commit, state}, {
        email,
        appId,
        dashboardCards,
        filterCards,
        closeCards,
        mobileNumber
    }) {
        if (dashboardCards) {
            commit(SAVE_DASHBOARD_GRID_ORDER, dashboardCards);
        }
        if (closeCards) {
            commit(CLOSE_THE_CARD, closeCards);
        }
        commit(SET_IS_DEFAULT_LAYOUT, {page: ANALYTICS_PAGES.DASHBOARD, value: false});
        AdminAnalyticsService.saveLayout(email, mobileNumber, filterDataPoints(state[ANALYTICS_STATE.DASHBOARD_DATA]), appId).then(() => {

        });
    },
    [ADMIN_SAVE_FILTERS]({commit}, data) {
        const {isComponentSpecific = false} = data;
        if (isComponentSpecific) {
            commit(SAVE_COMPONENT_SPECIFIC_FILTERS, data);
            return;
        }
        commit(SAVE_ALL_FILTERS, data);
    },
    [ADMIN_TOGGLE_REFRESH_TOKENS]({commit}, toggleValue) {
        commit(SET_REFRESH_TOKENS, toggleValue);
    },
    [ADMIN_RESET_ALL_REFRESH_TOKENS]({commit}, data) {
        commit(RESET_REFRESH_TOKENS, data);
    },
    [ADMIN_CHANGE_TAB]({commit, state}, selectedTab) {
        commit(SET_SELECTED_TAB, selectedTab);
        const {
            reportData, graphFilters, timeFilters
        } = organiseDataForReports(state[ANALYTICS_STATE.REPORT_TAB_MODEL], selectedTab);
        commit(ADMIN_SET_REPORT_DATA, reportData);
        commit(SET_REPORT_FILTERS_SEED_DATA, {graphFilters, timeFilters});
        commit(RESET_FILTERS, {pageName: ANALYTICS_PAGES.REPORTS, filterType: [FILTER_TYPES.TABLE_FILTERS]})
    },
    [ADMIN_SET_ACTIVE_TAB]({commit}, selectedTab) {
        commit(SET_SELECTED_TAB, selectedTab);
    },
    [ADMIN_CHANGE_GRAPH_FILTER]({commit, state}, {graphFilter}) {
        const {
            reportData, timeFilters, graphFilters
        } = organiseDataForReports(state[ANALYTICS_STATE.REPORT_TAB_MODEL], state[ANALYTICS_STATE.REPORTS_SELECTED_TAB], graphFilter);
        commit(ADMIN_SET_REPORT_DATA, reportData);
        commit(SET_REPORT_FILTERS_SEED_DATA, {timeFilters, graphFilters});
        commit(RESET_FILTERS, {
            pageName: ANALYTICS_PAGES.REPORTS,
            filterType: [FILTER_TYPES.TABLE_FILTERS,]
        })
    },
    [ADMIN_SAVE_PAGINATION_CHANGE]({commit}, {graphId, current, limit, pageName = ANALYTICS_PAGES.REPORTS, panelIndex, cardIndex}) {
        commit(TURN_PAGINATION_CONTROL_FLAG, {pageName: pageName, flagValue: true});
        commit(CHANGE_PAGES_SIZE, {graphId, limit});
        commit(NAVIGATE_PAGE, {graphId, current, panelIndex, cardIndex});
    },
    [ADMIN_CLONE_GLOBAL_FILTERS]({commit}, data) {
        commit(CLONE_GLOBAL_FILTERS, data);
    },
    [ADMIN_EXPORT_TABLE]({commit, state}, {appId}) {
        const suffixUrl = state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo.dataSource;
        const chartId = state[ANALYTICS_STATE.REPORT_DATA].table.id;
        let {
            [FILTER_TYPES.GRAPH_FILTERS]: graphFilter,
            [FILTER_TYPES.GLOBAL_FILTERS]: globalFilters,
            ...filters
        } = state[ANALYTICS_STATE.REPORT_FILTERS];
        filters = {
            ...filters, ...globalFilters,
            [FILTER_TYPES.TABLE_FILTERS]: filters[FILTER_TYPES.TABLE_FILTERS] && filters[FILTER_TYPES.TABLE_FILTERS].length ? filters[FILTER_TYPES.TABLE_FILTERS] : null
        };

        let page = state[ANALYTICS_STATE.PAGINATION][chartId] && Object.keys(state[ANALYTICS_STATE.PAGINATION][chartId]).length > 0 ? state[ANALYTICS_STATE.PAGINATION][chartId] : null;
        return AdminAnalyticsService.getChartOrStatData(suffixUrl, appId, filters, page, 'export').then(
            res => {
                const url = res.data;
                window.open(url);
                return url;
            }
        );
    },
    [ADMIN_RESET_DASHBOARD_LAYOUT]({commit}, {appId, emailId, mobileNumber}) {
        return AdminAnalyticsService.resetLayoutDataByEmailId(appId, emailId, mobileNumber).then(res => setDashboardData(res, commit));
    },
    [ADMIN_SET_IS_DEFAULT_FLAG]({commit}, data) {
        commit(SET_IS_DEFAULT_LAYOUT, data);
    },
    [ADMIN_MAKE_STAGING_FILTERS_LIVE]({commit}, data) {
        commit(MAKE_STAGING_FILTERS_LIVE, data);
    },
    [ADMIN_CLEAR_FILTERS]({commit}, data) {
        commit(CLEAR_FILTERS, data);
    },
    [ADMIN_REQUEST_SALES_DUMP]({commit, state, dispatch}, {appId, pageName}) {
        const filters = state[ANALYTICS_STATE.REPORT_FILTERS][FILTER_TYPES.GLOBAL_FILTERS];
        return AdminAnalyticsService.requestSalesDump(appId, filters)
            .then(
                response => {
                    const jobId = response.data;
                    const payload = {pageName: ANALYTICS_PAGES.REPORTS, appId: appId, jobId}
                    const timerId = setInterval(function () {
                        dispatch(ADMIN_CHECK_STATUS_OF_SALES_DUMP, payload);
                    }, TIME_INTERVAL_IN_SECS * 1000);
                    commit(CLEAR_SALES_DUMP, {page: pageName, jobId: 1});
                    commit(REQUEST_SALES_DUMP, {page: pageName, jobId, timerId});
                    return jobId;
                }
            )
            .catch(err => {
                commit(REQUEST_SALES_DUMP, {page: pageName, timerId: 1, jobId: 1});
                commit(SET_SALES_DUMP_STATUS, {page: pageName, jobId: 1, statusCode: HTTP_STATUS_CODES.SERVER_ERROR});
                commit(ACTION_ON_SALES_DUMP_STATUS, {
                    page: pageName,
                    jobId: 1,
                });
                throw new Error();
            })
    },
    [ADMIN_CHECK_STATUS_OF_SALES_DUMP]({commit}, {appId, pageName, jobId}) {
        return AdminAnalyticsService.checkSalesDumpStatusOrCancel(jobId, appId)
            .then(result => {
                const {url, status} = result.data;
                commit(SET_SALES_DUMP_STATUS, {page: pageName, jobId, url, statusCode: result.statusCode, status});
                commit(ACTION_ON_SALES_DUMP_STATUS, {page: pageName, jobId, url, statusCode: result.statusCode});
            })
            .catch(err => {
                commit(SET_SALES_DUMP_STATUS, {page: pageName, jobId, statusCode: HTTP_STATUS_CODES.SERVER_ERROR});
                commit(ACTION_ON_SALES_DUMP_STATUS, {
                    page: pageName,
                    jobId,
                    statusCode: HTTP_STATUS_CODES.SERVER_ERROR
                });
            })
    },
    [ADMIN_SALES_DUMP_INITIATE_REQUEST]({commit}, data) {
        commit(REQUEST_SALES_DUMP, data)
    },
    [ADMIN_SALES_DUMP_RETRY]({commit, dispatch, state}, data) {
        let {pageName, appId, jobId} = data;
        const jobIdFromStore = Object.keys(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][pageName])[0];

        if (jobIdFromStore)
            jobId = jobIdFromStore;

        if (!jobId || Number(jobId) === 1) {
            dispatch(ADMIN_REQUEST_SALES_DUMP, {appId, pageName});
            return;
        }
        const payload = {pageName, appId, jobId}
        const timerId = setInterval(function () {
            dispatch(ADMIN_CHECK_STATUS_OF_SALES_DUMP, payload);
        }, TIME_INTERVAL_IN_SECS * 1000);
        commit(REQUEST_SALES_DUMP, {page: ANALYTICS_PAGES.REPORTS, jobId, timerId});
    },
    [ADMIN_SALES_DUMP_CANCEL]({commit, dispatch, state}, {page, appId, jobId}) {
        const jobIdBeta = Object.keys(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page])[0];
        if (jobIdBeta)
            jobId = jobIdBeta;
        AdminAnalyticsService.checkSalesDumpStatusOrCancel(jobId, appId, 'cancel')
            .then(res => {
                commit(CANCEL_SALES_DUMP, {page, jobId});
                commit(ACTION_ON_SALES_DUMP_STATUS, {page, jobId});
            })
            .catch(err => {
            })
    },
    [ADMIN_START_COMPONENT_SPECIFIC_DOWNLOAD]({commit, state}, {url, pageName, chartId}) {
        const filterPageLocation = pageName === ANALYTICS_PAGES.DASHBOARD ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
        let {
            [FILTER_TYPES.GRAPH_FILTERS]: graphFilter,
            [FILTER_TYPES.GLOBAL_FILTERS]: globalFilters,
            [FILTER_TYPES.COMPONENT_SPECIFIC]: componentSpecifics,
            ...filters
        } = state[filterPageLocation];
        filters = {
            ...filters, ...globalFilters, ...(componentSpecifics && componentSpecifics[chartId] && componentSpecifics[chartId]),
        };
        return AdminAnalyticsService.componentSpecificDownload(filters, url).then(res => {
            const url = res.data;
            window.open(url);
            return url;
        });
    },
    [ADMIN_LOAD_FILTER_DROPDOWN_VALUES]({commit, state}, {
        url,
        pageName,
        chartId,
        panelIndex,
        cardIndex,
        filterIndex,
        id
    }) {
        const allFilters = {
            [ANALYTICS_STATE.DASHBOARD_FILTERS]: state[ANALYTICS_STATE.DASHBOARD_FILTERS],
            [ANALYTICS_STATE.REPORT_FILTERS]: state[ANALYTICS_STATE.REPORT_FILTERS]
        };
        let {filters} = preparePayloads(pageName, allFilters, state, chartId, null);
        return AdminAnalyticsService.getChartOrStatData(url, null, filters, null).then(res => {
            const values = res.data;
            commit(SAVE_SEED_FILTER_FOR_DROPDOWNS, {
                values,
                panelIndex: panelIndex,
                cardIndex: cardIndex,
                filterIndex: filterIndex,
                pageName
            });
        }).finally(
            () => {
                commit(SET_REFRESH_TOKENS, {key: url, toggleValue: false, page: pageName});
            }
        );
    },
    [ADMIN_RESET_DROPDOWN_SEED_FILTERS_FOR_DUNZO_DASHBOARD]({commit, state}, {
        pageName,
        panelIndex,
        cardIndex,
        filterIndex,
        dependency,
        chartId,
        resetSelf = null
    }) {
        commit(SAVE_SEED_FILTER_FOR_DROPDOWNS, {
            values: null,
            panelIndex: panelIndex,
            cardIndex: cardIndex,
            filterIndex: filterIndex,
            pageName
        });
        commit(RESET_SEED_FILTERS_ON_EVENT, {
            values: null,
            panelIndex: panelIndex,
            cardIndex: cardIndex,
            filterIndex: filterIndex,
            pageName,
            dependency,
            chartId,
            resetSelf
        });
    },

};
const mutations = {
    [ADMIN_SET_DASHBOARD_DATA](state, data) {
        state[ANALYTICS_STATE.DASHBOARD_DATA] = data;
    }, [ADMIN_SET_REPORT_DATA](state, {layoutHeader, table}) {
        state[ANALYTICS_STATE.REPORT_DATA] = {headerGraph: layoutHeader, table: table};
    }, [TOGGLE_LAYOUT_HEADER_GRAPH](state, data) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][0].position.h = data === GRAPH_HEADER_STATE.CLOSED ? 2 : 4;
    }, [LAYOUT_FOR_MOBILE_DEVICE](state) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][0].cards.map((item) => {
            item.position = {
                x: 0, y: 0, w: 5.5, h: 4
            };
            return item;
        });
        state[ANALYTICS_STATE.DASHBOARD_DATA][1].cards.map((item, index) => {
            item.position = {
                x: 0, y: index * 3, w: 5.5, h: 3
            };
            return item;
        });
    },

    [LAYOUT_FOR_LARGER_DEVICE](state) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][0].cards.map((item) => {
            item.position = {
                x: 0, y: 0, w: 12, h: 4
            };
            return item;
        });
        var counter = 0;
        state[ANALYTICS_STATE.DASHBOARD_DATA][1].cards.map((item) => {
            if (item.id % 2 == 0) {
                item.position = {
                    x: 4.4, y: counter, w: 5.5, h: 3
                };
                counter = counter + 3;
            } else {
                item.position = {
                    x: 0, y: counter, w: 5.5, h: 3
                };
            }
            return item;
        });
    }, [LAYOUT_FOR_EXTRA_LARGER_DEVICE](state, data) {
        if (!state[ANALYTICS_STATE.DASHBOARD_DATA] || !state[ANALYTICS_STATE.DASHBOARD_DATA].length) {
            return;
        }
        state[ANALYTICS_STATE.DASHBOARD_DATA][0].cards.map((item) => {
            item.position = {
                x: 0, y: 0, w: 12, h: 4
            };
            return item;
        });
        var counter = 0;
        state[ANALYTICS_STATE.DASHBOARD_DATA][1].cards.map((item) => {
            if (item.id % 2 == 0) {
                item.position = {
                    x: (((data - 400) / 100) / 2), y: counter, w: 5.5, h: 3
                };
                counter = counter + 3;
            } else {
                item.position = {
                    x: 0, y: counter, w: 5.5, h: 3
                };
            }
            return item;
        });
    }, [LOAD_INDIVIDUAL_GRAPH_DATA](state, {panelIndex, cardIndex, graphData, pageName, url, statusCode}) {
        const {graphType, xAxes, yAxes} = graphData;
        let existingGraphInfo = null;
        const dataKey = panelIndex === REPORT_PAGE_PANELS.HEADER_GRAPH ? 'headerGraph' : 'table';
        if (checkIfDashboardCategory(pageName)) {
            existingGraphInfo = state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo;
        }
        if (pageName === ANALYTICS_PAGES.REPORTS) {
            existingGraphInfo = state[ANALYTICS_STATE.REPORT_DATA][dataKey].graphInfo;
        }
        let sacredData = {
            dataSource: url ? url : existingGraphInfo.dataSource,
            graphType: graphType ? graphType : existingGraphInfo.graphType,
            xAxes: xAxes,
            yAxes: yAxes,
            statusCode: statusCode
        };
        switch (pageName) {
            case ANALYTICS_PAGES.DASHBOARD:
                if (state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo.columns) {
                    sacredData = state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo;
                    sacredData.rows = graphData.rows;
                    sacredData.statusCode = statusCode;
                }
                state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo = {...sacredData};
                break;
            case ANALYTICS_PAGES.REPORTS:
                if (panelIndex === REPORT_PAGE_PANELS.TABLE && state[ANALYTICS_STATE.REPORT_DATA].table) {
                    sacredData = {
                        ...state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo,
                        rows: graphData.rows,
                        dataSource: url,
                        statusCode: statusCode
                    };
                }
                state[ANALYTICS_STATE.REPORT_DATA][dataKey].graphInfo = {...sacredData};
                break;
        }
    }, [RESET_INDIVIDUAL_GRAPH_DATA](state, {panelIndex, cardIndex, graphData, pageName}) {
        switch (pageName) {
            case ANALYTICS_PAGES.DASHBOARD: {
                let cleaningObject = {
                    xAxes: null, yAxes: null, statusCode: null
                };
                if (state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo.columns || state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo.rows) {
                    cleaningObject = {
                        rows: null,
                        statusCode: null
                    };
                }
                state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo = {
                    ...state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo, ...cleaningObject
                };
                break;
            }
            case ANALYTICS_PAGES.REPORTS: {
                if (panelIndex === REPORT_PAGE_PANELS.HEADER_GRAPH) {
                    state[ANALYTICS_STATE.REPORT_DATA].headerGraph.graphInfo = {
                        ...state[ANALYTICS_STATE.REPORT_DATA].headerGraph.graphInfo,
                        xAxes: null,
                        yAxes: null,
                        statusCode: null
                    };
                }
                if (panelIndex === REPORT_PAGE_PANELS.TABLE) {
                    state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo = {
                        ...state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo, rows: null, statusCode: null
                    };
                }
                break;
            }
        }
    }, [LOAD_INDIVIDUAL_FILTER_CARD_DATA](state, {
        graphData: graphStats = {value: "", changeInValue: ""}, panelId, cardIndex
    }) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][panelId].cards[0].filters.data[cardIndex].value = graphStats.value;
        state[ANALYTICS_STATE.DASHBOARD_DATA][panelId].cards[0].filters.data[cardIndex].changeInValue = graphStats.changeInValue;
        state[ANALYTICS_STATE.DASHBOARD_DATA][panelId].cards[0].filters.data[cardIndex].color = graphStats.color;
    }, [LOAD_GROWTH_FACTOR](state, {graphData: graphStats = {value: null, changeInValue: null, color: ''}, panelId, cardIndex}) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][panelId].cards[cardIndex].growth.value = graphStats.value;
        state[ANALYTICS_STATE.DASHBOARD_DATA][panelId].cards[cardIndex].growth.changeInValue = graphStats.changeInValue;
        state[ANALYTICS_STATE.DASHBOARD_DATA][panelId].cards[cardIndex].growth.color = graphStats.color;
    }, [RESIZE_REPORT_PAGE](state, {screenWidth}) {
        let canvasHeight = 0;
        if (screenWidth < 768 && screenWidth > 360 || screenWidth < 360) {
            canvasHeight = CANVAS_HEIGHT.MOBILE;
        }
        if (screenWidth > 768) {
            canvasHeight = CANVAS_HEIGHT.LARGE_SCREEN;
        }
        if (state[ANALYTICS_STATE.REPORT_DATA] && state[ANALYTICS_STATE.REPORT_DATA].headerGraph && state[ANALYTICS_STATE.REPORT_DATA].headerGraph.extraProps) {
            state[ANALYTICS_STATE.REPORT_DATA].headerGraph.extraProps.height = canvasHeight;
        }
    }, [SAVE_DASHBOARD_GRID_ORDER](state, dashboardCards) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][DASHBOARD_PAGE_PANELS.REST].cards = dashboardCards;
    },
    [SAVE_DASHBOARD_FILTER_ORDER](state, filterCards) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][DASHBOARD_PAGE_PANELS.HEADER].cards[0].filters.data = filterCards;
    },
    [SAVE_ALL_FILTERS](state, {
        pageName, globalFilters, cardSelected, timeFilter, graphFilter, appliedFilters, navLink, saveOnStaging = false
    }) {
        const page = checkIfDashboardCategory(pageName) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
        if (globalFilters) {
            if (!saveOnStaging) {
                state[page][FILTER_TYPES.GLOBAL_FILTERS] = {...state[page][FILTER_TYPES.GLOBAL_FILTERS], ...globalFilters};
            }
            state[ANALYTICS_STATE.STAGED_FILTERS][pageName][FILTER_TYPES.GLOBAL_FILTERS] = {...state[ANALYTICS_STATE.STAGED_FILTERS][pageName][FILTER_TYPES.GLOBAL_FILTERS], ...globalFilters};
        }
        if (cardSelected) {
            state[page][FILTER_TYPES.CARD_SELECTED] = cardSelected;
            state[page][FILTER_TYPES.CARD_NAV_LINK] = navLink;
            state[ANALYTICS_STATE.DASHBOARD_DATA][DASHBOARD_PAGE_PANELS.HEADER].cards[0].graphInfo = {
                ...state[ANALYTICS_STATE.DASHBOARD_DATA][DASHBOARD_PAGE_PANELS.HEADER].cards[0].graphInfo,
                yAxes: null,
                xAxes: null,
                dataSource: cardSelected
            };
        }
        if (timeFilter) {
            state[page][FILTER_TYPES.TIME_FILTERS] = timeFilter;
            if (!state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo) {
                state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo = {};
            }
            state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo.rows = null;

            if (state[ANALYTICS_STATE.REPORT_DATA].headerGraph.graphInfo) {
                state[ANALYTICS_STATE.REPORT_DATA].headerGraph.graphInfo.xAxes = null
                state[ANALYTICS_STATE.REPORT_DATA].headerGraph.graphInfo.yAxes = null
            }
        }
        if (graphFilter) {
            state[page][FILTER_TYPES.GRAPH_FILTERS] = graphFilter;
        }
        if (appliedFilters) {
            state[page][FILTER_TYPES.TABLE_FILTERS] = appliedFilters.map(c => ({
                column_name: c.operand1, operator: FILTER_CONDITIONS[c.operator], value: c.operand2, type: c.type
            }));
            state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo.rows = null
        }
        state[ANALYTICS_STATE.FILTER_CONTROL_FLAGS] = constructFilterControlFlags(state[page], page, false);
    }, [TOGGLE_REFRESH_FOR_ALL_FILTERS](state, toggleValue) {
        state[ANALYTICS_STATE.REFRESH_ALL_PAGE] = toggleValue;
    }, [SET_REFRESH_TOKENS](state, {key, toggleValue = false, page}) {
        const newObject = {
            [key]: toggleValue
        };
        state[ANALYTICS_STATE.REFRESH_ALL_PAGE][page] = {...state[ANALYTICS_STATE.REFRESH_ALL_PAGE][page], ...newObject};
    }, [RESET_REFRESH_TOKENS](state, {toggle, page}) {
        state[ANALYTICS_STATE.REFRESH_ALL_PAGE][page] = Object.keys(state[ANALYTICS_STATE.REFRESH_ALL_PAGE][page]).reduce((a, i) => {
            a[i] = toggle;
            return a;
        }, {});
    }, [SET_STAGES](state, stages) {
        state[ANALYTICS_STATE.REPORT_STAGES] = stages;
    }, [SET_TAB_MODEL](state, tabModel) {
        state[ANALYTICS_STATE.REPORT_TAB_MODEL] = tabModel;
    }, [SET_SELECTED_TAB](state, selectedTab) {
        state[ANALYTICS_STATE.REPORTS_SELECTED_TAB] = selectedTab;
    }, [SET_REPORT_FILTERS_SEED_DATA](state, filtersSeedData) {
        state[ANALYTICS_STATE.REPORT_FILTERS_SEED_DATA] = filtersSeedData;
    }, [SET_PAGINATION](state, {graphId, current, size, item_total, total_page, has_next, has_previous}) {
        state[ANALYTICS_STATE.PAGINATION][graphId] = {
            [PAGINATION_MODEL.CURRENT]: current,
            [PAGINATION_MODEL.SIZE]: size,
            [PAGINATION_MODEL.ITEM_TOTAL]: item_total,
            [PAGINATION_MODEL.TOTAL_PAGE]: total_page,
            [PAGINATION_MODEL.HAS_NEXT]: has_next,
            [PAGINATION_MODEL.HAS_PREV]: has_previous,
        };
    }, [NAVIGATE_PAGE](state, {graphId, current, panelIndex = null, cardIndex = null}) {
        // console.log('graphId: ', graphId, ' and refreshToken: ', state);
        if (current) {
            state[ANALYTICS_STATE.PAGINATION][graphId][PAGINATION_MODEL.CURRENT] = current;
            if (panelIndex === null && cardIndex === null) {
                state[ANALYTICS_STATE.REPORT_DATA].table.graphInfo.rows = null;
            } else {
                state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].graphInfo.rows = null;
            }
        }
    }, [CHANGE_PAGES_SIZE](state, {graphId, limit}) {
        if (limit) {
            state[ANALYTICS_STATE.PAGINATION][graphId][PAGINATION_MODEL.SIZE] = limit;
        }
    },
    [CLONE_GLOBAL_FILTERS](state, {to, from}) {
        if (to === ANALYTICS_PAGES.REPORTS) {
            to = ANALYTICS_STATE.REPORT_FILTERS;
            from = ANALYTICS_STATE.DASHBOARD_FILTERS;
        } else {
            to = ANALYTICS_STATE.DASHBOARD_FILTERS;
            from = ANALYTICS_STATE.REPORT_FILTERS;
        }
        state[to][FILTER_TYPES.GLOBAL_FILTERS] = state[from][FILTER_TYPES.GLOBAL_FILTERS];
    },
    [TURN_PAGINATION_CONTROL_FLAG](state, {flagValue, pageName}) {
        const controlKey = checkIfDashboardCategory(pageName) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
        if (!state[ANALYTICS_STATE.FILTER_CONTROL_FLAGS][controlKey]) {
            state[ANALYTICS_STATE.FILTER_CONTROL_FLAGS][controlKey] = {};
        }
        state[ANALYTICS_STATE.FILTER_CONTROL_FLAGS][controlKey].pagination = flagValue;
    },
    [RESET_FILTERS](state, {pageName, filterType = []}) {
        const key = pageName === ANALYTICS_PAGES.REPORTS ? ANALYTICS_STATE.REPORT_FILTERS : ANALYTICS_STATE.DASHBOARD_FILTERS;
        if (Array.isArray(filterType)) {
            filterType.forEach(f => {
                state[key][f] = null;
            });
        }
    },
    [SET_NAV_LINK](state, {pageName, navLink}) {
        const page = checkIfDashboardCategory(pageName) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
        state[page][FILTER_TYPES.CARD_NAV_LINK] = navLink;
    },
    [CLOSE_THE_CARD](state, {cardIndex, panelIndex}) {
        state[ANALYTICS_STATE.DASHBOARD_DATA][panelIndex].cards[cardIndex].hidden = true;
    },
    [SET_IS_DEFAULT_LAYOUT](state, {page, value}) {
        state[ANALYTICS_STATE.IS_DEFAULT_LAYOUT][page] = value;
    },
    [SET_SEED_FILTERS](state, {page, value}) {
        state[ANALYTICS_STATE.SEED_FILTERS][page] = value;
    },
    [SET_ADDITIONAL_FILTERS](state, {page, values}) {
        state[ANALYTICS_STATE.ADDITIONAL_FILTERS][page] = values;
    },
    [SET_STAGED_FILTERS](state, {page, values}) {
        state[ANALYTICS_STATE.STAGED_FILTERS][page] = {...values};
    },
    [MAKE_STAGING_FILTERS_LIVE](state, {page}) {
        const pageName = checkIfDashboardCategory(page) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
        state[pageName][FILTER_TYPES.GLOBAL_FILTERS] = {...state[pageName][FILTER_TYPES.GLOBAL_FILTERS], ...state[ANALYTICS_STATE.STAGED_FILTERS][page][FILTER_TYPES.GLOBAL_FILTERS]};
    },
    [CLEAR_FILTERS](state, {page, filterNames = [], indices = [], makeChangesLive = true}) {
        const pageName = checkIfDashboardCategory(page) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
        const updatedFilters = cloneDeep(state[ANALYTICS_STATE.STAGED_FILTERS][page][FILTER_TYPES.GLOBAL_FILTERS]);
        const seedFiltersMap = state[ANALYTICS_STATE.SEED_FILTERS][page][FILTER_TYPES.GLOBAL_FILTERS].reduce((a, i) => {
            a[i.id] = i.defaultValue ? i.defaultValue : spliceIndices(updatedFilters[i.id], indices)
            return a;
        }, {});

        if (!filterNames || !filterNames.length) {
            filterNames = state[ANALYTICS_STATE.ADDITIONAL_FILTERS][page]
        }
        for (let filter of filterNames) {
            updatedFilters[filter] = cloneDeep(seedFiltersMap[filter]);
        }
        if (makeChangesLive) {
            state[pageName][FILTER_TYPES.GLOBAL_FILTERS] = cloneDeep(updatedFilters);
        }
        state[ANALYTICS_STATE.STAGED_FILTERS][page][FILTER_TYPES.GLOBAL_FILTERS] = cloneDeep(updatedFilters);
    },
    [REQUEST_SALES_DUMP](state, {page, jobId, timerId}) {

        const tracker = {requestedTimes: 0, url: '', requestStatus: SALES_DUMP_STATUSES.IN_PROGRESS, jobId};
        state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER] = Object.assign({[jobId]: tracker}, {});
        state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId] = timerId;
    },
    [CANCEL_SALES_DUMP](state, {page, jobId}) {
        const tracker = state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER][jobId];
        tracker.requestStatus = SALES_DUMP_STATUSES.CANCELLED;
        state[ANALYTICS_STATE.SALES_DUMP_EXPORT] = {
            ...state[ANALYTICS_STATE.SALES_DUMP_EXPORT],
            ...{
                [page]: {
                    ...state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page],
                    ...{
                        [SALES_DUMP_KEYS.TRACKER]: {
                            ...state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER],
                            ...{
                                [jobId]: {...tracker}
                            }
                        }
                    }
                }
            }
        };
    },
    [SET_SALES_DUMP_STATUS](state, {page, jobId, url, statusCode, status, setDefault = false}) {
        const tracker = state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER][jobId];
        if (statusCode === HTTP_STATUS_CODES.SERVER_ERROR || statusCode === HTTP_STATUS_CODES.NOT_FOUND || statusCode === HTTP_STATUS_CODES.BAD_REQUEST) {
            tracker.requestStatus = SALES_DUMP_STATUSES.FAILED;
        }
        tracker.requestedTimes += 1;
        if (status === SALES_DUMP_STATUSES.DONE) {
            tracker.requestStatus = SALES_DUMP_STATUSES.DONE;
            tracker.url = url;
        }
        if (setDefault) {
            tracker.requestStatus = SALES_DUMP_STATUSES.DEFAULT;
        }
        state[ANALYTICS_STATE.SALES_DUMP_EXPORT] = {
            ...state[ANALYTICS_STATE.SALES_DUMP_EXPORT],
            ...{
                [page]: {
                    ...state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page],
                    ...{
                        [SALES_DUMP_KEYS.TRACKER]: {
                            ...state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER],
                            ...{
                                [jobId]: {...tracker}
                            }
                        }
                    }
                }
            }
        };
    },
    [ACTION_ON_SALES_DUMP_STATUS](state, {page, jobId}) {
        const tracker = state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER][jobId];
        if (tracker.requestStatus === SALES_DUMP_STATUSES.FAILED) {
            clearInterval(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId]);
        }
        if (tracker.requestStatus === SALES_DUMP_STATUSES.IN_PROGRESS) {
            if (tracker.requestedTimes >= MAX_RETRY_TIMES) {
                clearInterval(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId]);
            }
        }
        if (tracker.requestStatus === SALES_DUMP_STATUSES.CANCELLED) {
            clearInterval(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId]);
            delete state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId];
        }
        if (tracker.requestStatus === SALES_DUMP_STATUSES.DEFAULT) {
            delete state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId];
            delete state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER][jobId];
        }
        if (tracker.requestStatus === SALES_DUMP_STATUSES.DONE) {
            clearInterval(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId]);
            delete state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId];
            window.open(tracker.url);
        }
    },
    [CLEAR_SALES_DUMP](state, {page, jobId}) {
        if (!state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS] || !state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page] || !state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId]) {
            return;
        }
        clearInterval(state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId]);
        delete state[ANALYTICS_STATE.ACTIVE_SALES_DUMPS][page][jobId];
        delete state[ANALYTICS_STATE.SALES_DUMP_EXPORT][page][SALES_DUMP_KEYS.TRACKER][jobId];
    },
    [SET_SALES_CHANNELS_INFO](state, {applications, marketplaces}) {
        state[ANALYTICS_STATE.SALES_CHANNEL_TYPES] = getSalesChannelIds(applications, marketplaces);
    },
    [SAVE_COMPONENT_SPECIFIC_FILTERS](state, {
        pageName,
        filterId,
        timeFilter,
        searchFilter,
        genericComponentSpecific
    }) {
        const url = checkIfDashboardCategory(pageName) ? ANALYTICS_STATE.DASHBOARD_FILTERS : ANALYTICS_STATE.REPORT_FILTERS;
        if (!filterId) {
            return;
        }

        if (!state[url][FILTER_TYPES.COMPONENT_SPECIFIC]) {
            state[url][FILTER_TYPES.COMPONENT_SPECIFIC] = {[filterId]: {}}
        }

        if (genericComponentSpecific) {
            if (!state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId]) {
                state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId] = {}
            }
            state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId] = {...state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId], ...genericComponentSpecific};
            state[url] = cloneDeep(state[url]);
        }

        if (timeFilter) {
            state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId][FILTER_TYPES.TIME_FILTERS] = timeFilter;
        }
        if (searchFilter) {
            if (!state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId]) {
                state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId] = {}
            }
            state[url][FILTER_TYPES.COMPONENT_SPECIFIC][filterId][searchFilter.id] = searchFilter.searchText
        }
    },
    [SAVE_SEED_FILTER_FOR_DROPDOWNS](state, {
        pageName,
        panelIndex,
        cardIndex,
        filterIndex,
        values = null
    }) {
        const url = constructAnalyticsBeginningUrl(pageName);
        state[url][panelIndex].cards[cardIndex].filters.data[filterIndex] = {
            ...state[url][panelIndex].cards[cardIndex].filters.data[filterIndex],
            values: values
        };
        state[url][panelIndex].cards[cardIndex].filters = cloneDeep(state[url][panelIndex].cards[cardIndex].filters);
    }, [RESET_SEED_FILTERS_ON_EVENT](state, {
        pageName,
        panelIndex,
        cardIndex,
        dependency = [],
        chartId,
        resetSelf
    }) {
        const startingUrlForData = constructAnalyticsBeginningUrl(pageName);
        const startingUrlForFilters = constructAnalyticsBeginningUrl(pageName, true);
        state[startingUrlForData][panelIndex].cards[cardIndex].filters.data = state[startingUrlForData][panelIndex].cards[cardIndex].filters.data.map(x => ({
            ...x,
            ...(x.dataSource && dependency.includes(x.id) && {values: null})
        }));

        // remove all filters applied for those dependent ones
        if (resetSelf) {
            dependency.push(resetSelf.id);
        }
        const componentFilters = state[startingUrlForFilters][FILTER_TYPES.COMPONENT_SPECIFIC][chartId];
        const dependencyMap = dependency.reduce((a, item) => {
            a[item] = 1;
            return a;
        }, {});
        const finalSetOfFilters = Object.keys(componentFilters).reduce((a, item) => {
            if (!dependencyMap[item]) {
                a[item] = componentFilters[item];
            }
            return a;
        }, {});
        state[startingUrlForFilters][FILTER_TYPES.COMPONENT_SPECIFIC][chartId] = finalSetOfFilters;
        state[startingUrlForData] = cloneDeep(state[startingUrlForData]);
    },
};

export function createAdminAnalyticsStore() {
    return {
        state: getDefaultState(), actions, mutations, getters
    };
}
