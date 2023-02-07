<template>
        <div class="company-list">
            <confirmation-popup ref="confirmationPopup" @onUpdate="onUpdate"></confirmation-popup>
            <div class="company-group"> 
                <div class="group1">
                    <div class="drag-icon">
                            <inline-svg :src="'drag'" class="icon"></inline-svg>
                    </div>
                    <div class="company-icon"> 
                        <img :src="icon"> 
                    </div>
                    <div class="company-info">
                            <div class="item"> {{ name }} </div>
                            <div class="sub-item" v-if="subMenu.length > 0"> 
                            <span id="p1">
                                Sub Menu:&nbsp; 
                            </span>
                            <div  id="p2">
                                {{ modifySubMenuTitle() }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="group2" >
                    <div class="company-edit" @click.stop="$emit('seller-panel-show')" >
                        <inline-svg :src="'edit_pen'" class="icon"></inline-svg>
                    </div>
                    <div @click.stop="openConfirmationPopup('Are you sure?', `If you delete “${name}” , the seller won’t be able to access it anymore.`, 'Yes', 'No')">
                        <inline-svg :src="'delete-icon'"  class="icon"></inline-svg>
                    </div>
                </div>
            </div>
        </div>
</template>

<script>
/* Component imports */


import {
    NitrozenToggleBtn
} from '@gofynd/nitrozen-vue';
import inlineSvgVue from '@/components/common/inline-svg.vue';
import ConfirmationPopup from './confirmation-popup.vue';
export default {
    name: 'seller-navigation-list',
    props: ['name', 'subMenu', 'icon'],
    components: {
        'inline-svg': inlineSvgVue,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'confirmation-popup': ConfirmationPopup
    },
    methods: {
        modifySubMenuTitle () {
           let subMenuTitle = ''
           for (let index = 0; index < this.subMenu.length; index++) {
                let menuStr = this.subMenu[index];
                for (let menuIndex = 0; menuIndex < menuStr.length; menuIndex++) {
                    subMenuTitle = subMenuTitle + menuStr[menuIndex]
                    if (subMenuTitle.length > 49) {
                        return subMenuTitle + (this.subMenu.length - index - 1 > 0 ? ` ...+${this.subMenu.length - index - 1} More` : '')
                    }
                }
                if (index + 1 !== this.subMenu.length ) 
                        subMenuTitle = subMenuTitle + ', ';
           }
           return subMenuTitle
        },
        openConfirmationPopup(header, info, confirmButtonName, cancleButtonName) {
                this.$refs["confirmationPopup"].open({
                    header: header,
                    info: info,
                    confirmButtonName: confirmButtonName,
                    cancleButtonName: cancleButtonName,
                    type: 'main'
                });
        },
        onUpdate(isSave) {
            if (isSave)
                this.$emit('delete-menu')
        }
    }
}
</script>


<style lang="less" scoped>

.company-list {
     .company-group {
                display: flex;
                align-items: center;
                justify-content:space-between;
                padding: 30px 20px;
                border: 1px solid @LightGray;
                margin: 20px 20px 20px 20px;
                .group1{
                    display: flex;
                    // justify-content: center;
                    align-items: center;
                    width: 70%;
                }
                .group2 {
                    display: flex;
                    align-items: center;
                }
                .company-icon{
                    width: 40px;
                    height: 40px;
                    background: @LinkWater;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 50%;
                    margin-left: 20px;
                }
                .company-info {
                    display: flex;
                    flex-direction: column;
                    margin-left: 2%;
                
                    .item {
                        font-weight: 600;
                        font-size: 14px;
                        margin-bottom: 4px;
                    }
                    .sub-item {
                        display: flex;
                    }

                    .sub-item #p1 {
                        color: @DarkGray;
                        font-size: 12px;
                        font-weight: 400;
                    }
                    .sub-item #p2 {
                        font-size: 12px;
                        font-weight: 400;
                    }

                }

                .company-edit{
                    margin-right: 15px;
                }
                .company-icon img {
                    width: 24px;
                    height: 20px;
                }
                .company-toggle {
                    margin-left: 1%;
                }
        }
    }

</style>
