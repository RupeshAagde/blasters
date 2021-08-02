<script>
import FormSchemaNative from '@formschema/native';
import Title from './title';
import Input from './input';
import Select from './select';
import { validateJsonFormField } from './utils';


FormSchemaNative.setComponent('title', Title);

FormSchemaNative.setComponent('label', 'div');

FormSchemaNative.setComponent('button', '');


FormSchemaNative.setComponent('text', Input, form => {
    
    const { field, vm } = form;
    const propSchema = vm.schema.properties[field.name];

    field['verified'] = propSchema.verified ? propSchema.verified : false;
    field['required'] = propSchema.required ? propSchema.required : false;
    let errorMessage = propSchema.errorMessage ? propSchema.errorMessage: null
    if (field.description) {
        field.tooltipText = field.description;
        field.description = '';
    }

    return {
        showTooltip: !!field.tooltipText,
        tooltipText: field.tooltipText,
        errorMessage
    };
});

FormSchemaNative.setComponent('number', Input, form => {
    
    const { field, vm } = form;
    
    const propSchema = vm.schema.properties[field.name];
    field['verified'] = propSchema.verified ? propSchema.verified : false;
    field['required'] = propSchema.required ? propSchema.required : false;
    let errorMessage = propSchema.errorMessage ? propSchema.errorMessage: null

    if (field.description) {
        field.tooltipText = field.description;
        field.description = '';
    }
    return {
        type: 'number',
        showTooltip: !!field.tooltipText,
        tooltipText: field.tooltipText,
        errorMessage
    };
});

FormSchemaNative.setComponent('select', Select, form => {
    
    const { field, vm } = form;
    
    const propSchema = vm.schema.properties[field.name];
    field['verified'] = propSchema.verified ? propSchema.verified : false;
    field['required'] = propSchema.required ? propSchema.required : false;

    if (!vm._isMounted) {
        // hack code
        // reverting prop type to 'array' so that form validation works right
        const propSchema = vm.schema.properties[field.name];
        if (propSchema.multiple) {
            propSchema.type = 'array';
            propSchema.enum = undefined;

            field.multiple = true;
        }
    }

    // let errorMessage = validateJsonFormField(form);
    let errorMessage = propSchema.errorMessage ? propSchema.errorMessage: null

    if (!field.items) {
        return;
    }
    field.items.forEach(item => {
        item.text = item.label;
    });

    if (field.description) {
        field.tooltipText = field.description;
        field.description = '';
    }

    return {
        tooltip: field.tooltipText,
        multiple: field.multiple,
        required: false,
        errorMessage
    };
});
export default FormSchemaNative;
</script>
