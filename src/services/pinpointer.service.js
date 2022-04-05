'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const AuditTrailServices = {
    getLogs(params){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions(),{params});
        return ApiService.get(URLS.AUDIT_TRAIL() , axiosOptions);
    }
    ,
    getLogById(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.AUDIT_TRAIL(id) , axiosOptions);
    }
   

}

export default AuditTrailServices;