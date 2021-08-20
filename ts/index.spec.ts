import 'jest-extended';
import * as DIG from './index';

describe('GW.dig', () => {
    test('exports', () => {
        expect(DIG.room).toBeObject();
        expect(DIG.blueprint).toBeObject();
    });
});
