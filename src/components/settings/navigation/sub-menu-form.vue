<template>
    <div class="sub-item-form">
        <div class="sub-menu-title">
            <div class="title">
                Sub Menu
            </div>
            <div class="sub-title">
                Create a sub menu under current navigation item
            </div>
        </div>

        <draggable :list="subMenu" v-model="subMenu">
                <transition-group>
                    <div class="sub-menu" v-for="(item, index) in subMenu" :key="index" >
                        <div class="sub-menu-input-title">
                            <div class="title-grp">
                                <div class="drag">
                                        <inline-svg :src="'drag'" class="icon"></inline-svg>
                                </div>
                                <div class="item-title">
                                    Sub Item {{ index + 1}}
                                </div>
                            </div>

                            <div class="icon-grp">
                                <div class="item-dlt" @click="onDeleteMenu(index)">
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

                                <nitrozen-input v-model="item.title"  type="text" placeholder="Give a title to the sub item"></nitrozen-input>
                                <nitrozen-error v-bind:class="{ visible: errors[index]['title'] }">
                                                {{ errors[index]['title'] }}
                                </nitrozen-error>
                            </div>
                            <div class="form-item">
                                <div class="form-title">
                                    Navigation Link
                                </div>
                                <nitrozen-input v-model="item.link" type="text" placeholder="Paste a link to the page"></nitrozen-input>
                                <nitrozen-error v-bind:class="{ visible: errors[index]['link'] }">
                                                {{ errors[index]['link'] }}
                                </nitrozen-error>
                            </div>
                            <div class="form-title">
                                Visible On
                            </div>
                            <div class="visible-grp">
                                <div class="item">
                                    <div class="check">
                                        <nitrozen-checkbox v-model="item.visible_on.android"></nitrozen-checkbox>
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
                                        <nitrozen-checkbox v-model="item.visible_on.ios"></nitrozen-checkbox>
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
                                        <nitrozen-checkbox v-model="item.visible_on.web"></nitrozen-checkbox>
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
                </transition-group>
        </draggable>

        <div class="add-sub-menu-btn">
            <nitrozen-button :theme="'secondary'" @click.stop="addSubMenu" >+ Add Sub Item</nitrozen-button>
        </div>
    </div>
</template>

<script>
/* Component imports */
import inlineSvgVue from '@/components/common/inline-svg.vue';
import { NitrozenInput, NitrozenCheckBox, NitrozenButton, NitrozenError} from '@gofynd/nitrozen-vue';
import draggable from 'vuedraggable';
import isEmpty from 'lodash/isEmpty';

const REQUIRED_FIELDS = [
    'title',
    'link'
];

export default {
    name: 'sub-menu',
    props: ['menuSettings'],
    components: {
        'inline-svg': inlineSvgVue,
        "nitrozen-input": NitrozenInput,
        "nitrozen-checkbox": NitrozenCheckBox,
        "nitrozen-button": NitrozenButton,
        'nitrozen-error': NitrozenError,
        draggable
    },
    mounted() {
        this.subMenu = this.menuSettings
        this.clearErrors()
    },
    data() {
        return {
            subMenu : null,
            errors: []
        }
    },
    methods: {
        addSubMenu () {
            this.subMenu.push({               
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
                "is_disabled": false,
                "child": []
            })
            this.errors.push({
                title: '',
                link: ''
            })
        },
        onDeleteMenu(index) {
            this.subMenu.splice(index, 1)
            this.errors.splice(index, 1)
        },
        validateRequiredFormFields() {
            let value = '';
            let isVaild = true;
            for (let index = 0; index < this.errors.length; index++) {

                REQUIRED_FIELDS.forEach(key => {
                    value = this.subMenu[index][key]
                
                if (isEmpty(value)) {
                    this.errors[index][key] = '* Required field';
                    isVaild = false;
                }
                });
            }

            return isVaild

        },
        clearErrors() {
            this.errors = [];
            for (let index = 0; index < this.subMenu.length; index++) {
                this.errors.push({
                    title: '',
                    link: ''
                })
            }
        },  
        validateForm() {
            this.clearErrors()
            return this.validateRequiredFormFields()
        },
    }
}
</script>


<style lang="less" scoped>
    .sub-item-form {
        .sub-menu-title {
            display: flex;
            flex-direction: column;
            
            .title {
                font-weight: 600;
                font-size: 16px;
                color: @Mako;
                margin-top: 10px;
            }

            .sub-title {
                font-weight: 400;
                font-size: 12px;
                color: @Mako;
                margin-top: 10px;
            }
        }
        .add-sub-menu-btn {
                margin-top: 15px;
        }
        .sub-menu {
            margin-top: 15px;
            border: 0.5px solid @LightGray;

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
                        color: @Mako;
                    }

                    .drag {
                        margin-left: 15px;
                        cursor: pointer;
                    }
                }

                .icon-grp {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 15px;

                    .item-dlt {
                        margin-right: 10px;
                        cursor: pointer;
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
                        border: 0.5px solid @LightGray;
                        height: 45px;
                        width: 120px;
                        font-weight: 400;
                        font-size: 12px;
                        color: @Mako;

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
        color: @Mako;
        margin-bottom: 10px;
    }

</style>
