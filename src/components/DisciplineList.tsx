import { useState } from 'react';
import { ExternalIcon } from './icons';

interface Workout {
  title: string;
  distance: string;
  duration: string;
  link: string;
  note: string;
  tags: string[];
}

interface Props {
  workouts: Workout[];
  tags: string[];
}

export default function DisciplineList({ workouts, tags }: Props) {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? workouts
      : workouts.filter((w) => w.tags.includes(active));

  return (
    <>
      <div className="tag-filter">
        {['All', ...tags].map((tag) => (
          <button
            key={tag}
            className={`tag-btn ${active === tag ? 'tag-btn--active' : ''}`}
            onClick={() => setActive(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div>
        {filtered.map((w, i) => (
          <div className="workout-row" key={i}>
            <div>
              <div className="workout-row__title">{w.title}</div>
              {w.note && <div className="workout-row__note">{w.note}</div>}
              {w.link && (
                <a
                  href={w.link}
                  className="workout-row__link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {new URL(w.link).hostname.replace(/^www\./, '').split('.')[0]}
                  <ExternalIcon />
                </a>
              )}
            </div>
            <div className="workout-row__stats tnum">
              {w.distance !== '—' && <span>{w.distance}</span>}
              {w.distance !== '—' && (
                <span style={{ margin: '0 6px', color: 'var(--border)' }}>
                  &middot;
                </span>
              )}
              <span>{w.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
