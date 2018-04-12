import fs from 'fs';
import _ from 'lodash';
import path from 'path';

export default dir => {
    const result = {};
    const files = fs.readdirSync(dir);
    _.each(files, file => {
        const key = file.replace(/\..+/, '');
        if (key !== 'index') {
            const module = require(path.join(dir, key));
            result[key] = module.default || module;
        }
    });
    return result;
}