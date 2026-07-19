import {
  Bot,
  ScanLine,
  SlidersHorizontal,
  Sprout,
  type LucideIcon,
} from "lucide-react";

import {
  navigationItems,
  type SectionId,
} from "../../data/navigation";

type PrimaryNavigationProps = {
  activeSection: SectionId;
};

const sectionIcons: Record<SectionId, LucideIcon> = {
  overview: ScanLine,
  signals: Sprout,
  model: SlidersHorizontal,
  "ai-worklog": Bot,
};

export function PrimaryNavigation({
  activeSection,
}: PrimaryNavigationProps) {
  return (
    <nav aria-label="Основная навигация" className="primary-navigation">
      <ul className="navigation-list">
        {navigationItems.map((item) => {
          const Icon = sectionIcons[item.id];
          const isActive = item.id === activeSection;

          return (
            <li key={item.id}>
              <a
                aria-current={isActive ? "page" : undefined}
                className="navigation-link"
                href={`#${item.id}`}
              >
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
