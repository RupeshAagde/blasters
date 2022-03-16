'use strict';

import URLS from './mixmaster-url.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const PartnersService = {
    fetchPartnerOrganizations(params) {
        const axiosOptions = Object.assign(
            { params },
            getCommonHeaderOptions()
        );

        return ApiService.get(URLS.FETCH_PARTNER_ORGANIZATIONS(), axiosOptions);
    }
}

export default PartnersService;
