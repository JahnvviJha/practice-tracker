import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';

export default function ControlsToolbar({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  statusFilter,
  onStatusChange,
  difficultyFilter,
  onDifficultyChange,
  onResetFilters,
  totalResultsCount,
  totalQuestionsCount
}) {
  const hasActiveFilters =
    searchTerm.trim() !== '' ||
    categoryFilter !== 'All' ||
    statusFilter !== 'All' ||
    difficultyFilter !== 'All';

  return (
    <div className="toolbar-container" aria-label="Search and Filter Controls">
      <div className="toolbar-grid">
        {/* Search Input */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="input-field"
            placeholder="Search questions or notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search input"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div>
          <select
            className="select-field"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by Category"
          >
            <option value="All">All Categories</option>
            <option value="DSA">DSA</option>
            <option value="Git">Git</option>
            <option value="Technical">Technical</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            className="select-field"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by Status"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <select
            className="select-field"
            value={difficultyFilter}
            onChange={(e) => onDifficultyChange(e.target.value)}
            aria-label="Filter by Difficulty"
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="btn btn-secondary btn-sm"
            title="Clear all active filters"
          >
            <RotateCcw size={13} />
            Clear Filters
          </button>
        )}
      </div>

      {/* Active Filter Info Bar */}
      <div className="filter-badge-bar">
        <span>
          Showing <strong>{totalResultsCount}</strong> of <strong>{totalQuestionsCount}</strong> questions
        </span>
        {hasActiveFilters && (
          <span style={{ color: '#2563eb', fontWeight: 600 }}>
            Active filters applied
          </span>
        )}
      </div>
    </div>
  );
}
