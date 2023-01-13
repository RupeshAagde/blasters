import {isBrowser} from 'browser-or-node';
import CompanyService from '@/services/company-admin.service';
import {Array, console} from 'window-or-global';
import InputTypes from './NitrozenCustomFormInputTypes';
import {getNavigations} from '../pages/administrator/navigations';
import get from "lodash/get";
import moment from 'moment';

export const debounce = (func, wait, immediate) => {
    var timeout;

    // This is the function that is actually executed when
    // the DOM event is triggered.
    return function executedFunction() {
        // Store the context of this and any
        // parameters passed to executedFunction
        var context = this;
        var args = arguments;

        // The function to be called after
        // the debounce time has elapsed
        var later = function () {
            // null timeout to indicate the debounce ended
            timeout = null;

            // Call function now if you did not on the leading end
            if (!immediate) func.apply(context, args);
        };

        // Determine if you should call the function
        // on the leading or trail end
        var callNow = immediate && !timeout;

        // This will reset the waiting every function execution.
        // This is the step that prevents the function from
        // being executed because it will never reach the
        // inside of the previous setTimeout
        clearTimeout(timeout);

        // Restart the debounce waiting period.
        // setTimeout returns a truthy value (it differs in web vs node)
        timeout = setTimeout(later, wait);

        // Call immediately if you're dong a leading
        // end execution
        if (callNow) func.apply(context, args);
    };
};

export const replaceQueryParam = (router, key, value) => {
    router.push({
        query: Object.assign({}, router.currentRoute.query, {
            [key]: value
        })
    });
};
export const appendQueryParam = (router, key, value) => {
    let currentValue = getUpdatedQueryParamVal(router, key, value);
    router.push({
        query: Object.assign({}, router.currentRoute.query, {
            [key]: currentValue
        })
    });
};

export const getUpdatedQueryParamVal = (router, key, value) => {
    let currentValue = router.currentRoute.query[key] || [];
    if (!Array.isArray(currentValue)) {
        currentValue = [currentValue];
    }
    if (Array.isArray(currentValue)) {
        currentValue = currentValue.map(String);
        let isAlready = currentValue.indexOf(value.toString());
        isAlready === -1 ?
            currentValue.push(value) :
            currentValue.splice(isAlready, 1);
    }
    return currentValue;
};

export const transformRequestOptions = (params) => {
    let options = '';

    for (const key in params) {
        if (typeof params[key] !== 'object' && params[key]) {
            const encodeVal = encodeURIComponent(params[key]);
            options += `${key}=${encodeVal}&`;
        } else if (Array.isArray(params[key])) {
            params[key].forEach((el) => {
                const encodeVal = encodeURIComponent(el);
                options += `${key}=${encodeVal}&`;
            });
        } else if (typeof params[key] === 'object' && params[key]) {
            options += transformRequestOptions(params[key]);
        }
    }
    return options ? options.slice(0, -1) : options;
};

export const camelCase = (str) => {
    return str.replace(/\W+(.)/g, function (match, chr) {
        return chr.toUpperCase();
    });
};

export const getSelectedCurrencyPrice = (amount, exchangeRate) => {
    if (exchangeRate) {
        if (exchangeRate === 0) return 0;
        return amount / exchangeRate;
    }
    return amount;
};

export const detectMobile = () => {
    if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) {
        return true
    } else {
        return false
    }
}

export const detectMobileWidth = () => {
    if (isBrowser) {
        if (window && window.screen.width <= 768) {
            return true;
        } else {
            return false;
        }
    }
};

export const copyToClipboard = (str) => {
    const el = document.createElement('textarea'); // Create a <textarea> element
    el.value = str; // Set its value to the string that you want copied
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
        document.getSelection().rangeCount > 0 // Check if there is any content selected previously
            ?
            document.getSelection().getRangeAt(0) // Store selection if found
            :
            false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand('copy'); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
        // If a selection existed before copying
        document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
        document.getSelection().addRange(selected); // Restore the original selection
    }
};

export const convertToSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
};

export const getQueryObj = (searchURL) => {
    return Array.from(new URLSearchParams(searchURL)).reduce(
        (o, i) => ({ ...o, [i[0]]: i[1] }), {}
    );
};
export const getURLSearchParams = (url) => {
    let baseLink = '',
        queryParams = {};
    const arrURL = url.split('?');
    baseLink = arrURL[0];

    if (arrURL[1]) {
        queryParams = getQueryObj(arrURL[1]);
    }
    return { baseLink, queryParams };
};

export const normalizeAPIError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let { data, status } = error.response;
        let obj;
        // if it is primitive
        if (data !== Object(data)) {
            obj = { message: data, code: status };
        } else {
            obj = { ...data, message: data.message, code: status };
        }
        return obj;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        return { message: 'no response was received' };
    } else {
        // Something happened in setting up the request that triggered an Error
        return { message: error.message };
    }
};

export const randomString = (len) => {
    let charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz, randomPoz + 1);
    }
    return randomString;
};

export const titleCase = (str) => {
    str = str.toLowerCase().split('_');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
};

