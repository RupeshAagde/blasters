import ApiService from './api.service';
import URLS from './domain.service';

const SellerPanleService = {
    getPanelSettings() {
        let axiosOption = {};
        // console.log(typeof URLS.GET_PANEL_SETTINGS );
        return ApiService.get(URLS.GET_PANEL_SETTINGS(), axiosOption);
    },
    // updateMarketplaceWorker( payload) {
    //     let axiosOption = {
    //         data: payload
    //     };
    //     return ApiService.post(URLS.UPDATE_MARKETPLACE_WORKERS(compId, mkp), axiosOption);
    // }
};
export default SellerPanleService;
