// import _ from 'lodash';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import cloneDeep from 'lodash/cloneDeep';
import isArray from 'lodash/isArray';
import compact from 'lodash/compact';
import pickBy from 'lodash/pickBy';
import pick from 'lodash/pick';
import identity from 'lodash/identity';
import Ajv from 'ajv';


export function round(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

const DEFAULT_NO_IMAGE = '/public/admin/assets/pngs/default_icon_listing.png';

export function productProfileImage(media) {
    if (isEmpty(media)) {
        return DEFAULT_NO_IMAGE;
    }
    const profileImg = media.find(m => m.type === 'image');
    if (isEmpty(profileImg) || !profileImg.url) {
        return DEFAULT_NO_IMAGE;
    }
    return profileImg.url;
}

export function parseDynamicAttributes(schema = {}, value = {}, options = {}, rejectedFields = {}) {
    const { properties, required } = schema;
    const schemas = {};
    const values = {};

    map(properties, (prop, key) => {
        const grpName = prop.tags;
        prop = cloneDeep(prop);
        if (!schemas[grpName]) {
            schemas[grpName] = {
                title: grpName,
                type: 'object',
                properties: {},
                required: []
            };
            values[grpName] = {};
        }

        if (prop.type === 'array') {
            // hack code
            // making array type to string type with enum so that
            // it gets parsed to 'select' component by the json-form lib
            Object.assign(prop, prop.items, { multiple: true });
        }

        schemas[grpName]['properties'][key] = prop;
        values[grpName][key] = value[key];
        // if(rejectedFields[key]){
        schemas[grpName]['properties'][key]['verified'] = rejectedFields[key] !==undefined ? false :  true;
        schemas[grpName]['properties'][key]['errorMessage'] = schemas[grpName]['properties'][key]['verified'] ? null : "This field is required to verify the product"
        // }

        if (required.includes(key)) {
            schemas[grpName].required.push(key);

            if (options.appendRequiredAsterisk) {
                if (prop.title[prop.title.length - 1] !== '*') {
                    prop.title += ' *';
                }
            }
        }
    });

    return { schemas, values };
}

export function compactDeepObject(obj = {}) {
    map(obj, (prop, key) => {
        if (isArray(prop)) {
            if (isEmpty(compact(prop))) {
                delete obj[key];
            }
        } else {
            let compactProp = pickBy(prop, identity);
            if (isEmpty(compactProp)) {
                delete obj[key];
            }
        }
    });
    return obj;
}

export function fieldSchemaValidation(schema = {}, propName = '', propValue) {
    try {
        let errMsg = '';

        if (schema.required.includes(propName)) {
            if (
                propValue === undefined ||
                propValue === null ||
                propValue === ''
            ) {
                errMsg = 'field is required';
                return errMsg;
            }
        }

        const propSchema = {
            type: schema.type,
            properties: pick(schema.properties, [propName])
        };
        const value = { [propName]: propValue };

        var ajv = new Ajv({ jsonPointers: true });
        const isValid = ajv.validate(propSchema, value);

        if (isValid) return errMsg;

        ajv.errors.forEach(err => {
            if (err.message.includes('pattern')) {
                errMsg = 'invalid format';
            } else {
                errMsg = err.message;
            }
        });

        return errMsg;
    } catch (err) {
        console.error(
            'field schema validation error',
            { schema, propName, propValue },
            err
        );
        return '';
    }
}