export const compactDeepObject = (obj = {}) => {
    _.map(obj, (prop, key) => {
        if (_.isArray(prop)) {
            if (_.isEmpty(_.compact(prop))) {
                delete obj[key];
            }
        } else {
            let compactProp = _.pickBy(prop, _.identity);
            if (_.isEmpty(compactProp)) {
                delete obj[key];
            }
        }
    });
    return obj;
};

export const moveArrayItem = (arr, oldIndex, newIndex) => {
    while (oldIndex < 0) {
        oldIndex += arr.length;
    }
    while (newIndex < 0) {
        newIndex += arr.length;
    }
    if (newIndex >= arr.length) {
        let k = newIndex - arr.length;
        while (k-- + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
};

export const generateArrItem = (arr, filterKey) => {
    const tempArr = [];
    arr.forEach((element) => {
        if (element.hasOwnProperty('modified_by')) {
            if (element['modified_by'] !== null) {
                tempArr.push(element['modified_by']);
            }
        }
        if (element.hasOwnProperty('created_by')) {
            if (element['created_by'] !== null) {
                tempArr.push(element['created_by']);
            }
        }
    });
    return tempArr;
};

export const filterDuplicateObject = (arr) => {
    const filteredArr = arr.reduce((acc, current) => {
        const x = acc.find((item) => item.user_id === current.user_id);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []);
    return filteredArr;
};

export const fetchUserMetaObjects = (arr) => {
    var tempArr = [];
    arr.forEach((element) => {
        if (element.user_id !== null) {
            tempArr.push(element.user_id);
        }
    });
    const params = {
        query: tempArr
    };
    return new Promise((resolve, reject) => {
        CompanyService.searchUser(params)
            .then(({ data }) => {
                return resolve(data.users);
            })
            .catch((err) => {
                return reject(err);
            });
    });
};
export const validatePhone = (text) => {
    let check = Number(text);
    if (!isNaN(check)) {
        let regex = new RegExp('^[0-9]{10}$');
        if (regex.test(text)) {
            return true;
        }
    }
    return false;
};

export const validateEmail = (text) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(text).toLowerCase());
};

export const validateNitrozenCustomFormInputs = (inputs) => {
    try {
        if (inputs && Array.isArray(inputs)) {
            if (inputs.length === 0) {
                return true;
            }
            for (let i of inputs) {
                if (!validateNitrozenCustomFormInput(i)) {
                    console.log('INPUT:::', i, inputs.length)
                    throw 'Some input is invalid';
                }
            }
            return true;
        } else {
            throw 'Inputs format invalid';
        }
    } catch (e) {
        console.log('ERROR', e)
        return false
    }
}

export const validateNitrozenCustomFormInput = (input, skipKey = false) => {
    if (!input.type) {
        return false
    }

    // if (!input.key && !skipKey) {
    //     return false
    // }

    // if (skipKey && input.key) {
    //     return false
    // }

    if (input.required != undefined && input.required != true && input.required != false) {
        return false
    }

    switch (input.type) {
        case InputTypes.text.key:
        case InputTypes.textarea.key:
        case InputTypes.email.key:
            return true;
        case InputTypes.number.key:
            return true;
        case InputTypes.radio.key:
        case InputTypes.dropdown.key:
        case InputTypes.checkbox.key:
            if (!input.enum || input.enum.length == 0) {
                return false;
            }
            return true;
        case InputTypes.mobile.key:
            return true;
        case InputTypes.toggle.key:
            return true;
        case InputTypes.object.key:
            if (!input.inputs || input.inputs.length == 0) {
                return false;
            }
            let isValid = true
            input.inputs.forEach(io => {
                isValid = validateNitrozenCustomFormInput(io) && isValid;
            });
            return isValid;
        case InputTypes.array.key:
            return validateNitrozenCustomFormInput(input.input, true);
        default:
            console.log(input.type + 'Unknown input type detected')
            return false
    }
}
export const validUrl = (url) => {
    let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
    if (regexp.test(url)) {
        return true;
    }
    return false
}

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

export const allowNumbersOnly = function (event) {
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 65) {
        return true; // allow control + A
    }
    if (!event.shiftKey && event.keyCode == 8 || event.keyCode == 46
        || event.keyCode == 37 || event.keyCode == 39) {
        return true;
    }
    else if ((event.keyCode >= 48 && event.keyCode <= 57) && !event.shiftKey) {
        return true;
    }
    event.preventDefault()
    return false;
}

export const allowAlphaNumbericOnly = function(event) {
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 65) {
        return true; // allow control + A
    }
    if (!event.shiftKey && event.keyCode == 8 || event.keyCode == 46 ||
        event.keyCode == 37 || event.keyCode == 39) {
        return true;
    }
    if (
        (
            (!event.shiftKey && event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 65 && event.keyCode <= 90) ||
            (event.keyCode >= 97 && event.keyCode <= 122)
        )
    ) {
        return true;
    }
    event.preventDefault();
    return false;
}
export const DecimalNumbersOnly = function (event,el){
    if (event.keyCode == 190) {
        if (el.indexOf('.') === -1) {
            return true;
        }
    }
    if ((event.ctrlKey || event.metaKey) && event.keyCode == 65) {
        return true; // allow control + A
    }
    if (!event.shiftKey && event.keyCode == 8 || event.keyCode == 46
        || event.keyCode == 37 || event.keyCode == 39) {
        return true;
    }
    else if ((event.keyCode >= 48 && event.keyCode <= 57) && !event.shiftKey) {
        return true;
    }
    event.preventDefault()
    return false;
}

