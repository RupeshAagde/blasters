<template>
    <div>
        <template v-if="lineItem.type == 'toggle'">
            <toggle-component :lineItem="lineItem" :parentState="parentState" ref="getData" :textClass="textClass" :alwaysDisplayLineItems="alwaysDisplayLineItems">
            </toggle-component>
        </template>
        
        
        <template v-if="lineItem.type == 'group'">
            <group-component :lineItem="lineItem" :parentState="parentState" ref="getData" :textClass="textClass"></group-component>
        </template>

        <template v-if="lineItem.type == 'checkbox'">
            <checkbox-component :lineItem="lineItem"
                :parentState="parentState"
                ref="getData"
                :textClass="textClass"
            ></checkbox-component>
        </template>

        <template v-if="lineItem.type == 'radio_group'">
            <radio-component
                :lineItem="lineItem"
                :parentState="parentState"
                ref="getData"
                :textClass="textClass"
            ></radio-component>
        </template>

        <template v-if="lineItem.type == 'documents'">
            <documents
                :lineItem="lineItem"
                :parentState="parentState"
                ref="getData"
                :textClass="textClass"
            ></documents>
        </template>
        
        <template v-if="lineItem.type == 'extensions'">
            <extensions-component
                :lineItem="lineItem"
                :parentState="parentState"
                ref="getData"
                :textClass="textClass"
            ></extensions-component>
        </template>

        <template v-if="lineItem.type == 'badge'">
            <badge-component :lineItem="lineItem" ref="getData" :textClass="textClass"></badge-component>
        </template>
        
        <template v-if="lineItem.type == 'range'">
            <range-component :lineItem="lineItem" :parentState="parentState" ref="getData" :textClass="textClass"></range-component>
        </template>

        <template v-if="lineItem.type == 'button'">
            <button-component :lineItem="lineItem" :parentState="parentState" ref="getData" :textClass="textClass" @btnClicked="onClickBtn"></button-component>
        </template>

        <template v-if="lineItem.type == 'dropdown'">
           <dropdown-component :lineItem="lineItem" ref="getData" :parentState="parentState"></dropdown-component>
        </template>

    </div>
</template>

<style scoped>
</style>
<script>
import ToggleComponent from './toggle-component.vue';
import GroupComponent from './group-component.vue';
import CheckboxComponent from './checkbox-component.vue';
import RadioComponent from './radio-component.vue';
import Documents from './documents.vue';
import ExtensionsComponent from './extensions-component.vue';
import BadgeComponent from './badge-component.vue';
import RangeComponent from './range.vue';
import ButtonComponent from './button.component.vue'
import DropdownComponent from './dropdown-component.vue';

export default {
    name: 'component-factory',
    components: {
    ToggleComponent,
    GroupComponent,
    RadioComponent,
    CheckboxComponent,
    Documents,
    ExtensionsComponent,
    BadgeComponent,
    RangeComponent,
    ButtonComponent,
    DropdownComponent,
},
    props: ['lineItem', 'parentState', 'textClass', 'alwaysDisplayLineItems'],
    methods: {
        saveForm() {
            return this.$refs.getData.saveForm();
        },
        onClickBtn(id) {
            this.$emit('btnClicked', id)
        }
    },
};
</script>
