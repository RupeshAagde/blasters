<template>
    <div class="main-container">
        <div class="box-container">
            <div>
                <img class="image-container" :src="imageData[0].image">
            </div>
        </div>
        <div class="item-details">
            <p class="item-name">{{ imageData[0].name }}</p>
            <!-- <div class="item-variant" v-if="!isEmpty(imageData[0].size)">
                <nitrozen-chips 
                    class="nitro-chip" 
                    >
                    {{ imageData[0].size }}
                </nitrozen-chips> -->
                <!-- <nitrozen-chips class="nitro-chip">Variant 1</nitrozen-chips>
                <nitrozen-chips class="nitro-chip">Variant 2</nitrozen-chips> -->
            <!-- </div> -->
            <p class="item-sku" v-if="!isEmpty(imageData[0].size)">Size: {{ imageData[0].size }}</p>
            <p class="item-sku" v-if="imageData[0].sku">SKU: {{ imageData[0].sku }}</p>
        </div>
    </div>
</template>

<script>
/* Package imports */
import isEmpty from 'lodash/isEmpty';

/* Component imports */
import { NitrozenChips } from '@gofynd/nitrozen-vue';

export default {
    name: 'bag-details',
    props: {
        imageData: {
            type: Array
        }
    },
    components: {
        NitrozenChips,
    },
    methods: {
        isEmpty
    }
}
</script>

<style lang="less" scoped>
.main-container {
    box-sizing: border-box;
    margin: 24px;
    .box-container {
        border: 0.5px solid #979797;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-content: center;
        margin-bottom: 24px;
        .image-container {
            object-fit: contain;
            width: 100%;
            height: 320px;
            // display: block;
            // margin-left: auto;
            // margin-right: auto;
            // margin-top: 15%;
            // width: 50%;
            // width: 90%;
            // height: 20rem;
        }
    }
    .item-details {
        // display: flex;
        // margin-left: 30px;
        .item-name {
            font-weight: 500;
            font-size: 16px;
            line-height: 17px;
            color: #4D4D4E;
            margin-bottom: 1rem;
        }
        .item-variant {
            margin-bottom: 1rem;
            .nitro-chip {
                height: 24px;
                padding: 0 8px;
                margin: 0 6px 0 0;
                display: inline-block;
                cursor: default;
                background: #F6F6F6;
                border-radius: 24px;
                font-size: 12px;
                line-height: 24px;
                vertical-align: middle;
                white-space: nowrap;
                font-family: Inter, sans-serif;
                cursor: pointer;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                max-width: 150px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                color: #4D4D4E;
                border: #E0E0E0;
            }
        }
        .item-sku {
            font-weight: 400;
            font-size: 12px;
            line-height: 17px;
            color: #000000;
        }
    }
}
</style>