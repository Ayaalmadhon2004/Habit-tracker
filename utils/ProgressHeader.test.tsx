import { ProgressHeader } from '@/components/ProgressHeader';
import { render } from '@testing-library/react-native';

jest.mock('react-native-reanimated',()=>require('react-native-reanimated/mock'));

describe('ProgressHeader',()=>{
    test('renders correctly with given props',()=>{
        const {getByText}=render(
            <ProgressHeader total={10} completed={5} animatedStyle={{}} />
        );
        expect(getByText('50%')).toBeTruthy();
    });
    test("renders 0% when total is 0", () => {
        const {getByText}=render(
            <ProgressHeader total={0} completed={0} animatedStyle={{}} />
        );
        expect(getByText('0%')).toBeTruthy();
    });
});
