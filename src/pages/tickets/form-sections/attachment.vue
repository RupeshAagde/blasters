<template>
    <div class="main">
        <div>
            <div v-if="attachment.type == 'image'" class="product">
                <div class="side-image">
                    <img :src="attachment.value" />
                </div>
                <div class="card-content-section">
                    <div class="card-content-line-1">
                        {{ attachment.display || attachment.value }}
                    </div>
                </div>
            </div>
            <a
                v-else-if="attachment.type == 'product'"
                class="product"
                :href="urlToOpen"
                target="_blank"
            >
                <div class="side-image" v-if="attachment.details">
                    <img :src="attachment.details.images[0].url" />
                </div>
                <div v-if="attachment.details" class="card-content-section">
                    <div class="card-content-line-1">
                        {{ attachment.details.name }}
                    </div>
                    <div class="card-content-line-2">
                        {{ attachment.details.brand.name }}
                    </div>
                </div>
                <div v-else>
                    {{ attachment.display || attachment.value }}
                </div>
            </a>
            <a
                v-else-if="attachment.type == 'shipment'"
                class="shipment"
                :href="urlToOpen"
                target="_blank"
            >
                <div
                    class="side-image"
                    v-if="
                        attachment.details &&
                            attachment.details.shipments &&
                            attachment.details.shipments.length &&
                            attachment.details.shipments[0].bags &&
                            attachment.details.shipments[0].bags.length &&
                            attachment.details.shipments[0].bags[0].item
                                .image &&
                            attachment.details.shipments[0].bags[0].item.image
                                .length
                    "
                >
                    <img
                        :src="
                            attachment.details.shipments[0].bags[0].item
                                .image[0]
                        "
                    />
                </div>
                <div v-if="attachment.details" class="card-content-section">
                    <div class="card-content-line-1">
                        {{ attachment.details.id }}
                    </div>
                    <div class="card-content-line-2">
                        {{ attachment.details.shipments[0].id }}
                    </div>
                    <div class="card-content-line-2">
                        {{ shipmentSubTitle }}
                    </div>
                </div>
                <div v-else>
                    {{ attachment.display + ': ' + attachment.value }}
                </div>
            </a>
            <a
                v-else-if="attachment.type == 'file'"
                class="attachement-file"
                :href="attachment.value"
                target="_blank"
            >   
                <adm-inline-svg
                src="details"
                class="attachment-image"
                ></adm-inline-svg>
                <div class="attachment-label">
                    {{attachment.display}}
                </div>
            </a>
        </div>
        <!-- <div class="cross-container">
            <nitrozen-inline
                icon="cross"
                class="nitrozen-icon cross"
                @click="deleteThis()"
            ></nitrozen-inline>
        </div> -->
    </div>
</template>

<style lang="less" scoped>
@import './../../less/form.less';
@import './../../less/page-ui.less';
@import './../../less/page-header.less';

.nitrozen-label {
    color: #9b9b9b;
    font-family: Inter, sans-serif;
    font-size: 12px;
    font-weight: 500;
    line-height: 21px;
}

.cross {
    flex: 1;
}

.mt-sm {
    margin-top: 8px;
}
.main {
    display: flex;
    flex-direction: row;
    background: #ffffff;
    margin-bottom: 10px;
    border: 1px solid #e4e5e6;
    border-radius: 3px;
    height: auto;
    overflow: auto;
    max-height: 100px;
    transition: box-shadow 0.3s;
    justify-content: space-between;
}

.cross-container {
    padding-right: 4px;
}
.product {
    display: flex;
    padding: 12px;
    padding: 8px;
    width: 95%;
    cursor: pointer;

    .side-image {
        display: flex;
        align-items: center;
        margin-right: 8px;
        img {
            min-height: 80px;
            max-height: 80px;
            min-width: 60px;
            max-width: 60px;
            border-radius: 4px;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;
        .card-content-line-1 {
            color: @Mako;
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
        }
        .card-content-line-2 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
        .card-content-line-3 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
    }
}

.shipment {
    display: flex;
    padding: 12px;
    padding: 8px;
    width: 95%;
    cursor: pointer;

    .side-image {
        display: flex;
        align-items: center;
        margin-right: 8px;
        img {
            min-height: 80px;
            max-height: 80px;
            min-width: 60px;
            max-width: 60px;
            border-radius: 4px;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;
        .card-content-line-1 {
            color: @Mako;
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
        }
        .card-content-line-2 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
        .card-content-line-3 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
    }
}

.attachement-file {
    display: flex;
    padding: 8px;
    width: 95%;
    max-height: 80px;
    align-items: center;
    .attachment-image {
        width: 40px;
        height: 40px;
    }
    .attachment-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 200px;
    }
}

.image {
    display: flex;
    padding: 8px;
    cursor: pointer;

    .side-image {
        display: flex;
        align-items: center;
        img {
            min-height: 80px;
            max-height: 80px;
            min-width: 60px;
            max-width: 60px;
            border-radius: 4px;
        }
    }
    .card-content-section {
        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;
        margin-left: 4px;
        .card-content-line-1 {
            color: @Mako;
            font-weight: 600;
            font-size: 16px;
            -webkit-font-smoothing: antialiased;
            line-height: 22px;
        }
        .card-content-line-2 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
        .card-content-line-3 {
            color: @DustyGray2;
            line-height: 22px;
            font-size: 12px;
        }
    }
}
</style>
<script>
import {
    NitrozenInput,
    NitrozenError,
    NitrozenDropdown,
    NitrozenCheckBox,
    NitrozenChips,
    NitrozenInline
} from '@gofynd/nitrozen-vue';

import { getRoute } from '@/helper/get-route';
import { getAppInfo } from '@/services/utils.service';
import admInlineSvg from '@/components/common/adm-inline-svg.vue';
// import { getPrimaryDomain } from '@/helper/domains.util';
import path from 'path';

export default {
    name: 'attachment',
    components: {
        'nitrozen-inline': NitrozenInline,
        'adm-inline-svg': admInlineSvg
    },
    props: {
        attachment: {
            type: Object
        },
        index: {
            type: Number
        }
    },
    data() {
        return {
            title: '',
            subTitle: '',
            subSubTitle: '',
            logoURLString: ''
        };
    },
    computed: {
        shipmentSubTitle() {
            // const shipmentBags = this.attachment.details.shipments[0].bags
            // let itemsCount = shipmentBags.items.length;
            // let piecesCount = 0;
            // if (shipmentBags) {
            //     for (let i = 0; i < shipmentBags.items.length; i++) {
            //         piecesCount += shipmentBags.items[i].total_detail
            //             .pieces;
            //     }
            // }
            // return itemsCount + ' items | ' + piecesCount + ' Pieces';
            if (this.attachment.details.shipments[0].bags.length == 0) {
                return 'No Pieces';
            } else if (this.attachment.details.shipments[0].bags.length == 1) {
                return '1 Piece';
            }
            return this.attachment.details.shipments[0].bags.length + ' Pieces';
        },
        urlToOpen() {
            if (this.attachment.type == 'product') {
                // return `https://${getPrimaryDomain(
                //     getAppInfo().domains
                // )}/product/${this.attachment.value}`;
            } else if (
                this.attachment.type == 'shipment' &&
                this.attachment.details &&
                this.attachment.details.id
            ) {
                // return path.join(
                //     this.$basePath,
                //     `/order/${this.attachment.details.id}/shipments`
                // );
            }
        }
    },
    mounted() {
        //
    },
    methods: {
        deleteThis() {
            this.$emit(`deleteAttachmentAt`, this.index);
        }
    }
};
</script>
