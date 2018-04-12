'use strict';

import _ from 'lodash';
import Router from 'koa-router';
import koaBody from 'koa-body';
import mock from './mock';
import cases from 'lib/cases';
import assertEqual from 'lib/utils/assertEqual';
import asyncRequest from 'lib/utils/async-request';
import {getLogger} from 'lib/utils/logger';

const logger = getLogger('router');

async function runCase(testCase) {
    const headers = _.merge({
        phoneNumber: '995001162',
    }, testCase.headers);

    if(!_.isEmpty(router.sessionId)){
        headers.cookie = 'JSESSIONID=' + router.sessionId;
    }

    logger.info('cookie', headers.cookie);

    const request = {
        url: 'http://local.peru' + testCase.url,
        headers: headers,
        json: true
    };
    _.set(request, 'headers.User-Agent', 'Mozilla')
    const response = await asyncRequest(request);
    const expectResponse = _.get(testCase, 'response');


    const cookies = _.get(response, 'headers.set-cookie');
    if(_.isArray(cookies)){
        for(let cookie of cookies){
            const matches = /JSESSIONID=([^;]+);.*/.exec(cookie);
            if(_.isArray(matches) && matches.length > 1){
                logger.info(cookie);
                router.sessionId = matches[1];
            }
        }
    }

    // check response of ATG
    assertEqual(response.body, expectResponse, testCase.assertResponse , testCase.url);
    return response.body;
}


const router = new Router();
router.param('caseName',async (caseName, ctx, next)=>{
    const testCase = _.get(cases, caseName);
    if(testCase != undefined){

        if(testCase.requireLogin && !router.isLoggedIn){
            const loginCase = _.merge({}, cases.login);
            mock.payloads = loginCase;
            const result = await runCase(loginCase);
            router.isLoggedIn = true;
        }

        mock.payloads = _.merge({}, testCase);
        const result = await runCase(testCase);
        ctx.body = result;
        mock.payloads = {};
    }else{
        ctx.body = `case ${caseName} is undefined`;
    }
    next();
}).all('/admin/:caseName', koaBody(),async (ctx, next) => {
});

export default router;