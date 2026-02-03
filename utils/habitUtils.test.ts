import {calculateProgress} from './habitUtils';

describe('calculated progress utility function', () => {
    test('should return 0% when total is 0', () => {
        expect(calculateProgress(0,0)).toBe(0);
    });

    test('returns 50% when half of the tasks are completed', () => {
        expect(calculateProgress(4,2)).toBe(50);
    });

    test('returns 100% when all tasks are completed', () => {
        expect(calculateProgress(5,5)).toBe(100);
    });
    
    test('returns 30.33% when 3 out of 10 tasks are completed', () => {
        expect(calculateProgress(10,3)).toBe(30);
    });     
});