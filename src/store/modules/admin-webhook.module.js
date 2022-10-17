import {
    ADMIN_CANCEL_WEBHOOK_REPORT,
    ADMIN_CHANGE_REPORT_HISTORY_PAGINATION,
    ADMIN_GET_REPORT_HISTORIES,
    ADMIN_SET_SUBSCRIBER_ID_MAP
} from "../action.type";
import {CANCEL_REPORT, PAGINATION_CHANGE, SET_REPORT_HISTORIES, SET_SUBSCRIBER_ID_MAP} from "../mutation.type";
import AdminWebhookService from "@/services/admin-webhook.service.js";
import {GET_REPORT_HISTORIES, GET_REPORT_HISTORY_PAGINATION, GET_SUBSCRIBER_ID_MAP} from "../getters.type";
import {REPORT_HISTORY_STATUS} from "@/pages/webhook/report-history/utils/constants";

export const WEBHOOK_STATE = {
    WEBHOOK_REPORT_HISTORIES: "WEBHOOK_REPORT_HISTORIES",
    SUBSCRIBER_IDS_MAP: "SUBSCRIBER_IDS_MAP",
};

const getDefaultState = () => {
    return {
        [WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES]: {data: [], page: {size: 10, current: 1}},
        [WEBHOOK_STATE.SUBSCRIBER_IDS_MAP]: {},
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
    [ADMIN_GET_REPORT_HISTORIES]({commit, state}) {
        const storedData = sessionStorage.getItem('data');
        const data = storedData ? JSON.parse(storedData) : {};
        let page = null;
        if (state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].page) {
            const {current, size} = state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].page;
            page = {page_no: current, page_size: size};
        }
        return AdminWebhookService.getReportHistories(data.subscriber_ids, page)
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
};
const mutations = {
    [SET_REPORT_HISTORIES](state, data) {
        state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES] = data;
    }, [CANCEL_REPORT](state, {index}) {
        state[WEBHOOK_STATE.WEBHOOK_REPORT_HISTORIES].data[index].status = REPORT_HISTORY_STATUS.CANCELLED;
    }, [SET_SUBSCRIBER_ID_MAP](state, map) {
        state[WEBHOOK_STATE.SUBSCRIBER_IDS_MAP] = map;
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
