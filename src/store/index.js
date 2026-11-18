import { configureStore } from '@reduxjs/toolkit';
import { createEntitySlice } from './createEntitySlice';

export const usersEntity = createEntitySlice('users', '/api/users', [
  { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@gmail.com' },
  { id: 2, firstName: 'Dhiraj', lastName: 'Ray', email: 'only2dhir@gmail.com' },
  { id: 3, firstName: 'Anastasia', lastName: 'Petrova', email: 'nastya@gmail.com' },
]);

export const employeesEntity = createEntitySlice('employees', '/api/employees', [
  { id: 1, firstName: 'Alexey', lastName: 'Volkov', position: 'Senior Trainer' },
  { id: 2, firstName: 'Elena', lastName: 'Sokolova', position: 'Yoga Instructor' },
]);

export const workoutsEntity = createEntitySlice('workouts', '/api/workouts', [
  { id: 1, title: 'CrossFit', hall: 'Hall #1', time: '18:00' },
  { id: 2, title: 'Pilates', hall: 'Hall #2', time: '19:30' },
]);

export const store = configureStore({
  reducer: {
    users: usersEntity.reducer,
    employees: employeesEntity.reducer,
    workouts: workoutsEntity.reducer,
  },
});
