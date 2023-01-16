<template>
    <div v-if="showNavigation">
        <confirmation-popup ref="confirmationPopup" @onUpdate="onSave"></confirmation-popup>
        <transition name="slide">
            <template>
                <div class="slide-fade" ref="slide-fade">
                    <div class="container" v-click-outside="showNavigationSection">
                        <div class="header">
                            <div v-if="isEdit" class="title">
                                Edit Navigation Item
                            </div>
                            <div v-else class="title">
                                Add Navigation Item
                            </div>
                            <div class="cancel-btn" @click="showNavigationSection">
                                <inline-svg :src="'cross-side-panel'" class="icon"></inline-svg>
                            </div>
                                                    
                        </div>
                        <div class="forms">

        
                            <div class="item-form">
                                <div class="image-upload">
                                    <div class="form-item">
                                        <image-uploader-tile
                                           label="Feature Image"
                                            aspectRatio="*"
                                            :fileName="'platform feature'"
                                            namespace="platform-feature-image"
                                            v-model="menuSettings.icon"
                                            @delete="menuSettings.icon = ''"
                                            @save="menuSettings.icon = $event"
                                        ></image-uploader-tile>
                                        <nitrozen-error v-bind:class="{ visible: errors['icon'] }">
                                                {{ errors['icon'] }}
                                        </nitrozen-error>
                                    </div>
                                    <div class="form-item">
                                        <div class="form-title-group">
                                            <div class="form-title">
                                                Title
                                            </div>
                                            <div class="previous-title" v-if="previousTitle">
                                                Previously: {{ previousTitle }}
                                            </div>
                                        </div>
                                        <nitrozen-input v-model="menuSettings.title" v-on:keyup="menuSettings.display = $event.target.value" type="text" placeholder="Give a title to the navigation item"></nitrozen-input>
                                        <nitrozen-error v-bind:class="{ visible: errors['title'] }">
                                                {{ errors['title'] }}
                                        </nitrozen-error>
                                    </div>

                                    <div class="form-item">
                                        <div class="form-title">
                                            Navigation Link
                                        </div>
                                        <nitrozen-input v-model="menuSettings.link" type="text" placeholder="Paste a link to the page here"></nitrozen-input>
                                        <nitrozen-error v-bind:class="{ visible: errors['link'] }">
                                                {{ errors['link'] }}
                                        </nitrozen-error>
                                    </div>

                                    <div class="form-item">
                                        <div class="form-title">
                                            Permission
                                        </div>
                                        <!-- <nitrozen-dropdown v-if="permissions.length !==0 " :items="permissions" v-model="menuSettings.permissions" :multiple="true"></nitrozen-dropdown> -->
                                        <div class="dropdown-btn">
                                            <div class="dropdown">
                                                <nitrozen-dropdown v-if="permissions.length !==0 " :items="permissions" v-model="menuSettings.permissions[0]" :multiple="false"></nitrozen-dropdown>
                                            </div>
                                            <div class="button">
                                                <nitrozen-button :theme="'secondary'" @click.stop="menuSettings.permissions = []"> Clear </nitrozen-button>
                                            </div>
                                        </div>

                                    </div>

                                    <div class="form-item">
                                        <div class="form-title">
                                            Visible On
                                        </div>
                                        <div class="visible-grp">
                                            <div class="item">
                                                <div class="check">
                                                    <nitrozen-checkbox v-model="menuSettings.visible_on.android"></nitrozen-checkbox>
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
                                                    <nitrozen-checkbox v-model="menuSettings.visible_on.ios" ></nitrozen-checkbox>
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
                                                    <nitrozen-checkbox v-model="menuSettings.visible_on.web" ></nitrozen-checkbox>
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
                            <sub-menu ref="subMenu" v-if="menuSettings" :menuSettings="menuSettings.child"></sub-menu>

                        </div>
                        <div class="add-cancle-btn">
                                <div class="cancle-btn">
                                    <nitrozen-button :theme="'secondary'" v-strokeBtn size:='small' @click.stop="showNavigationSection"> Cancel </nitrozen-button>          
                                </div>
                                <div class="add-btn">
                                    <nitrozen-button :theme="'secondary'" @click.stop="openConfirmationPopup('Save Changes?', 'If you save the changes here, it will change the navigation panel for all the sellers.', 'Yes', 'No')"  v-flatBtn> Save </nitrozen-button>
                                </div>
                        </div>
                    </div>
                </div>
                
            </template>
        </transition>
    </div>
</template>

