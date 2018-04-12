import _ from 'lodash';
import {getLogger} from 'lib/utils/logger';

const logger = getLogger('utils');

function eq(actual, expect, propPaths) {
    let ret = true;
    for (let path of propPaths) {
        ret = _.isEqual(_.get(actual, path), _.get(expect, path));
        if (!ret) {
            break;
        }
    }
    return ret;
}

export default (actual, expect, propPaths, msg) => {
    const ret = _.isEmpty(propPaths) || eq(actual, expect, propPaths);
    if (!ret) {
        logger.error(`check result of ${msg} is ${ret}`);
        logger.error('actual', actual);
        logger.error('expect', expect);
    }
    return ret;
}