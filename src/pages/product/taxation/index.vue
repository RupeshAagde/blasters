<template>
    <div>
        <div>
            <transition :name="!detectFPApp() ? 'fade' : ''" :mode="!detectFPApp() ? 'out-in' : ''">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<style lang="less" scoped>
// @import '../less/page-header.less';
// @import '../less/page-ui.less';
</style>

<script>
import path from 'path';

import { getCompanyBasePath } from '@/helper/get-route';
// import _ from 'lodash';
import { detectFPApp } from '@/helper/utils';

export default {
    name: 'ProductTaxation',
    data() {
        return {};
    },
    mounted() {
        console.log("I am here30",detectFPApp())
        this.updateMenu();
    },
    updated() {
        console.log("I am here34",detectFPApp())
        this.updateMenu();
    },
    methods: {
        detectFPApp,
        updateMenu() {
            console.log("I am here")
            if (
                !['List HSN', 'Add HSN', 'Edit HSN'].includes(
                    this.$route.meta.name
                )
            ) {
                this.$router.replace({
                    path: path.join(this.$basePath, '/taxation/list'),
                });
            }
        },
    },
};
</script>
