import ApiService from './api.service';
import URLS from './mixmaster-url.service';
import { getCommonHeaderOptions, getCompInfo } from './utils.service.js';
import urlJoin from 'url-join';

const AdminWebhookService = {

  getWebhookSubscriberById(id) {
    const axiosOption = Object.assign(
      { data: {} },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.get(
      URLS.GET_SUBSCRIBER_BY_ID_TYPE(id, 'global'),
      axiosOption
    );
  },
  getSubscriberList(query_param) {
    const axiosOption = Object.assign(
      { data: {} },
      { params: query_param },
      getCommonHeaderOptions()
    );
    return ApiService.get(
      URLS.WEBHOOK_GLOABAL_SUBSCRIBER(),
      axiosOption
    );
  },
  getEventList() {
    const axiosOption = Object.assign(
      { data: {} },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.get(
      URLS.WEBHOOK_EVENT_LIST(),
      axiosOption
    );
  },
  pingUrl(request) {
    const axiosOption = Object.assign(
      { data: request },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.post(
      URLS.TEST_WEBHOOK(),
      axiosOption
    );
  },
  getWebhookReport(query_param) {
    const axiosOption = Object.assign(
      { data: query_param },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.post(
      URLS.GET_WEBHOOK_REPORT(),
      axiosOption
    );
  },
  registerSubscriber(request) {
    const axiosOption = Object.assign(
      { data: request },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.post(
      URLS.REGISTER_SUBSCRIBERS(),
      axiosOption
    );
  },
  updateSubscriber(request) {
    const axiosOption = Object.assign(
      { data: request },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.put(
      URLS.UPDATE_SUBSCRIBER(),
      axiosOption
    );
  }, getFilterList() {
    const axiosOption = Object.assign(
      { data: {} },
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
