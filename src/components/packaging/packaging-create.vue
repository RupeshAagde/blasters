<template>
    <div class="packaging-create-container">
        <div class="packaging-create-container-header">Extra Details</div>
        <div class="create-packaging-search-container">
            <nitrozen-input
                class="input w-l"
                :label="'Select your packaging'"
                :search="true"
                :showSearchIcon="true"
                :showTooltip="true"
                :tooltipText="searchTooltipText"
                :placeholder="searchPlacholder"
                v-model="searchInput"
            />
        </div>
        <div class="create-packaging-row-2">
            <div
                class="row-2-input"
                v-for="(input, index) of Object.keys(row2Inputs)"
                :key="'r2-input-' + index"
            >
                <nitrozen-input
                    class="input w-l"
                    :label="row2Inputs[input].label"
                    :required="true"
                    :placeholder="row2Inputs[input].placeholder"
                    v-model="row2Inputs[input].value"
                    type="number"
                    @blur="handleBlur(input)"
                    @input="(val) => handleChange(input, val)"
                />
                <nitrozen-error v-if="row2Inputs[input].error">
                    {{ row2Inputs[input].error }}
                </nitrozen-error>
            </div>
        </div>
        <div class="create-packaging-row-3">
            <div
                class="row-3-input"
                v-for="(input, index) of Object.keys(row3Inputs)"
                :key="'r3-input-' + index"
            >
                <nitrozen-input
                    class="input w-l"
                    :label="row3Inputs[input].label"
                    :required="true"
                    :placeholder="row3Inputs[input].placeholder"
                    v-model="row3Inputs[input].value"
                    type="number"
                    :showTooltip="row3Inputs[input].showToolTip"
                    :tooltipText="row3Inputs[input].toolTipText"
                    @blur="handleBlur(input)"
                    @input="(val) => handleChange(input, val)"
                    :disabled="row3Inputs[input].isDisabled"
                />
                <nitrozen-error v-if="row3Inputs[input].error">
                    {{ row3Inputs[input].error }}
                </nitrozen-error>
            </div>
        </div>
        <div class="toggle-container">
          <p>L3 Categories</p>
          <nitrozen-toggle-btn :value="l3Checked" @change="handleToggleChange('l3')"/>
        </div>
        <div class="toggle-container">
          <p>Bulk Packaging</p>
          <nitrozen-toggle-btn :value="bulkChecked" @change="handleToggleChange('bulk')"/>
        </div>
    </div>
</template>
<script>
import { NitrozenInput, NitrozenError, NitrozenToggleBtn } from '@gofynd/nitrozen-vue';
export default {
    name: 'packaging-create',
    components: {
        NitrozenInput,
        NitrozenError,
        NitrozenToggleBtn
    },
    computed: {
        searchPlacholder() {
            return 'Search and select packaging from the list';
        }
    },
    data() {
        return {
            searchInput: '',
            searchTooltipText: 'Tool tip text',
            row2Inputs: {
                length: {
                    label: 'Length (cm)',
                    placeholder: 'Enter length',
                    value: '',
                    error: ''
                },
                width: {
                    label: 'Width (cm)',
                    placeholder: 'Enter width',
                    value: '',
                    error: ''
                },
                height: {
                    label: 'Height (cm)',
                    placeholder: 'Enter height',
                    value: '',
                    error: ''
                }
            },
            row3Inputs: {
                orderThreshold: {
                    label: 'Maximum order threshold',
                    placeholder: '0',
                    value: '',
                    error: ''
                },
                weight: {
                    label: 'Weight(Kg)',
                    placeholder: 'Enter weight',
                    value: '',
                    error: '',
                    showToolTip: true,
                    toolTipText: 'weight Text'
                },
                errorRate: {
                    label: 'Error Rate',
                    placeholder: '0',
                    value: '',
                    error: ''
                },
                deadWeight: {
                    label: 'Dead Weight',
                    placeholder: '0',
                    value: '',
                    error: '',
                    isDisabled: true
                }
            },
            l3Checked : false,
            bulkChecked: false
        };
    },
    methods: {
      /**
       * 
       * @author Rohan Shah
       * @description Handle blur and check for errors if found then show the error 
       * 
       */
        handleBlur(key) {
            if (this.row2Inputs[key] && !this.row2Inputs[key].value)
                this.row2Inputs[key].error = `${this.row2Inputs[key].label} is a mandatory field`;
            else {
                if (this.row3Inputs[key] && !this.row3Inputs[key].value)
                    this.row3Inputs[key].error = `${this.row3Inputs[key].label} is a mandatory field`;
            }
        },
        /**
         * 
         * @author Rohan Shah
         * @description Handle input change and save values in the state object
         */
        handleChange(input, val) {
            let objCheck = this.row2Inputs.hasOwnProperty(input);
            if (objCheck) {
                this.row2Inputs[input].value = val;
                this.row2Inputs[input].error = '';
            } else {
                this.row3Inputs[input].value = val;
                this.row3Inputs[input].error = '';
            }
            this.calculateDeadWeight()
        },
        /**
         * @author Rohan Shah
         * @description Calculates the deadwieght if all length, width, height are present
         * else it resets it to empty / 0 
         */
        calculateDeadWeight(){
          let field = this.row2Inputs
          if(field['length'].value && field['width'].value && field['height'].value){
            let deadWeight = (field['length'].value * field['width'].value * field['height'].value) / 5000
            this.row3Inputs['deadWeight'].value = deadWeight
          }
          else {
            this.row3Inputs['deadWeight'].value = ''
          }
        },
        /**
         * @author Rohan Shah
         * @description create request object and dispatch the service to save the packaging product
         */
        savePackagingOrder(){

        },
        handleToggleChange(type){
          switch (type) {
            case 'l3':
              this.l3Checked = !this.l3Checked
              break;
            case 'bulk':
              this.bulkChecked = !this.bulkChecked
            default:
              break;
          }
        }
    }
};
</script>

<style lang="less">
@import '../../less/packaging/packaging-create.less';
</style>
