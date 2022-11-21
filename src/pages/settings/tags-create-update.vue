<template>
    <div class="container">
        <div class="header-position">
            <page-header 
            :title="pageTitle" 
            @backClick="redirectToListing"
            :contextMenuItems="contextDeleteTag"
            @edit="openDeleteDialog()"
            >
                <div class="button-box">
                    <nitrozen-button
                        class="pad-left"
                        theme="secondary"
                        v-flatBtn
                        id="post-update"
                        @click="postTags"
                    >
                        {{ this.tagMode }}
                    </nitrozen-button>
                </div>
            </page-header>
        </div>
        <loader v-if="pageLoading || inProgress" class="loading"></loader>
        <div class="main-container">
            <div class="form-container">
                <div class="cl-Mako bold-md">Details</div>
                <div class="form-row">
                    <nitrozen-input
                        label="Name *"
                        placeholder="Enter tag name"
                        v-model="name.value"
                    ></nitrozen-input>
                    <nitrozen-error
                        class="nitrozen-error"
                        v-if="name.showerror"
                    >
                        {{ name.errortext }}
                    </nitrozen-error>
                </div>
                <div class="form-row">
                    <nitrozen-dropdown
                        label="Choose file type"
                        placeholder="Choose filetype"
                        :items="supportedFileTypes"
                        v-model="fileType.value"
                        tooltip="File type of tags to inject"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="fileType.showerror">
                        {{ fileType.errortext }}
                    </nitrozen-error>
                </div>
                <div class="form-row">
                    <nitrozen-dropdown
                        label="Choose sub type"
                        placeholder="Choose sub type"
                        :items="supportedSubTypes"
                        v-model="subType.value"
                        tooltip="Sub type of file, if External enter the url and if Inline then use the code editor"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="subType.showerror">
                        {{ subType.errortext }}
                    </nitrozen-error>
                </div>
                <div class="form-row">
                    <nitrozen-dropdown
                        label="Choose Tag Position"
                        placeholder="Choose position"
                        :items="supportedPositionTypes"
                        v-model="position.value"
                        tooltip="Position of tag"
                    ></nitrozen-dropdown>
                    <nitrozen-error v-if="position.showerror">
                        {{ position.errortext }}
                    </nitrozen-error>
                </div>
                <div class="meta-container">
                    <div v-for="(meta, index) in arrAttribute" :key="index">
                        <div class="meta-pair inline">
                            <!-- key -->
                            <nitrozen-input
                                class="cell-key"
                                v-model="meta.key"
                                label="Key"
                                type="text"
                            />
                            <!-- value -->
                            <nitrozen-input
                                class="cell-value"
                                v-model="meta.value"
                                label="Value"
                                type="text"
                            />
                            <!-- delete pair -->
                            <ukt-inline-svg
                                src="delete"
                                class="delete-icon"
                                title="Delete Attribute"
                                @click.stop.native="deletePair(index)"
                            ></ukt-inline-svg>
                        </div>
                    </div>
                    <nitrozen-error v-if="errAttributes.showerror">
                        {{ errAttributes.errortext }}
                    </nitrozen-error>
                    <nitrozen-error v-if="errAttributes.emptyerror">
                        {{ errAttributes.emptytext }}
                    </nitrozen-error>
                    <nitrozen-button
                        class="add-btn"
                        theme="secondary"
                        @click="add"
                        >Add Attribute
                    </nitrozen-button>
                </div>
            </div>
            <div class="editor-container">
                <div class="cl-Mako bold-md subtype">Sub Type</div>
                <div
                    v-if="subType.value !== 'inline'"
                    class="form-row cst-width row-height"
                >
                    <nitrozen-input
                        label="URL *"
                        placeholder="Enter external file url"
                        v-model="url.value"
                        id="url"
                        @input="isUrl(url.value)"
                    ></nitrozen-input>
                    <nitrozen-error class="nitrozen-error" v-if="url.showerror">
                        {{ url.errortext }}
                    </nitrozen-error>
                    <nitrozen-error class="nitrozen-error" v-if="noUrl">
                        Not a valid URL
                    </nitrozen-error>
                </div>
                <div v-if="subType.value === 'inline'" class="row-height">
                    <div class="cs-disp">
                        <div class="cst-label">Code *</div>
                        <div>
                            <rawhtml-editor
                                v-model="content"
                                ref="rawhtml"
                            ></rawhtml-editor>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nitrozen-dialog ref="tag_delete_dialog" :title="'Delete'" @close="closeDeleteDialog">
            <template slot="body">
                <div>Are you sure you want to delete this tag?</div>
            </template>
            <template slot="footer">
                <div>
                    <nitrozen-button class="mr24" v-flatBtn :theme="'secondary'" id="del" @click="deleteTag"
                        >Delete</nitrozen-button
                    >
                    <nitrozen-button v-strokeBtn :theme="'secondary'" @click="closeDeleteDialog"
                        >Cancel</nitrozen-button
                    >
                </div>
            </template>
        </nitrozen-dialog>
    </div>
