'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('App integration tests', function () {
    beforeEach(function () {
        browser.get('/index.html');
    });

    it('should redirect index.html to index.html#/', function () {
        browser.getCurrentUrl().then(function (url) {
            process.stdout.write("Location: " + url);
            expect(url.split('#')[1]).toBe('/');
        });
    });
});