import { Puck } from "@puckeditor/core";

export function RightSidebar() {
  return (
    <aside className="flex w-64 flex-shrink-0 flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3 flex-shrink-0">
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          Properties
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-3 text-sm text-slate-700 [&_input]:!rounded-md [&_input]:!border [&_input]:!border-slate-200 [&_input]:!bg-slate-50 [&_input]:!px-2.5 [&_input]:!py-1.5 [&_input]:!text-sm [&_input]:focus:!border-indigo-400 [&_input]:focus:!ring-1 [&_input]:focus:!ring-indigo-200 [&_input]:!outline-none [&_label]:!text-[11px] [&_label]:!font-semibold [&_label]:!uppercase [&_label]:!tracking-wider [&_label]:!text-slate-400">
        <Puck.Fields />
      </div>
    </aside>
  );
}
