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

    const expectRequest = _.get(currentService, 'request');
    const assertRequest = _.get(currentService, 'assertRequest');
    const response = _.get(currentService, 'response');

    assertEqual(request, expectRequest, assertRequest, originalUrl);
    ctx.body = response;
});

export default router;