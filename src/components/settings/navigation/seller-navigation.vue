<template>
    <div class="company">
        <div class="company-title">
            <div class="company-menu">
                Company Menu
            </div>
            <div class="grp-btn-close">
                <div class="add-menu-btn">
                    <nitrozen-button  v-strokeBtn size:='small' theme="secondary"> Add Menu Item </nitrozen-button>
                </div>
                <div class="menu-close">
                    <inline-svg :src="'arrow_down'" class="icon"></inline-svg>
                </div>
            </div>
        </div>
        <hr class="line">
        <div>
            <draggable :list="myArray" v-model="myArray">
                <transition-group>
                    <seller-navigation-list v-for="element in myArray" :key="element.id" :name="element.name" ></seller-navigation-list>
                </transition-group>
            </draggable>

        </div>
            
    </div>
</template>

<script>


import {
    NitrozenButton,
    strokeBtn,
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import SellerNavigationList from './seller-navigation-list.vue';
import draggable from 'vuedraggable';
export default {
    name: 'seller-navigation',
    components: {
        NitrozenButton,
        'inline-svg': inlineSvgVue,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'seller-navigation-list': SellerNavigationList,
        draggable,
    },
    directives: {
        strokeBtn
    },
    methods: {
    },
    data() {
        return {
            myArray: [
                {
                    name : "pratik",
                    id : 1,
                    fixed : false
                },
                {
                    name : "rajkotiya",
                    id : 2,
                    fixed : false
                }

            ]
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
            }
            .grp-btn-close{
                display: flex;
                align-items: center;
                .menu-close{
                    padding-left: 25px;
                }
            }

        }
        .line {
            border: 0.5px solid #E4E5E6;
            margin: 0px;
        }

    }
</style>
