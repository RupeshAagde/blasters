<template>
    <div class="image-uploader-list">
        <nitrozen-dropdown
            class="input-field"
            placeholder="Select Images Source"
            :items="imageSources"
            v-model="imageSource"
        ></nitrozen-dropdown>
        <nitrozen-input
            v-show="imageSource != 'namespace_images' || this.namespace"
            class="input-field"
            :showSearchIcon="true"
            type="search"
            :placeholder="
                `Search ${
                    imageSource != 'namespace_images' ? imageSource : ''
                } images`
            "
            v-model="searchText"
            @input="debounceInput"
        ></nitrozen-input>
        <page-empty
            class="not-found"
            v-if="filteredImageList.length == 0 && !loading"
            helperText="No Results Found"
        ></page-empty>
        <div v-else class="image-list" @scroll="$handleScroll">
            <div
                v-for="(item, i) in filteredImageList"
                :key="i"
                class="image-list-item"
                :title="item.text || ''"
                @click="$selectImage(item.secure_url)"
            >
                <img
                    :src="item.thumbnail_url"
                    :alt="item.text || item.secure_url"
                    @error="$imageError($event, item)"
                    @load="$imageLoad($event, item)"
                    :ref="`image`"
                />
                <div class="image-meta" @mouseover="calculateDimensions(item)">
                    <span
                        class="dimensions"
                        v-if="$refs.image && $refs.image[i]"
                    >
                        {{ item.naturalDimensions }}
                    </span>
                </div>
            </div>
        </div>
        <loader v-if="loading"></loader>
    </div>
</template>

<script>
import { NitrozenInput, NitrozenDropdown } from '@gofynd/nitrozen-vue';
import loader from '@/components/common/loader';
import InlineSvg from '@/components/common/inline-svg.vue';
import PageEmpty from '@/components/common/page-empty';
import { getCommonHeaderOptions } from '@/services/utils.service';
import GrindorService from '@/services/grindor.service';
import { debounce } from '@/helper/utils';

