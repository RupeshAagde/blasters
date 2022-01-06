'use strict';

import URLS from './domain.service';
import ApiService from './api.service';
import { getCommonHeaderOptions } from './utils.service';

const CommunicationServices = {
    getLog(params){
        const axiosOptions = Object.assign({params}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_LOG(params) , axiosOptions);
    },
    getCampaigns(params){
        const axiosOptions = Object.assign({params}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_CAMPAIGNS() , axiosOptions);
    }
   

}

export default CommunicationServices;