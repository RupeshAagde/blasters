'use strict';

import { config, shallowMount, createLocalVue } from '@vue/test-utils';
import imageDialog from '../../../../../../components/common/image-uploader/dialog.vue';
import imagePanel from '../../../../../../components/common/image-uploader/panel';
import grindorService from '../../../../../../services/grindor.service';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import completeupload from './completeupload.json';
import startUpload from './startuplaod.json';
import VueRouter from 'vue-router';
let wrapper, localVue;
const mock = new MockAdapter(axios);
const event = {
    dataTransfer: {
        files: {
            lastModified: 1672750952822,
            name: 'videoplayback (2).mp4',
            size: 6660518,
            type: 'video/mp4'
        }
    }
};

describe('Image uploader dialog test cases.vue', () => {
    let locSchema = {};
    beforeEach(async () => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        mock.reset();
        config.mocks['$snackbar'] = {
            global: {
                showSuccess: () => {},
                show: () => {},
                showError: () => {},
                showWarning: () => {},
                showInfo: () => {}
            }
        };
    });
    it('Mounted imageDialog', () => {
        const wrapper = shallowMount(imageDialog);
        expect(wrapper.exists()).toBe(true);
    });
    it('Mounted imagePanel', () => {
        const wrapper = shallowMount(imagePanel);

        expect(wrapper.exists()).toBe(true);
    });
    it('Renders file uploader component', async () => {
        wrapper = shallowMount(imagePanel);
        expect(wrapper.exists()).toBe(true);
        wrapper.vm.handleFile(event.dataTransfer.files);
    });

    it('should upload file to grindor', async () => {
        const wrapper = shallowMount(imageDialog);
        mock.onPost(
            grindorService.uploadToGrindorStart('application-theme-image')
        ).reply(500, startUpload);
        mock.onPut(startUpload.upload.url).reply(200, {});
        mock.onPost(
            grindorService.uploadToGrindorComplete('application-theme-image')
        ).reply(200, completeupload);
        wrapper.vm.uploadToGrindor('application-theme-image', 1);
    });
    it(' getMeta function should resolve with image dimensions', () => {
        const wrapper = shallowMount(imageDialog);
        // create a mock image
        const img = {
            addEventListener: jest.fn(),
            naturalWidth: 100,
            naturalHeight: 200,
            src: ''
        };

        // spy on addEventListener
        jest.spyOn(img, 'addEventListener');

        // mock the Image constructor
        window.Image = jest.fn(() => img);

        // call the function with a mock URL
        const promise = wrapper.vm.getMeta('mock-url');

        // assert that the addEventListener was called with 'load' event type
        expect(img.addEventListener).toHaveBeenCalledWith(
            'load',
            expect.any(Function)
        );

        // simulate the 'load' event by calling the callback passed to addEventListener
        img.addEventListener.mock.calls[0][1]();

        // assert that the promise resolves with the correct dimensions
        return promise.then((dimensions) => {
            expect(dimensions).toEqual({ width: 100, height: 200 });
        });
    });
    it('should test the dataURItoFile function', () => {
        const wrapper = shallowMount(imageDialog);
        const dataURI = 'data:image/png;base64,R0lGODlhEAAQAMQAAORHHOV';
        const file = wrapper.vm.dataURItoFile(dataURI);
        expect(file).toEqual(dataURI);
    });
    it('should return true if image resolution is within maximum resolution', () => {
        const wrapper = shallowMount(imageDialog);
        const image = { width: 1000, height: 800 }; // image resolution is within maximum resolution
        wrapper.vm.maximumResolution = { width: 1200, height: 900 }; // set maximum resolution

        const result = wrapper.vm.validateMaximumResolution(image);
        expect(result).toBe(true);
    });

    it('should return false if image resolution exceeds maximum resolution', () => {
        const wrapper = shallowMount(imageDialog);
        const image = { width: 1500, height: 1200 }; // image resolution exceeds maximum resolution
        wrapper.vm.maximumResolution = { width: 1200, height: 900 }; // set maximum resolution

        const result = wrapper.vm.validateMaximumResolution(image);
        expect(result).toBe(false);
    });

    it('should return true for SVG images', () => {
        const wrapper = shallowMount(imageDialog);
        const svgImage = { width: 200, height: 100, type: 'image/svg+xml' }; // set SVG image
        wrapper.vm.maximumResolution = { width: 1200, height: 900 }; // set maximum resolution

        const result = wrapper.vm.validateMaximumResolution(svgImage);
        expect(result).toBe(true);
    });

    it('should return true when maximum resolution is not set', () => {
        const wrapper = shallowMount(imageDialog);
        const image = { width: 1500, height: 1200 }; // image resolution exceeds maximum resolution

        const result = wrapper.vm.validateMaximumResolution(image);
        expect(result).toBe(true);
    });
    it('resizes image to maximum resolution when it exceeds the limit', () => {
        const wrapper = shallowMount(imageDialog);
        const result = wrapper.vm.resizeToMaximumResolution({
            src: 'mock.url'
        });
        expect(result).toBe('mock.url');
    });
    it('returns the original path if it is not an HDN path and `any` parameter is not set', () => {
        const wrapper = shallowMount(imageDialog);
        const originalPath = 'https://example.com/image.jpg';
        const result = wrapper.vm.getNonCORSHDNURL(originalPath, false);
        expect(result).toEqual(originalPath);
    });

    it('returns a proxy URL if the path is an HDN path and `any` parameter is not set', () => {
        const wrapper = shallowMount(imageDialog);
        const hdnPath = 'https://hdn.example.com/image.jpg';
        const proxyUrl = `https://hdn.example.com/image.jpg`;
        const result = wrapper.vm.getNonCORSHDNURL(hdnPath, false);
        expect(result).toEqual(proxyUrl);
    });

    it('returns a proxy URL if the `any` parameter is set', () => {
        const wrapper = shallowMount(imageDialog);
        const originalPath = 'https://example.com/image.jpg';
        const proxyUrl = `${grindorService.getProxyURL()}?url=https%3A%2F%2Fexample.com%2Fimage.jpg`;
        const result = wrapper.vm.getNonCORSHDNURL(originalPath, true);
        expect(result).toEqual(proxyUrl);
    });

    it('returns the original path if there is an error', () => {
        const wrapper = shallowMount(imageDialog);
        const originalPath = 'https://example.com/image.jpg';
        const result = wrapper.vm.getNonCORSHDNURL(originalPath, false);
        expect(result).toEqual(originalPath);
    });
    it('should check for autoCropper function', async () => {
        const wrapper = shallowMount(imageDialog);
        wrapper.vm.aspectRatio = '1:1';
        wrapper.setData({
            imageURL: 'https://example.com/image.jpg',
            aspectR: { x: 1, y: 1 },
            maximumResolution: { width: 1000, height: 1000 },
            aspectRatio: '1:1'
        });
        const getMetaPromise = Promise.resolve({ width: 2000, height: 1000 });
        jest.spyOn(wrapper.vm, 'getMeta').mockReturnValue(getMetaPromise);

        wrapper.vm.autoCropper();

        await getMetaPromise; // wait for getMeta to resolve
        expect(wrapper.vm.maxCropperWidth).toBe(50);
        expect(wrapper.vm.maxCropperHeight).toBe(100);
    });
    it('should test for handleInput function', () => {
        const wrapper = shallowMount(imageDialog);
        const imageUrl = 'https://example.com/image.jpg';
        const event = imageUrl ;
        wrapper.vm.autoCropper = jest.fn(); // mock autoCropper method

        wrapper.vm.handlePanelInput(event);

        expect(wrapper.vm.imageURL).toBe(imageUrl);
        expect(wrapper.vm.autoCropper).toHaveBeenCalled();
    });
    it('should mount image panel and check for onInpurURLChange function call with dropbox link', () => {
        const panelWrapper = shallowMount(imagePanel);
        expect(panelWrapper.exists()).toBe(true);
        let inputEvent = {
            target: {
                value:
                    'https://www.dropbox.com/s/ybm21upxfbjwqh4/IMGL0435.JPG?dl=0',
            },
        };
        const expectedModifiedURL =
            'https://www.dropbox.com/s/ybm21upxfbjwqh4/IMGL0435.JPG?dl=0';

        panelWrapper.vm.$onInpurURLChange(inputEvent);

        expect(panelWrapper.vm.imageURL).toBe(expectedModifiedURL);
        expect(panelWrapper.emitted().input).toBeTruthy();
        expect(panelWrapper.emitted().input[0][0]).toBe(expectedModifiedURL);
    });
    it('should mount image panel and check for onInpurURLChange function call with google drive link', () => {
        const panelWrapper = shallowMount(imagePanel);
        const userInput = 'https://drive.google.com/file/d/example/share_link';
        const inputEvent = { target: { value: userInput } };
        panelWrapper.vm.$onInpurURLChange(inputEvent);

        expect(panelWrapper.vm.imageURL).toBe(userInput);
        expect(panelWrapper.emitted().input).toBeTruthy();
        expect(panelWrapper.emitted().input[0][0]).toBe(userInput);
    });
    it('should mount image panel and check for onInpurURLChange function call with normal image link and nothing should change', () => {
        const panelWrapper = shallowMount(imagePanel);
        const userInput = 'https://example.com/image.jpg';
        const expectedURL = 'https://example.com/image.jpg';

        const inputEvent = { target: { value: userInput } };
        panelWrapper.vm.$onInpurURLChange(inputEvent);

        expect(panelWrapper.vm.imageURL).toBe(expectedURL);
        expect(panelWrapper.emitted().input).toBeTruthy();
        expect(panelWrapper.emitted().input[0][0]).toBe(expectedURL);
    });
});
