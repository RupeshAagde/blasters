import { isBrowser, isNode } from 'browser-or-node';
import root from 'window-or-global';

const config = root.config || {};
const env = root.env || {};

let headers = {};

export const getCommonHeaderOptions = () => {
    let defaultHeader = isBrowser ? {} : {};
    return {
        headers: {
            'Content-Type': 'application/json',
            'x-currency-code': 'INR',
            ...defaultHeader,
            ...headers
        }
    };
};

export const getFormDataHeaders = () => {
    let defaultHeader = isBrowser ? {} : {};
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            ...defaultHeader,
            ...headers
        }
    };
};

export const setAuthTokenHeader = (token) => {
    headers[env.AUTH_HEADER_NAME] = token;
};

// "_id": "5c987cf426c22b21a4420e3e",
// "domain": {
//   "verified": true,
//   "name": "demo.addsale.link"
// },
// "cors": {
//   "domains": []
// },
// "description": "testing-2",
// "name": "testing-2",
// "owner": "5c77921fa1bf7d8695ed57fd",
// "createdAt": "2019-03-25T07:02:12.921Z",
// "updatedAt": "2019-04-05T09:15:12.219Z",
// "token": "ea6361a0-4ecb-11e9-90a6-af5e85fa36fe",
