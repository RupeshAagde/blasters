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
        return ApiService.patch(URLS.FETCH_TICKET(ticketID), axiosOption);
    },
    createVideoRoom() {
        let axiosOption = {};
        return ApiService.post(URLS.CREATE_VIDEO_ROOM(), axiosOption);
    },
    fetchHistory(company_id, ticketID) {
        return ApiService.get(URLS.FETCH_HISTORY(company_id, ticketID), {});
    },
    addComment(company_id, ticketID, comment) {
        let axiosOption = { data: comment };
        return ApiService.post(URLS.ADD_COMMENT(company_id, ticketID), axiosOption);
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
    fetchOptions(company_id) {
        return ApiService.get(URLS.FETCH_TICKETS_OPTIONS(company_id), {
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
