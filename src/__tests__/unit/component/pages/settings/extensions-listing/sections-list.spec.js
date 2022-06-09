/* Package imports */
import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import flushPromises from 'flush-promises';

/* Component imports */
import SectionsList from '@/pages/settings/extensions-listing/sections-list.vue';
import AvailableSections from '@/pages/settings/extensions-listing/available-sections-list.vue';
import SectionForm from '@/pages/settings/extensions-listing/section-form.vue';

/* Mock imports */
import mockData from './fixtures/mocks';

let localVue;
let router, wrapper;

describe('Sections List Component', () => {
    beforeEach(async() => {
        localVue = createLocalVue();
        localVue.use(VueRouter);
        router = new VueRouter({
            routes: [
                { path: '/administrator/settings/partners/extensions-listing', component: SectionsList }
            ]
        });

        router.push('/administrator/settings/partners/extensions-listing');

        wrapper = mount(SectionsList, {
            localVue,
            propsData: {
                sections: mockData.sectionsMock,
                available_sections: mockData.availableSectionsMock
            },
            router
        });
    });

    afterAll(() => {
        mock.reset();
    });
    
    it('Checks if component is loaded', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
    });

    it('should show the available sections when user clicks on Add Section button', async() => {
        let element = wrapper.find('.add-section');
        let availableSections = wrapper.findComponent(AvailableSections);
        element.trigger('click');

        expect(availableSections.exists()).toBe(true);
        expect(wrapper.vm.showAvailableSections).toBe(true);
    });

    it('should emit save when user clicks on the save button', async() => {
        let element = wrapper.find('.save-button');
        element.vm.$emit('click');

        expect(wrapper.emitted()).toHaveProperty('save');
    });

    it('should show the user the relevant section when user clicks on the Add button next to an available section', async() => {
        let element = wrapper.findComponent(AvailableSections);
        element.vm.$emit('add-section');

        expect(wrapper.vm.showAvailableSections).toBe(false);
        expect(wrapper.vm.showSectionForm).toBe(true);
    });

    it('should add a section to preview when user has enabled to do that', async() => {
        let element = wrapper.findComponent(AvailableSections);
        element.vm.$emit('select', mockData.availableSectionsMock[0]);

        expect(Object.keys(wrapper.vm.addedSection).length).not.toBe(0);
    });

    it('should emit search-input when user searches for a collection or extensions', async() => {
        wrapper.vm.showSectionForm = true
        await wrapper.vm.$nextTick();
        let element = wrapper.findComponent(SectionForm);
        element.vm.$emit('search-input', {type: 'collection', value: {text: 'Hello'}});
        
        expect(wrapper.emitted()).toHaveProperty('search-input');
    });

    it('Checks if onMove works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.onMove({
            draggedContext: {
                index: 0,
                futureIndex: 1,
            },
        });
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.vm.movingIndex).toBe(1);
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.emitted()['post-message']).toBeTruthy();
    });

    it('Checks if dragStart works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.dragStart();
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.emitted()['zoom-out']).toBeTruthy();
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.emitted()['post-message']).toBeTruthy();
    });

    it('Checks if dragStop works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.dragStop();
        await new Promise((resolve) => setTimeout(resolve, 10));
        expect(wrapper.emitted()['zoom-in']).toBeTruthy();
        expect(wrapper.vm.movingIndex).toBe(-1);
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.emitted()['post-message']).toBeTruthy();
    });

    it('Checks if removeSection works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.removeSection(1);
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.emitted()['post-message']).toBeTruthy();
    });

    it('Checks if removeSectionFromPreview works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.addedSection = {
            name: 'test',
        };
        await wrapper.vm.$nextTick();
        wrapper.vm.removeSectionFromPreview();
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.emitted()['post-message']).toBeTruthy();
    });
    
    it('check if onSectionClick works', async() => {
        let element = wrapper.find('.title');
        element.trigger('click');  
        await wrapper.vm.$nextTick();
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.emitted()['post-message']).toBeTruthy();
    });

    it('should copy and create a new section if the user clicks on the copy icon', async() => {
        await flushPromises();

        let initialLength = wrapper.vm.sections.length;
        
        let element = wrapper.find('.copy');
        element.trigger('click');

        await wrapper.vm.$nextTick();
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.vm.mSections.length).toBe(initialLength+1);
    });

    it('Checks if updateBlocks works', async () => {
        expect(wrapper.element).toMatchSnapshot();
        expect(wrapper.exists()).toBeTruthy();
        wrapper.vm.selectedSectionIndex = 1;
        await wrapper.vm.$nextTick();
        wrapper.vm.updateBlocks(mockData.sectionForUpdate);
        await new Promise((resolve) => setTimeout(resolve, 200));
        expect(wrapper.emitted()['post-message']).toBeTruthy();
    });
});
