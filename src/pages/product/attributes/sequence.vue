<template>
    <div class="panel">
        <div class="header-position">
            <page-header :title="title" @backClick="redirectToListing">
                <nitrozen-button
                    :theme="'secondary'"
                    v-flatBtn
                    @click="shuffleAttributes"
                    >Save</nitrozen-button
                >
            </page-header>
        </div>
        <loader v-if="pageLoading" class="loading"></loader>
        <div class="page-container" v-if="!pageLoading">
            <!-- Groups -->
            <div class="section left">
                <div class="pane">
                    <div class="cl-Mako bold-md">Filters</div>
                    <div class="attribute-container mt-md">
                        <draggable
                            class="list h-xl"
                            v-model="sequence"
                            handle=".reorder"
                            @start="drag = true"
                            @end="drag = false"
                        >
                            <div
                                v-for="(slug, index) of sequence"
                                :key="index"
                                class="item inline apart pointer"
                            >
                                <div class="inline v-center">
                                    <inline-svg
                                        class="reorder mr-md"
                                        src="reorder"
                                    ></inline-svg>

                                    {{ index + 1 }}. &nbsp;
                                    {{ getAttributeName(slug) }}
                                </div>
                                <a
                                    :href="
                                        `/administrator/product/attributes/edit/${slug}`
                                    "
                                    target="_blank"
                                >
                                    <inline-svg
                                        title="Edit Attribute"
                                        class="pointer"
                                        src="edit"
                                    ></inline-svg>
                                </a>
                            </div>
                        </draggable>
                    </div>
                </div>
            </div>
        </div>
        <!-- <loader v-if="inProgress" /> -->
    </div>
</template>

<style lang="less" scoped>
.header-position {
    height: 58.5px;
}
.cursor-pointer {
    cursor: pointer;
}
.page-container {
    width: auto;
    padding: 0;
    background-color: @Alabaster2;
    justify-content: center;
    .section {
        width: 800px;
        &.right {
            margin-left: 24px;
        }
        .pane {
            padding: 24px;
            border: 1px solid @WhiteSmoke;
            border-radius: 8px;
            background-color: @White;
        }
    }

    .settings-container {
        width: 50%;
        display: block;
        padding: 24px;
        border: 1px solid @WhiteSmoke;
        border-radius: 8px;
        background-color: @White;
    }
}

.attribute-container {
    .list {
        overflow-y: auto;
        padding-right: 24px;
        .blaster-scrollbar;
        &.h-md {
            max-height: 400px;
        }
        &.h-xl {
            max-height: calc(100vh - 263px);
        }

        .item {
            max-width: 100%;
            border: 1px solid @Iron;
            border-radius: 4px;
            margin-bottom: 12px;
            height: 24px;
            display: flex;
            align-items: center;
            padding: 12px;
            color: @Mako;
            font-size: 14px;
            font-weight: 500;
            &.active {
                background: rgba(92, 107, 221, 0.1) !important;
            }
        }
        .msg {
            font-size: 12px;
            font-weight: 400;
            color: @DustyGray2;
            text-align: center;
            line-height: 18px;
            padding: 24px 12px;
        }
        .invalid {
            color: @Required;
        }
    }
}

.pointer {
    cursor: pointer;
}

.input {
    &.w-sm {
        width: 200px;
    }
    &.w-md {
        width: 300px;
    }
    &.w-l {
        width: 400px;
    }
    &.w-xl {
        max-width: 600px;
    }
    &.w-xxl {
        max-width: 800px;
    }
}

.mt-sm {
    margin-top: 12px;
}
.mt-md {
    margin-top: 24px;
}

.mr-xxxs {
    margin-right: 4px;
}
.mr-sm {
    margin-right: 12px;
}
.mr-md {
    margin-right: 24px;
}

.lh-md {
    line-height: 22px;
}

