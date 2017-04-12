var fs = require('fs');
var expect = require('chai').expect;
var nunjucks = require('nunjucks');

var Plugin = require('../');
var compiledFolder = __dirname + '/../public/tests';

describe('Plugin', function () {

    var plugin;

    beforeEach(function () {
        plugin = new Plugin({
            plugins: {
                nunjucks: {
                    test_variable: 'success'
                }
            }
        });
    });

    it('should be an object', function () {
        return expect(plugin).to.be.ok;
    });

    it('should have #compile method', function () {
        return expect(plugin.compile).to.be.an["instanceof"](Function);
    });

    it('should pass `plugins.nunjucks` data to the template', function (done) {
        var content = __dirname + '/variable_before.html';
        var expected = fs.readFileSync(__dirname + '/variable_after.html', {
            encoding: 'utf-8'
        });
        return plugin.compile('', content, function (err) {
            expect(err).not.to.be.ok;
            var result = fs.readFileSync(compiledFolder + '/variable_before.html', {
                encoding: 'utf-8'
            });
            expect(result).to.equal(expected);
            return done();
        });
    });

    it('should verify all `plugins.nunjucks` options', function (done) {
        plugin = new Plugin({
            plugins: {
                nunjucks: {
                    brunchPlugin: true,
                    type: 'template',
                    extension: 'html',
                    path: 'public',
                    templatePath: 'app/views',
                    filePatterns: /^app(\/|\\)views(\/|\\).*.html$/,
                    test_variable: 'success'
                }
            }
        });
        var content = __dirname + '/variable_before.html';
        var expected = fs.readFileSync(__dirname + '/variable_after.html', {
            encoding: 'utf-8'
        });
        return plugin.compile('', content, function (err) {
            expect(err).not.to.be.ok;
            var result = fs.readFileSync(compiledFolder + '/variable_before.html', {
                encoding: 'utf-8'
            });
            expect(result).to.equal(expected);
            return done();
        });
    });

    it('should fail if the template path is invalid', function (done) {
        var content = '';
        return plugin.compile('', content, function (err) {
            expect(err).to.exist;
            return done();
        });
    });

    it('should extend another template', function (done) {
        var content = __dirname + '/extends_before.html';
        var expected = fs.readFileSync(__dirname + '/extends_after.html', {
            encoding: 'utf-8'
        });
        return plugin.compile('', content, function (err) {
            expect(err).not.to.be.ok;
            var result = fs.readFileSync(compiledFolder + '/extends_before.html', {
                encoding: 'utf-8'
            });
            expect(result).to.equal(expected);
            return done();
        });
    });

    it('should include another template', function (done) {
        var content = __dirname + '/include_before.html';
        var expected = fs.readFileSync(__dirname + '/include_after.html', {
            encoding: 'utf-8'
        });
        return plugin.compile('', content, function (err) {
            expect(err).not.to.be.ok;
            var result = fs.readFileSync(compiledFolder + '/include_before.html', {
                encoding: 'utf-8'
            });
            expect(result).to.equal(expected);
            return done();
        });
    });

    it('should fail with options = undefined', function (done) {
        plugin = new Plugin({
            plugins: {
                nunjucks: void 0
            }
        });
        var content = __dirname + '/variable_before.html';
        return plugin.compile('', content, function (err) {
            expect(err).not.to.be.ok;
            var result = fs.readFileSync(compiledFolder + '/variable_before.html', {
                encoding: 'utf-8'
            });
            expect(result).to.equal("\n");
            return done();
        });
    });

});


