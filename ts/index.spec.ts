import 'jest-extended';
import * as DIG from './index';

describe('GW.dig', () => {
    test('exports', () => {
        expect(DIG.dig).toBeObject();
    });
});