<script>
const REQUIRED_FIELDS = [
    'title',
    'link',
    'icon'
];
import { NitrozenInput, NitrozenDropdown, NitrozenCheckBox, NitrozenButton, strokeBtn, flatBtn, NitrozenError } from '@gofynd/nitrozen-vue';
import SubMenu from './sub-menu-form.vue'
import ConfirmationPopup from './confirmation-popup.vue';
import { cloneDeep } from "lodash";
import isEmpty from 'lodash/isEmpty';
import { ImageUploaderTile, InlineSvg } from '@/components/common/';
export default {
    name: 'side-panel',
    components: {
        'inline-svg': InlineSvg,
        "nitrozen-input": NitrozenInput,
        "nitrozen-dropdown": NitrozenDropdown,
        "nitrozen-checkbox": NitrozenCheckBox,
        "nitrozen-button": NitrozenButton,
        "sub-menu": SubMenu,
        'nitrozen-error': NitrozenError,
        'image-uploader-tile': ImageUploaderTile,
        'confirmation-popup': ConfirmationPopup
    },
    directives: {
        strokeBtn,
        flatBtn
    },
    data() {
        return {
            showNavigation : false,
            menuSettings: null,
            permissions: [],
            type: '',
            index: null,
            isEdit: false,
            errors: {},
            previousTitle: ''
        }
    },
    methods: {
        showNavigationSection () {
            this.clearError()
            this.showNavigation = !this.showNavigation;
        },
        close () {
            this.showNavigation = false;
        },
        setPermission(permissions) {
            for (let index = 0; index < permissions.length; index++) {
                this.permissions[index] = {
                    text: permissions[index].title,
                    value: permissions[index].key
                }
            }
        },
        openConfirmationPopup(header, info, confirmButtonName, cancleButtonName) {
            if(this.validateForm()) {
                this.$refs["confirmationPopup"].open({
                    header: header,
                    info: info,
                    confirmButtonName: confirmButtonName,
                    cancleButtonName: cancleButtonName
                });
            }
        },
        openSidePanel(settings) {
            settings = cloneDeep(settings)
            this.menuSettings = settings.data;
            this.previousTitle = this.menuSettings.title
            this.type = settings.type;
            this.isEdit = settings.isEdit
            if (settings.isEdit) {
                this.index = settings.index
            }
            this.setPermission(this.type === 'company_level' ? settings.permissions.permissions : settings.permissions.application.permissions)
            this.showNavigationSection()
        },
        validateRequiredFormFields() {
            let value = '';
            let isVaild = true;
            REQUIRED_FIELDS.forEach(key => {
                value = this.menuSettings[key]
               
               if (isEmpty(value)) {
                   this.errors[key] = '* Required field';
                   isVaild = false;
               }

               if(value && key === 'link' && value.includes(' ')){
                    this.errors[key] = 'Invalid Path';
                    isVaild = false;
               }
            });

            return isVaild
        },
        validateForm() {
            this.clearError()
            return this.validateRequiredFormFields() && this.$refs['subMenu'].validateForm()
        },
        clearError() {
            this.errors = {}
        },
        onSave() {
            if (this.validateForm()){
                this.$emit('onSave', {index: this.index, data: this.menuSettings, type: this.type, isEdit: this.isEdit});
                this.showNavigationSection()
            }
        }
    }
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
        z-index: @menu;
        .container {
            position: absolute;
            right: 0px;
            width: 506px;
            height: 100%;
            background: @White;
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
            position: fixed;
            display: flex;
            justify-content: space-between;
            height: 72px;
            align-items: center;
            z-index: @gotop;
            background: @White;
            width: 506px;
            box-sizing: border-box;
            border-bottom: 0.5px solid @LightGray;
            .line {
                border: 0.5px solid @LightGray;
                margin: 0px;
            }
            
            .title {
                font-style: normal;
                font-weight: 700;
                font-size: 20px;
                margin-left: 24px;
                color: @Mako;
            }

            .cancel-btn {
                cursor: pointer;
                margin-right: 25px;
            }
        }

        .forms {
            margin: 80px 24px 80px 24px;

            .item-form {

                .form-item {
                    margin-top: 15px;
                    .form-title-group {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .dropdown-btn {
                        display: flex;
                        justify-content: space-between;
                        .dropdown {
                            flex: 0.90;
                        }
                    }

                    .previous-title {
                        font-weight: 400;
                        font-size: 12px;
                        color:@DarkGray;
                    }
                }

                .visible-grp {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    .item {
                        display: flex;
                        align-items: center;
                        border: 0.5px solid @LightGray;
                        height: 45px;
                        width: 140px;
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

            .form-title {
                margin-top: 10px;
                font-weight: 400;
                font-size: 12px;
                color: @DarkGray;
                margin-bottom: 10px;
            }

            .line {
                border: 0.5px solid @LightGray;
                margin: 0px;
            }
        }

        .add-cancle-btn {
            display: flex;
            position: fixed;
            width: 506px;
            bottom: 0;
            align-items: center;
            height: 72px;
            justify-content: right;
            background-color: @White;
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
