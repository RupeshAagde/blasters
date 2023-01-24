<template>
    <div class="shipment-tracker-container" :style="{'grid-template-columns': `repeat(${data.length}, 1fr)`}">
        <div 
            class="track-item"
            v-for="(item, index) in data"
            :key="index">
            <div class="icon-container">
                <div class="icon" :class="{active: item.is_passed}">
                    <adm-inline-svg :src="'tick-grey'" v-if="item.is_passed"></adm-inline-svg>
                </div>
                <div class="connector" :class="{active: item.is_passed}"></div>
            </div>
            <p class="status">{{ item.display_name || convertSnakeCaseToString(item.status) }}</p>
            <div class="time" v-if="item.is_passed">
                <p>{{ dateInOMSFormat(item.time) }}</p>
            </div>
        </div>
    </div>
</template>

<script>
/* Component imports */
import AdmInlineSvg from '@/components/common/inline-svg.vue';

/* Helper imports */
import { convertToOMSDate, convertSnakeCaseToString } from '@/helper/utils.js';

export default {
    name: 'shipment-tracker',
    props: {
        data: {
            type: Array,
            required: true
        }
    },
    methods: {
        convertSnakeCaseToString,
        dateInOMSFormat(date) {
            return convertToOMSDate(date);
        }
    },
    components: {
        AdmInlineSvg
    }
}
</script>

<style lang="less" scoped>
.shipment-tracker-container {
    display: grid;
    // The following value will remain as a back for the template columns
    grid-template-columns: repeat(8, 1fr);
    column-gap: 8px;
    margin-top: 1rem;

    .track-item {
        .icon-container {
            margin-bottom: 8px;
            display: grid;
            grid-template-columns: 20px auto;
            column-gap: 8px;
            align-items: center;

            .icon {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 14px;
                width: 14px;
                border-radius: 50%;
                border: 1px solid #F4F4F4;
                padding: 2px;
                box-sizing: content-box;
    
                ::v-deep svg {
                    stroke: #219653;
                    stroke-width: 1;
                }

                &.active {
                    border-color: #219653;
                }
            }

            .connector {
                height: 1px;
                background: #F4F4F4;
                width: 100%;

                &.active {
                    background: #219653;
                }
            }
        }

        &:last-child {
            .connector {
                display: none;
            }
        }

        .status {
            font-size: 12px;
            font-weight: 400;
            color: #4D4D4E;
            margin-bottom: 4px;
        }

        .time {
            font-size: 10px;
            color: #9B9B9B;
            font-weight: 400;
        }
    }
}
</style>
