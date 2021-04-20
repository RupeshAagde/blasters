import ApiService from './api.service';
import URLS from './domain.service';
import root from 'window-or-global';
const envVars = root.env || {};

const SupportService = {
    fetchTickets(params) {
        return ApiService.get(URLS.FETCH_TICKETS(), {
            params: { ...params }
        });
    },
    saveTicket(ticket) {
        let axiosOption = { data: ticket };
        return ApiService.post(URLS.FETCH_TICKETS(), axiosOption);
    },
    updateTicket(ticketID, ticket) {
        let axiosOption = { data: ticket };
        return ApiService.put(URLS.FETCH_TICKET(ticketID), axiosOption);
    },
    createVideoRoom() {
        let axiosOption = {};
        return ApiService.post(URLS.CREATE_VIDEO_ROOM(), axiosOption);
    },
    fetchHistory(ticketID) {
        return ApiService.get(URLS.FETCH_HISTORY(ticketID), {});
    },
    addComment(ticketID, comment) {
        let axiosOption = { data: comment };
        return ApiService.post(URLS.ADD_COMMENT(ticketID), axiosOption);
    },
    getTokenForVideoRoom(uniqueName) {
        let axiosOption = {};
        return ApiService.get(
            URLS.GET_VIDEO_ROOM_TOKEN(uniqueName),
            axiosOption
        );
    },
    deleteTicket(company_id, ticketID) {
        let axiosOption = {};
        return ApiService.del(
            URLS.FETCH_TICKET(company_id, ticketID),
            axiosOption
        );
    },
    getTicket(ticketID) {
        return ApiService.get(URLS.FETCH_TICKET(ticketID), {});
    },
    fetchOptions() {
        return ApiService.get(URLS.FETCH_TICKETS_OPTIONS(), {
            params: {}
        });
    },
    fetchDRI(company_id, params) {
        return ApiService.get(URLS.FETCH_DRIs(company_id), {
            params: params
        });
    },
    fetchShipmentInfo(id, company_id) {
        return ApiService.get(URLS.FETCH_SHIPMENT_INFO(id, company_id), {
            params: {}
        });
    },
    fetchCategories() {
        return ApiService.get(URLS.FETCH_CATEGORIES(), {
            params: {}
        });
    },
    addCategories(categories) {
        let axiosOption = { data: categories };
        return ApiService.post(URLS.FETCH_CATEGORIES(), axiosOption);
    }
    // Product Info
    // fetchProductInfo(slug) {
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
    //         params: {}
    //     });
    //     return ApiService.get(URLS.FETCH_PRODUCT_INFO(slug), axiosOption);
    // }
};

export default SupportService;
