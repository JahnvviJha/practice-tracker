import React from 'react';
import {
  CheckCircle2,
  Code2,
  MessageSquareCode,
  Laptop,
  TrendingUp
} from 'lucide-react';

export default function MetricsDashboard({
  metrics,
  machineCodingStatus,
  onCycleMachineCodingStatus
}) {
  const {
    totalQuestions,
    completedQuestions,
    overallPercent,
    dsaTotal,
    dsaCompleted,
    interviewTotal,
    interviewCompleted
  } = metrics;

  const getMachineCodingBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  return (
    <section className="metrics-grid" aria-label="Practice Overview Dashboard">
      {/* 1. Overall Progress & Total Questions */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-label">Overall Progress</span>
          <div className="metric-icon-box" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
            <TrendingUp size={18} />
          </div>
        </div>
        <div className="metric-value-wrapper">
          <span className="metric-value">{overallPercent}%</span>
          <span className="metric-total">({completedQuestions}/{totalQuestions} done)</span>
        </div>
        <div className="progress-bar-container" title={`${overallPercent}% completed`}>
          <div
            className="progress-bar-fill"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
        <div className="metric-footer" style={{ marginTop: '0.5rem' }}>
          <span>Total Questions: <strong>{totalQuestions}</strong></span>
          <span>{totalQuestions - completedQuestions} remaining</span>
        </div>
      </div>

      {/* 2. DSA Problems */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-label">DSA Problems</span>
          <div className="metric-icon-box" style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
            <Code2 size={18} />
          </div>
        </div>
        <div className="metric-value-wrapper">
          <span className="metric-value">{dsaCompleted}</span>
          <span className="metric-total">/ {dsaTotal}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${dsaTotal > 0 ? Math.round((dsaCompleted / dsaTotal) * 100) : 0}%`,
              background: '#4f46e5'
            }}
          />
        </div>
        <div className="metric-footer" style={{ marginTop: '0.5rem' }}>
          <span>Target: 5 LeetCode</span>
          <span>
            {dsaTotal > 0 ? Math.round((dsaCompleted / dsaTotal) * 100) : 0}% Completed
          </span>
        </div>
      </div>

      {/* 3. Interview Topics (Git & Technical) */}
      <div className="metric-card">
        <div className="metric-header">
          <span className="metric-label">Interview Questions</span>
          <div className="metric-icon-box" style={{ backgroundColor: '#dcfce7', color: '#15803d' }}>
            <MessageSquareCode size={18} />
          </div>
        </div>
        <div className="metric-value-wrapper">
          <span className="metric-value">{interviewCompleted}</span>
          <span className="metric-total">/ {interviewTotal}</span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{
              width: `${interviewTotal > 0 ? Math.round((interviewCompleted / interviewTotal) * 100) : 0}%`,
              background: '#16a34a'
            }}
          />
        </div>
        <div className="metric-footer" style={{ marginTop: '0.5rem' }}>
          <span>Git (5) + Technical (5)</span>
          <span>
            {interviewTotal > 0 ? Math.round((interviewCompleted / interviewTotal) * 100) : 0}% Done
          </span>
        </div>
      </div>

      {/* 4. Machine Coding Status Card */}
      <div className="metric-card machine-coding-card">
        <div className="metric-header">
          <span className="metric-label">Machine Coding</span>
          <div className="metric-icon-box" style={{ backgroundColor: '#fef3c7', color: '#b45309' }}>
            <Laptop size={18} />
          </div>
        </div>
        <div className="metric-value-wrapper" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            type="button"
            onClick={onCycleMachineCodingStatus}
            className={`status-toggle-btn ${getMachineCodingBadgeClass(machineCodingStatus)}`}
            title="Click to toggle machine coding status"
          >
            <CheckCircle2 size={13} />
            {machineCodingStatus}
          </button>
        </div>
        <div className="metric-footer" style={{ marginTop: 'auto' }}>
          <span>Practice Tracker App</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>(Click badge to toggle)</span>
        </div>
      </div>
    </section>
  );
}
