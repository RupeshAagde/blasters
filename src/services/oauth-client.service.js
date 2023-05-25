import ApiService from './api.service';
import URLS from './domain.service';
import { getCommonHeaderOptions } from './utils.service.js';

const OAuthClientService = {
    fetchClientListing(params) {
        let axiosOption = Object.assign({},{
            params: params
        });
        return ApiService.get(URLS.GET_OAUTH_CLIENT_LISTING(), axiosOption);
    },
    fetchClient(client_id) {
        return ApiService.get(URLS.GET_OAUTH_CLIENT(client_id), {});
    },
    createClient(body) {
        let axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions(),
            {}
        );
        return ApiService.post(URLS.CREATE_OAUTH_CLIENT(), axiosOption);
    },
    updateClient(client_id, body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions(),
            {}
        );
        return ApiService.put(URLS.UPDATE_OAUTH_CLIENT(client_id), axiosOption);
    },
    deleteClient(client_id) {
        return ApiService.del(URLS.DELETE_OAUTH_CLIENT(client_id),{});
    }
}

export default OAuthClientService