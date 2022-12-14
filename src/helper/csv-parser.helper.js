import * as csvParser from 'papaparse';
// import * as _ from 'lodash';
import uniqBy from 'lodash/uniqBy';

const TYPE_CASTS = {
    getNumber: (value) => {
        let regexNum = new RegExp(/[0-9]+/g);
        if (!regexNum.test(value)) {
            return 'Invalid data';
        }
        return Number(value);
    },
    getBoolean: (value) => {
        const val = value.toLowerCase();
        if (val != 'true' || val != 'false') {
            return 'Invalid data';
        }
        return val === 'true' ? true : false;
    }
};

export const getBoolean = (value) => {
    const val = value.toLowerCase();
    return val === 'true' ? true : val === 'false' ? false : 'Invalid data';
};

export const typeCast = function typeCast(type, value) {
    const fnName = 'get' + type.name;
    const fn = TYPE_CASTS[fnName];
    if (fn === undefined) {
        throwError('Invalid data type');
    }
    return fn(value);
};

function updateUniqueValueMap(map, column, value) {
    if (!map[column]) {
        map[column] = {};
    }
    if (map[column][value]) {
        throwError(
            `Duplicate Values found for Column "${column}" with value ${value}`
        );
    }
    map[column][value] = true;
}

function throwError(errMsg) {
    throw { parseError: true, message: errMsg };
}

function downloadCsv(data) {
    let keys = Object.keys(data);
    let respData = keys;
    if (data instanceof Array) {
        data.forEach((obj) => {});
    }
}

export const parseCsv = function parseCsv(data, schema) {
    try {
        const uniqueValues = {};
        const rows = data.split('\n');
        let schemaColumns = {};
        const requiredColumns = [];

        // Schema validations
        schema.columns.forEach((columnInfo, index) => {
            if (!columnInfo.header.trim()) {
                throwError(
                    `Schema: Column header cannot be empty at index ${index}`
                );
            } else if (schemaColumns[columnInfo.header]) {
                throwError(
                    `Schema: Column header "${columnInfo.header.trim()}" cannot have duplicate entry`
                );
            }
            schemaColumns[columnInfo.header] = columnInfo;
            if (columnInfo.required) {
                requiredColumns.push(columnInfo.header);
            }
        });
        const parsedData = [];

        // Data validation and parsing
        if (rows.length > schema.data_limit) {
            throwError(`Max ${schema.data_limit} records allowed only`);
        }
        let columnNames = null;
        if (rows[0]) {
            // Verify schema is present for all columns from file
            columnNames = rows[0].split(',');
            columnNames.forEach((columnVal) => {
                let columnName = columnVal.trim();
                let columnInfo = schemaColumns[columnName];
                if (!columnInfo) {
                    throwError(`Unknown field column "${columnName}" found`);
                } else if (uniqueValues[columnName]) {
                    throwError(
                        `Column header "${columnName}" cannot have duplicate entry`
                    );
                }
                uniqueValues[columnInfo.header] = {};
            });
        }
        if (!rows[1]) {
            throwError(`No data found`);
        }

        requiredColumns.forEach((reqColumn) => {
            if (!uniqueValues[reqColumn]) {
                throwError(`Required Column "${reqColumn}" is missing`);
            }
        });

        rows.forEach((row, rowIndex) => {
            const columns = row.split(',');
            const columnData = {};
            let columnInfo = null;

            columns.forEach((columnVal, columnIndex) => {
                if (rowIndex === 0) {
                    return;
                } else {
                    columnInfo = schemaColumns[columnNames[columnIndex].trim()];
                    columnData[columnInfo.header] =
                        !columnInfo.type || columnInfo.type.name === 'String'
                            ? columnVal.trim()
                            : typeCast(columnInfo.type, columnVal.trim());
                    if (columnInfo.required && !columnVal.trim()) {
                        throwError(
                            `Value cannot be empty for Column "${
                                columnInfo.header
                            }" on Row ${rowIndex + 1}`
                        );
                    } else if (
                        columnInfo.type != String &&
                        typeof columnData[columnInfo.header] ===
                            String.name.toLocaleLowerCase()
                    ) {
                        throwError(
                            `${columnData[columnInfo.header]} in Column "${
                                columnInfo.header
                            }" Row ${rowIndex + 1}`
                        );
                    } else if (columnInfo.unique) {
                        updateUniqueValueMap(
                            uniqueValues,
                            columnInfo.header,
                            columnVal
                        );
                    }
                }
            });
            if (rowIndex > 0) {
                parsedData.push(columnData);
            }
        });
        return Promise.resolve({ data: parsedData, error: '' });
    } catch (ex) {
        // Do not handle library javascript errors
        if (!ex.parseError) {
            Promise.reject(ex);
        }
        return Promise.resolve({ data: [], error: ex.message });
    }
};

export const parseCsvV1 = (files, validateCsv) => {
    if (files && files.length > 0) {
        let file = files[0];
        csvParser.parse(file, {
            header: true,
            keepEmptyRows: false,
            skipEmptyLines: true,
            trimHeaders: true,
            complete: (data) => {
                validateCsv(data, null);
            },
            error: (err) => {
                validateCsv(null, err);
            }
        });
    }
};

export const getCSVValidationErrors = (ajvErrors) => {
    ajvErrors = ajvErrors || [];
    let mErrors = [];

    let typeErrors = ajvErrors
        .filter((error) => error.keyword === 'type')
        .map((error) => {
            let temp = {};
            let jsonInfo = error.dataPath.split('/');
            const key = jsonInfo.pop();
            const index = 1 + +jsonInfo.pop();
            temp.message = `${key} field at row ${index} ${error.message}`;
            return temp;
        });

    let requiredErrors = ajvErrors.filter(
        (error) => error.keyword === 'required'
    );
    requiredErrors = uniqBy(requiredErrors, 'message').map((error) => {
        let temp = {};
        temp.message = `column ${error.params.missingProperty} is missing`;
        return temp;
    });

    let otherErrors = ajvErrors
        .filter(
            (error) => error.keyword !== 'required' && error.keyword !== 'type'
        )
        .map(({ message }) => ({ message }));

    mErrors = [...typeErrors, ...requiredErrors, ...otherErrors];
    console.log(mErrors);
    return mErrors;
};
