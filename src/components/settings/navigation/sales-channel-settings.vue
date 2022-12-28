<template>
    <div class="company">
        <div class="company-title">
            <div class="company-menu">
                <div>
                    Seller Channel Settings
                </div>
                <div id="company-setting">
                    <inline-svg :src="'edit_pen'" class="icon"></inline-svg>
                </div>
            </div>
            <div class="grp-btn-close">
                <div class="check">
                    <nitrozen-checkbox> Show Create Button </nitrozen-checkbox>
                </div>
                <div class="add-menu-btn">
                    <nitrozen-button  v-strokeBtn size:='small' theme="secondary" @click.stop="$root.$emit('seller-panel-navigation',{ data: getSettings(), edit: false, type: 'sales-channel', permissions: permissions})"> Add Menu Item </nitrozen-button>
                </div>
                <div class="menu-close">
                    <inline-svg :src="'arrow_down'" class="icon"></inline-svg>
                </div>
            </div>
        </div>
        <hr class="line">
        <div v-if="channelSettings">
            <draggable :list="channelSettings" v-model="channelSettings">
                <transition-group>
                    <seller-navigation-list v-for="element in channelSettings" :key="element.title" :name="element.title" :subMenu="getSubMenu(element.child)" :icon="element.icon" :type="'sales-channel'" :move="onListChange()" @toggle-list="toggleList" @seller-panel-show="showPanel"></seller-navigation-list>
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
    NitrozenCheckBox
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SellerNavigationList from './seller-navigation-list.vue'
import draggable from 'vuedraggable';

export default {
    name: 'seller-channel-settings',
    props: ['settings', 'permissions'],
    components: {
        NitrozenButton,
        'inline-svg': inlineSvgVue,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'seller-navigation-list': SellerNavigationList,
        'nitrozen-checkbox': NitrozenCheckBox,
        draggable,
    },
    directives: {
        strokeBtn
    },
    mounted() {
        this.channelSettings = this.settings
    },
    data() {
        return {
            channelSettings: []
        }
    },
    methods: {
        onListChange() {
            this.$emit('change-list', {type: 'sales-channel', data: this.channelSettings})
        },
        getSubMenu(subMenu) {
            let subMenuStr = ''
            for (let index = 0; index < subMenu.length; index++) {
               subMenuStr = subMenuStr + subMenu[index].title  + ", " 
            }
            return subMenuStr
        },
        toggleList(payload) {
            if (payload.type == 'sales-channel') {
                let obj = {}
                obj['is_disabled'] =  payload.isDisable
                this.updateData(payload.id, obj)
            }
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
        showPanel(payload) {
            this.$emit('seller-panel-show', payload)
        },
        updateData(key, obj) {
            for (let index = 0; index < this.channelSettings.length; index++) {
                if (key == this.channelSettings[index].title) {
                    this.channelSettings[index] = {...this.channelSettings[index], ...obj};
                    break;
                }
            }
            this.$emit('change-list',{type: 'sales-channel', data: this.channelSettings})
        }
    }
};
</script>

<style lang="less" scoped>
    .company {
        margin-top: 22px;
        border-radius: 3px;
        border: 1px solid #E4E5E6;
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
            }

            .company-menu #company-setting {
                margin-left: 15px;
            }
            .grp-btn-close{
                display: flex;
                align-items: center;
                .menu-close{
                    padding-left: 25px;
                }
            }

            .check {
                margin-right: 10px;
            }

        }
        .line {
            border: 0.5px solid #E4E5E6;
            margin: 0px;
        }

    }
</style>
