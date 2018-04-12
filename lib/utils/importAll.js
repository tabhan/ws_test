import fs from 'fs';
import _ from 'lodash';
import path from 'path';

export default dir => {
    const result = {};
    const files = fs.readdirSync(dir);
    _.each(files, file => {
        const key = file.replace('.js', '');
        if (key !== 'index') {
            result[key] = require(path.join(dir, key)).default;
        }
    });
    return result;
}