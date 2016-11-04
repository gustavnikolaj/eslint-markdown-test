var path = require('path');
var fs = require('fs');

var configLocationByDirname = {};

function configLocationFromDirname(dirname) {
    if (dirname === '/') {
        throw new Error('Reached root without finding a package.json file');
    }
    if (configLocationByDirname[dirname]) {
        return configLocationByDirname[dirname];
    }
    if (configLocationByDirname[dirname] === false) {
        return configLocationFromDirname(path.dirname(dirname));
    }
    try {
        var packageJsonPath = path.resolve(dirname, 'package.json');
        var packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
        var packageJson = JSON.parse(packageJsonContent);

        var configLocation = path.resolve(dirname, packageJson.main);

        configLocationByDirname[dirname] = configLocation;

        return configLocation;
    } catch (e) {
        if (e.code === 'ENOENT') {
            configLocationByDirname[dirname] = false;
            return configLocationFromDirname(path.dirname(dirname));
        }
        throw e;
    }
}

module.exports = function locateEslintConfig(filename) {
    return configLocationFromDirname(path.dirname(filename));
};
