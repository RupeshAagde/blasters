import ApiService from './api.service';
import URLS from './domain.service';
import root from 'window-or-global';
import {
    getCommonHeaderOptions
} from './utils.service';

const IntegrationService = {
    getIntegrationsList(params) {
        const axiosOptions = Object.assign({
                params
            },
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.INTEGRATIONS_LIST(), axiosOptions);
    },
    getIntegrationById(id = '') {
        const axiosOptions = Object.assign({},
            getCommonHeaderOptions()
        );
        return ApiService.get(URLS.INTEGRATION_BY_ID(id), axiosOptions);
    },
    saveIntegration(id = '', data) {
        const axiosOptions = Object.assign({}, {
                data
            },
            getCommonHeaderOptions()
        );
        return ApiService.put(URLS.SAVE_INTEGRATION(id), axiosOptions);
    },
    addIntegration(data) {
        const axiosOptions = Object.assign({}, {
                data
            },
            getCommonHeaderOptions()
        );
        return ApiService.post(URLS.ADD_INTEGRATION(), axiosOptions);
    }
}

export default IntegrationService;