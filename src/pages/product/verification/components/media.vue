<template>
    <div>
        <div class="image-uploader-container">
            <div class="image-uploader">
                <div v-if="value.url">
                    <div v-if="value.type === 'image'" class="image"
                    >
                        <img
                            :src="value.url"
                            @load="getImageDimensions($event)"
                        />
                        <div class="dimensions">{{this.aspect_ratio}}</div>
                    </div>
                    <div
                        v-else-if="value.type === 'video'"
                        class="image"
                    >
                        <no-ssr>
                            <iframe
                                class="iframe"
                                width="360"
                                height="270"
                                :src="value.url"
                                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </no-ssr>
                    </div>


                    <div
                        v-else-if="value.type === '3d_model' && isMounted"
                        class="image"
                    >
                        <no-ssr>
                            <viewer-3d
                                :src="value.url"
                                :list="true"
                            ></viewer-3d>
                        </no-ssr>
                    </div>

                </div>
                
            </div>
            <loader class="image-uploading" v-if="loading"></loader>
        </div>
    </div>
</template>

<script>
import { NitrozenDialog } from '@gofynd/nitrozen-vue';
import loader from '@/components/common/loader';
import uktinlinesvg from '@/components/common/ukt-inline-svg.vue';
import InlineSvg from '@/components/common/adm-inline-svg.vue';
import { formatBytes } from '@/helper/digital-storage.util';
import NoSSR from 'vue-no-ssr';
import { isNode } from "browser-or-node";

export default {
    name: 'mirage-image-uploader-banner',
    components: {
        'nitrozen-dialog': NitrozenDialog,
        'ukt-inline-svg': uktinlinesvg,
        'no-ssr': NoSSR,
        'viewer-3d' : () => isNode ? Promise.resolve(null) : Promise.resolve(require("@/components/media/viewer3D.vue")),
        InlineSvg,
        loader
    },
    props: {
        label: {
            type: String
        },
        text: {
            type: String,
            default: 'Upload'
        },
        aspectRatio: {
            type: String
        },
        minimumResolution: {
            type: Object
        },
        maximumResolution: {
            type: Object
        },
        recommendedResolution: {
            type: Object
        },
        value: {
            type: Object,
            default: () => {
                return {};
            }
        },
        type: {
            type: String,
            default: 'image'
        },
        loading: {
            type: Boolean,
            default: false
        },
        mediaFolder: {
            type: String
        },
        fileName: {
            type: String
        },
        index: {
            type: Number
        },
        tags: {
            type: Array,
            default: () => {
                return [];
            }
        }
    },
    data() {
        return {
            showOptions: false,
            namespace: 'products-item-image',
            fileTypes: ['png', 'jpeg'],
            fileDomain: 'image',
            isMounted: false,
            height: 0,
            width: 0,
            aspect_ratio: "1:1"
        };
    },
    mounted() {
        this.isMounted = true;
    },
    methods: {
        formatBytes,
        gcd(a, b){
            // calculates gcd of two numbers
            return b ? this.gcd(b,a%b) : a; 
        },
        getImageDimensions (e) {
            if(e) {
                this.width = e.target.naturalWidth;
                this.height = e.target.naturalHeight;
                let gcd = this.gcd(this.width, this.height);
                this.aspect_ratio = `${this.width/gcd}:${this.height/gcd}`
            }
            
        }
        
    }
};
</script>

<style lang="less" scoped>
.image-uploader-container {
    display: flex;
    .image-uploader {
        
        .model {
            pointer-events: none;
        }
        .image {
            width: 250px;
            height: 250px;
            position: relative;
            background-color: @Alabaster2;
            border: 1px dashed @RoyalBlue;
            border-radius: @BorderRadius;
            .dimensions {
                margin-top: 5px;
                font-size: small;
            }
            img {
                object-fit: contain;
                display: block;
                margin: 0 auto;
                width: 100%;
                height: 100%;
            }
            .delete-image {
                position: absolute;
                display: inline-block;
                cursor: pointer;
                right: 4px;
                top: 4px;
            }
            .edit-image {
                position: absolute;
                display: inline-block;
                cursor: pointer;
                right: 34px;
                top: 4px;
            }
            .iframe {
                width: 100%;
                height: 100%;
            }
        }
        .no-image-container {
            .inline {
                display: flex;
            }
            .top-gutter {
                margin-top: 12px;
            }
            .right-gutter {
                margin-right: 12px;
            }
            .no-image {
                width: 118px;
                height: 118px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                background-color: @Alabaster2;
                border: 1px dashed @RoyalBlue;
                border-radius: @BorderRadius;
                cursor: pointer;
                &.disabled {
                    opacity: 0.5;
                    pointer-events: none;
                }
                .add-image {
                    ::v-deep {
                        svg {
                            width: 60px;
                            height: 60px;
                            #prefix__Group {
                                stroke: #d5daff;
                            }
                        }
                    }
                }
                .label {
                    color: @RoyalBlue;
                    font-size: 14px;
                    font-weight: 500;
                }
                .sub-label {
                    color: @DustyGray2;
                    font-size: 12px;
                    font-weight: 500;
                    line-height: 22px;
                }
                .video-uploader-container {
                    width: 100%;
                    height: 100%;
                    .video-upload {
                        text-align: center;
                        width: 100%;
                        display: block;
                        cursor: pointer;
                        height: 100%;
                        margin: auto;
                        align-items: center;
                        padding: 21px 0px;
                    }
                }
            }
        }
    }
    .image-uploader-meta {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 12px;
        margin-top: 24px;
        align-items: center;
        .meta-info {
            color: @DustyGray2;
            font-size: 13px;
            line-height: 20px;
        }
    }
    .image-uploading {
        padding: 0;
        position: absolute;
        height: 82px;
        width: 82px;
        background: white;
        opacity: 0.6;
        img {
            height: 82px;
        }
    }
}
</style>
