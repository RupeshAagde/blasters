import ApiService from './api.service';
import URLS from './domain.service';

const MarketplacesService = {
    getMarketplaceWorkers(compId = '') {
        let axiosOption = {};
        return ApiService.get(URLS.MARKETPLACE_WORKERS(compId), axiosOption);
    },
    updateMarketplaceWorker(compId = '', mkp = '', payload) {
        let axiosOption = {
            data: payload
        };
        return ApiService.post(URLS.UPDATE_MARKETPLACE_WORKERS(compId, mkp), axiosOption);
    }
};
export default MarketplacesService;
