import ApiService from './api.service';
import URLS from './domain.service';

const SellerPanleService = {
    getPanelSettings() {
        // console.log(typeof URLS.GET_PANEL_SETTINGS );
        return ApiService.get(URLS.GET_PANEL_SETTINGS());
    },

    getPermission() {
        return ApiService.get(URLS.GET_PERMISSION());
    },

    savePanelSettings(payload) {
        return ApiService.put(URLS.SAVE_PANEL_SETTINGS(), { data: payload });
    }

};
export default SellerPanleService;
