<template>
    <div class="container">
        <div class="sidebar" :class="{ 'hide-sidebar': !showSidebar }">
            <loader v-if="loading || !selectedPage" class="loading"></loader>
        </div>
    </div>
</template>

<script>
/* Package imports */
import {
    NitrozenDropdown, NitrozenDialog, NitrozenButton,
    NitrozenInput, flatBtn, strokeBtn
} from '@gofynd/nitrozen-vue';

/* Component imports */
import Loader from '@/components/common/loader.vue';

export default {
    name: 'listing-container',
    components: {
        NitrozenButton,
        NitrozenDialog,
        NitrozenDropdown,
        NitrozenInput,
        Loader
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    data() {
        return {
            loading: false,
            zoomOut: false,
            dragging: false,
            pageToDelete: null,
            pageToEdit: null,
            selectedViewport: 'desktop',
            showSidebar: true,
            available_sections: [],
            available_pages: [],
            sections: [],
            viewports: [
                {
                    value: 'desktop',
                    image_url: '/public/admin/assets/admin/pngs/monitor.png',
                },
                {
                    value: 'tablet',
                    image_url: '/public/admin/assets/admin/pngs/tablet.png',
                },
                {
                    value: 'mobile',
                    image_url: '/public/admin/assets/admin/pngs/phone.png',
                },
                {
                    value: 'expand',
                    image_url: '/public/admin/assets/admin/pngs/expand.png',
                },
            ],
        }
    },
    computed: {
        getCurrentPage() {
            return this.selectedPage;
        }
    }
}
</script>

<style lang="less" scoped>
.container {
    flex: 1;
    display: flex;
    overflow: hidden;

    .sidebar {
        width: 300px;
        border-right: 1px solid #dfe3e8;
        position: relative;
        overflow-y: hidden;
        transition: all 1s;

        /deep/.loading {
            position: absolute;
            z-index: 1;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            height: 100%;
            width: 100%;
        }
    }
}
</style>
