import { useState, useEffect, useRef, useCallback } from 'react';
import { CloseIcon, ChevronLeft, ChevronRight } from './icons';

interface Photo {
  caption: string;
  src: string;
  srcset: string;
  width: number;
  height: number;
  fullSrc: string;
}

interface Props {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lightboxSrc, setLightboxSrc] = useState('');
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const open = (index: number, el: HTMLDivElement) => {
    triggerRef.current = el;
    setLightboxIndex(index);
    setLightboxSrc(photos[index].fullSrc);
  };

  const close = useCallback(() => {
    setLightboxIndex(null);
    setLightboxSrc('');
    triggerRef.current?.focus();
  }, []);

  const next = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null) return null;
      const next = (i + 1) % photos.length;
      setLightboxSrc(photos[next].fullSrc);
      return next;
    });
  }, [photos]);

  const prev = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null) return null;
      const prev = (i - 1 + photos.length) % photos.length;
      setLightboxSrc(photos[prev].fullSrc);
      return prev;
    });
  }, [photos]);

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
            key={photo.src}
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
            <picture>
              <source
                type="image/avif"
                srcSet={photo.srcset}
                sizes="(max-width: 540px) 100vw, (max-width: 900px) 50vw, 33vw"
              />
              <img
                className="masonry__img"
                src={photo.src}
                alt={photo.caption}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
              />
            </picture>
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
            <img src={lightboxSrc} alt={currentPhoto.caption} />
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
