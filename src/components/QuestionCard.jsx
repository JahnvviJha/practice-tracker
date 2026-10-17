import React from 'react';
import {
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  PlayCircle
} from 'lucide-react';

export default function QuestionCard({
  question,
  onEdit,
  onDelete,
  onCycleStatus
}) {
  const { id, title, category, difficulty, status, notes, link } = question;

  const getCategoryClass = (cat) => {
    switch (cat) {
      case 'DSA':
        return 'badge-dsa';
      case 'Git':
        return 'badge-git';
      case 'Technical':
        return 'badge-technical';
      default:
        return 'badge-dsa';
    }
  };

  const getDifficultyClass = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'badge-easy';
      case 'Medium':
        return 'badge-medium';
      case 'Hard':
        return 'badge-hard';
      default:
        return 'badge-easy';
    }
  };

  const getStatusChipClass = (st) => {
    switch (st) {
      case 'Completed':
        return 'status-completed';
      case 'In Progress':
        return 'status-in-progress';
      default:
        return 'status-pending';
    }
  };

  const getStatusIcon = (st) => {
    switch (st) {
      case 'Completed':
        return <CheckCircle2 size={13} />;
      case 'In Progress':
        return <PlayCircle size={13} />;
      default:
        return <Clock size={13} />;
    }
  };

  return (
    <article className="question-card" aria-label={`Question: ${title}`}>
      <div className="question-main">
        <div className="question-header-row">
          <span className={`badge ${getCategoryClass(category)}`}>
            {category}
          </span>
          <span className={`badge ${getDifficultyClass(difficulty)}`}>
            {difficulty}
          </span>

          {/* Quick Clickable Status Chip */}
          <button
            type="button"
            onClick={() => onCycleStatus(id)}
            className={`status-chip ${getStatusChipClass(status)}`}
            title="Click to advance status (Pending → In Progress → Completed)"
          >
            {getStatusIcon(status)}
            {status}
          </button>
        </div>

        <div>
          {link ? (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="question-title"
              title="Open problem link in new tab"
            >
              {title}
              <ExternalLink size={13} style={{ color: '#64748b' }} />
            </a>
          ) : (
            <h3 className="question-title">{title}</h3>
          )}
        </div>

        {notes && <p className="question-notes">{notes}</p>}
      </div>

      <div className="card-actions">
        <button
          type="button"
          onClick={() => onEdit(question)}
          className="btn-icon"
          title="Edit question details"
          aria-label={`Edit ${title}`}
        >
          <Edit2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(id)}
          className="btn-icon"
          style={{ color: '#ef4444' }}
          title="Delete question"
          aria-label={`Delete ${title}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
