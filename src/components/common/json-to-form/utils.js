import Ajv from 'ajv';
import pick from 'lodash/pick';

export function validateJsonFormField(form = {}) {
    let {
        vm: { schema, _isMounted },
        field: { value, name }
    } = form;

    // _isMounted is checked because error should not
    // be shown on page load, but only after any input event
    if (!_isMounted) return '';

    const propSchema = {
        ...schema,
        properties: pick(schema.properties, [name]),
        required: schema.required.filter(prop => prop === name)
    };

    // value is made undefined as 'required' RULE passes for empty string.
    // It only fails if field is not present/undefined
    if (value === '') value = undefined;

    var ajv = new Ajv({ jsonPointers: true });
    var valid = ajv.validate(propSchema, { [name]: value });

    if (valid) return '';

    let err = ajv.errors.find(err => err.dataPath === `/${name}`);
    if (!err) {
        if (!propSchema.required.includes(name)) return '';
        return 'field is required';
    }
    return err.message;
}
