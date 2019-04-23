/* global it describe beforeEach afterEach */
/* @flow */

import { ENV } from '@paypal/sdk-constants/src';
import { getVersion } from '@paypal/sdk-client/src';
import { expect } from 'chai';

import * as component from '../src/component'; // eslint-disable-line import/no-namespace

// $FlowFixMe
describe('muse', () => {
    describe('DOM', () => {
        let oldMockDomain;

        // $FlowFixMe
        beforeEach(() => {
            oldMockDomain = window.mockDomain;
        });

        // $FlowFixMe
        afterEach(() => {
            const script = document.getElementById(component.PPTM_ID);
    
            if (script && script.parentNode) {
                script.parentNode.removeChild(script);
            }

            window.mockDomain = oldMockDomain;
        });

        // $FlowFixMe
        it('should insert pptm.js with client ID and merchant ID', () => {
            const script = document.getElementById(component.PPTM_ID);
            const expectedUrl = `id=${ window.location.hostname }&t=xo&v=${ getVersion() }&source=payments_sdk&mrid=xyz&client_id=abc`;
            let src = '';
    
            if (script) {
                // $FlowFixMe
                src = script.src;
            }

            expect(src).to.have.string(expectedUrl);
        });

        // $FlowFixMe
        it('should not insert pptm.js if on paypal domain', () => {
            window.mockDomain = 'mock://www.paypal.com';

            component.insertPptm();

            const script = document.getElementById(component.PPTM_ID);

            // $FlowFixMe
            expect(script).to.equal(null);
        });
    });

    // $FlowFixMe
    describe('#getScriptSrc', () => {
        const mrid = 'abc';
        const clientId = 'xyz';
        const url = 'www.merchant-site.com';

        // $FlowFixMe
        it('should not add mrid param to src if mrid is not present', () => {
            const src = component.getPptmScriptSrc(ENV.TEST, null, clientId, url);
            // $FlowFixMe
            expect(src).to.not.have.string('&mrid=');
        });

        // $FlowFixMe
        it('should not add client_id param to source if client_id is not present', () => {
            const src = component.getPptmScriptSrc(ENV.TEST, mrid, null, url);
            // $FlowFixMe
            expect(src).to.not.have.string('&client_id=');
        });

        // testing for query param
        it('test for query param', () => {
            window.location = 'www.paypal.com?musenodeweb=localhost.paypal.com';
            const src = component.getPptmScriptSrc(ENV.TEST, mrid, null, url);
            expect(src).to.have.string('musenodeweb');
        });
    });
});
