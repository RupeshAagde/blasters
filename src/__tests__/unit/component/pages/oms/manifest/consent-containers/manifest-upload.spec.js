'use strict';

/* Package imports */
import { mount, shallowMount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';

/* Component imports */
import ManifestUploadBox from '@/pages/oms/manifest/consent-containers/manifest-upload.vue';

/* Mock imports */
import ORDER_ROLES from '../../fixtures/order-roles.json'

let wrapper, router, localVue;
describe('ManifestUploadBox', () => {
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({});
        router.push(`/company/1/orders/manifest/`);
        wrapper = mount(ManifestUploadBox, {
            localVue,
            router,
            propsData: {
            orderRoles: ORDER_ROLES,
            status: 'pdf_generated',
          
           },

        });
    });

    it('should render to a snapshot', () => {
        expect(wrapper.element).toMatchSnapshot();
    });

    it('Shipment list item renders', async () => {
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should upload the files', async()=>{
        wrapper.vm.onFileUpload({target:{files:[{size: 20971, type: 'application/pdf', name:'consent.pdf'}]}});
        expect(wrapper.vm.uploadedFileName).toBe('consent.pdf');
    });

    it('should throw error for large file size', async()=>{
        let showError = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        wrapper.vm.onFileUpload({target:{files:[{size: 2097153, type: 'application/pdf', name:'consent.pdf'}]}});
        expect(showError).toHaveBeenCalled();
    });

    it('should throw error for large file name', async()=>{
     
        wrapper.vm.onFileUpload({target:{files:[{size: 20971, type: 'application/pdf', name:'conshshhdhhhsggklshgkghdkhgdent.pdf'}]}});
        expect(wrapper.vm.uploadedFileName).not.toBe('conshshhdhhhsggklshgkghdkhgdent.pdf');
    });

    it('should throw error for not pdf files name', async()=>{
        let showError = jest.spyOn(wrapper.vm.$snackbar.global, 'showError');
        wrapper.vm.onFileUpload({target:{files:[{size: 20971, type: 'application/jpg', name:'conshshhdhhhsggklshgkghdkhgdent.pdf'}]}});
        expect(showError).toHaveBeenCalled();
    });

    it('should set the class active on file enter', async()=> {
        wrapper.vm.fileDropListner(
        {  preventDefault: () => {},dataTransfer:{files:[{size: 20971, type: 'application/pdf', name:'consent.pdf'}]}}, 'enter');
       
      expect(wrapper.vm.isActive).toBe(true);
    });

    it('should set the class inactive on file drop', async()=> {
        wrapper.vm.fileDropListner(
        {  preventDefault: () => {},dataTransfer:{files:[{size: 20971, type: 'application/pdf', name:'consent.pdf'}]}}, 'drop');
      expect(wrapper.vm.isActive).toBe(false);
    });

    it('should set the class active on file drop', async()=> {
        wrapper.vm.fileDropListner(
        {  preventDefault: () => {},dataTransfer:{files:[{size: 20971, type: 'application/pdf', name:'consent.pdf'}]}}, 'drop');
      expect(wrapper.vm.isActive).toBe(false);
    });

    it('should format the file name when file name is greater than 20 characters', async()=> {
        wrapper.vm.fileDropListner(
        {  preventDefault: () => {},dataTransfer:{files:[{size: 20971, type: 'application/pdf', name:'consenhsldfhlhdslhdlhlhsdlhfdlhlsdhldsshlt.pdf'}]}}, 'drop');
      expect(wrapper.vm.uploadedFileName).not.toBe('consenhsldfhlhdslhdlhlhsdlhfdlhlsdhldsshlt.pdf');
    });
    
});
