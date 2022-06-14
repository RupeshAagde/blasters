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
    },
    getEventsOrder(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_EVENT() , axiosOptions);
    },
    getEventSubscription(params){
        const axiosOptions = Object.assign({params}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_EVENT_SUBSCRIPTION() , axiosOptions);
    },
    putEventSubscription(params){
        let data = params.body
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.put(URLS.COMMUNICATION_EVENT_SUBSCRIPTION(params.id) , axiosOptions);
    },
    getSmsTemplates(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_SMS_TEMPLATES() , axiosOptions);
    },
    getSmsSysTemplates(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_SMS_S_TEMPLATES() , axiosOptions);
    },
    getEmailTemplates(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_EMAIL_TEMPLATES() , axiosOptions);
    },
    getEmailSysTemplates(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_EMAIL_S_TEMPLATES() , axiosOptions);
    },
    getSmsProvider(params){
        const axiosOptions = Object.assign({params}, getCommonHeaderOptions());
        return ApiService.get(URLS.SMS_PROVIDER() , axiosOptions);
    },
    getEmailProvider(params){
        const axiosOptions = Object.assign({params}, getCommonHeaderOptions());
        return ApiService.get(URLS.EMAIL_PROVIDER() , axiosOptions);
    },
    postEmailProvider(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.post(URLS.EMAIL_PROVIDER() , axiosOptions);
    },
    postSmsProvider(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.post(URLS.SMS_PROVIDER() , axiosOptions);
    },
    getSmsProviderbyId(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.SMS_PROVIDER(id) , axiosOptions);
    },
    getEmailProviderbyId(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.EMAIL_PROVIDER(id) , axiosOptions);
    },
    putEmailProviderbyId(id,data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.put(URLS.EMAIL_PROVIDER(id) , axiosOptions);
    },
    putSmsProviderbyId(id,data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.put(URLS.SMS_PROVIDER(id) , axiosOptions);
    },
    getGlobalProvider(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_GLOBAL_PROVIDER() , axiosOptions);
    },
    getAppProvider(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_APP_PROVIDER() , axiosOptions);
    },
    postGlobalProvider(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.put(URLS.COMMUNICATION_GLOBAL_PROVIDER() , axiosOptions);
    },
    getSystemEvents(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_SYSTEM_EVENTS() , axiosOptions);
    },
    postSendSync(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.post(URLS.COMMUNICATION_SEND_SYNC() , axiosOptions);
    },
    postSmsTemplate(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.post(URLS.COMMUNICATION_SMS_TEMPLATES() , axiosOptions);
    },
    
    postBulkUpdate(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.post(URLS.EVENT_BULK_UPDATE() , axiosOptions);
    },
    getSmsTemplatebyId(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_SMS_TEMPLATES(id) , axiosOptions);
    },
    

    




   

}

export default CommunicationServices;