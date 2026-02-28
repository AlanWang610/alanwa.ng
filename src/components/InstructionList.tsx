import { ExternalIcon } from './icons';

interface Course {
  title: string;
  semester: string;
  link: string;
  note: string;
}

interface Props {
  courses: Course[];
}

export default function InstructionList({ courses }: Props) {
  return (
    <div>
      {courses.map((c, i) => (
        <div className="workout-row" key={i}>
          <div>
            <div className="workout-row__title">{c.title}</div>
            {c.note && <div className="workout-row__note">{c.note}</div>}
            {c.link && c.link !== '#' && (
              <a
                href={c.link}
                className="workout-row__link"
                target="_blank"
                rel="noopener noreferrer"
              >
                View
                <ExternalIcon />
              </a>
            )}
          </div>
          <div className="workout-row__stats tnum">
            <span>{c.semester}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
