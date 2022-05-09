import UAParser from 'ua-parser-js';

/**
 * Extracts User Device Specefic Data from UserAgent
 */
export default class UserAgentParser {

    constructor(user_agent) {
        let parsed = UAParser(user_agent);
        parsed = this.fyndUAParser(user_agent, parsed);
        return parsed;
    }

    fyndUAParser(ua, parsed_ua = {}) {
        if (ua) {
            const regexFilters = [{
                parent: "os",
                child: "name",
                pattern: new RegExp(/(Platform)\/([\w\.]+)/ig),
                value_op: (v) => v.split('/')[1]
            }, {
                parent: "os",
                child: "version",
                pattern: new RegExp(/(Platform-Version)\/([\w\.]+)/ig),
                value_op: (v) => v.split('/')[1]
            }, {
                parent: "application",
                child: "name",
                pattern: new RegExp(/(App-Name)\/([\w\-\.]+)/ig),
                value_op: (v) => v.split('/')[1].replaceAll("-", " ")
            }, {
                parent: "application",
                child: "version",
                pattern: new RegExp(/(App-Version)\/([\w\.]+)/ig),
                value_op: (v) => v.split('/')[1]
            }, {
                parent: "application",
                child: "identifier",
                pattern: new RegExp(/(Identifier)\/([\w\.]+)/ig),
                value_op: (v) => v.split('/')[1]
            }];

            regexFilters.forEach(f => {
                const found = ua.match(f.pattern);
                if (found && found.length) {
                    parsed_ua[f.parent] = parsed_ua[f.parent] ? parsed_ua[f.parent] : {};
                    parsed_ua[f.parent][f.child] = f.value_op(found[0]);
                }
            });
        }
        return parsed_ua;
    }
}