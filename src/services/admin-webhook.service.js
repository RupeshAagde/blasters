import ApiService from './api.service';
import URLS from './mixmaster-url.service';
import { getCommonHeaderOptions,getCompInfo } from './utils.service.js';
import urlJoin from 'url-join';

const AdminWebhookService = {
    
    getWebhookSubscriberById(id) {
        const axiosOption = Object.assign(
            {data: {}},
            { params: {} },
            getCommonHeaderOptions()
        );
        return ApiService.get(
          URLS.GET_SUBSCRIBER_BY_ID(id),
            axiosOption
        );
    },
    getSubscriberList(query_param){
      console.log("@################1")
      const axiosOption = Object.assign(
        {data: {}},
        { params: query_param },
        getCommonHeaderOptions()
      ); 
      console.log(axiosOption,"@################2",URLS.SUBSCRIBER_BY_COMPANY_ID())
      return ApiService.get(
        URLS.SUBSCRIBER_BY_COMPANY_ID(),
          axiosOption
      );
    },
    getEventList(){
        const axiosOption = Object.assign(
            {data: {}},
            { params: {} },
            getCommonHeaderOptions()
        );
        return ApiService.get(
            URLS.WEBHOOK_EVENT_LIST(),
            axiosOption
        );
    },
    pingUrl(request){
        const axiosOption = Object.assign(
                {data: request},
                { params: {} },
                getCommonHeaderOptions()
            );
            return ApiService.post(
                URLS.TEST_WEBHOOK(),
                axiosOption
            );
    },
    getWebhookReport(query_param){      
      const axiosOption = Object.assign(
        {data: query_param},
        { params: {}},
        getCommonHeaderOptions()
      ); 
      return ApiService.post(
        URLS.GET_WEBHOOK_REPORT(),
          axiosOption
      );
    },
    registerSubscriber(request){
      const axiosOption = Object.assign(
        {data: request},
        { params: {} },
        getCommonHeaderOptions()
      ); 
      return ApiService.post(
        URLS.SUBSCRIBER_BY_COMPANY_ID(),
          axiosOption
      );
    },
    updateSubscriber(request){
      const axiosOption = Object.assign(
        {data: request},
        { params: {} },
        getCommonHeaderOptions()
      ); 
      return ApiService.put(
        URLS.SUBSCRIBER_BY_COMPANY_ID(),
          axiosOption
      );
    },getFilterList(){      
      const axiosOption = Object.assign(
        {data: {}},
        { params: {} },
        getCommonHeaderOptions()
      ); 
      return ApiService.get(
        URLS.GET_FILTER_LIST(),
          axiosOption
      );
    },
};

export default AdminWebhookService;
