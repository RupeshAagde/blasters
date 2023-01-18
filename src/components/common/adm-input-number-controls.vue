<template>
    <div class="custom-input-number-container">
        <nitrozen-input 
            @change="inputChange"
            @keyup="onKeyUp"
            :type="'number'" 
            v-model="inputValue"
            :disabled="disabled"
            :min="min"
            :max="max" />
        <div class="spinners">
            <button 
                class="spinner increment" 
                @click="increment"
                :disabled="inputValue === max"
            >+</button>
            <button 
                class="spinner decrement" 
                @click="decrement"
                :disabled="inputValue === min"
            >-</button>
        </div>
    </div>
</template>

<script>
/* Package imports */
import { 
    NitrozenInput
} from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-input-number-controls',
    components: {
        NitrozenInput
    },
    props: ['value', 'id', 'min', 'max', 'allowNegative', 'disabled'],
    methods: {
        increment() {
            this.$emit('increment', this.id);
        },
        decrement() {
            this.$emit('decrement', this.id);
        },
        inputChange(e) {
            if(e.target.value.includes('-')) {
                this.inputValue = 0;
                this.$emit('change', {id: this.id, value: 0});
                return;
            }
            if(e.target.value > this.max) {
                this.inputValue = 0;
                this.$snackbar.global.showError(`You cannot add a value more than the maximum number of items (${this.max}) for rejection`);
                this.$emit('change', {id: this.id, value: 0});
                return;
            }
            if(e.target.value < this.min) {
                this.inputValue = 0;
                this.$snackbar.global.showError(`You cannot add a value less than the minimum number of items (${this.min}) for rejection`);
                this.$emit('change', {id: this.id, value: 0});
                return;
            } 
            this.$emit('change', {id: this.id, value: e.target.value});
        },
        onKeyUp(e) {
            if(!this.allowNegative && e.keyCode === 189) {
                this.$snackbar.global.showError('You cannot add negative values', {duration: 2500});
            }
        }
    },
    data() {
        return {
            inputValue: this.value
        }
    },
    watch: {
        value(newValue, oldValue) {
            if(oldValue !== newValue) {
                if(newValue < this.min) this.inputValue = 0;
                else this.inputValue = this.value;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.custom-input-number-container {
    position: relative;

    .spinners {
        position: absolute;
        right: 0;
        top: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 30%;
        transform: translateY(-50%);
        height: 100%;

        .spinner {
            font-size: 12px;
            border: none;
            padding: 0 1px;
            height: 48%;
            cursor: pointer;
            &:first-child {
                // margin-bottom: 4%;
                margin: 1px 1px 4% 0;
                border-radius: 0 3px 0 0;
                border-color: #e0e0e0;
            }

            &:last-child {
                margin: 0 1px 1px 0;
                border-radius: 0 0 3px 0;
                border-color: #e0e0e0;
            }
        }

        .spinner:hover {
            background: @LightGreyShade;
        }
    }
}
</style>
