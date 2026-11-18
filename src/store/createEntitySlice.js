import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

export function createEntitySlice(entityName, endpointUrl, initialMockData = []) {
  const fetchItems = createAsyncThunk(
    `${entityName}/fetchAll`,
    async (_, { rejectWithValue }) => {
      try {
        const res = await fetch(endpointUrl);
        if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`);
        return await res.json();
      } catch (err) {
        // Имитация сетевого запроса (800 мс), чтобы был виден спиннер загрузки таблицы
        await new Promise((resolve) => setTimeout(resolve, 800));
        if (initialMockData.length > 0) return initialMockData;
        return rejectWithValue(err.message);
      }
    }
  );

  const addItem = createAsyncThunk(
    `${entityName}/add`,
    async (newItem, { rejectWithValue }) => {
      try {
        const res = await fetch(endpointUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem),
        });
        if (!res.ok) throw new Error('Ошибка добавления');
        return await res.json();
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return { ...newItem, id: Date.now() };
      }
    }
  );

  const updateItem = createAsyncThunk(
    `${entityName}/update`,
    async (updatedItem, { rejectWithValue }) => {
      try {
        const res = await fetch(`${endpointUrl}/${updatedItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedItem),
        });
        if (!res.ok) throw new Error('Ошибка обновления');
        return await res.json();
      } catch (err) {
        await new Promise((resolve) => setTimeout(resolve, 400));
        return updatedItem;
      }
    }
  );

  const deleteItem = createAsyncThunk(
    `${entityName}/delete`,
    async (id, { rejectWithValue }) => {
      try {
        const res = await fetch(`${endpointUrl}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Ошибка удаления');
        return id;
      } catch (err) {
        // Имитация задержки удаления (700 мс), чтобы был виден спиннер на самой кнопке
        await new Promise((resolve) => setTimeout(resolve, 700));
        return id;
      }
    }
  );

  const slice = createSlice({
    name: entityName,
    initialState: {
      items: [],
      loading: false,
      submitting: false,
      deletingId: null, // ID элемента, на кнопке которого крутится спиннер
      error: null,
    },
    reducers: {}, // пусто по требованию задания
    extraReducers: (builder) => {
      builder
        // Загрузка (pending / fulfilled / rejected)
        .addCase(fetchItems.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchItems.fulfilled, (state, action) => {
          state.loading = false;
          state.items = action.payload;
        })
        .addCase(fetchItems.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        // Добавление
        .addCase(addItem.pending, (state) => {
          state.submitting = true;
        })
        .addCase(addItem.fulfilled, (state, action) => {
          state.submitting = false;
          const nextId =
            state.items.length > 0 ? Math.max(...state.items.map((i) => i.id)) + 1 : 1;
          state.items.push({ ...action.payload, id: nextId });
        })
        .addCase(addItem.rejected, (state, action) => {
          state.submitting = false;
          state.error = action.payload;
        })
        // Редактирование
        .addCase(updateItem.pending, (state) => {
          state.submitting = true;
        })
        .addCase(updateItem.fulfilled, (state, action) => {
          state.submitting = false;
          const index = state.items.findIndex((i) => i.id === action.payload.id);
          if (index !== -1) state.items[index] = action.payload;
        })
        .addCase(updateItem.rejected, (state, action) => {
          state.submitting = false;
          state.error = action.payload;
        })
        // Удаление (спиннер вешается на конкретную кнопку через action.meta.arg)
        .addCase(deleteItem.pending, (state, action) => {
          state.deletingId = action.meta.arg;
        })
        .addCase(deleteItem.fulfilled, (state, action) => {
          state.deletingId = null;
          state.items = state.items.filter((i) => i.id !== action.payload);
        })
        .addCase(deleteItem.rejected, (state, action) => {
          state.deletingId = null;
          state.error = action.payload;
        });
    },
  });

  // Мемоизированные селекторы
  const selectSlice = (state) => state[entityName];

  const selectItems = createSelector([selectSlice], (sliceState) => sliceState.items);

  const selectStatus = createSelector([selectSlice], (sliceState) => ({
    loading: sliceState.loading,
    submitting: sliceState.submitting,
    deletingId: sliceState.deletingId,
    error: sliceState.error,
  }));

  return {
    reducer: slice.reducer,
    actions: { fetchItems, addItem, updateItem, deleteItem },
    selectors: { selectItems, selectStatus },
  };
}
