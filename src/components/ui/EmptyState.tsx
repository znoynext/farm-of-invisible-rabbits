import type { ReactNode } from "react";

import { SignalMark } from "../SignalMark";

type EmptyStateProps = {
  action?: ReactNode;
  description: string;
  eyebrow?: string;
  title: string;
  titleId?: string;
};

export function EmptyState({
  action,
  description,
  eyebrow,
  title,
  titleId,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <SignalMark className="empty-state__mark" />
      <div className="empty-state__copy">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>
      {action ? <div className="empty-state__action">{action}</div> : null}
    </div>
  );
}
