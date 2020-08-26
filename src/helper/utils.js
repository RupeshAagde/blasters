import { isBrowser, isNode } from 'browser-or-node';
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
        var later = function() {
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
        isAlready === -1
            ? currentValue.push(value)
            : currentValue.splice(isAlready, 1);
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
    return str.replace(/\W+(.)/g, function(match, chr) {
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

// export const detectMobile = () => {
//   if (
//     navigator.userAgent.match(/Android/i) ||
//     navigator.userAgent.match(/webOS/i) ||
//     navigator.userAgent.match(/iPhone/i) ||
//     navigator.userAgent.match(/iPad/i) ||
//     navigator.userAgent.match(/iPod/i) ||
//     navigator.userAgent.match(/BlackBerry/i) ||
//     navigator.userAgent.match(/Windows Phone/i)
//   ) {
//     return true
//   } else {
//     return false
//   }
// }

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
            ? document.getSelection().getRangeAt(0) // Store selection if found
            : false; // Mark as false to know no selection existed before
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
        (o, i) => ({ ...o, [i[0]]: i[1] }),
        {}
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
