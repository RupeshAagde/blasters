<template>
    <div>
        <page-header
            :title="editMode ? 'Edit Page' : 'Create Page'"
            @backClick="$router.push({ name: 'pages-setting' })"
        >
            <div >
            <div
                class="publish-status status-text bold-xs"
                :class="{ 'publish-status-disabled': !published }"
                
            >
                {{ published ? 'Published' : 'Unpublished' }}
            </div>
            </div>
            <nitrozen-toggle-btn @change="changePublish" v-model="published"></nitrozen-toggle-btn>
            <span class="actions" 
                ><nitrozen-button class="actions" v-flatBtn theme="secondary" @click="saveForm" >
                    {{ editMode ? 'Save' : 'Create' }}
                </nitrozen-button></span
            >
        </page-header>
        <div class="form page-container">
            <div class="form-container">
                <section class="section">
                    <h3 class="cl-Mako bold-md">Details</h3>
                    <!-- Title -->
                    <div class="input">
                        <nitrozen-input
                            label="Title *"
                            placeholder="Enter Page Title"
                            v-model="name.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="name.showerror"
                        >
                            {{ name.errortext }}
                        </nitrozen-error>
                    </div>

                    <!-- Slug -->
                    <div class="input">
                        <nitrozen-input
                            label="Slug *"
                            pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                            placeholder="Enter Page Slug"
                            v-model="slug.value"
                            tooltipText="Part of the URL that explains the page’s content"
                            :showTooltip="true"
                            :disabled="editMode"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="slug.showerror"
                        >
                            {{ slug.errortext }}
                        </nitrozen-error>
                    </div>
                    <!-- Generated Link -->
                    <adm-form-input
                        v-if="editMode"
                        class="custom-form-input"
                        label="Preview Link"
                        :custom="true"
                        tooltipText="The URL of the page, generated using slug"
                        :showTooltip="true"
                    >
                        <page-link
                            :link="getPageLink"
                        ></page-link>
                        
                    </adm-form-input>

                    

                    <!-- Description -->
                    <div class="input">
                        <nitrozen-input
                            type="textarea"
                            label="Description"
                            :maxlength="100"
                            placeholder="Enter Page Description"
                            v-model="description.value"
                        ></nitrozen-input>
                        <nitrozen-error
                            class="nitrozen-error"
                            v-if="description.showerror"
                        >
                            {{ description.errortext }}
                        </nitrozen-error>
                    </div>

                    <adm-form-input
                        class="custom-form-input"
                        label="Tags"
                        :custom="true"
                        name="tags"
                    >
                        <div class="input-text tags" @click="focusOnChipInput">
                            <nitrozen-chips
                                v-for="(item, index) in tags"
                                :key="'chips_' + index"
                            >
                                {{ item.display }}
                                <nitrozen-inline
                                    icon="cross"
                                    class="nitrozen-icon"
                                    v-on:click="removeChip(index)"
                                ></nitrozen-inline>
                            </nitrozen-chips>
                            <input
                                type="text"
                                placeholder="E.g. Featured"
                                ref="chipInput"
                                class="chip-input cl-Mako light-xs"
                                @blur="addChip"
                                @keydown.enter="addChip"
                                @keydown.tab="addChip"
                                v-model="chipInput"
                            />
                        </div>
                    </adm-form-input>
                </section>
                
                <section class="section">
                    <h3 class="cl-Mako bold-md">Advanced</h3>

                    <page-options
                        v-for="(pageCssOption, index) in pageCssOptions"
                        :options="pageCssOption"
                        :key="index"
                        @add-field="addOption"
                        @delete-field="deleteOption"
                    ></page-options>
                </section>
                <loader
                    v-if="inProgress || pageLoading"
                    class="loading"
                ></loader>
            </div>
            <div 
                class="page-editor-wrapper"
                v-show="!pageLoading">
                <div class="page-editor">
                    <div>
                        <rawhtml-editor
                        v-if="pageType === 'rawhtml'"
                        v-model="content"
                        ref="rawhtml"
                    ></rawhtml-editor>
                    <markdown-page-editor
                        v-if="pageType === 'markdown'"
                        v-model="content"
                        ref="markdown"
                    ></markdown-page-editor>
                    </div>
                </div>
                </div>
        </div>
    </div>
</template>
<script>

import { PageHeader,Loader, FormInput, PageOptions } from '@/components/common/';
import rawhtmlEditor from './rawhtml-editor.vue'
import markdownPageEditor from './markdown-page-editor.vue'
import InternalSettingsService from '@/services/internal-settings.service';
import pageLink from '../../../components/common/page-link.vue';
import {convertToSlug} from '../../../helper/utils'
import {
    NitrozenToggleBtn,
    NitrozenButton,
    strokeBtn,
    flatBtn,
    NitrozenInput,
    NitrozenError,
    NitrozenChips,
    NitrozenInline,

    
} from '@gofynd/nitrozen-vue';

import root from 'window-or-global';
const env = root.env || {};

