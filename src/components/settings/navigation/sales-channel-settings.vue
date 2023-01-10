<template>
    <div class="company">
        <div class="company-title">
            <div class="company-menu">
                <div  v-if="type==='application_level'">
                    <div>
                        {{ appSettings.title }}
                    </div>
                    <edit-header ref="editPopUp" :title="appSettings.title" @saveTitle="appSettings.title = $event"></edit-header>
                </div>
                <div  v-else>
                    Company Menu
                </div>
                <div id="company-setting" v-if="type==='application_level'" @click="editHeader">
                    <inline-svg :src="'edit_pen'" class="icon"></inline-svg>
                </div>
            </div>
            <div class="grp-btn-close">
                <div class="check" v-if="type==='application_level'">
                    <nitrozen-checkbox  v-model="appSettings.can_add" > Show Create Button </nitrozen-checkbox>
                </div>
                <div class="add-menu-btn">
                    <nitrozen-button  v-strokeBtn size:='small' theme="secondary" @click.stop="$emit('seller-panel-show', { data: getSettings(), type: type, isEdit: false})"> Add Menu Item </nitrozen-button>
                </div>
                <div class="menu-close" @click="toggleMenu">
                    <inline-svg
                            src="arrow_down"
                            class="dropdown-icon"
                            :class="{
                                'rotate-arrow': show,
                            }"
                    ></inline-svg>
                </div>
            </div>
        </div>
        <hr class="line">
        <div class="navigation-list" v-if="settings && show">
            <draggable :list="settings" v-model="settings">
                <transition-group>
                    <seller-navigation-list v-for="(element, index) in settings" :key="index" :name="element.title" :subMenu="getSubMenu(element.child)" :icon="element.icon" @delete-menu="settings.splice(index, 1)" @seller-panel-show="$emit('seller-panel-show', { type: type, index: index, isEdit: true})"></seller-navigation-list>
                </transition-group>
            </draggable>
        </div>
    </div>
</template>

<script>


import {
    NitrozenButton,
    strokeBtn,
    NitrozenToggleBtn,
    NitrozenCheckBox,
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SellerNavigationList from './seller-navigation-list.vue'
import EditHeader from './edit-header.vue'
import draggable from 'vuedraggable';

export default {
    name: 'seller-channel-settings',
    props: ['settings', 'permissions', 'type', 'appSettings'],
    components: {
        NitrozenButton,
        'inline-svg': inlineSvgVue,
        'edit-header': EditHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'seller-navigation-list': SellerNavigationList,
        'nitrozen-checkbox': NitrozenCheckBox,
        draggable,
    },
    directives: {
        strokeBtn
    },
    data() {
        return {
            show: true,
        }
    },
    methods: {
        getSubMenu(subMenu) {
            let subMenuStr = ''
            for (let index = 0; index < subMenu.length; index++) {
               subMenuStr = subMenuStr + subMenu[index].title  + ", " 
            }
            return subMenuStr
        },
        toggleMenu() {
            this.show = !this.show
        },
        editHeader() {
            this.$refs["editPopUp"].open(this.appSettings.title)
        },
        getSettings() {
            return {
                    "visible_on": {
                        "web": false,
                        "ios": false,
                        "android": false
                    },
                    "display": "",
                    "permissions": [],
                    "title": "",
                    "link": "",
                    "icon": "",
                    "child": []
                }
        },
    }
};
</script>

<style lang="less" scoped>
    .company {
        margin-top: 22px;
        border-radius: 3px;
        border: 1px solid @LightGray;
        .company-title {
            display: flex;
            align-content: center;
            align-items: center;
            padding: 16px 20px;
            justify-content: space-between;
            .company-menu {
                font-weight: 600;
                font-size: 18px;
                display: flex;
                .title-edit .input {
                    outline: none !important;
                }
            }

            .company-menu #company-setting {
                margin-left: 15px;
            }
            .grp-btn-close{
                display: flex;
                align-items: center;
                .menu-close{
                    padding-left: 25px;
                    .dropdown-icon {
                        transition: all 0.5s ease;
                    }
                    .rotate-arrow {
                        transform: rotate(180deg);
                    }
                }
            }

            .check {
                margin-right: 10px;
            }

        }
        .line {
            border: 0.5px solid @LightGray;
            margin: 0px;
        }

    }
</style>
