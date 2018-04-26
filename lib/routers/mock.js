'use strict';

import _ from 'lodash';
import Router from 'koa-router';
import {getLogger} from 'lib/utils/logger';
import koaBody from 'koa-body';
import assertEqual from 'lib/utils/assertEqual';

const logger = getLogger('router');

const router = new Router();
router.all('/*', koaBody(), (ctx) => {
    const request = ctx.request.body;

    const services = _.get(router, 'payloads.services');
    const {originalUrl} = ctx.request;

    let currentService;
    _.forIn(services, service => {
        if (_.isEqual(originalUrl, _.get(service, 'url'))) {
            currentService = service;
        }
    });

    if (currentService === undefined) {
        logger.error(`No response of ${originalUrl} is registered.`);
        ctx.body = {};
    }else{
        const expectRequest = _.get(currentService, 'request');
        const assertRequest = _.get(currentService, 'assertRequest');
        const response = _.get(currentService, 'response');
        logger.debug(`Request to mock server ${originalUrl}`, request);
        if (!assertEqual(request, expectRequest, assertRequest, originalUrl)){
            router.payloads.errors.push(`Unexpected request of ${originalUrl}`);
        }
        ctx.body = response;
    }

});

export default router;