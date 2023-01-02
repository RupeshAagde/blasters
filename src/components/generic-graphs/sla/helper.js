import {SLA_CONFIG} from './sla_config.js';
import moment from 'moment';

export const getSLAColorByPercent = (percent) =>{
    return SLA_CONFIG.find(slot=>slot.start_time_percentage<percent&&slot.end_time_percentage>=percent)
} 
