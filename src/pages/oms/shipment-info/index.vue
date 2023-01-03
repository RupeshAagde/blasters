<template>
    <div class="shipment-info-container">
        <shipment-info-header
            :shipment="shipment"
            :firstBag="firstBag"
        ></shipment-info-header>

        <details-section
            :shipment="shipment"
            @updateOrderDetails="() => $emit('updateOrderDetails')"
        ></details-section>

        <div class="shipment-tracker-container" v-if="shipment.tracking_list" :class="{ hide: !isOpen }">
            <shipment-tracker
                :data="shipment.tracking_list"
            ></shipment-tracker>
        </div>
        <div @click="isOpen = !isOpen" class="shipment-tracker-accordion">
            <span>Shipment Journey</span>
            <span v-bind:class="{
                    'filter-arrow-down': !isOpen,
                    'filter-arrow-up': isOpen
                }"
            ><inline-svg class="filter-price" src="arrow-dropdown-blue"></inline-svg></span>

        </div>
    </div>
</template>

<script>
/* Package imports */
// import { NitrozenBadge, NitrozenTab, NitrozenButton, flatBtn } from '@gofynd/nitrozen-vue';

/* Component imports */
import ShipmentInfoHeader from './header.vue';
import DetailsSection from './details-section.vue'; 
import ShipmentTracker from '@/pages/admin/oms/shipment-tracker/index.vue';
import InlineSvg from '@/components/common/inline-svg.vue';

/* Helper imports */
import { convertToOMSDate } from '@/helper/utils.js';

export default {
    name: 'shipment-info',
    props: {
        shipment: {
            type: Object
        }
    },
    data() {
        return {
            isOpen: false,
        }
    },
    components: {
        ShipmentInfoHeader,
        ShipmentTracker,
        DetailsSection,
        InlineSvg
    },
    computed: {
        deliveryPromisedDate() {
            return (
                this.shipment.promise &&
                this.shipment.promise.max
            );
        },
        firstBag() {
            if (this.shipment && this.shipment.bags.length > 0) {
                const bag = this.shipment.bags[0];
                return bag;
            }
            return null;
        },
        // pickupSlot() {
        //     let date = moment(this.shipment.delivery_slot.date).add(new Date().getTimezoneOffset(), 'minutes').format('DD MMM YYYY');
        //     let lower_bound = moment(this.shipment.delivery_slot.lower_bound).add(new Date().getTimezoneOffset(), 'minutes').format('LT');
        //     let upper_bound = moment(this.shipment.delivery_slot.upper_bound).add(new Date().getTimezoneOffset(), 'minutes').format('LT');

        //     return `${date}, ${lower_bound} - ${upper_bound}`;
        // }
    },
    methods: {
        toDateTimeString(date) {
            return convertToOMSDate(date);
        }
    }
}
</script>

<style lang="less" scoped>
.shipment-info-container {
    padding: 24px;
    border: 1px solid #E0E0E0;
    border-radius: 4px;
    margin-bottom: 2rem;

    .details-container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        column-gap: 1rem;
        margin-bottom: 1.5rem;

        .info {
            font-size: 12px;
            font-weight: 400;
            color: #4D4D4E;
            margin-bottom: 8px;
            line-height: 18px;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .download-link {
            color: #2E31BE;
        }
    }
}
.shipment-tracker-accordion {
    display: flex;
    justify-content: center;
    border: 1px solid #E0E0E0;
    max-width: 20%;
    min-width: 20%;
    align-items: center;
    position: relative;
    top: 39px;
    background: white;
    left: 40%;
    border-radius: 26px;
    color: #2E31BE;
    gap: 0.5rem;
    height: 26px;
    margin-top: -1rem;
    font-weight: 400;
    font-size: 12px;
    cursor: pointer;
    .filter-price {
        color: #2E31BE;
    };
    .filter-arrow-up {
        transform: rotate(180deg);
    }
    .label {
        cursor: pointer;
    }
}
.hide {
    display: none;
}
// .extra-info:last-child {
//     margin-right: 16px;
// }
.button-submit {
    margin-left: 74%;
}
</style>
