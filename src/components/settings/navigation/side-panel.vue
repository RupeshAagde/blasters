<template>
    <div v-if="showNavigation">
        <transition name="slide">
            <template >
                <div class="slide-fade" ref="slide-fade">
                    <div class="container" v-click-outside="showNavigationSection">
                        <div class="header">
                            <div class="title">
                                Add Navigation Item
                            </div>
                            <div class="cancel-btn" @click="showNavigationSection">
                                <inline-svg :src="'cross-side-panel'" class="icon"></inline-svg>
                            </div>
                        </div>
                        <hr class="line">
                        <div class="forms">
                            <div class="item-form">
                                <div class="image-upload">
                                    <div class="form-title">
                                        Image
                                    </div>
                                    <div class="form-item">
                                        <div class="image-grp">
                                            <div class="image-upload-space">
                                                <div class="plus">
                                                    <inline-svg :src="'plus-blue'" class="icon"></inline-svg>
                                                </div>
                                                <div class="upload-des">
                                                    Upload
                                                </div>
                                            </div>
                                            <div class="image-guidelines">
                                                <div class="title">
                                                    Image Guidelines:
                                                </div>
                                                <div class="description">
                                                    &#x2022; Accepted icon types: SVG, File Size &lt 2MB
                                                </div>
                                                <div class="description">
                                                    &#x2022; Dimensions: 100px(W) * 100px(H), Aspect Ratio: 1:1
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-item">
                                        <div class="form-title">
                                            Title
                                        </div>
                                        <nitrozen-input type="text" placeholder="Give a title to the navigation item"></nitrozen-input>
                                    </div>

                                    <div class="form-item">
                                        <div class="form-title">
                                            Navigation Link
                                        </div>
                                        <nitrozen-input type="text" placeholder="Paste a link to the page here"></nitrozen-input>
                                    </div>

                                    <div class="form-item">
                                        <div class="form-title">
                                            Permission
                                        </div>
                                        <nitrozen-dropdown ></nitrozen-dropdown>
                                    </div>

                                    <div class="form-item">
                                        <div class="form-title">
                                            Visible On
                                        </div>
                                        <div class="visible-grp">
                                            <div class="item">
                                                <div class="check">
                                                    <nitrozen-checkbox></nitrozen-checkbox>
                                                </div>
                                                <div>
                                                    <inline-svg :src="'android'" class="icon"></inline-svg>
                                                </div>
                                                <div class="des">
                                                    Android
                                                </div>                   
                                            </div>
                                            <div class="item">
                                                <div class="check">
                                                    <nitrozen-checkbox></nitrozen-checkbox>
                                                </div>
                                                <div class="des">
                                                    <inline-svg :src="'ios'" class="icon"></inline-svg>
                                                </div>
                                                <div class="des">
                                                    IOS
                                                </div>                   
                                            </div>
                                            <div class="item">
                                                <div class="check">
                                                    <nitrozen-checkbox></nitrozen-checkbox>
                                                </div>
                                                <div>
                                                    <inline-svg :src="'web'" class="icon"></inline-svg>
                                                </div>
                                                <div class="des">
                                                    Web
                                                </div>                   
                                            </div>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div>
                            <hr class="line">
                            <div class="sub-item-form">
                                <div class="sub-menu-title">
                                    <div class="title">
                                        Sub Menu
                                    </div>
                                    <div class="sub-title">
                                        Create a sub menu under current navigation item
                                    </div>
                                </div>

                                <div class="sub-menu">

                                    <div class="sub-menu-input-title">
                                        <div class="title-grp">
                                            <div class="drag">
                                                 <inline-svg :src="'drag'" class="icon"></inline-svg>
                                            </div>
                                            <div class="item-title">
                                                Sub Item 1
                                            </div>
                                        </div>

                                        <div class="icon-grp">
                                            <div class="item-dlt">
                                                <inline-svg :src="'delete'" class="icon"></inline-svg>
                                            </div>
                                            <div class="arrow">
                                                <inline-svg :src="'arrow_down'" class="icon"></inline-svg>
                                            </div>
                                        </div>
                                    </div>

                                    <hr class="line">

                                    <div class="sub-menu-input">
                                        <div class="form-item">
                                            <div class="form-title">
                                                Title
                                            </div>
                                            <nitrozen-input type="text" placeholder="Give a title to the sub item"></nitrozen-input>
                                        </div>
                                        <div class="form-item">
                                            <div class="form-title">
                                                Navigation Link
                                            </div>
                                            <nitrozen-input type="text" placeholder="Paste a link to the page"></nitrozen-input>
                                        </div>
                                        <div class="form-title">
                                            Visible On
                                        </div>
                                        <div class="visible-grp">
                                            <div class="item">
                                                <div class="check">
                                                    <nitrozen-checkbox></nitrozen-checkbox>
                                                </div>
                                                <div>
                                                    <inline-svg :src="'android'" class="icon"></inline-svg>
                                                </div>
                                                <div class="des">
                                                    Android
                                                </div>                   
                                            </div>
                                            <div class="item">
                                                <div class="check">
                                                    <nitrozen-checkbox></nitrozen-checkbox>
                                                </div>
                                                <div class="des">
                                                    <inline-svg :src="'ios'" class="icon"></inline-svg>
                                                </div>
                                                <div class="des">
                                                    IOS
                                                </div>                   
                                            </div>
                                            <div class="item">
                                                <div class="check">
                                                    <nitrozen-checkbox></nitrozen-checkbox>
                                                </div>
                                                <div>
                                                    <inline-svg :src="'web'" class="icon"></inline-svg>
                                                </div>
                                                <div class="des">
                                                    Web
                                                </div>                   
                                            </div>
                                        </div>
                                    </div>

                                </div>


                                <div class="add-sub-menu-btn">
                                    <nitrozen-button :theme="'secondary'" >+ Add Sub Item</nitrozen-button>
                                </div>
                            </div>
                            <div class="default-page">
                                <div class="form-title">
                                    Default Page
                                </div>
                                <div>
                                    <nitrozen-dropdown ></nitrozen-dropdown>
                                </div>
                            </div>

                        </div>
                        <div class="add-cancle-btn">
                                <div class="cancle-btn">
                                    <nitrozen-button :theme="'secondary'" v-strokeBtn size:='small'> Cancle </nitrozen-button>
                                    
                                </div>
                                <div class="add-btn">
                                    <nitrozen-button :theme="'secondary'" v-flatBtn> Add </nitrozen-button>
                                </div>
                        </div>
                    </div>
                </div>
            </template>
        </transition>
    </div>
