// import _ from 'lodash';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';

export const isLive = schedule => {
    let isLive = false;
    const s = schedule.next_schedule; // next schedules
    if (!s) return false;
    const now = new Date().getTime();
    for (let i = 0; i < s.length; i++) {
        const group = s[i];
        const start = group.start ? new Date(group.start).getTime() : null;
        const end = group.end ? new Date(group.end).getTime() : null;
        if (!end && start < now) {
            isLive = true;
            break;
        } else if (start < now && now < end) {
            isLive = true;
            break;
        }
    }
    return isLive;
};

export const nextSchedules = schedule => {
    let next_schedules = [];
    const s = schedule.next_schedule; // next schedules
    if (!s) return next_schedules;
    const now = new Date().getTime();
    for (let i = 0; i < s.length; i++) {
        const group = s[i];
        const start = group.start ? new Date(group.start).getTime() : null;
        const end = group.end ? new Date(group.end).getTime() : null;
        if (end && end < now) {
            continue;
        } else {
            next_schedules.push(group);
        }
    }
    return next_schedules;
};

export const nextSchedule = schedule => {
    const ns = nextSchedules(schedule);
    return ns.length > 0 ? ns[0] : null;
};

const timeUnitsEnum = [
    'years',
    'y',
    'months',
    'M',
    'weeks',
    'w',
    'days',
    'd',
    'hours',
    'h',
    'minutes',
    'm',
    'seconds',
    's',
    'milliseconds',
    'ms'
];
export const toReadableDuration = (value, unit) => {
    if (isNaN(value)) {
        throw new Error('invalid duration value type, expected number');
    }
    if (!timeUnitsEnum.find(u => u === unit)) {
        throw new Error(
            `invalid unit, list of supported units -${timeUnitsEnum.join(', ')}`
        );
    }
    const duration = moment.duration(value, unit);
    return humanizeDuration(duration.asMilliseconds());
};
