import moment from 'moment';
export const dateRangeShortcuts = [
    {
        text: 'Today',
        start: new Date(),
        end: new Date()
    },
    {
        text: 'Last Week',
        start: moment().subtract(7, 'days'),
        end: new Date()
    },
    {
        text: 'Last 15 days',
        start: moment().subtract(15, 'days'),
        end: new Date()
    },
    {
        text: 'Last Month',
        start: moment().subtract(1, 'months'),
        end: new Date()
    },
    {
        text: 'Last 3 Months',
        start: moment().subtract(3, 'months'),
        end: new Date()
    }
];