.inline {
    display: flex;
    &.v-center {
        align-items: center;
    }

    &.apart {
        justify-content: space-between;
    }
    .inline-left {
        width: 50%;
    }
    .inline-right {
        flex: 1;
        margin-left: 24px;
    }
}
.txt-btn {
    color: @RoyalBlue;
    font-size: 12px;
    font-weight: 600;
    .pointer;
}
.cross-icon {
    ::v-deep svg {
        -ms-transform: rotate(20deg); /* IE 9 */
        transform: rotate(45deg);
        width: 28px;
        height: 28px;
    }
}
.reorder {
    cursor: -webkit-grab;
}
.toggle {
    display: flex;
    align-items: center;
    .text {
        font-size: 12px;
        font-weight: 700;
        color: @RoyalBlue;
        cursor: pointer;
        &.disabled {
            color: @DustyGray2;
        }
    }
}
</style>

<script>
import TagsInput from '@/components/common/tags-input';
import PageHeader from '@/components/common/layout/page-header';
import { compactDeepObject } from '../../../helper/utils';
import ImageUploader from '@/components/common/image-uploader/index';
import CompanyService from '@/services/company-admin.service';
import Loader from '@/components/common/loader';
import FormInput from '@/components/common/form-input';
import InlineSvg from '@/components/common/ukt-inline-svg';
import Draggable from 'vuedraggable';
import slugify from 'slugify';
// import { dirtyCheckMixin } from '@/mixins/form.mixin';
import root from 'window-or-global';
import _ from 'lodash';
import path from 'path';
import {
    NitrozenInput,
    NitrozenButton,
    NitrozenError,
    NitrozenChips,
    NitrozenInline,
    NitrozenToggleBtn,
    NitrozenDropdown,
    NitrozenTooltip,
    NitrozenBadge,
    flatBtn,
    strokeBtn
} from '@gofynd/nitrozen-vue';

const EMPTY_GROUP_DETAILS = {
    details: { attributes: [], priority: 1 },
    comparisons: { attributes: [], priority: 1 },
    _new: true
};

export default {
    name: 'AttributeGroupAndOrder',
    components: {
        PageHeader,
        TagsInput,
        FormInput,
        ImageUploader,
        InlineSvg,
        Draggable,
        Loader,

        NitrozenInput,
        NitrozenError,
        NitrozenInline,
        NitrozenButton,
        NitrozenToggleBtn,
        NitrozenDropdown,
        NitrozenTooltip,
        NitrozenBadge
    },
    directives: {
        flatBtn,
        strokeBtn
    },
    computed: {},
    // mixins: [dirtyCheckMixin],
    data: function() {
        return {
            entity: 'filters',

            pageLoading: false,
            inProgress: false,
            pageError: false,
            formSaved: false,

            attributes: [],
            sequence: [],
            selectedGroup: {},
            groupDetails: { ...EMPTY_GROUP_DETAILS },
            departments: [],
            errors: {},

            departmentsList: [],
            attributesList: []
        };
    },
    mounted() {
        this.init();
    },
    computed: {
        title() {
            return `Attribute Sequence - Filter`;
        }
    },
    methods: {
        isEmpty: _.isEmpty,
        init() {
            this.pageLoading = true;
            this.fetchAttributes()
                .then(() => {
                    this.pageLoading = false;
                })
                .catch((err) => {
                    this.pageLoading = false;
                    this.pageError = true;
                });
        },
        fetchAttributes() {
            return CompanyService.fetchShuffleAttributes(this.entity)
                .then(({ data }) => {
                    this.attributes = data.data.attribute_details;
                    this.sequence = data.data.sequence;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        getAttributeName(slug) {
            const attribute = this.attributes.find((a) => a.slug === slug);
            if (!attribute) return slug;
            return attribute.name;
        },
        shuffleAttributes() {
            const data = {
                sequence: this.sequence
            };
            return CompanyService.shuffleAttribute(this.entity, data)
                .then(({ data }) => {
                    this.departments = data.data;
                    this.$snackbar.global.showSuccess(
                        'Successfully saved Filter sequence'
                    );
                })
                .catch((err) => {
                    this.$snackbar.global.showError('Failed to save');
                });
        },
        redirectToListing() {
            this.$goBack('/administrator/product/attributes');
        },
        isFormDirty() {
            if (this.formSaved) {
                return false;
            }

            let dirtyForm = { ...this.offer, ...this.getFormData() };
            if (dirtyForm.banner_image.secure_url === '') {
                delete dirtyForm.banner_image.secure_url;
            }

            return !_.isEqual(this.offer, dirtyForm);
        }
    }
};
</script>