</template>

<script>
import inlineSvgVue from '@/components/common/inline-svg.vue';
import { NitrozenInput, NitrozenDropdown, NitrozenCheckBox, NitrozenButton, strokeBtn, flatBtn } from '@gofynd/nitrozen-vue';
export default {
    name: 'side-panel',
    components: {
        'inline-svg': inlineSvgVue,
        "nitrozen-input": NitrozenInput,
        "nitrozen-dropdown": NitrozenDropdown,
        "nitrozen-checkbox": NitrozenCheckBox,
        "nitrozen-button": NitrozenButton
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    mounted() {
    },
    data() {
        return {
            showNavigation : false
        }
    },
    mounted() {
        this.$root.$on('seller-panel-navigation', () => {
           this.showNavigationSection()
        });
    },
    methods: {
        showNavigationSection () {
            this.showNavigation = !this.showNavigation;
        },
        close () {
            this.showNavigation = false;
        }
     },
};
</script>

<style lang="less" scoped>
    .slide-fade {
        height: 100%;
        position: fixed;
        top: 0px;
        right: 0px;
        width: 100%;
        background-color: rgba(82, 78, 78, 0.52);
        z-index: +45;
        .container {
            position: absolute;
            right: 0px;
            width: 506px;
            height: 100%;
            background: white;
            overflow-y: scroll;
            box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.1);
            &::-webkit-scrollbar {
                display: none;
            }
            @media @mobile {
                position: fixed;
                width: 100%;
            }

        }
        .header {
            display: flex;
            justify-content: space-between;
            height: 72px;
            align-items: center;
            .line {
                border: 0.5px solid #E0E0E0;
                margin: 0px;
            }
            
            .title {
                font-style: normal;
                font-weight: 700;
                font-size: 20px;
                margin-left: 24px;
                color: #41434C;
            }

            .cancel-btn {
                cursor: pointer;
                margin-right: 25px;
            }
        }

        .forms {
            margin: 24px 24px 0px 24px;

            .item-form {

                .form-item {
                    margin-top: 15px;
                }

                .visible-grp {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    .item {
                        display: flex;
                        align-items: center;
                        border: 0.5px solid #E0E0E0;
                        height: 45px;
                        width: 140px;
                        font-weight: 400;
                        font-size: 12px;
                        color: #41434C;

                        .des {
                            margin-left: 8px;
                        }

                        .check {
                            margin-left: 10px;
                            margin-bottom: 15px;
                        }
                    }

                }

                .image-upload {
                    
                    .image-grp {
                        display: flex;
                        height: 100px;
                        .item {
                            width: 100px;
                            height: 45px;
                            border: 1px solid #E4E5E6;
                        }
                    }
                    .image-upload-space {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        background: #dae0f0;
                        width: 100px;
                        height: 100px;
                        .upload-des {
                            margin-top: 5px;
                            color: #2E31BE;
                            font-style: normal;
                            font-weight: 500;
                            font-size: 12px;
                        }
                    }

                    .image-guidelines {
                        display: flex;
                        flex-direction: column;
                        justify-content: space-evenly;
                        margin-left: 16px;
                        border: 1px solid #E4E5E6;
                        font-style: normal;
                        padding-left: 10px;
                        width: 342px;
                        .title {
                            font-weight: 700;
                            font-size: 12px;
                            color: #2E31BE;
                        }

                        .description {
                            font-weight: 400;
                            font-size: 12px;
                            color: #41434C;
                        }
                    }
                }


            }

            .sub-item-form {

                .sub-menu-title {
                    display: flex;
                    flex-direction: column;
                    
                    .title {
                        font-weight: 600;
                        font-size: 16px;
                        color: #41434C;
                        margin-top: 10px;
                    }

                    .sub-title {
                        font-weight: 400;
                        font-size: 12px;
                        color: #9B9B9B;
                        margin-top: 10px;
                    }
                }

                .add-sub-menu-btn {
                        margin-top: 15px;
                    }

                .sub-menu {
                    margin-top: 15px;
                    border: 1px solid #E4E5E6;

                    .sub-menu-input-title {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 55px;

                        .title-grp {
                            display: flex;
                            .item-title {
                                margin-left: 15px;
                                font-weight: 600;
                                font-size: 16px;
                                color: #41434C;
                            }

                            .drag {
                                margin-left: 15px;
                            }
                        }

                        .icon-grp {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-right: 15px;

                            .item-dlt {
                                margin-right: 10px;
                            }
                        }
                     }

                     .sub-menu-input {
                        margin: 20px 15px 20px 15px;
                            .visible-grp {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 15px;
                            .item {
                                display: flex;
                                align-items: center;
                                border: 0.5px solid #E0E0E0;
                                height: 45px;
                                width: 120px;
                                font-weight: 400;
                                font-size: 12px;
                                color: #41434C;

                                .des {
                                    margin-left: 8px;
                                }

                                .check {
                                    margin-left: 10px;
                                    margin-bottom: 15px;
                                }
                            }

                        }
                        
                     }
                }
            }
            .form-title {
                margin-top: 10px;
                font-weight: 400;
                font-size: 12px;
                color: #9B9B9B;
                margin-bottom: 10px;
            }

            .line {
                border: 0.5px solid #E4E5E6;
                margin: 0px;
            }
        }

        .add-cancle-btn {
            display: flex;
            margin-top: 25px;
            align-items: center;
            height: 72px;
            justify-content: right;
            color: white;
            box-shadow: 0px -4px 12px rgba(0, 0, 0, 0.06);

            .cancle-btn {
                margin-right: 15px;
            }

            .add-btn {
                margin-right: 24px;
            }
        
        }
    }

</style>
