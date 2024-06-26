import ApiService from './api.service';
import URLS from './domain.service';

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
    createVideoRoom(data) {
        let axiosOption = { data: data };
        return ApiService.post(URLS.CREATE_VIDEO_ROOM(), axiosOption);
    },
    getParticipantsForVideoRoom(ticketID) {
        return ApiService.get(URLS.GET_VIDEO_PARTICIPANTS(ticketID), {});
    },
    getTokenForVideoRoom(ticketID) {
        return ApiService.get(URLS.GET_VIDEO_ROOM_TOKEN(ticketID), {});
    },
    rateVideo(ticketID, ratingData) {
        let axiosOption = { data: ratingData };
        return ApiService.post(URLS.FETCH_HISTORY(ticketID), axiosOption);
    },
    fetchHistory(ticketID) {
        return ApiService.get(URLS.FETCH_HISTORY(ticketID), {});
    },
    fetchFeedbacks(ticketID) {
        return ApiService.get(URLS.FETCH_FEEDBACK(ticketID), {});
    },
    addComment(ticketID, comment) {
        let axiosOption = { data: comment };
        return ApiService.post(URLS.ADD_COMMENT(ticketID), axiosOption);
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
    },
    getGeneralConfig(type){
        return ApiService.get(URLS.GET_GENERAL_CONGIF(type), {});
    },
    setGeneralConfig(data) {
        let axiosOption = { data: data };
        return ApiService.post(URLS.SET_GENERAL_CONGIF(), axiosOption);
    },
    categorySync(type){
        return ApiService.get(URLS.CATEGORY_SYNC(type), {
            params: {}
        }); 
    },
    testApiKey(data,type){
        let axiosOption = { data: data };
        return ApiService.post(URLS.TEST_API_KEY(type), axiosOption);
    },
    getIntegrationDetails(type){
        return ApiService.get(URLS.INTEGRATION_DETAILS(type), {
            params: {}
        }); 
    },
    updateIntegrationDetails(data,type){
        let axiosOption = { data: data };
        return ApiService.put(URLS.INTEGRATION_DETAILS(type), axiosOption);
    },
    createIntegration(data,type){
        let axiosOption = { data: data };
        return ApiService.post(URLS.INTEGRATION_DETAILS(type), axiosOption);
    },
    // Product Info
    // fetchProductInfo(slug) {
    //     let axiosOption = Object.assign({}, getCommonHeaderOptions(), {
    //         params: {}
    //     });
    //     return ApiService.get(URLS.FETCH_PRODUCT_INFO(slug), axiosOption);
    // }
};

export default SupportService;
