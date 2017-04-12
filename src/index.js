var nunjucks = require('nunjucks');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var _ = require('lodash');

function nunjucksBrunchPlugin(config) {

    var nunjucksOptions = {};
    var publicPath = 'public';
    var templatePath = 'app/views';
    var projectPath = path.resolve(process.cwd());
    var filePatterns = /^app(\/|\\)views(\/|\\).*.html$/;

    function init(config) {
        var options = {};

        if (config && config.plugins && config.plugins.nunjucks) {
            options = config.plugins.nunjucks;
        }

        if (options.filePatterns) {
            filePatterns = options.filePatterns;
        }

        if (options.templatePath) {
            templatePath = options.templatePath;
        }

        if (options.path) {
            publicPath = options.path;
        }

        nunjucksOptions = _.omit(options, 'filePatterns', 'path');
    }

    function renderTemplate(templatePath, options, callback) {
        try {
            var loader = new nunjucks.FileSystemLoader(path.dirname(templatePath));
            var env = new nunjucks.Environment(loader);
            var template = env.render(options.filename, options);
            callback(null, template);
        } catch (e) {
            callback(e);
        }
    }

    function compile(data, originalPath, callback) {
        // We are avoiding the use of the data variable. Using the file path
        // lets the template compile correctly when referencing other templates.
        var templatePath = path.resolve(originalPath);
        var relativePath = path.relative(projectPath, templatePath);

        var options = _.extend({}, nunjucksOptions);
        if (!options.filename) {
            options.filename = path.basename(relativePath);
        }

        renderTemplate(templatePath, options, function(error, template) {
            if (error) {
                callback(error);
                return;
            }

            if (relativePath.length) {
                var outputPath = path.join(projectPath, publicPath, relativePath);
                var outputDirectory = path.dirname(outputPath);

                mkdirp(outputDirectory, function(error) {
                    if (error) {
                        callback(error);
                        return;
                    }

                    fs.writeFile(outputPath, template, function(error) {
                        if (error) {
                            callback(error);
                            return;
                        }

                        callback();
                    });
                });

            } else {
                callback(null, "module.exports = " + template + ";");
            }

        });
    }

    init(config);

    return {
        type: 'template',
        extension: 'html',
        compile: compile
    };

}

nunjucksBrunchPlugin.prototype.brunchPlugin = true;

module.exports = nunjucksBrunchPlugin;
