import { AppPage } from './app.po';
import { browser } from 'protractor';



describe('Running end to end  HomePage Test Suite', () => {
  const homePage = new AppPage();
  describe('home page should work fine', () => {
    beforeAll(() => {
      homePage.getPage();
    });

    it('should have right title', () => {
      homePage.getPageTitle().then((title: string) => {
        expect(title).toMatch('Homepage | Gizer Token Sale');
      });
    });

    it('contains paragraph', () => {
      expect(homePage.getJustReleasedParagraph()).toMatch('Just Released');
    });

    it('display: Open Treasure', () => {
      homePage.getOpenTreasure().getText().then((label: string) => {
        expect(label).toEqual('Open Treasure');
      });
    });

    // it('clicks on rifle item', () => {
    //     browser.wait(() => {
    //       return homePage.getRifleItemCard().click().then(() => true);
    //     }).then(() => {
    //       expect(homePage.getRifleTitle()).toBe('Heavy Cal Sniper Rifle');
    //     });
    // });
  });
});
