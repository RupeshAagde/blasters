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
      URLS.GET_SUBSCRIBER_BY_ID_TYPE(id),
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
      URLS.WEBHOOK_GLOBAL_SUBSCRIBER(),
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
  downloadWebhookReport(query_param) {
    const axiosOption = Object.assign(
      { data: query_param },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.post(
      URLS.DOWNLOAD_WEBHOOK_REPORT(),
      axiosOption
    );
  },
  checkWebhookReport(fileName) {
    const axiosOption = Object.assign(
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.get(
      URLS.CHECK_STATUS_WEBHOOK_REPORT(fileName),
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
  postFilterList(query_param) {
    const axiosOption = Object.assign(
      { data: query_param },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.post(
      URLS.GET_FILTER_LIST(),
      axiosOption
    );
  },
  getReportHistories(subscriberIds, page = { page_size: 10, page_no: 1 }, type = 'adminstrator') {
    page = { ...(page && { ...page }), ...(subscriberIds && subscriberIds.length > 0 && { subscriber_ids: subscriberIds }) }
    const axiosOption = Object.assign(
      { data: { type, ...page } },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.post(
      URLS.REPORT_HISTORY_URL(),
      axiosOption
    );
  },
  cancelWebhookReport(filename, type = 'administrator') {
    const axiosOption = Object.assign(
      { data: {} },
      { params: {} },
      getCommonHeaderOptions()
    );
    return ApiService.get(
      URLS.REPORT_HISTORY_URL('cancel/file/' + filename),
      axiosOption
    );
  }
};

export default AdminWebhookService;
