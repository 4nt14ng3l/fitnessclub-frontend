import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EntityForm } from './EntityForm';
import { LibraryTable } from './LibraryTable';

export function EntitySection({
  title,
  entity,
  fields,
  addLabel,
  saveLabel,
  useLibraryTable = false,
}) {
  const dispatch = useDispatch();
  const items = useSelector(entity.selectors.selectItems);
  const { loading, submitting, deletingId, error } = useSelector(entity.selectors.selectStatus);

  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('table');

  useEffect(() => {
    dispatch(entity.actions.fetchItems());
  }, [dispatch, entity]);

  const handleSubmit = (formData) => {
    if (editingItem) {
      dispatch(entity.actions.updateItem(formData));
      setEditingItem(null);
    } else {
      dispatch(entity.actions.addItem(formData));
    }
  };

  const handleDelete = (id) => {
    dispatch(entity.actions.deleteItem(id));
    if (editingItem?.id === id) setEditingItem(null);
  };

  return (
    <>
      <EntityForm
        fields={fields}
        editingItem={editingItem}
        onSubmit={handleSubmit}
        onCancel={() => setEditingItem(null)}
        submitting={submitting}
        addLabel={addLabel}
        saveLabel={saveLabel}
      />

      <hr className="divider" />

      <div className="view-toggle-container">
        <h2>{title}</h2>
        <div className="toggle-buttons">
          <button
            className={`btn-toggle ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            📋 Таблица
          </button>
          <button
            className={`btn-toggle ${viewMode === 'cards' ? 'active' : ''}`}
            onClick={() => setViewMode('cards')}
          >
            🎴 Карточки
          </button>
        </div>
      </div>

      {/* Спиннер загрузки таблицы */}
      {loading && (
        <div className="spinner-container">
          <div className="spinner" />
          <span>Загрузка данных...</span>
        </div>
      )}

      {/* Вывод ошибки */}
      {error && <div className="error-banner">Ошибка: {error}</div>}

      {/* Контент после загрузки */}
      {!loading && !error && viewMode === 'table' && (
        useLibraryTable ? (
          <LibraryTable
            data={items}
            fields={fields}
            onEdit={setEditingItem}
            onDelete={handleDelete}
            deletingId={deletingId}
          />
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Id</th>
                {fields.map((f) => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isDeleting = deletingId === item.id;
                return (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    {fields.map((f) => (
                      <td key={f.name}>{item[f.name]}</td>
                    ))}
                    <td>
                      <button onClick={() => setEditingItem(item)} className="btn-table-edit">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting}
                        className="btn-table-delete"
                      >
                        {isDeleting && <span className="btn-spinner" />}
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )
      )}

      {!loading && !error && viewMode === 'cards' && (
        <div className="cards-grid">
          {items.map((item) => {
            const isDeleting = deletingId === item.id;
            const firstField = fields[0]?.name;
            const secondField = fields[1]?.name;
            const thirdField = fields[2]?.name;

            return (
              <div className="user-card" key={item.id}>
                <div className="card-avatar">👤</div>
                <h3>
                  {item[firstField]} {item[secondField]}
                </h3>
                <p className="card-email">✉ {item[thirdField]}</p>
                <p className="card-id">ID: {item.id}</p>
                <div className="card-actions">
                  <button onClick={() => setEditingItem(item)} className="btn-edit-sm">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={isDeleting}
                    className="btn-delete-sm"
                  >
                    {isDeleting && <span className="btn-spinner" />}
                    {isDeleting ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
