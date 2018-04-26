'use strict';

import request from 'request';
import {getLogger} from 'lib/utils/logger';

const logger = getLogger('utils');

export default async function(options) {
    return new Promise((resolve) => {
        request(options, (error, response) => {
            if (error) {
                throw new Error(error);
            }

            resolve(response);
        });
    })
}