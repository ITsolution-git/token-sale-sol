import { AppPage } from './app.po';



describe('Running end to end  HomePage Test Suite', () => {
  const homePage = new AppPage();
  describe('home page should work fine', () => {
    beforeAll(() => {
      homePage.getPage();
    });

    it('should have right title', () => {
      homePage.getPageTitle().then((title: string) => {
        expect(title).toEqual('Gizer Tokensale');
      });
    });

    it('contains paragraph', () => {
      expect(homePage.getJustReleasedParagraph()).toBe('Just Released');
    });

    it('display: Open Treasure', () => {
      homePage.getOpenTreasure().getText().then((label: string) => {
        expect(label).toEqual('Open Treasure');
      });
    });
  });
});



// describe('gizer.web App', () => {
//   let page: AppPage;

//   beforeEach(() => {
//     page = new AppPage();
//   });

//   it('should display welcome message', () => {
//     page.navigateTo();
//     expect(page.getParagraphText()).toEqual('Open Treasure');
//   });
// });
