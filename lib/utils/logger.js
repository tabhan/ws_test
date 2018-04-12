import winston from 'winston';
import _ from 'lodash';

export function getLogger(category) {
    if(!winston.loggers.has(category)){
        const config = winston.config;
        winston.loggers.add(category, {
            transports: [
                new (winston.transports.Console)({
                    formatter: function(options) {
                        return config.colorize(options.level, options.level.toUpperCase()) + '\t' + category + '\t' +
                            (options.message ? options.message : '') +
                            (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                    },
                    level: 'info'
                })
            ],
        });
    };
    return winston.loggers.get(category);
}

function updateLogger(conf, category) {
    const logger = getLogger(category);
    logger.transports.console.level = conf.level;
}

export function configure(opt) {
    _.mapValues(opt.categories, updateLogger);
}