</template>
<script>
import PageEmpty from '@/components/common/page-empty.vue';
import Shimmer from '@/components/common/shimmer';
import { PageHeader, Loader } from '@/components/common/';
import adminlinesvg from '@/components/common/adm-inline-svg.vue';
import inlinesvg from '@/components/common/ukt-inline-svg.vue';
import rawhtmlEditor from './page-editor/rawhtml-editor.vue';
import InternalSettingsService from '@/services/internal-settings.service';
import root from 'window-or-global';

import {
    NitrozenButton,
    flatBtn,
    strokeBtn,
    NitrozenDialog,
    NitrozenError,
    NitrozenInput,
    NitrozenDropdown,
} from '@gofynd/nitrozen-vue';
export default {
    name: 'tag-update',
    components: {
        PageHeader,
        'nitrozen-button': NitrozenButton,
        NitrozenError,
        NitrozenInput,
        NitrozenDropdown,
        'rawhtml-editor': rawhtmlEditor,
         'nitrozen-dialog': NitrozenDialog,
        // 'adm-inline-svg': adminlinesvg,
        'ukt-inline-svg': inlinesvg,
        // 'no-content': PageEmpty,
        // Shimmer,
        Loader,
        flatBtn,
        strokeBtn,
    },
    directives: {
        flatBtn,
        strokeBtn,
    },
    data() {
        return {
            content: '',
            update: false,
            uid: null,
            noUrl: false,
            tagList: [],
            tagData: {},
            pageTitle: 'Create Tag',
            pageLoading: false,
            inProgress: false,
            saveText: 'Tag saved successfully',
            metaType: 'json',
            validForm: true,
            supportedFileTypes: [
                {
                    text: 'CSS',
                    value: 'css',
                },
                {
                    text: 'JavaScript',
                    value: 'js',
                },
            ],
            supportedSubTypes: [
                {
                    text: 'External',
                    value: 'external',
                },
                {
                    text: 'Inline',
                    value: 'inline',
                },
            ],
            supportedPositionTypes: [
                {
                    text: 'Head',
                    value: 'head',
                },
                {
                    text: 'Body Top',
                    value: 'body-top',
                },
                {
                    text: 'Body Bottom',
                    value: 'body-bottom',
                },
            ],
            showUrl: false,
            name: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            fileType: {
                value: 'css',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            subType: {
                value: 'external',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            url: {
                value: '',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            position: {
                value: 'head',
                showerror: false,
                errortext: 'This is a mandatory field',
            },
            arrAttribute: [],
            errAttributes: {
                showerror: false,
                errortext: 'Please fill the key, value pair',
                emptyerror: false,
                emptytext: 'Atleast one tag is required',
            },
            tagMode: '',
            contextDeleteTag: [
                {
                    text: 'Delete',
                    action: 'edit',
                },
            ],
        };
    },
    mounted() {
        //console.log(this.$route)
        if (this.$route.params.tagId) {
            this.update = true;
            this.pageTitle = 'Update Tag';
            this.uid = this.$route.params.tagId;
            this.getList();
        } else {
            this.update = false;
        }
        if (this.$route.name === 'update-tag') {
            this.tagMode = 'Save';
        }
        if (this.$route.name === 'create-tag') {
            this.tagMode = 'Create';
        }
    },
    methods: {
        getList() {
            InternalSettingsService.getUpdateTags(this.uid)
                .then((res) => {
                    this.tagList = res.data;
                    //console.log(this.tagList);
                    this.tagData = this.tagList;
                    //console.log(this.tagData,"tagData");
                    this.tagList.name
                        ? (this.name.value = this.tagList.name)
                        : (this.name.value = '');
                    if (this.tagData.type) {
                        this.fileType.value = this.tagData.type;
                        //this.checkType();
                    }
                    if (this.tagData.sub_type) {
                        this.subType.value = this.tagData.sub_type;
                    }
                    this.tagData.url
                        ? (this.url.value = this.tagData.url)
                        : (this.url.value = '');
                    this.tagData.content
                        ? (this.content = this.tagData.content)
                        : (this.content = '');
                    this.tagData.position
                        ? (this.position.value = this.tagData.position)
                        : (this.position.value = '');
                    if (this.tagData.attributes) {
                        this.arrAttribute = [];
                        for (const item in this.tagData.attributes) {
                            let temp = {
                                key: item,
                                value: this.tagData.attributes[item],
                            };
                            this.arrAttribute.push(temp);
                        }
                    }
                })
                .catch((err) => {
                    this.tagList = [];
                    this.pageLoading = true;
                });
        },
        redirectToListing() {
            setTimeout(() => {
            this.$router.push({ path: '/administrator/settings/list-tags' })
            });

        },
        add() {
            this.arrAttribute.push(this.newPair());
        },
        newPair() {
            return {
                key: '',
                value: '',
            };
        },
        deletePair(index) {
            this.arrAttribute.splice(index, 1);
            if (this.arrAttribute.length === 0) {
                this.errAttributes.showerror = false;
            }
        },
        checkform() {
            if (this.name.value !== '') {
                this.name.showerror = false;
            } else {
                this.name.showerror = true;
            }
            if (this.url.value !== '') {
                this.url.showerror = false;
            } else {
                this.url.showerror = true;
            }
            if (this.subType.value === 'external') {
                if (this.name.showerror || this.url.showerror) {
                    this.validForm = false;
                }
            }
        },
        isUrl(str) {
            if (str !== '') {
                let pattern = new RegExp("((http|https)://)(www.)?[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)"); // fragment locator
                if (pattern.test(str)) {
                    this.noUrl = false;
                    // return true;
                } else {
                    this.url.showerror = false;
                    this.noUrl = true;
                    // return false;
                }
            } else {
                this.noUrl = false;
            }
        },
        postTags() {
            this.checkform();
            if (!this.validForm || this.noUrl) {
                return;
            }
            this.pageLoading = true;
            const data = {
                    attributes: {},
                    name: this.name.value,
                    type: this.fileType.value,
                    sub_type: this.subType.value,
                    content: window.btoa(
                        unescape(encodeURIComponent(this.content))
                    ),
                    position: this.position.value,
                    url: this.url.value,
                };

            if (this.tagMode === 'Create') {
                this.arrAttribute.forEach((ele) => {
                    data.attributes[ele.key] = ele.value;
                });
                InternalSettingsService.postCustomTags(data)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(
                            'Tag saved successfully',
                            {
                                duration: 2000,
                            }
                        );
                        this.$router
                            .push({
                                path: `/administrator/settings/list-tags`,
                            })
                            .catch(() => {});
                    })
                    .catch((error) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showError(
                            `${
                                error.response.data.message
                                    ? error.response.data.message
                                    : JSON.stringify(error.response.data)
                            }`
                        );
                    });
            }

            if (this.tagMode === 'Save') {
                InternalSettingsService.putCustomTag(this.uid, data)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(
                            'Tag Updated successfully',
                            {
                                duration: 2000,
                            }
                        );
                        this.$router
                            .push({
                                path: `/administrator/settings/list-tags`,
                            })
                            .catch(() => {});
                    })
                    .catch((error) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showError(
                            `${
                                error.response.data.message
                                    ? error.response.data.message
                                    : JSON.stringify(error.response.data)
                            }`
                        );
                    });
            }
        },
        deleteTag(){
             this.pageLoading = true;
                InternalSettingsService.deleteTag(this.uid)
                    .then((res) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showSuccess(
                            `Tag removed successfully`,
                            {
                                duration: 2000,
                            }
                        );
                    })
                    .catch((err) => {
                        this.pageLoading = false;
                        this.$snackbar.global.showError(
                            `Tag removed Failed`,
                            {
                                duration: 2000,
                            }
                        );
                    });
                    this.redirectToListing();
        },
         closeDeleteDialog: function () {
            this.$refs.tag_delete_dialog.close();
        },
        openDeleteDialog() {        
            this.$refs.tag_delete_dialog.open({
                width: '500px',
                showCloseButton: true,
                dismissible: true,
            });
        },
    },
};
</script>
<style lang="less" scoped>
.main-container {
    display: flex;
    flex-flow: row-reverse;
    width: auto;
    background-color: @Alabaster2;

    .editor-container {
        flex: 1;
        margin-right: 24px;
        height: fit-content;
        background-color: white;
        border-radius: 4px;
        margin: 24px 12px 24px 24px;
        overflow: hidden;
        padding: 24px 0 24px 24px;
    }

    .form-container {
        padding: 24px;
        background-color: white;
        height: fit-content;
        border-radius: 4px;
        width: 300px;
        min-width: 300px;
        margin: 24px 24px 24px 12px;
        .form-row {
            margin: 20px 0;
        }
    }
}
.header-position {
    height: 58.5px;
    .button-box {
        display: flex;
        align-items: center;
        .pad-left {
            margin-left: 12px;
        }
    }
}
.meta-container {
    padding-bottom: 15px;
    .inline {
        display: flex;
        margin-top: 12px;
        .cell-key {
            width: 40%;
        }
        .cell-value {
            margin-left: 12px;
            width: 40%;
        }
        ::v-deep .delete-icon svg {
            width: 24px;
            height: 24px;
            cursor: pointer;
            margin: 21px 0px 0px 12px;
        }
        .datatype-dropdown {
            min-width: 105px;
        }
    }
    .add-btn {
        float: right;
        margin-top: 16px;
    }
}
.subtype {
    margin-bottom: 20px;
}
.cst-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 600;
    line-height: 21px;
    margin-bottom: 12px;
}
</style>