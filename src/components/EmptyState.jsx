import React from 'react';
import { SearchX, Inbox, RotateCcw, Plus } from 'lucide-react';

export default function EmptyState({
  type = 'no-results',
  onResetFilters,
  onResetTemplate,
  onOpenAddModal
}) {
  if (type === 'no-results') {
    return (
      <div className="empty-state" role="status">
        <div className="empty-state-icon">
          <SearchX size={26} />
        </div>
        <h3 className="empty-state-title">No matching questions</h3>
        <p className="empty-state-desc">
          No questions matched your current search and filter combination. Try adjusting or clearing your filters.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="btn btn-secondary btn-sm"
        >
          <RotateCcw size={14} />
          Clear All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon">
        <Inbox size={26} />
      </div>
      <h3 className="empty-state-title">Your tracker is empty</h3>
      <p className="empty-state-desc">
        Start by adding your first question or load the pre-built Sheet 1 interview syllabus template.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={onResetTemplate}
          className="btn btn-secondary"
        >
          <RotateCcw size={14} />
          Load Sheet 1 Template
        </button>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add First Question
        </button>
      </div>
    </div>
  );
}