export default {
    name: 'create-custom-page',
    components: {
        PageHeader,
        'nitrozen-toggle-btn': NitrozenToggleBtn,
        'nitrozen-button': NitrozenButton,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
        'adm-form-input': FormInput,
        'nitrozen-chips': NitrozenChips,
        'nitrozen-inline': NitrozenInline,
        'page-options': PageOptions,
        'rawhtml-editor': rawhtmlEditor,
        'markdown-page-editor': markdownPageEditor,
        'page-link': pageLink,
        Loader

    },
    directives: {
        strokeBtn,
        flatBtn,
    },
    data() {
        return {
            published: false,
            editMode: false || this.$route.name == "edit-custom" ,
            name: this.getInitialValue(),
            slug: this.getInitialValue(),
            description: this.getInitialValue(),
            pageData: {},
             pageCssOptions: [
                {
                    key: 'width',
                    value: '',
                    unit: 'px',
                    units: [
                        {
                            text: 'px',
                            value: 'px'
                        },
                        { text: '%', value: '%' }
                    ]
                }
            ],
            tags: [],
            chipInput: '',
            pageLoading: false,
            inProgress: false,
            pageType: '',
            content: '',
            seoObj: { title: '', description: '' },
            savedSlug: null,



        };
    },
    computed:{
     getPageLink(){
         if(this.slug){
             return `https://platform.${env.FYND_PLATFORM_DOMAIN}/p/${this.slug.value}`;
         }
     }
    },
    methods: {
        changePublish(){
                        this.inProgress = true;

            InternalSettingsService.editPublished(this.slug.value,{published: this.published}).then(res=>{
                this.$snackbar.global.showSuccess(
                        this.published
                            ? 'Page published successfully'
                            : 'Page unpublished successfully'
                    );
            })
            .catch(err => {
                    this.$snackbar.global.showError(
                        `Failed to ${
                            this.published ? 'publish' : 'unpublish'
                        } page`
                    );
                    this.published = !this.published;
                    console.error(err);
                })
                .finally(() => {
                    this.inProgress = false;
                });

        },
        publish(){
          
        },
        getInitialValue(val = '') {
            return {
                showerror: false,
                value: val,
                errortext: '-',
            };
        },
        focusOnChipInput() {
            this.$refs['chipInput'].focus();
        },
         addChip(event) {
            if (this.chipInput) {
                if (
                    this.tags.filter(it => it.display === this.chipInput)
                        .length === 0
                )
                    this.tags.push({ display: this.chipInput });
                this.chipInput = '';
            }
            event.preventDefault();
        },
        removeChip(index) {
            this.tags.splice(index, 1);
        },
        addOption() {
            this.pageCss.push({ key: '', value: '' });
        },deleteOption(index) {
            this.pageCss.splice(index, 1);
        },
         getFormData() {
            let contentInfo = {
                type: this.pageType ,
            value: this.content
            };

            const obj = {
                content: [],
                title: this.name.value,
                description: this.description.value,
                tags: this.tags.map(it => it.display),
                slug: this.slug.value,
                published: this.published,
                page_meta: this.getPageMeta() ,
                seo: this.seoObj,
                type: this.pageType ,               
            };
            obj.content.push(contentInfo);
            
            return obj;
        },
        saveForm() {
             if (!this.validateForm()) {
                return;
            }
            const formData = this.getFormData();
            
            if(formData.content[0].value === ''){
                this.$snackbar.global.showError(
                        `Editor is Empty`
                    );
                    return;
            }
            
            let promisefn = this.$route.params.slug ? InternalSettingsService.editCustomPage(this.pageData._id,formData) : InternalSettingsService.createCustomPage(formData)

            this.inProgress = true;
            promisefn
                .then(res => {
                    this.$snackbar.global.showSuccess(
                        `Page ${
                            this.editMode ? 'updated' : 'created'
                        } successfully`
                    );
                    this.pageData = res.data;
                    this.inProgress = false;
                    this.$router.push({
                        path: `/administrator/settings/pages`
                    }).catch(() => {});
                })
                .catch(err => {
                    let msg =
                        err.response.data.message;
                    if (msg && msg.includes('DuplicateKey'))
                        msg = 'Duplicate Slug Not allowed';
                    this.inProgress = false;
                    this.$snackbar.global.showError(
                        `Failed to ${
                            this.editMode ? 'update' : 'create'
                        } page${' : ' + msg || ' : ' + err.message || ''}`
                    );
                });
        },
        
        validateForm() {
            let formValid = true;
            formValid = this.checkEmpty('name') && formValid;
            // formValid = this.checkEmpty('description') && formValid;
            formValid =
                this.checkEmpty('slug') && this.validateSlug() && formValid;

            
           
            return formValid;
        },
        validateSlug() {
            const valid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(this.slug.value);
            this['slug'].showerror = !valid;
            if (!valid) {
                this['slug'].errortext = 'Slug is invalid';
            }
            return valid;
        },
        checkEmpty(key) {
            const emptyErorrs = {
                name: 'Title is required',
                slug: 'Slug is required'
            };
            if (this[key].value.trim() === '') {
                this[key].showerror = true;
                this[key].errortext = emptyErorrs[key] || 'Enter ' + key;
                return false;
            }
            return true;
        },
        getPageMeta() {
            let meta = [];
            this.pageCssOptions.forEach(pageCss => {
                if (pageCss.value) {
                    meta.push({
                        key: pageCss.key,
                        value: { value: pageCss.value, unit: pageCss.unit }
                    });
                }
            });

            return meta;
        },
        loadPageData(){
            this.name.value = this.pageData.title || '';
            this.seoObj.title = this.pageData.seo && this.pageData.seo.title ? this.pageData.seo.title : '';
            this.seoObj.description = this.pageData.seo && this.pageData.seo.description ? this.pageData.seo.description : '';
            this.slug.value = this.pageData.slug || '';
            this.savedSlug = this.pageData.slug || null;
            this.description.value = this.pageData.description || '';
            this.published = this.pageData.published;
            this.pageData.page_meta &&
                this.pageData.page_meta.forEach(meta => {
                    this.pageCssOptions.forEach(pageCss => {
                        if (pageCss.key === meta.key) {
                            pageCss.value = meta.value.value;
                            pageCss.unit = meta.value.unit;
                        }
                    });
                });
            this.tags =
                (this.pageData.tags &&
                    this.pageData.tags.map(t => {
                        return { display: t };
                    })) ||
                [];

            this.pageData.content = this.pageData.content || [];
            let contentData = this.pageData.content.find(
                    elem => elem.type === this.pageType
                );
                this.content = (contentData && contentData.value) || '';
            this.pageLoading = false;

        },
        attachNameWatcher() {
            this.detachNameWatcher = this.$watch(
                'name',
                function handler(val) {
                    this.slug.value = convertToSlug(this.name.value);
                    this.seoObj.title = this.name.value
                },
                { deep: true }
            );
            this.detachDescriptionWatcher = this.$watch(
                'description',
                function handler(val) {
                    this.seoObj.description = this.description.value
                },
                { deep: true }
            );
        },
    },
    mounted(){
                this.pageType = this.$route.params.pagetype;
                if(this.editMode){
                  this.pageLoading = true;
                  InternalSettingsService.previewCustomPage(this.$route.params.slug)
                  .then((res=>{
                       //console.log(data)
                       this.pageData = res.data;
                       //console.log(this.pageData);
                       this.loadPageData()

                  })
                //    .catch(err => {
                //     this.pageLoading = false;
                //     this.$snackbar.global.showError(
                //         'Failed to load Page. Try Again.'
                //     );
                // })
                )
                }
                this.attachNameWatcher();

    }
};
</script>
<style lang="less" scoped>
.publish-status {
    line-height: 56.5px;
    cursor: pointer;
    color: @RoyalBlue;
    // font-weight: 700;
    // font-size: 12px;
    -webkit-font-smoothing: antialiased;
    @media @mobile {
        line-height: 20px;
    }
}
.publish-status-disabled {
    color: @DustyGray2;
}
.actions {
    margin-top: 5px;
    padding-left: 24px;
}
.form.page-container {
    display: flex;
    flex-flow: row-reverse;
    width: 100%;
    margin: 58.4px 0px 24px 0px;
    background-color: @Alabaster2;
    //padding: 58.5px 0 0 0;
    padding: 0;
    @media @mobile {
        display: block;
        margin-top: 48px;
    }
}
.custom-form-input {
    ::v-deep label {
        font-size: 12px;
    }
}
.form-container {
    width: 298px;
    margin: 12px 24px 12px 12px;
    height: fit-content;
    // animation-name: setting-slider-open;
    // animation-duration: 0.5s;
    @media @mobile {
        width: 100%;
        margin: 0;
    }
    .input {
        padding: 6px 0;
    }
    section.section {
        padding: 24px;
        background: #fff;
        border: 1px solid @WhiteSmoke;
        border-radius: 8px;
        margin: 12px 0;
    }
    ::v-deep .link-container {
        padding: 12px;
        border: 1px solid @LightGray;
        border-radius: 3px;
        .link {
            white-space: normal;
            word-break: break-all;
        }
    }
}
.tags {
    border: 1px solid @Iron;
    border-radius: 4px;
    min-height: 72px;
    .nitrozen-chip {
        margin: 5px;
        height: 30px;
        padding: 0 9px;
        font-size: 12px;
        line-height: 30px;
    }
    .chip-input {
    width: 92%;
    border: none;
    padding: 10px;
    }
}
.page-editor-wrapper {
    flex: 1;
    overflow: auto;
}

.page-editor {
    display: block;
    min-height: 450px;
    flex: 1;
    margin: 24px 12px 24px 24px;
    // padding: 12px;
    border: 1px solid @WhiteSmoke;
    border-radius: 8px;
    background-color: #ffffff;
    // width: 0;
    ::v-deep #bee-plugin-container {
        overflow: auto;
        .mirage-scrollbar;
        height: calc(100vh - 170px);
    }
}

</style>