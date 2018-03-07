import { browser, by, element } from 'protractor';


describe('Rundown over Buy GZR subpage', () => {

    beforeAll(() => {
        browser.waitForAngularEnabled(false);
        browser.get('/buy-gzr');
    });

    it('check title', () => {
        expect(browser.getTitle()).toMatch('Buy GZR | Gizer Token');
    });

});