const imageSources = [
    {
        text: 'My Images',
        value: 'namespace_images',
        onlyApp: false
    }
];
export default {
    name: 'image-uploader-list',
    components: {
        NitrozenInput,
        NitrozenDropdown,
        InlineSvg,
        PageEmpty,
        loader
    },
    props: {
        mediaFolder: {
            default: ''
        },
        minimumResolution: {
            type: Object
        },
        namespace: {
            type: String
        }
    },
    computed: {
        imageSources() {
            return imageSources.filter((i) => {
                if (!this.applicationId) {
                    return !i.onlyApp;
                }
                return true;
            });
        },
        filteredImageList() {
            let filteredImageList = [];
            if (
                this.searchText &&
                this.imageSource != 'products' &&
                !this.namespace
            ) {
                filteredImageList = this.imageList.filter((i) => {
                    if (!i) console.log(i);
                    return (
                        i.secure_url &&
                        i.text &&
                        i.text
                            .toLowerCase()
                            .includes(this.searchText.toLowerCase())
                    );
                });
            } else {
                filteredImageList = this.imageList.filter((a) => a.secure_url);
            }
            filteredImageList = filteredImageList.map((i) => {
                try {
                    const imageURL = i.secure_url;
                    i.thumbnail_url = i.secure_url;
                    const url = new URL(imageURL);
                    if (this.hdns.includes(url.hostname)) {
                        // prepare get original image url
                        const sizeToReplace = this.hdnSizes.find((hs) => {
                            return imageURL.includes(hs);
                        });
                        if (sizeToReplace) {
                            i.secure_url = imageURL.replace(
                                `/${sizeToReplace}/`,
                                '/original/'
                            );
                        }
                        i.thumbnail_url = i.secure_url.replace(
                            '/original/',
                            `/resize-h:90,w:0/`
                        );
                    } else if (url.hostname == 'res.cloudinary.com') {
                        i.thumbnail_url = i.secure_url.replace(
                            '/upload/',
                            `/upload/c_thumb,h_90/`
                        );
                    }
                } catch (err) {
                    return i;
                }
                return i;
            });
            return filteredImageList;
        }
    },
    watch: {
        imageSource() {
            this.$loadImages();
        }
    },
    data: function() {
        return {
            loading: false,
            imageSource: 'namespace_images',
            searchText: '',
            imageList: [],
            grindorPagination: { page: 0, nextPage: 1, limit: 16 }, // for grindor images
            hdns: GrindorService.hdns,
            hdnSizes: ['540x0', '240x0', '50x0', '720x0', '360x0'],
            applicationId: this.$route.params.applicationId
        };
    },
    mounted() {
        this.$loadImages();
        const source = imageSources.find((s) => {
            return s.value === 'namespace_images';
        });
        source && (source.text = GrindorService.getDisplayName(this.namespace));
    },
    methods: {
        debounceInput: debounce(function(e) {
            switch (this.imageSource) {
                case 'namespace_images':
                    if (!this.namespace) return;
                    this.imageList = [];
                    this.grindorPagination = Object.assign(
                        {},
                        this.grindorPagination,
                        { page: 0, nextPage: 1, search: e }
                    );
                    this.getMyImages();
                    break;
            }
            // call search function
        }, 500),
        // not used getNaturalDimensions
        getNaturalDimensions(i) {
            const img = this.$refs.image[i];
            return `${img.naturalWidth}x${img.naturalHeight}`;
        },
        calculateDimensions(item) {
            if (!item.naturalDimensions) {
                this.getMeta(item.secure_url).then((data) => {
                    item.naturalDimensions = data;
                    item.__ob__.dep.notify();
                });
            }
        },
        getMeta(url) {
            return new Promise((resolve, reject) => {
                var img = new Image();
                img.addEventListener('load', function() {
                    resolve(`${img.naturalWidth}x${img.naturalHeight}`);
                });
                img.src = url;
            });
        },
        $loadImages() {
            this.imageList = [];
            this;
            if (this.imageSource !== 'namespace_images') {
                this.grindorPagination = { page: 0, nextPage: 1, limit: 16 };
            }
            switch (this.imageSource) {
                case 'namespace_images':
                    this.getMyImages();
                    break;
                case 'brands':
                    this.getBrands();
                    break;
                case 'collections':
                    this.getCollection();
                    break;
                case 'products':
                    this.getProducts();
                    break;
            }
            // this.getCategories();
        },
        getMyImages() {
            if (!this.namespace) {
                console.warn('namespace is required');
            } else {
                if (this.grindorPagination.nextPage == null) return;
                this.grindorPagination.page += 1;
                this.loading = true;
                GrindorService.explore(this.namespace, this.grindorPagination)
                    .then(({ data }) => {
                        data.docs = data.docs.map((f) => {
                            return {
                                text: f.file_name,
                                secure_url: f.cdn.url,
                                ...f
                            };
                        });
                        this.imageList = this.imageList.concat(data.docs);
                        this.grindorPagination.nextPage = data.nextPage;
                        if (this.imageList && this.imageList.length === 0) {
                            this.showNoImageText = true;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.showNoImageText = false;
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            }
        },
        $handleScroll(e) {
            let imageListElement = e.srcElement;
            if (
                parseInt(
                    imageListElement.scrollTop + imageListElement.offsetHeight
                ) === imageListElement.scrollHeight
            ) {
                switch (this.imageSource) {
                    case 'namespace_images':
                        if (
                            !this.namespace ||
                            (this.imageList && this.imageList.length === 0)
                        ) {
                            return;
                        }
                        this.getMyImages();
                        break;
                    case 'products':
                        this.getProducts();
                        break;
                }
            }
        },
        $selectImage(url) {
            this.$emit('imageSelected', url);
        },
        $imageError(e, item) {
            console.error(e);
            item.secure_url = '';
        },
        $imageLoad(e, item) {
            item.__ob__.dep.notify();
        }
    }
};
</script>

<style lang="less" scoped>
.image-uploader-list {
    display: flex;
    flex-direction: column;
    height: 480px;

    .input-field {
        margin-bottom: 12px;
        ::v-deep .nitrozen-select-wrapper {
            z-index: 3;
        }
    }
    .not-found {
        width: 400px;
        padding: 0px;
    }
    .image-list {
        overflow: auto;
        .blaster-scrollbar;
        .image-list-item {
            display: inline-block;
            cursor: pointer;
            margin: 7px;
            width: 90px;
            height: 90px;
            overflow: hidden;
            position: relative;
            img {
                width: auto;
                height: 90px;
                display: block;
                margin: 0 auto;
            }
            &:hover {
                box-shadow: 0 9px 13px 0 rgba(221, 221, 221, 0.5);
                .image-meta {
                    visibility: visible;
                    opacity: 1;
                }
            }
            .image-meta {
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background: rgba(29, 106, 154, 0.72);
                color: #fff;
                visibility: hidden;
                opacity: 0;

                /* transition effect. not necessary */
                transition: opacity 0.2s, visibility 0.2s;
                .dimensions {
                    position: absolute;
                    font-size: 10px;
                    bottom: 0;
                    right: 2px;
                }
            }
        }
    }
}
</style>
