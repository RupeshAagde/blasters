<template>
    <div class="container">
        <div class="menu" v-if="settings.length > 0" v-for="(item, index) in settings">
            <div class="menu-submenu-group">
                <div class="menu-item">
                    <div class="menu-group" >
                        <div class="icon">
                            <img class="img" :src="item.icon">
                        </div>
                        <div class="title"> {{ item.title }} </div>
                    </div>
                    <div class="arrow" v-if="item.child.length > 0" @click="changeSelectedMenu(index)"> 
                        <inline-svg
                            src="arrow-dropdown-black"
                            class="dropdown-icon"
                            :class="{
                                'rotate-arrow': selectedMenuIndex === index,
                            }"
                        ></inline-svg>
                    </div>
                </div>
                <div class="submenu" v-if="item.child.length > 0 && selectedMenuIndex === index" v-for="child in item.child">
                        <div class="title" >
                            {{ child.title }}
                        </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>



import inlineSvgVue from '@/components/common/inline-svg.vue';

export default {
    name: 'preview-setting',
    props: ['settings'],
    components: {
        'inline-svg': inlineSvgVue,
    },
    data() {
        return {
            selectedMenuIndex: -1
        }
    },
    methods: {
        changeSelectedMenu(index) {
            if (index === this.selectedMenuIndex)
                    this.selectedMenuIndex = -1
            else
                    this.selectedMenuIndex = index; 
        }
    }
};
</script>

<style lang="less" scoped>

    .container {
        border: 1px solid @LightGray;
        margin-top: 24px;
        .menu {
            margin-top: 24px;
            .menu-submenu-group {
                .menu-item {
                    margin: 14px 24px 14px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .menu-group {
                        display: flex;
                        align-items: center;
                        .title {
                            margin-left: 12px;
                            font-weight: 400;
                            font-size: 12px;
                            color: @Mako;
                        }
                        .icon .img{
                            width: 24px;
                            height: 24px;
                        }
                    }
                    .arrow {
                        .dropdown-icon {
                            transition: all 0.5s ease;
                            display: inline-block;
                            margin-left: auto;
                        }
                        .rotate-arrow {
                            transform: rotate(180deg);
                        }
                    }

                }

                .submenu {
                    margin-left: 58px;
                    .title {
                        margin: 24px 0px 24px 0px;
                        font-weight: 400;
                        font-size: 12px;
                        color: @Mako;
                    }

                }
            }

        }
       
    }
    
</style>
