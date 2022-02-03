<template>
    <div class="panel extension-collection-list">
        <div class="main-container">
            <div class="page-container">
                <jumbotron
                    :title="'Extension Collection'"
                    btnLabel="Create"
                    :desc="'Extension Collection'"
                    @btnClick="createExtensionCollection"
                ></jumbotron>
                <div class="page-header-position"></div>
            </div>
            <loader v-if="pageLoading && !pageError"></loader>
            <page-error
                v-else-if="pageError && !pageLoading"
                @tryAgain="fetchExtension"
            ></page-error>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import '../../pages/less/page-header.less';
@import '../../pages/less/page-ui.less';
@import '../../pages/less/form.less';
.nitrozen-form-input {
    margin-top: 12px;
}
.hidden {
    visibility: hidden;
}
.page-container {
    margin: 0;
    flex-direction: column;
}
</style>

<script>
import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenInput,
    NitrozenError,
} from '@gofynd/nitrozen-vue';
import jumbotronVue from '@/components/common/jumbotron.vue';

import loader from '@/components/common/loader';
import pageEmpty from '@/components/common/page-empty.vue';
import pageError from '@/components/common/page-error.vue';
import pageHeader from '@/components/common/layout/page-header.vue';
import root from 'window-or-global';
const env = root.env || {};

export default {
    name: 'extension-review',
    components: {
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'page-empty': pageEmpty,
        'page-error': pageError,
        'page-header': pageHeader,
        jumbotron: jumbotronVue,
        loader: loader,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            inProgress: false,
            pageError: false,
            pageLoading: false,
            extension_info: {},
            review_data: {
                review_comments: '',
                current_status: '',
            },
            error_comments: '',
            fynd_platform_domain: 'fynd.com',
        };
    },
    computed: {},
    mounted() {
        this.fynd_platform_domain =
            env.FYND_PLATFORM_DOMAIN || this.fynd_platform_domain;
        this.fetchExtension();
    },
    methods: {
        fetchExtension() {},
        createExtensionCollection() {
            this.$router
                .push(`/administrator/extensions/collection/create`)
                .catch(() => {});
            //TODO: Add form dirty
        },
        onCancel() {
            this.$router
                .push(`/administrator/extensions/review`)
                .catch(() => {});
        },
    },
};
</script>
<style lang="less" scoped>
.extension-collection-list {
    .main-container {
        // width: 100%;
    }
}
</style>
