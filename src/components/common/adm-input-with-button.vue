<template>
    <div class="button-input-container">
        <div class="input-container"> 
            <input
                :type="type"
                v-model="value"
                :maxlength="maxLength"
                @onChange="onChange"
                :placeholder="placeHolderText"
            />
        </div>
        
        <nitrozen-button 
            :disabled='value.length === 0 || disabled'
            class="button"
            theme="secondary"
            v-flatBtn
            @click="onClick">
            {{ buttonText }}    
        </nitrozen-button>
    </div> 
</template>

<script>
/**
 * A special component for displaying input box with a button inside it.
 * 
 * @author: Rushabh Mulraj Shah
 */

/* Package imports */
import {
    NitrozenInput,
    NitrozenButton,
    flatBtn
} from '@gofynd/nitrozen-vue';

export default {
    name: 'adm-button-input',
    components: {
        NitrozenInput,
        NitrozenButton
    },
    props: {
        type: {
            type: String,
            default: 'text'
        },
        placeHolderText: {
            type: String
        },
        buttonText: {
            type: String
        },
        maxLength: {
            type: Number,
            default: 524288
        },
        disabled: {
            type: Boolean
        }
    },
    data() {
        return {
            value: ''
        }
    },
    directives: {
        flatBtn
    },
    methods: {
        onChange(event) {
            this.$emit('change', event);
        },
        onClick() {
            this.$emit('submit', this.value);
        }
    }
}
</script>

<style lang="less" scoped>
.button-input-container {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 230px;
    position: relative;
    border: 1px solid #e0e0e0;
    border-radius: 3px;

    .input-container{
        width: fit-content;
    }

    input {
        height: 40px;
        background: #fff;
        font-family: 'Inter', sans-serif;
        padding: 0 6px;
        border: none;
        max-width: 130px;
        min-width: 75px;
        margin: 4px;
        color: #41434c;
    }
    
    .button {
        // position: absolute;
        // right: 0;
        padding: 8px;
        margin: 4px;
    }
}
</style>
