import { browser, by, element } from 'protractor';

export class AppPage {
         getPage() {
           browser.waitForAngularEnabled(false);
           return browser.get('/');
         }

         getPageTitle() {
           return browser.getTitle();
         }

         getJustReleasedParagraph() {
          // tslint:disable-next-line:max-line-length
          return element(by.css('body > app-root > app-layout > div > div > div > app-home > section:nth-child(2) > app-item-list > div > div > div.list-title.position-relative > p')).getText();
         }
         getOpenTreasure() {
           // tslint:disable-next-line:max-line-length
           return element(by.css('body > app-root > app-layout > div > div > app-header > div > div > div > div.col-md-6.d-flex.justify-content-end.align-items-center.p-0 > div.d-inline-flex.btn-treasure.align-items-center.custom-button > span'));
         }
         getRifleItemCard() {
           // tslint:disable-next-line:max-line-length
           return element(by.css('body > app-root > app-layout > div > div > div > app-home > section:nth-child(2) > app-item-list > div > div > div.row.justify-content-center.position-relative > app-item:nth-child(1) > div > div > div.item-img.align-items-center.d-flex.justify-content-center'));
         }
         getRifleTitle() {
           // tslint:disable-next-line:max-line-length
           return element(by.css('body > app-root > app-layout > div > div > div > app-item-detail > div > div > div:nth-child(1) > div.col-12.col-md-4 > div > h2')).getText();
         }
         wait(amount) {
           return browser.wait(amount);
         }
       }
