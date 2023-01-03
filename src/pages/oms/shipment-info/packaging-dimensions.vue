<!-- <template>
    <div class="packaging-dimension-header">
        <div class="shipment-id">Shipment ID: {{ shipment.shipment_id }}</div>
        <div class="header-note" v-if="packagesWithDimensions > 1">
            <span class="note">Note: </span>
            <span class="note-message">This shipment contains more than one package</span>
        </div>
        <div class="message">Select Custom Packaging from dropdown</div>
        <div
            v-for="(f, i) in packagesWithDimensions"
            :key="i"
        >
        <div class="nitro-dropdown">
            <nitrozen-dropdown
                label="Package Type"
                :items="packagesWithDimensions[i].options"
                v-model="f.selected"
                @change="changePackageType(i, f.selected)"
            ></nitrozen-dropdown>
        </div>
        <div class="all-dimensions">
            <div>
                <div class="dimension-title">Package dimension (L x B x H) (in cm) </div>
                <div class="lbh-dimensions-input">
                    <nitrozen-input
                        :value="nitroInput(i, f.selected, 'length')"
                    ></nitrozen-input>

                    <nitrozen-input
                        :value="nitroInput(i, f.selected, 'breadth')"
                    ></nitrozen-input>

                    <nitrozen-input
                        :value="nitroInput(i, f.selected, 'height')"
                    ></nitrozen-input>
                </div>
            </div>
            <div class="weight-main">
                <div class="weight-title">Weight (in kg)</div>
                <div class="weight-input">
                    <nitrozen-input>
                    </nitrozen-input>
                </div>
            </div>
        </div>
        </div>
    </div>
</template> this code is kept for the future refrence -->
<template>
    <div class="packaging-dimension-header">
        <div class="shipment-id">Shipment ID: {{ shipment.shipment_id }}</div>

        <div class="nitro-dropdown">
            <nitrozen-dropdown
                :items="packageTypes"
                :value="packagingType"
                :disabled="true"
            ></nitrozen-dropdown>
        </div>
        <div class="all-dimensions">
            <div>
                <div class="dimension-title">
                    Package dimension (L x B x H) (in cm)
                </div>
                <div class="lbh-dimensions-input">
                    <nitrozen-input
                        :value="dimension.length"
                        v-model="dimension.length"
                        @change="dimensionChange($event)"
                    />
                    <nitrozen-input
                        :value="dimension.width"
                        v-model="dimension.width"
                        @keyup="dimensionChange($event)"
                    />
                    <nitrozen-input
                        :value="dimension.height"
                        v-model="dimension.height"
                        @keyup="dimensionChange($event)"
                    />
                </div>
            </div>
            <div class="weight-main">
                <div class="weight-title">Weight (in kg)</div>
                <div class="weight-input">
                    <nitrozen-input
                        :vlaue="calculatedVolumetricWeightVar"
                        v-model="calculatedVolumetricWeightVar"
                        :disabled="true"
                    >
                    </nitrozen-input>
                </div>
            </div>
        </div>
        <nitrozen-error v-if="!isInputsValid">
            {{ errorMsg }}
        </nitrozen-error>
    </div>
</template>

<script>
/* Components import */
import {
    NitrozenDropdown,
    NitrozenInput,
    NitrozenError,
} from '@gofynd/nitrozen-vue';

/* Library import */
import isEmpty from 'lodash/isEmpty';

/* Service import */
import OrderService from '@/services/orders.service';

/* Mock import */
// import { PACKAGE_WITH_DIMENSIONS } from './../mocks/pakaging-dimension.js'
// import cloneDeep from 'lodash/cloneDeep';

