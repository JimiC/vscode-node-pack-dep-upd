// tslint:disable only-arrow-functions
// tslint:disable no-unused-expression
import { expect } from 'chai';
import nls from '../../../package.nls.json';
import nlsTemplate from '../../../package.nls.template.json';

describe('I18n: tests', function () {

  context('ensures that', function () {

    context('nls', function () {

      it('match nls template',
        function () {
          for (const key of Reflect.ownKeys(nls)) {
            expect(nlsTemplate[key]).to.exist;
          }
        });

      it('template match nls',
        function () {
          for (const key of Reflect.ownKeys(nlsTemplate)) {
            expect(nls[key]).to.exist;
          }
        });

    });

  });

});
