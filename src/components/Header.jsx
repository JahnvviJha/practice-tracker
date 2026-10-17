import React from 'react';
import { Layers, Plus, RotateCcw } from 'lucide-react';

export default function Header({ onOpenAddModal, onResetData }) {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <div className="brand-icon">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="brand-title">Interview Practice Tracker</h1>
          <p className="brand-subtitle">
            Sheet 1 Preparation • DSA, Git Scenarios, Full-Stack Technical & Machine Coding
          </p>
        </div>
      </div>

      <div className="header-actions">
        <button
          type="button"
          onClick={onResetData}
          className="btn btn-secondary btn-sm"
          title="Reset tracker with Sheet 1 standard syllabus questions"
        >
          <RotateCcw size={14} />
          Reset Template
        </button>
        <button
          type="button"
          onClick={onOpenAddModal}
          className="btn btn-primary"
        >
          <Plus size={16} />
          Add Question
        </button>
      </div>
    </header>
  );
}
