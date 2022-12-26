<template>
        <div class="company-list">
            <div class="company-group"> 
                <div class="group1">
                    <div class="drag-icon">
                            <inline-svg :src="'drag'" class="icon"></inline-svg>
                    </div>
                    <div class="company-icon"> 
                        <img src="https://hdn-1.fynd.com/platform/pictures/feature-image/original/DXwhELtRew-Home.png"> 
                    </div>
                    <div class="company-info">
                            <div class="item"> {{ name }} </div>
                            <div class="sub-item"> 
                            <span id="p1">
                                Sub Menu:&nbsp; 
                            </span>
                            <div id="p2">
                                all prodhhhhhhhhhhuct
                            </div>
                        </div>
                    </div>
                </div>
                <div class="group2" >
                    <div class="company-edit" @click.stop="$root.$emit('seller-panel-navigation')" >
                        <inline-svg :src="'edit_pen'" class="icon"></inline-svg>
                    </div>
                    <div class="company-toggle">
                        <nitrozen-toggle-btn> </nitrozen-toggle-btn>
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
export default {
    name: 'seller-navigation-list',
    props: ['name'],
    components: {
        'inline-svg': inlineSvgVue,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
    },
    mounted() {
        
    },
    methods: {
        edit () {
        }
    },
    directives: {
    },
}
</script>


<style lang="less" scoped>

.company-list {
     .company-group {
                display: flex;
                align-items: center;
                justify-content:space-between;
                padding: 30px 20px;
                border: 1px solid #E4E5E6;
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
                .drag-icon{
                    
                }
                .company-icon{
                    width: 40px;
                    height: 40px;
                    background: #dae0f0;
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
                        color: #9B9B9B;
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
