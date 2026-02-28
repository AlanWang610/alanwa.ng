import { useState, useEffect, useRef, useCallback } from 'react';
import { CloseIcon, ChevronLeft, ChevronRight } from './icons';

interface Photo {
  id: number;
  aspect: number;
  caption: string;
  src?: string;
}

interface Props {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const open = (index: number, el: HTMLDivElement) => {
    triggerRef.current = el;
    setLightboxIndex(index);
  };

  const close = useCallback(() => {
    setLightboxIndex(null);
    triggerRef.current?.focus();
  }, []);

  const next = useCallback(() => {
    setLightboxIndex((i) => (i !== null ? (i + 1) % photos.length : null));
  }, [photos.length]);

  const prev = useCallback(() => {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + photos.length) % photos.length : null,
    );
  }, [photos.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    document.body.style.overflow = 'hidden';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKey);
    dialogRef.current?.querySelector<HTMLElement>('button')?.focus();

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKey);
    };
  }, [lightboxIndex, close, next, prev]);

  const currentPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <div className="masonry">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="masonry__item"
            tabIndex={0}
            role="button"
            aria-label={photo.caption}
            onClick={(e) => open(i, e.currentTarget)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open(i, e.currentTarget as HTMLDivElement);
              }
            }}
          >
            {photo.src ? (
              <img
                className="masonry__img"
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                style={{ aspectRatio: `${photo.aspect}` }}
              />
            ) : (
              <div
                className="masonry__placeholder"
                style={{ paddingBottom: `${(1 / photo.aspect) * 100}%` }}
              >
                <svg
                  viewBox="0 0 80 80"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 40,
                    height: 40,
                    opacity: 0.15,
                  }}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <rect x="8" y="8" width="64" height="64" rx="2" />
                  <circle cx="28" cy="28" r="6" />
                  <polyline points="8,56 28,36 48,56" />
                  <polyline points="44,48 56,36 72,52" />
                </svg>
              </div>
            )}
            <div className="masonry__caption">{photo.caption}</div>
          </div>
        ))}
      </div>

      {currentPhoto && (
        <div
          className="lightbox-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={currentPhoto.caption}
          ref={dialogRef}
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            className="lightbox-close"
            onClick={close}
            aria-label="Close lightbox"
            style={{ position: 'fixed', top: 16, right: 16 }}
          >
            <CloseIcon />
          </button>

          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={prev}
            aria-label="Previous photo"
            style={{ position: 'fixed' }}
          >
            <ChevronLeft />
          </button>

          <div className="lightbox-content">
            {currentPhoto.src ? (
              <img src={currentPhoto.src} alt={currentPhoto.caption} />
            ) : (
              <div
                style={{
                  width: 400,
                  maxWidth: '80vw',
                  aspectRatio: `${currentPhoto.aspect}`,
                  background:
                    'linear-gradient(135deg, var(--photo-placeholder-a), var(--photo-placeholder-b))',
                  borderRadius: 'var(--radius-1)',
                }}
              />
            )}
            <div className="lightbox-caption">{currentPhoto.caption}</div>
          </div>

          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={next}
            aria-label="Next photo"
            style={{ position: 'fixed' }}
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </>
  );
}
