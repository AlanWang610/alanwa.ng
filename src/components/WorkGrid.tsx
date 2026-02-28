import { useState } from 'react';

interface Project {
  slug: string;
  title: string;
  tags: string[];
  year: string;
  summary: string;
  featured: boolean;
}

interface Props {
  projects: Project[];
  tags: string[];
}

export default function WorkGrid({ projects, tags }: Props) {
  const [active, setActive] = useState('All');

  const filtered =
    active === 'All'
      ? projects
      : projects.filter((p) => p.tags.includes(active));

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

      <div className="work-grid">
        {filtered.map((p) => (
          <a
            key={p.slug}
            href={`/work/${p.slug}/`}
            className={`card ${p.featured ? 'card--featured' : ''}`}
          >
            <div className="card__eyebrow">
              {p.tags.join(' · ')} · {p.year}
            </div>
            <div className="card__title">{p.title}</div>
            <div className="card__desc">{p.summary}</div>
          </a>
        ))}
      </div>
    </>
  );
}
