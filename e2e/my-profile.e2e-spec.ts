import { browser, by, element } from 'protractor';


describe('Rundown over My Profile', () => {

    beforeAll(() => {
        browser.waitForAngularEnabled(false);
        browser.get('/my-items');
    });

    it('check title', () => {
        expect(browser.getTitle()).toMatch('My Items | Gizer Token Sale');
    });

});
