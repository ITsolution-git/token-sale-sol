import { browser, by, element } from 'protractor';


describe('Rundown over Buy GZR subpage', () => {

    beforeAll(() => {
        browser.get('/buy-gzr');
    });

    describe('check title', () => {
        expect(browser.getTitle()).toMatch('Buy GZR | Gizer Token');
    });

)};
