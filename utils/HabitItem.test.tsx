import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HabitItemComponent } from '../components/HabitItem'; 

describe('Habit Toggle Functionality', () => {
  // تأكدنا من استخدام completedToday لتطابق منطق المكون الخاص بك
  const mockHabit = {
    id: '1',
    title: 'Workout',
    completedToday: false,
  };

  test('toggles habit completion status correctly', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    // استخرجنا getByTestId للبحث عن المعرف، و getByText كخيار احتياطي
    const { getByTestId, getByText } = render(
      <HabitItemComponent 
        habit={mockHabit}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    // 1. البحث عن الزر باستخدام الـ TestID الذي أضفناه للـ Pressable
    const toggleButton = getByTestId('habit-item-touchable');
    
    // 2. محاكاة الضغط
    fireEvent.press(toggleButton);

    // 3. التحقق من أن الدالة استُدعيت مع المعرف الصحيح '1'
    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });
});