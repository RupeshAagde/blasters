'use strict';
import _ from 'lodash';

const getFilterToQuery = (filterObj) => {
    let filter_data = _.cloneDeep(filterObj);
    let query = {
        offset: Math.max(
            (filter_data.pagination.current - 1) *
                parseInt(filter_data.pagination.limit),
            0
        ),
        limit: filter_data.pagination.limit
    };

    // trim filter values
    Object.keys(filter_data.query).forEach((key) => {
        filter_data.query[key] = filter_data.query[key].toString().trim();
        if (filter_data.query[key] == '') {
            delete filter_data.query[key];
        }
    });

    if (filter_data.query.name) {
        filter_data.query.name = {
            $regex: filter_data.query.name,
            $options: 'gi'
        };
    }
    if (Object.keys(filter_data.query).length) {
        query.query = JSON.stringify(filter_data.query);
    }
    return query;
};

const PLAN_ENUMS = {
    bill_type: {
        text: 'Billing Type',
        enum: [
            {
                text: 'One Time',
                value: 'one_time'
            },
            {
                text: 'Recurring',
                value: 'recurring'
            }
        ]
    },
    billing_scheme: {
        text: 'Billing Scheme',
        enum: [
            {
                text: 'Per Unit',
                value: 'per_unit'
            },
            {
                text: 'Tier Based',
                value: 'tiered'
            }
        ]
    },
    price_type: {
        text: 'Price Type',
        enum: [
            {
                text: 'Fixed',
                value: 'static'
            },
            {
                text: 'Formula Based',
                value: 'formula'
            },
            {
                text: 'Flexible',
                value: 'dynamic'
            }
        ]
    },
    interval: {
        enum: [
            {
                text: 'Days',
                value: 'day'
            },
            {
                text: 'Weeks',
                value: 'week'
            },
            {
                text: 'Months',
                value: 'month'
            },
            {
                text: 'Years',
                value: 'year'
            }
        ]
    },
    usage_type: {
        text: 'Calculate usage on',
        enum: [
            {
                text: 'Meter Units',
                value: 'metered'
            },
            {
                text: 'Licensed (One time)',
                value: 'licensed'
            }
        ]
    },
    aggregate_usage: {
        text: 'Charge usage by',
        enum: [
            {
                text: 'Sum Units',
                value: 'sum'
            },
            {
                text: 'Maximum used',
                value: 'max'
            },
            {
                text: 'Last usage count',
                value: 'last_during_period'
            },
            {
                text: 'End subscription usage',
                value: 'last_ever'
            }
        ]
    },
    tiers_mode: {
        text: 'Mode of tiers',
        enum: [
            {
                text: 'Graduated',
                value: 'graduated'
            },
            {
                text: 'Volume',
                value: 'volume'
            }
        ]
    }
};

export { getFilterToQuery, PLAN_ENUMS };
