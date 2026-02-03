import {calculateProgress, updateStreak} from './habitUtils';

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

describe('updateStreak with 3-day grace period', () => {
    test('should increment streak if last completed was 2 days ago',()=>{
        const twoDaysAgo=new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate()-2);

        expect (updateStreak(5,twoDaysAgo.toISOString())).toBe(6);
    });

    test('should reset streak if last completed was 5 days ago',()=>{
        const fiveDaysAgo=new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate()-5);

        expect(updateStreak(10,fiveDaysAgo.toISOString())).toBe(1);
    });
});