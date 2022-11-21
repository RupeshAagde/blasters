// import * as _ from 'lodash';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';

export default function(emailTemplate) {
    let obj = cloneDeep(emailTemplate);
    obj = omit(obj, []);
    return obj;
}
