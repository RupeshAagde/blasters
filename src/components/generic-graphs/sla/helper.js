import {SLA_CONFIG} from './sla_config.js';
import moment from 'moment';

export const getSLAColorByPercent = (percent) =>{
    return SLA_CONFIG.find(slot=>slot.start_time_percentage<percent&&slot.end_time_percentage>=percent)
} 
export const displaySlaHoursLeft = (sla_estimated_date) => {    
    const current_time = new Date();
    sla_estimated_date = new Date(moment(sla_estimated_date).add(new Date().getTimezoneOffset(), 'minutes').format());
    return sla_estimated_date < current_time ? `- ${getHoursDifference(current_time - sla_estimated_date)}`:`${getHoursDifference(sla_estimated_date - current_time)}`;
}
export const displaySlaPercentage = (sla_estimated_time) => {
    const created_date = new Date(sla_estimated_time).getTime(); // 0% date ms
    const current_date = new Date().getTime(); // current% date ms
    const diff_time = (current_date - created_date)/60000;
    return Math.ceil(diff_time)>30?diff_time:101;

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
        time_string = `${days} day${days>1?'s':''} ${hours ? hours+' hour'+(hours>1?'s':''):''}`
    }else if(Math.floor(hours)){
        //minutes = seconds >= 30 ? minutes + 1 : minutes;
        minutes = minutes % 60;
        time_string = `${hours > 1 ? to2Digit(hours) + ' hours':to2Digit(hours) + ' hour' } ${to2Digit(minutes)} minute${minutes>1?'s':''}`
    }else{
        time_string = `${to2Digit(minutes)} minute${minutes>1?'s':''}`
    }
    
    return time_string;
}