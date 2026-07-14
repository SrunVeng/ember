import { Inbox } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
      <Inbox className="mx-auto h-10 w-10 text-slate-400" aria-hidden="true" />
      <h2 className="mt-3 text-base font-semibold text-slate-950">{title}</h2>
      {description ? <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{description}</p> : null}
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
