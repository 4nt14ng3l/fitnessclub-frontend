import { useState, useEffect } from 'react';

export function EntityForm({
  fields,
  editingItem,
  onSubmit,
  onCancel,
  submitting,
  addLabel = 'Add',
  saveLabel = 'Save',
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    } else {
      const initial = {};
      fields.forEach((f) => (initial[f.name] = ''));
      setFormData(initial);
    }
  }, [editingItem, fields]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const f of fields) {
      if (!formData[f.name]?.trim()) {
        alert('Заполните все поля!');
        return;
      }
    }
    onSubmit(formData);
    if (!editingItem) {
      const reset = {};
      fields.forEach((f) => (reset[f.name] = ''));
      setFormData(reset);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <button
        type="submit"
        disabled={submitting}
        className={`btn-submit ${editingItem ? 'btn-save-mode' : ''}`}
      >
        {submitting ? 'Saving...' : editingItem ? saveLabel : addLabel}
      </button>

      {editingItem && (
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancel
        </button>
      )}

      {fields.map((field) => (
        <div className="input-group" key={field.name}>
          <label>{field.label}</label>
          <input
            type={field.type || 'text'}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
          />
        </div>
      ))}
    </form>
  );
}
