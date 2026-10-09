import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  panel: ReactNode;
}

type TabsProps = {
  items: TabItem[];
  label: string;
  defaultValue?: string;
};

/**
 * Patrón WAI-ARIA "tabs" con tabindex itinerante: Tab entra a la pestaña activa,
 * las flechas cambian de pestaña y Home/End van a los extremos.
 */
export function Tabs({ items, label, defaultValue }: TabsProps) {
  const baseId = useId();
  const [active, setActive] = useState(defaultValue ?? items[0]?.id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = items.findIndex((t) => t.id === active);
    const go = (i: number) => {
      e.preventDefault();
      const next = (i + items.length) % items.length;
      setActive(items[next].id);
      tabRefs.current[next]?.focus();
    };
    if (e.key === 'ArrowRight') go(index + 1);
    else if (e.key === 'ArrowLeft') go(index - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
  };

  return (
    <div className="tabs">
      <div role="tablist" aria-label={label} className="tabs__list" onKeyDown={onKeyDown}>
        {items.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${tab.id}`}
            aria-selected={tab.id === active}
            aria-controls={`${baseId}-panel-${tab.id}`}
            tabIndex={tab.id === active ? 0 : -1}
            className="tabs__tab"
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {items.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={tab.id !== active}
          tabIndex={0}
          className="tabs__panel"
        >
          {tab.panel}
        </div>
      ))}
    </div>
  );
}