export default {
    name: 'packaging-drawer',
    props: {
        shipment: Object,
    },
    data() {
        return {
            dimension: {
                height: '0',
                length: '0',
                width: '0',
            },
            packagingType: 'DEFAULT',
            // pwd: cloneDeep(PACKAGE_WITH_DIMENSIONS),
            packageTypes: [{}],
            isInputsValid: true,
            calculatedVolumetricWeightVar: '',
            errorMsg: 'Only numeric values are allowed',
        };
    },
    components: {
        NitrozenDropdown,
        'nitrozen-input': NitrozenInput,
        'nitrozen-error': NitrozenError,
    },
    mounted() {
        this.packagingType = this.shipment.packaging_type || 'DEFAULT';
        this.packageTypes.push({
            text: this.packagingType,
            value: this.packagingType,
        });
        if (!isEmpty(this.shipment.meta.dimension)) {
          let dimensionData = this.shipment.meta.dimension
          this.dimension.length = dimensionData.length || 0;
          this.dimension.height = dimensionData.height || 0;
          this.dimension.width = dimensionData.width   || 0;
          this.positiveInputValues()

        }
    },
    methods: {
        /**
         * This method is fired every time when input values are changed of lbh input boxes
         * and based on that it will keep the submit button disabled until all the values are
         * greater than 0
         * @author Sameer Shaikh
         */
        positiveInputValues() {
            let allPositiveValues = Object.values(this.dimension).every(
                (item) => parseInt(item) > 0
            );

            if (allPositiveValues) {
                this.calculatedVolumetricWeightVar = this.calculateVolumetricWeight();
            } else {
                this.$emit('disableSubmit', true);
            }
        },
        /**
         * This function is only called when lbh values are greater than 0
         * and it contains a function to calculate and display the weight
         *  in the weight input box
         * @author Sameer Shaikh
         */
        calculateVolumetricWeight() {
            let Multipliedlbh = Object.values(this.dimension).reduce(
                (accumulator, currentValue) => currentValue * accumulator
            );
            let weight = Multipliedlbh / 5000
            return weight.toFixed('2');
        },
        /**
         * This functions is fired on input value change in all 3 dropdown of lbh
         * and have written validations on input with regex which enables error when user
         * type any alphabetic charactes. And only numeric input values are supported
         * @param {object} e this event contains text input value
         * @author Sameer Shaikh
         */
        dimensionChange(e) {
            let numCheck = new RegExp('^[0-9]*$');
            if (numCheck.test(e.target.value)) {

                this.isInputsValid = true;
                this.$emit('disableSubmit', false);
                this.positiveInputValues();

            } else {

                this.isInputsValid = false;
                this.calculatedVolumetricWeightVar = '';
                this.$emit('disableSubmit', true);
            }
        },
        /** As of now I am commenting this code and it will be used in future refrence
         * when we would have multiple packaging options
         *
         * @param {number} index of selected packaging through nitrozen dropdown
         * @param {string} selectedValue model value of selected pakaging.
         * @author Sameer Shaikh
         */
        // changePackageType(index, selectedValue) {
        //     this.packagesWithDimensions[index].selected = selectedValue;
        // },
        /**  As of now I am commenting this code and it will be used in future refrence
         * when we would have multiple packaging options
         * @param {number} index of selected packaing type
         * @param {string}  value of selected pakaging.
         * @param {string} dimension it would be text of the key for eg: lenght or width or height
         * @author Sameer Shaikh
         */
        // nitroInput(index, selec, dimension) {
        //     if (selec) {
        //         return this.packagesWithDimensions[index][selec][dimension];
        //     }
        // },
        /** Update packaging funcition will make an api call to udpdate the packaging dimensions
         * Since this function will be called on submit button which is in the footer
         * and here in this drawer we don't have access to the footer so we will call
         * this function through the ref from the parent when submit button is clicked
         * @author Sameer Shaikh
         *
         */
        updatePacKaging() {
            let data = {
                shipment_id: this.shipment.shipment_id,
                current_status: this.shipment.status.current_shipment_status,
                dimension: [
                    {
                        width: this.dimension.width,
                        height: this.dimension.height,
                        length: this.dimension.length,
                        weight: this.calculatedVolumetricWeightVar,
                        packaging_type: this.shipment.packaging_type,

                    },
                ],
            };
            let update_dimension_promise = OrderService.updatePackagingDimensions(data);
            return update_dimension_promise
                .then((res) => {
                    this.$snackbar.global.showSuccess("Dimensions updated successfully"
                    );
                    this.$emit('closeDimensionDrawer')
                    this.$emit('updateOrderDetails')
                })
                .catch((err) => {
                    console.error(
                        'Error while updating pacakging dimensions',
                        err
                    );
                    this.$snackbar.global.showError(
                        'Error while updating pacakging dimensions'
                    );
                });
        },

        // selectedPackage() {
        //     return this.pacakageSelected || '';
        // }
    },
};
</script>

<style lang="less" scoped>
.packaging-dimension-header {
    display: flex;
    flex-direction: column;
    .shipment-id {
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: #41434c;
        margin-bottom: 16px;
    }
    .header-note {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: auto;
        min-height: 45px;
        background-color: #e7eeff;
        border-radius: 4px;
        .note {
            font-weight: 700;
            font-size: 12px;
            line-height: 140%;
            text-align: center;
            color: #2e31be;
            padding: 14px 13px 14px 16px;
        }
        .note-message {
            font-weight: 400;
            font-size: 12px;
            line-height: 20px;
            color: #4f4f4f;
        }
    }
    .message {
        font-weight: 500;
        font-size: 14px;
        line-height: 17px;
        color: #41434c;
        margin-block: 16px;
    }
    .nitro-dropdown {
        margin-bottom: 26px;
        .nitro_input-width {
            width: 100%;
        }
    }
    .all-dimensions {
        display: flex;
        margin-bottom: 18px;
        .dimension-title {
            font-weight: 400;
            font-size: 12px;
            line-height: 17px;
            color: #41434c;
            opacity: 0.5;
        }
        .lbh-dimensions-input {
            display: flex;
            margin-top: 10px;
        }
        .weight-main {
            margin-left: 10px;
            .weight-title {
                font-weight: 400;
                font-size: 12px;
                line-height: 17px;
                color: #41434c;
                opacity: 0.5;
            }
            .weight-input {
                margin-top: 10px;
            }
        }
    }
}
::v-deep .nitrozen-dropdown-label {
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    color: #9b9b9b;
    margin-bottom: 8px;
}
::v-deep .n-input {
    width: 50%;
}
::v-deep .nitrozen-select-wrapper {
    width: 95%;
}
::v-deep .nitrozen-input-grp {
    margin-right: -70px;
}
</style>
