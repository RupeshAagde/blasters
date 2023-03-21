import Ajv from 'ajv';
import values from 'lodash/values';
import groupBy from 'lodash/groupBy';
import mapValues from 'lodash/mapValues';

export class CatalogueSchemaService {
    constructor(schema, schemaProp) {
        this.schema = schema;
        this.schemaTitleMapping = CatalogueSchemaService.getPropertyTitleSchemaMapping(
            schema.definitions[schemaProp]
        );
        // loading schema into Ajv
        this.ajv = new Ajv({
            coerceTypes: true,
            jsonPointers: true,
            allErrors: true,
            verbose: true
        });
        this.validate = this.ajv.compile(this.schema);
    }

    getSchemaErrors() {
        if (this.validate.errors && this.validate.errors.length > 0) {
            const errors = this.validate.errors;
            errors.map((err) => {
                const dataPath = err.dataPath;
                const firstIndex = dataPath.indexOf('/', 1) + 1;
                const nextIndex =
                    dataPath.indexOf('/', firstIndex) > 0
                        ? dataPath.indexOf('/', firstIndex)
                        : dataPath.length;
                err.index = dataPath.substring(firstIndex, nextIndex);
                err.property = dataPath.substring(
                    dataPath.lastIndexOf('/') + 1,
                    dataPath.length
                );
            });
            return values(groupBy(errors, 'index'));
        }
        return [];
    }

    static getPropertyTitleSchemaMapping(schema) {
        if (!schema) return {};
        const properties =
            schema.type == 'object'
                ? schema.properties
                : schema.allOf && schema.allOf.length > 0
                ? schema.allOf[0].properties
                : [];
        const response = mapValues(properties, (p) => {
            if (p.title == 'Media') {
                return [{ url: 'Media' }];
            } else if (p.type == 'array') {
                return { type: 'array', value: p.title };
            } else return p.title;
        });
        return schema.allOf && schema.allOf.length > 0
            ? [{ ...response }]
            : response;
    }
}

export default { CatalogueSchemaService };
