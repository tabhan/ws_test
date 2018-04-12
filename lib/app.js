import Koa from 'koa';
import adminRouter from 'lib/routers/admin';
import mockRouter from 'lib/routers/mock';

import {getLogger} from 'lib/utils/logger';

const logger = getLogger('server');

const app = new Koa();

app.use(adminRouter.routes()).use(adminRouter.allowedMethods()).use(mockRouter.routes()).use(mockRouter.allowedMethods());

logger.info('start');
app.listen(3000);