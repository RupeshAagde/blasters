<template>
    <div class="panel">
        <div class="main-container">
            <div class="jumbotron-container">
                <jumbotron
                    :title="'Platform Settings'"
                    :desc="'Add or edit configurations for platform'"
                ></jumbotron>
            </div>
            <section>
                <settings-group title="General" :menus="general_menus"></settings-group>
                <settings-group title="Custom Page and Tag" :menus="custom_menus"></settings-group>
                <settings-group title="Customize" :menus="customize_menus" @openHomePage="openHomePage"></settings-group>
                <settings-group v-if="platform_configuration_menus.length" title="Platform Configurations" :menus="platform_configuration_menus"></settings-group>
            </section>
        </div>
        <home-page ref="custom-home-page"></home-page>
    </div>
</template>

<script>
import Jumbotron from '@/components/common/jumbotron';
import { titleCase } from '@/helper/utils';
import InlineSvg from '@/components/common/inline-svg';
import SettingsGroup from './settings-group.vue';
import {
    NitrozenButton,
    NitrozenDropdown,
    strokeBtn,
    flatBtn,
    NitrozenBadge
} from '@gofynd/nitrozen-vue';
import _ from 'lodash';
import HomePage from './home-page';

const GENERAL_MENUS = [
    {
        title: 'Basic',
        link: 'platform/basic',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Update basic platform information'
    },
    {
        title: 'Features',
        link: 'platform/features',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Change platform features information'
    },
    {
        title: 'Pricing Banner',
        link: 'platform/pricing-banner',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Change platform pricing banner'
    }
];
const CUSTOM_MENUS = [
    {
        title: 'Custom Pages',
        link: 'platform/pages',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Use this section to develop and manage custom webpages'
    },
    {
        title: 'Custom Tags',
        link: 'platform/list-tags',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Inject Script/CSS'
    }
];
const CUSTOMIZE_MENUS = [
    {
        title: 'Navbar',
        link: 'platform/navbar',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Use this section to change platform navbar'
    },
    {
        title: 'Footer',
        link: 'platform/footer',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Use this section to change platform footer'
    },
    {
        title: 'Seller Panel Sidebar',
        link: 'platform/seller-panel',
        icon: 'settings',
        permissions: [],
        active: false,
        desc: 'Configure navigation items'
    }
];
const CUSTOM_PAGES = [
    {
        title: 'Home Page',
        icon: 'settings',
        active: false,
        desc: 'Update home page',
        key: 'home',
        eventName: 'openHomePage'
    },
    {
        title: 'Features Page',
        icon: 'settings',
        active: false,
        desc: 'Update features page',
        key: 'features',
        eventName: 'openHomePage'
    },
    {
        title: 'Pricing Page',
        icon: 'settings',
        active: false,
        desc: 'Update pricing page',
        key: 'pricing',
        eventName: 'openHomePage'
    }
];

const PLATFORM_CONFIGURATION_MENUS = [
    // {
    //     title: 'Business Registration',
    //     link: 'platform/business-registration',
    //     icon: 'settings',
    //     permissions: [],
    //     active: false,
    //     desc: 'Configure Business Registration'
    // },
    // {
    //     title: 'Business Details',
    //     link: 'platform/business-details',
    //     icon: 'settings',
    //     permissions: [],
    //     active: false,
    //     desc: 'Configure Business Details'
    // },
    // {
    //     title: 'Brand',
    //     link: 'platform/brand',
    //     icon: 'settings',
    //     permissions: [],
    //     active: false,
    //     desc: 'Configure Brand Details'
    // },
    // {
    //     title: 'Product',
    //     link: 'platform/product',
    //     icon: 'settings',
    //     permissions: [],
    //     active: false,
    //     desc: 'Configure Product Details'
    // },
    // {
    //     title: 'Marketplace',
    //     link: 'platform/marketplace/list',
    //     icon: 'settings',
    //     permissions: [],
    //     active: false,
    //     desc: 'Configure MarketPlaces'
    // },
    // {
    //     title: 'Locations',
    //     link: 'platform/location',
    //     icon: 'settings',
    //     permissions: [],
    //     active: false,
    //     desc: 'Configure location programs'
    // }
]
export default {
    name: 'settings',
    components: {
        InlineSvg,
        NitrozenBadge,
        NitrozenDropdown,
        NitrozenButton,
        Jumbotron,
        HomePage,
        SettingsGroup
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            pageLoading: false,
            pageError: false,
            general_menus: GENERAL_MENUS,
            customize_menus: CUSTOMIZE_MENUS.concat(CUSTOM_PAGES),
            custom_menus: CUSTOM_MENUS,
            cutsom_pages: CUSTOM_PAGES,
            platform_configuration_menus:PLATFORM_CONFIGURATION_MENUS,
        };
    },
    mounted() {},
    methods: {
        titleCase,
        openHomePage(menu){
            this.$refs["custom-home-page"].open(menu)
        }
    }
};
</script>

<style lang="less" scoped>
.panel {
    display: flex;
    flex-direction: column;
}
.main-container {
    cursor: pointer;
    background-color: white;
    margin: 24px;
    padding: 24px;
    position: relative;
    min-height: 400px;
    section {
        margin-top: 24px;
        .settings-head {
            display: flex;
            align-items: center;
            .title {
                font-size: 18px;
                padding-left: 10px;
            }
        }
        .settings-main {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 48px;
            .settings-menu {
                flex: 0 33.3%;
            }
            .settings-body {
                border: 1px solid @Iron;
                border-radius: 3px;
                display: flex;
                cursor: pointer;
                margin: 24px 24px 0 0;
                min-height: 84px;
                &:hover {
                    box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, 0.1);
                }
                .settings-icon {
                    width: 30%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-right: 1px solid @Alabaster2;
                    background-color: @Alabaster2;
                    img {
                        width: auto;
                    }
                }
                .settings-content {
                    background-color: @White;
                    width: 70%;
                    padding: 12px;
                    .settings-detail {
                        padding-top: 6px;
                        font-size: 12px;
                        line-height: 1.5;
                    }
                }
            }
        }
    }
}
</style>
