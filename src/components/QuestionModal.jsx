import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';

export default function QuestionModal({
  isOpen,
  onClose,
  onSave,
  initialData
}) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'DSA',
    difficulty: 'Easy',
    status: 'Pending',
    link: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'DSA',
        difficulty: initialData.difficulty || 'Easy',
        status: initialData.status || 'Pending',
        link: initialData.link || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        category: 'DSA',
        difficulty: 'Easy',
        status: 'Pending',
        link: '',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    if (isOpen && titleInputRef.current) {
      titleInputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters.';
    }

    if (formData.link && formData.link.trim() !== '') {
      try {
        new URL(formData.link.trim());
      } catch {
        newErrors.link = 'Please enter a valid URL (e.g. https://leetcode.com/...)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      title: formData.title.trim(),
      link: formData.link ? formData.link.trim() : '',
      notes: formData.notes ? formData.notes.trim() : ''
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {initialData ? 'Edit Question' : 'Add New Question'}
          </h2>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label htmlFor="question-title" className="form-label">
                Question Title *
              </label>
              <input
                id="question-title"
                ref={titleInputRef}
                type="text"
                className="input-field"
                style={{ paddingLeft: '0.75rem' }}
                placeholder="e.g. LeetCode 1: Two Sum"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
              />
              {errors.title && <span className="form-error form-error-title">{errors.title}</span>}
            </div>

            {/* Category, Difficulty, Status */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="question-category" className="form-label">
                  Category *
                </label>
                <select
                  id="question-category"
                  className="select-field"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="DSA">DSA</option>
                  <option value="Git">Git</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="question-difficulty" className="form-label">
                  Difficulty *
                </label>
                <select
                  id="question-difficulty"
                  className="select-field"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="question-status" className="form-label">
                  Status *
                </label>
                <select
                  id="question-status"
                  className="select-field"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Reference URL */}
            <div className="form-group">
              <label htmlFor="question-link" className="form-label">
                Problem / Documentation Link (Optional)
              </label>
              <input
                id="question-link"
                type="url"
                className="input-field"
                style={{ paddingLeft: '0.75rem' }}
                placeholder="https://leetcode.com/problems/..."
                value={formData.link}
                onChange={(e) => {
                  setFormData({ ...formData, link: e.target.value });
                  if (errors.link) setErrors({ ...errors, link: null });
                }}
              />
              {errors.link && <span className="form-error form-error-link">{errors.link}</span>}
            </div>

            {/* Notes */}
            <div className="form-group">
              <label htmlFor="question-notes" className="form-label">
                Approach Notes & Key Takeaways (Optional)
              </label>
              <textarea
                id="question-notes"
                className="input-field"
                style={{ paddingLeft: '0.75rem', minHeight: '80px', resize: 'vertical' }}
                placeholder="Key data structures, complexities, edge cases to remember..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                maxLength={500}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <Check size={16} />
              {initialData ? 'Save Changes' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
