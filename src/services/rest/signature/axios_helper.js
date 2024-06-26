
import combineURLs from 'axios/lib/helpers/combineURLs'
import isAbsoluteURL from "axios/lib/helpers/isAbsoluteURL"
import { transformRequestOptions } from './../../../helper/utils';
import { sign } from './signature'

function getTransformer(config) {
    const {
        transformRequest
    } = config;

    if (transformRequest) {
        if (typeof transformRequest === "function") {
            return transformRequest;
        } else if (transformRequest.length) {
            return transformRequest[0];
        }
    }

    throw new Error(
        "Could not get default transformRequest function from Axios defaults"
    );
}


export const interceptorFn = (options) => {
    return (config) => {

        if (!config.url) {
            throw new Error("No URL present in request config, unable to sign request");
        }

        let url = config.url;
        if (config.baseURL && !isAbsoluteURL(config.url)) {
            url = combineURLs(config.baseURL, config.url);
        }
        const {
            host,
            pathname,
            search
        } = new URL(url);
        if (pathname.startsWith('/service')) {
            const {
                data,
                headers,
                method,
                params
            } = config;
            let queryParam = '';
            if (params && Object.keys(params).length) {
                if (search && search.trim() !== '') {
                    queryParam = `&${transformRequestOptions(params)}`
                } else {
                    queryParam = `?${transformRequestOptions(params)}`
                }
            }
            const transformRequest = getTransformer(config);

            const transformedData = transformRequest(data, headers);

            // Remove all the default Axios headers
            const {
                common,
                delete: _delete, // 'delete' is a reserved word
                get,
                head,
                post,
                put,
                patch,
                ...headersToSign
            } = headers;

            const signingOptions = {
                method: method && method.toUpperCase(),
                host: host,
                path: pathname + search + queryParam,
                body: transformedData,
                headers: headersToSign
            };
            sign(signingOptions);

            // config.headers = signingOptions.headers;
            config.headers['x-fp-date'] = signingOptions.headers['x-fp-date'];
            config.headers['x-fp-signature'] = signingOptions.headers['x-fp-signature'];
        }
        return config
    };
}