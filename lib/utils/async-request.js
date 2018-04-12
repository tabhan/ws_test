'use strict';

import request from 'request';
import {getLogger} from 'lib/utils/logger';

const logger = getLogger('utils');

export default async function(options) {
    logger.debug('start sending request', options.url);
    return new Promise((resolve) => {
        request(options, (error, response) => {
            logger.debug('end sending request', options.url);

            if (error) {
                throw new Error(error);
            }

            resolve(response);
        });
    })
}