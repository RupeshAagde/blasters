import {
    ADMIN_CANCEL_WEBHOOK_REPORT,
    ADMIN_CHANGE_REPORT_HISTORY_PAGINATION, ADMIN_CLEAR_TO_DEFAULTS,
    ADMIN_GET_REPORT_HISTORIES,
    ADMIN_SET_SUBSCRIBER_ID,
    ADMIN_SET_SUBSCRIBER_ID_MAP
} from "../action.type";
import {
    CANCEL_REPORT, CLEAR_STORE_TO_DEFAULT,
    PAGINATION_CHANGE,
    SET_REPORT_HISTORIES,
    SET_SUBSCRIBER_ID,
    SET_SUBSCRIBER_ID_MAP
} from "../mutation.type";
import AdminWebhookService from "@/services/admin-webhook.service.js";
import {GET_REPORT_HISTORIES, GET_REPORT_HISTORY_PAGINATION, GET_SUBSCRIBER_ID_MAP} from "../getters.type";
import {REPORT_HISTORY_STATUS} from "@/pages/webhook/report-history/utils/constants";

export const WEBHOOK_STATE = {
    WEBHOOK_REPORT_HISTORIES: "WEBHOOK_REPORT_HISTORIES",
    SUBSCRIBER_IDS_MAP: "SUBSCRIBER_IDS_MAP",
    SUBSCRIBER_ID: "SUBSCRIBER_ID",
};

const defaultPaginationObject = {size: 10, current: 1};

const getDefaultState = () => {
    return {
        [WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES]: {data: [], page: defaultPaginationObject},
        [WEBHOOK_STATE.SUBSCRIBER_IDS_MAP]: {},
        [WEBHOOK_STATE.SUBSCRIBER_ID]: {},
    };
};

const state = getDefaultState();


const getters = {
    [GET_REPORT_HISTORIES](state) {
        return state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].data;
    },
    [GET_REPORT_HISTORY_PAGINATION](state) {
        return state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].page;
    }, [GET_SUBSCRIBER_ID_MAP](state) {
        return state[WEBHOOK_STATE.SUBSCRIBER_IDS_MAP];
    },
};

const actions = {
    [ADMIN_GET_REPORT_HISTORIES]({commit, state, dispatch}) {
        let subscriberIds = state[WEBHOOK_STATE.SUBSCRIBER_ID];
        const subscriberIdsMap = sessionStorage.getItem('subscriberIdMap');
        if (subscriberIdsMap) {
            dispatch(ADMIN_SET_SUBSCRIBER_ID_MAP, JSON.parse(subscriberIdsMap));
        }
        if (!subscriberIds || !subscriberIds.length) {
            const storedData = sessionStorage.getItem('data');
            const data = storedData ? JSON.parse(storedData) : {};
            subscriberIds = data.subscriber_ids;
        }
        let page = null;
        if (state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].page) {
            const {current, size} = state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].page;
            page = {page_no: current, page_size: size};
        }
        return AdminWebhookService.getReportHistories(subscriberIds, page)
            .then(res => {
                const {items, page} = res.data;
                commit(SET_REPORT_HISTORIES, {data: items, page});
            }).catch(err => {

            });
    },
    [ADMIN_CANCEL_WEBHOOK_REPORT]({commit}, {filename, index}) {
        return AdminWebhookService.cancelWebhookReport(filename)
            .then(res => {
                commit(CANCEL_REPORT, {index})
            }).catch(err => {
            });
    },
    [ADMIN_CHANGE_REPORT_HISTORY_PAGINATION]({commit, dispatch}, page) {
        commit(PAGINATION_CHANGE, page);
        dispatch(ADMIN_GET_REPORT_HISTORIES)
    },
    [ADMIN_SET_SUBSCRIBER_ID_MAP]({commit}, map) {
        commit(SET_SUBSCRIBER_ID_MAP, map);
    },
    [ADMIN_SET_SUBSCRIBER_ID]({commit}, id) {
        commit(SET_SUBSCRIBER_ID, id);
    }, [ADMIN_CLEAR_TO_DEFAULTS]({commit}) {
        commit(CLEAR_STORE_TO_DEFAULT);
    },
};
const mutations = {
    [SET_REPORT_HISTORIES](state, data) {
        state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES] = data;
    }, [CANCEL_REPORT](state, {index}) {
        state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].data[index].status = REPORT_HISTORY_STATUS.CANCELLED;
        state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].data[index].message = `File Download request was cancelled`;
    }, [SET_SUBSCRIBER_ID_MAP](state, map) {
        state[WEBHOOK_STATE.SUBSCRIBER_IDS_MAP] = map;
        sessionStorage.setItem('subscriberIdMap', JSON.stringify(map));
    }, [SET_SUBSCRIBER_ID](state, id) {
        state[WEBHOOK_STATE.SUBSCRIBER_ID] = [Number(id)];
    },[CLEAR_STORE_TO_DEFAULT](state) {
        state[WEBHOOK_STATE.SUBSCRIBER_ID] = null;
        state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES] = {...state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES], page: defaultPaginationObject};
    },
    [PAGINATION_CHANGE](state, pageObject) {
        const {total, current, limit} = pageObject;
        state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].page = {
            ...state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].page, ...{
                item_total: total,
                size: limit,
                current
            }
        };
    }
};

export function createAdminWebhookStore() {
    return {
        state, actions, mutations, getters
    };
}
