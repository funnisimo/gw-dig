import 'jest-extended';
import * as DIG from './index';

describe('GWU.dig', () => {
    test('exports', () => {
        expect(DIG.room).toBeObject();
        expect(DIG.blueprint).toBeObject();
    });
});
