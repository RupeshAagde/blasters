import ApiService from './api.service';
import URLS from './domain.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object } from 'window-or-global';



const CredentialsService = {

    fetchAllCredentials(entity_type) {
        return ApiService.get(URLS.GET_ALL_CREDENTIALS(entity_type))
    },
    fetchCredential(entity_type, slug) {
        return ApiService.get(URLS.GET_CREDENTIAL(entity_type, slug))
    },
    postCredential() {
        return ApiService.post(URLS.POST_CREDENTIAL())
    },
    updateCredential(id, payload) {
        let axiosOption = Object.assign({}, { data: payload }, getCommonHeaderOptions());
        return ApiService.put(URLS.UPDATE_CREDENTIAL(id), axiosOption)
    }

};

export default CredentialsService;