'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const CommunicationServices = {
    getLog(params){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_LOG(params) , axiosOptions);
    },
   

}

export default CommunicationServices;