// import * as _ from 'lodash';
import omit from 'lodash/omit';
import cloneDeep from 'lodash/cloneDeep';
export default function(smsTemplate) {
    let obj = cloneDeep(smsTemplate);
    obj = omit(obj, []);
    return obj;
}
