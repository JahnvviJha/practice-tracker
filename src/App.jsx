import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import MetricsDashboard from './components/MetricsDashboard';
import ControlsToolbar from './components/ControlsToolbar';
import QuestionCard from './components/QuestionCard';
import QuestionModal from './components/QuestionModal';
import EmptyState from './components/EmptyState';
import { initialQuestions } from './data/defaultQuestions';

const STORAGE_KEY = 'sheet1_practice_tracker_questions_v1';
const MC_STORAGE_KEY = 'sheet1_machine_coding_status_v1';

export default function App() {
  // 1. Persistent State Initialization
  const [questions, setQuestions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Failed to parse questions from localStorage', err);
    }
    return initialQuestions;
  });

  const [machineCodingStatus, setMachineCodingStatus] = useState(() => {
    try {
      const saved = localStorage.getItem(MC_STORAGE_KEY);
      if (saved) return saved;
    } catch (err) {
      console.error('Failed to parse machine coding status from localStorage', err);
    }
    return 'Completed';
  });

  // 2. LocalStorage Synchronization
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));
    } catch (err) {
      console.error('Failed to save questions to localStorage', err);
    }
  }, [questions]);

  useEffect(() => {
    try {
      localStorage.setItem(MC_STORAGE_KEY, machineCodingStatus);
    } catch (err) {
      console.error('Failed to save machine coding status to localStorage', err);
    }
  }, [machineCodingStatus]);

  // 3. Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // 4. Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // 5. Computed Metrics (useMemo)
  const metrics = useMemo(() => {
    const totalQuestions = questions.length;
    const completedQuestions = questions.filter(q => q.status === 'Completed').length;
    const overallPercent = totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0;

    const dsaQuestions = questions.filter(q => q.category === 'DSA');
    const dsaTotal = dsaQuestions.length;
    const dsaCompleted = dsaQuestions.filter(q => q.status === 'Completed').length;

    const interviewQuestions = questions.filter(q => q.category === 'Git' || q.category === 'Technical');
    const interviewTotal = interviewQuestions.length;
    const interviewCompleted = interviewQuestions.filter(q => q.status === 'Completed').length;

    return {
      totalQuestions,
      completedQuestions,
      overallPercent,
      dsaTotal,
      dsaCompleted,
      interviewTotal,
      interviewCompleted
    };
  }, [questions]);

  // 6. Filtered Questions (useMemo)
  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      // Category match
      if (categoryFilter !== 'All' && q.category !== categoryFilter) {
        return false;
      }
      // Status match
      if (statusFilter !== 'All' && q.status !== statusFilter) {
        return false;
      }
      // Difficulty match
      if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) {
        return false;
      }
      // Search match (title or notes)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const titleMatch = q.title.toLowerCase().includes(query);
        const notesMatch = q.notes ? q.notes.toLowerCase().includes(query) : false;
        if (!titleMatch && !notesMatch) {
          return false;
        }
      }
      return true;
    });
  }, [questions, categoryFilter, statusFilter, difficultyFilter, searchTerm]);

  // 7. Event Handlers
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleSaveQuestion = (data) => {
    if (editingQuestion) {
      // Edit existing
      setQuestions(prev =>
        prev.map(q => (q.id === editingQuestion.id ? { ...q, ...data } : q))
      );
    } else {
      // Add new
      const newQuestion = {
        ...data,
        id: `q-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      setQuestions(prev => [newQuestion, ...prev]);
    }
    handleCloseModal();
  };

  const handleDeleteQuestion = (id) => {
    const target = questions.find(q => q.id === id);
    const title = target ? target.title : 'this question';
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setQuestions(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleCycleStatus = (id) => {
    setQuestions(prev =>
      prev.map(q => {
        if (q.id !== id) return q;
        let nextStatus;
        if (q.status === 'Pending') nextStatus = 'In Progress';
        else if (q.status === 'In Progress') nextStatus = 'Completed';
        else nextStatus = 'Pending';
        return { ...q, status: nextStatus };
      })
    );
  };

  const handleCycleMachineCodingStatus = () => {
    setMachineCodingStatus(current => {
      if (current === 'Pending' || current === 'Not Started') return 'In Progress';
      if (current === 'In Progress') return 'Completed';
      return 'Pending';
    });
  };

  const handleResetData = () => {
    if (window.confirm('Reset tracker to the standard Sheet 1 syllabus questions? Custom changes will be overwritten.')) {
      setQuestions(initialQuestions);
      setMachineCodingStatus('Completed');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('All');
    setStatusFilter('All');
    setDifficultyFilter('All');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <Header
        onOpenAddModal={handleOpenAddModal}
        onResetData={handleResetData}
      />

      {/* Main KPI Dashboard */}
      <MetricsDashboard
        metrics={metrics}
        machineCodingStatus={machineCodingStatus}
        onCycleMachineCodingStatus={handleCycleMachineCodingStatus}
      />

      {/* Search & Filters */}
      <ControlsToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        difficultyFilter={difficultyFilter}
        onDifficultyChange={setDifficultyFilter}
        onResetFilters={handleResetFilters}
        totalResultsCount={filteredQuestions.length}
        totalQuestionsCount={questions.length}
      />

      {/* Questions List & Empty State Handling */}
      <main>
        <div className="section-header">
          <h2 className="section-title">
            Question Tracker
          </h2>
          <span className="questions-count-tag">
            {filteredQuestions.length} {filteredQuestions.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {questions.length === 0 ? (
          <EmptyState
            type="no-questions"
            onResetTemplate={handleResetData}
            onOpenAddModal={handleOpenAddModal}
          />
        ) : filteredQuestions.length === 0 ? (
          <EmptyState
            type="no-results"
            onResetFilters={handleResetFilters}
          />
        ) : (
          <div className="questions-grid">
            {filteredQuestions.map(question => (
              <QuestionCard
                key={question.id}
                question={question}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteQuestion}
                onCycleStatus={handleCycleStatus}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Question Modal */}
      <QuestionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveQuestion}
        initialData={editingQuestion}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div>
          <strong>Sheet 1 Practice Tracker</strong> • LocalStorage Persistent • Responsive Single Page Application
        </div>
        <div>
          Built with React 19 & Lucide Icons
        </div>
      </footer>
    </div>
  );
}
