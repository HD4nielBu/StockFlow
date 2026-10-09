import { CornerDownLeft, Search } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router';
import { ALL_PAGES, NAV_SECTIONS } from '../../app/navigation';
import { normalizar } from '../../shared/utils/paginar';

const sectionOf = (to: string) => NAV_SECTIONS.find((s) => s.items.some((i) => i.to === to))?.title ?? 'Cuenta';

/**
 * Búsqueda de SECCIONES (no de registros): patrón combobox de WAI-ARIA.
 * Ctrl/⌘+K o "/" enfocan el campo; flechas eligen; Enter navega; Escape cierra.
 */
export default function HeaderSearch() {
  const id = useId();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const term = normalizar(query);
  const results = ALL_PAGES.filter((p) => !term || normalizar(`${p.label} ${p.keywords ?? ''} ${sectionOf(p.to)}`).includes(term));
  const activeIndex = Math.min(active, Math.max(0, results.length - 1));

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const go = (to: string) => {
    navigate(to);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      setActive((activeIndex + delta + results.length) % Math.max(results.length, 1));
    } else if (e.key === 'Enter' && open && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex].to);
    } else if (e.key === 'Escape') {
      if (open) setOpen(false);
      else setQuery('');
    }
  };

  const listId = `${id}-list`;
  const showList = open;

  return (
    <div className="header-search">
      <Search size={16} aria-hidden="true" className="header-search__icon" />
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-label="Ir a una sección"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results[activeIndex] ? `${id}-opt-${activeIndex}` : undefined}
        className="header-search__input"
        placeholder="Ir a una sección…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
        autoComplete="off"
        spellCheck={false}
      />
      <kbd className="header-search__kbd" aria-hidden="true">
        Ctrl K
      </kbd>
      <ul id={listId} role="listbox" aria-label="Secciones" className="header-search__list" hidden={!showList}>
        {results.length === 0 && (
          <li className="header-search__empty" role="presentation">
            Ninguna sección coincide con «{query}»
          </li>
        )}
        {results.map((page, i) => (
          <li
            key={page.to}
            id={`${id}-opt-${i}`}
            role="option"
            aria-selected={i === activeIndex}
            className="header-search__option"
            // mousedown (no click): el input no pierde el foco antes de navegar
            onMouseDown={(e) => {
              e.preventDefault();
              go(page.to);
            }}
            onMouseMove={() => setActive(i)}
          >
            <page.icon size={16} aria-hidden="true" />
            <span className="header-search__label">{page.label}</span>
            <span className="header-search__section">{sectionOf(page.to)}</span>
            {i === activeIndex && <CornerDownLeft size={14} aria-hidden="true" className="header-search__enter" />}
          </li>
        ))}
      </ul>
    </div>
  );
}
