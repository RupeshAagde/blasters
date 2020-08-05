'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';
import { Object } from 'window-or-global';
import CompanyService from './company-admin.service';

const CatalogService = {
    fetchDepartment(params) {
        const axiosOption = Object.assign(
            {
                params: params
            },
            getCommonHeaderOptions()
        );

        return ApiService.get(URLS.FETCH_DEPARTMENT(), axiosOption);
    },
    saveDepartment(body) {
        const axiosOption = Object.assign(
            {},
            { data: body },
            getCommonHeaderOptions()
        );

        return ApiService.post(URLS.FETCH_DEPARTMENT(), axiosOption);
    }
};
export default CatalogService;