export const convertSnakeCaseToString = str => {
    if (str) {
        str = str.toLowerCase().split('_');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }
};

//*Packaging related helpers

/**
 * @author Rohan Shah
 * @param {Object} product 
 * @description Based on the arguments creates a request body and returns it
 * @returns Request body
 */
export const generateProductRequest = (product) => {
    const {
        bulkChecked,
        l3Checked,
        errorRate,
        itemId,
        deadWeight,
        length,
        width,
        height,
        orderThreshold,
        weight,
        l3Categories,
        bulkPackaging
    } = product;
    // default request object
    let createProductRequestBody = {
        item_id: itemId,
        is_bulk: bulkChecked,
        error_rate: errorRate,
        is_l3_specific: l3Checked,
        dead_weight_in_kg: deadWeight,
        dimensions: {
            length,
            width,
            height,
        },
        maximum_order: orderThreshold,
        weight,
        default_package: {
            quantity: {
                max: 1,
                min: 1
            },
            l3_categories: []
        },
        l3_mapping: []
    };
    // pass L3 default package if toggle is checked
    if (l3Checked) {
        createProductRequestBody.default_package.l3_categories = l3Categories;
    }
    // pass bulk group categories if the bulkChecked flag is true
    if (bulkChecked) {
        createProductRequestBody.l3_mapping = bulkPackaging
    }
    // return the createProductRequestBody
    return createProductRequestBody
};
/**
 * @author Rohan Shah
 * @param {Object} groupCategory 
 * @description Based on the arguments creates a request body and returns it
 * @returns Request body
 */
export const generateGroupCategoryRequest = (groupCategory) => {
    const { categories, categoryName, slug } = groupCategory;
    return {
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        categories: categories,
        slug
    };
}
export const convertKebabCaseToString = str => {
    if (str) {
        str = str.toLowerCase().split('-');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    }
};

export const getFirstAllowedRoute = userPermissions => {
    let matchingRoute = "/";
    if(userPermissions && userPermissions.length){
        const firstRoute = getNavigations().find(nav=>(!nav.permission || userPermissions.includes(nav.permission) ));
        if (firstRoute) {
            matchingRoute = firstRoute.link || matchingRoute;
            if (firstRoute.children && firstRoute.children.length) {
                const matchingFirstChild = firstRoute.children.find(nav=>(!nav.permission || userPermissions.includes(nav.permission)));
                if (matchingFirstChild) {
                    matchingRoute = matchingFirstChild.link || matchingRoute;
                }
            }
        }
    }
    return matchingRoute;
}
/**
 * method name: getAspectRatioFromString
 * usage: provides aspect ratio from a valid string value
 * params: takes two parameters first is the value from which we extracts data, second is optional and used to determine whether a string or object needed.
 */

export const getAspectRatioFromString = function (aspectRatio = '1:1', getObject = true) {
    try {
        aspectRatio = aspectRatio.split(":")
        if (aspectRatio.length != 2) {
            throw `aspect ratio ${aspectRatio} isn't in correct format`

        } else {
            let width = parseInt(aspectRatio[0].trim())
            let height = parseInt(aspectRatio[1].trim())
            const greatestCommonD = gcd(width,height)
            width = width/greatestCommonD
            height = height/greatestCommonD
            if (getObject){
                return {
                    width,
                    height
                }
            } else {
                return `${width}:${height}`
            }
           
        }
    } catch (e) {
        console.log('Error', e)
        // throwing default aspect ratio
        if (getObject){
            return {
                width: 1,
                height: 1
            }
        } else {
            return `1:1`
        }
    }
    function gcd(a,b){
        if (b==0){
            return a
        }
        return gcd(b, a%b)
    }
}

export const  pickValues = function (obj, keys) {
    return get(obj, keys.join('.'));
};

export const detectFPApp = () => {
    if (isBrowser) {
        return window._fpAppDetails;
    }
    return false;
};

/** OMS v2.1 */
export const convertToOMSDate = date => {
    return moment(date).add(new Date().getTimezoneOffset(), 'minutes').format('MMM D, YYYY LT');
}

export const downloadFile = path => {
    //creating an invisible element
    let element = document.createElement('a');
    element.setAttribute('href', path);
    element.setAttribute('download', path);
    element.setAttribute('target', '_self');
    // element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

export const formatPrice = (value) => {
    if(!isNaN(value)){
        return value.toFixed(2);
    }
    return Number(0).toFixed(2);
}

export const numberToThousandString = (num)=> {
    let val = Number(num)/1000;
    return val < 1 ? `${num}` : val.toString().split('.')[1].length > 0 ? `${val.toString().split('.')[0]}K+`:`${val}K`;
}
/** OMS v2.1 --END */
