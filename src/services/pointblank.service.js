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
    getSmsTemplates(param){
        const axiosOptions = Object.assign({}, {params: param}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_SMS_TEMPLATES() , axiosOptions);
    },
    getSubscribedSmsTemplates(param){
        let a = {params :param}
        console.log(a);
        const axiosOptions = Object.assign({},{params :param}, getCommonHeaderOptions());
        return ApiService.get(URLS.SUBSCRIBED_SMS_TEMPLATES() , axiosOptions);
    },
    getSmsSysTemplates(param){
        const axiosOptions = Object.assign({},{params: param}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_SMS_S_TEMPLATES() , axiosOptions);
    },
    getEmailTemplates(params){
        const axiosOptions = Object.assign({},params,getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_EMAIL_TEMPLATES() , axiosOptions);
    },
    getEmailSysTemplates(params){
        const axiosOptions = Object.assign({},params, getCommonHeaderOptions());
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
    getDefaultEmailProvider(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMS_DEFAULT_EMAIL_PROVIDERS() , axiosOptions);
    },
    getAppProvider(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_APP_PROVIDER() , axiosOptions);
    },
    postGlobalProvider(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.put(URLS.COMMUNICATION_GLOBAL_PROVIDER() , axiosOptions);
    },
    getSystemEvents(params){
        const axiosOptions = Object.assign({},{params}, getCommonHeaderOptions());
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
    postEmailTemplate(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.post(URLS.COMMUNICATION_EMAIL_TEMPLATES() , axiosOptions);
    },
    putEmailTemplate(id,data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.put(URLS.COMMUNICATION_EMAIL_TEMPLATES(id) , axiosOptions);
    },
    putSmsTemplate(id,data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.put(URLS.COMMUNICATION_SMS_TEMPLATES(id) , axiosOptions);
    },
    postBulkUpdate(data){
        const axiosOptions = Object.assign({data}, getCommonHeaderOptions());
        return ApiService.post(URLS.EVENT_BULK_UPDATE() , axiosOptions);
    },
    getSmsTemplatebyId(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_SMS_TEMPLATES(id) , axiosOptions);
    },
    deleteSmsTemplatebyId(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.del(URLS.COMMUNICATION_SMS_TEMPLATES(id) , axiosOptions);
    },
    deleteEmailTemplateById(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.del(URLS.COMMUNICATION_EMAIL_TEMPLATES(id) , axiosOptions);
    },
    getEmailTemplatebyId(id){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.COMMUNICATION_EMAIL_TEMPLATES(id) , axiosOptions);
    },
    getSmsDefault(){
        const axiosOptions = Object.assign({}, getCommonHeaderOptions());
        return ApiService.get(URLS.SMS_DEFAULT() , axiosOptions);
    },
    


    




   

}

export default CommunicationServices;