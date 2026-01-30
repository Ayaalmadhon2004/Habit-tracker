import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HabitItemComponent } from '../components/HabitItem'; 

describe('Habit Toggle Functionality', () => {
  const mockHabit = {
    id: '1',
    title: 'Workout',
    completedToday: false,
  };

  test('toggles habit completion status correctly', () => {
    const mockOnToggle = jest.fn();
    const mockOnDelete = jest.fn();
    const mockOnUpdate = jest.fn();

    const { getByTestId } = render(
      <HabitItemComponent 
        habit={mockHabit}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onUpdate={mockOnUpdate}
      />
    );

    const toggleButton = getByTestId('habit-item-touchable');
    
    fireEvent.press(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledWith('1');
  });
});