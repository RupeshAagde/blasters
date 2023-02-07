import {SLA_CONFIG} from './sla_config.js';
import moment from 'moment';

export const getSLAColorByPercent = (percent) =>{
    return SLA_CONFIG.find(slot=>slot.start_time_percentage<percent&&slot.end_time_percentage>=percent)
} 

export const getSLAPercentage = (order_date,estimated_sla) =>{
      // Computes sla value and color based on configuration
    const created_date = new Date(order_date).getTime(); // 0% date ms
    const current_date = new Date().getTime(); // current% date ms
    const sla_date = new Date(estimated_sla).getTime(); // 100% date ms
    const diff_percent = ((current_date-created_date)*100)/(sla_date-created_date);
    return diff_percent>0?diff_percent:101;
}

export const displaySlaTooltip = (sla_estimated_date) => {
    const current_time = new Date();
    sla_estimated_date = new Date(moment(sla_estimated_date).add(new Date().getTimezoneOffset(), 'minutes').format());
    return sla_estimated_date < current_time ? ` Breached`:`Time Left to Breach`;
}

export const displaySlaPercentage = (last_action_datetime,sla_estimated_date) => {
    sla_estimated_date = new Date(moment(sla_estimated_date).add(new Date().getTimezoneOffset(), 'minutes').format());
    last_action_datetime = new Date(moment(last_action_datetime).add(new Date().getTimezoneOffset(), 'minutes').format());
    return getSLAPercentage(last_action_datetime,sla_estimated_date);
}

export const displaySlaHoursLeft = (sla_estimated_date) => {    
    const current_time = new Date();
    sla_estimated_date = new Date(moment(sla_estimated_date).add(new Date().getTimezoneOffset(), 'minutes').format());
    return sla_estimated_date < current_time ? `- ${getHoursDifference(current_time - sla_estimated_date)}`:`${getHoursDifference(sla_estimated_date - current_time)}`;
}

const to2Digit = (num) =>parseInt(num).toString().padStart(2, '0');

const getHoursDifference = (milliseconds) =>{
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = seconds / 60;
    let hours = minutes / 60;
    seconds = seconds % 60;
    let time_string = '';
    
    if(hours>=24){
        let days = parseInt(hours / 24);
        hours = parseInt(hours % 24); 
        time_string = `${days} day${days>1?'s':''} ${hours ? hours+' hr'+(hours>1?'s':''):''}`
    }else if(Math.floor(hours)){
        //minutes = seconds >= 30 ? minutes + 1 : minutes;
        minutes = minutes % 60;
        time_string = `${to2Digit(hours)}:${to2Digit(minutes)} hr${hours>1?'s':''}`
    }else{
        time_string = `${to2Digit(minutes)} min${minutes>1?'s':''}`
    }
    
    return time_string;
}