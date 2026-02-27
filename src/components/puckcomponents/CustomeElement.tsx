import { createUsePuck } from "@puckeditor/core";
import { useState, useRef } from "react";
import { toAddInElement } from "./DirectComps/AccordionItem";
import { nanoid } from "@reduxjs/toolkit";

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M9 2a1.5 1.5 0 0 1 2.121 2.121L10 5.242 7.758 3 9 2ZM7 3.758 1.5 9.258V11.5h2.242l5.5-5.5L7 3.758Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <rect
        x="1"
        y="3.5"
        width="7.5"
        height="8.5"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M4 3V2a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <path
        d="M1.5 3.5h10M4.5 3.5V2.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M5.5 6v4M7.5 6v4M2.5 3.5l.7 7.2a1 1 0 0 0 1 .8h4.6a1 1 0 0 0 1-.8l.7-7.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
      <circle cx="6.5" cy="2.5" r="1" fill="currentColor" />
      <circle cx="6.5" cy="6.5" r="1" fill="currentColor" />
      <circle cx="6.5" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}

// ─── Element Row ──────────────────────────────────────────────────────────────

function ElementRow({
  element,
  index,
  handleCopyAccordianItem,
  handleDeleteAccordianItem,
}: {
  element: any;
  index: number;
  handleCopyAccordianItem: (el: any) => void;
  handleDeleteAccordianItem: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const type = element?.type;

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-2 bg-white border border-slate-200 rounded-lg group hover:border-slate-300 transition-all">
      {/* Label */}
      <span className="flex-1 text-[8px] text-slate-700 truncate font-medium">
        {type} - {index + 1}
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Edit */}
        <button
          title="Edit"
          className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <EditIcon />
        </button>

        {/* Duplicate */}
        <button
          onClick={() => handleCopyAccordianItem(element)}
          title="Duplicate"
          className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all"
        >
          <DuplicateIcon />
        </button>

        {/* Delete */}
        <button
          onClick={() => handleDeleteAccordianItem(element.props.id)}
          title="Delete"
          className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <DeleteIcon />
        </button>

        {/* More */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            title="More options"
            className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <MoreIcon />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden min-w-[130px]">
              {[
                { label: "Move Up", icon: "↑" },
                { label: "Move Down", icon: "↓" },
                { label: "Rename", icon: "✎" },
                { label: "Duplicate", icon: "⧉" },
                { label: "Delete", icon: "✕" },
              ].map((item) => (
                <button
                  //   key={item.label}
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 transition-colors text-left"
                >
                  <span className="text-slate-400 w-4">
                    {item.icon || "Major"}
                  </span>
                  {item.label || "Minor"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── ElementsPanel ────────────────────────────────────────────────────────────

export function ElementsPanel() {
  const [collapsed, setCollapsed] = useState(true);

  const puck = createUsePuck();
  const { selectedItem, dispatch, appState } = puck((s) => s);

  const items = selectedItem?.props.content.filter((content: any) => {
    return content.type == "AccordionItem";
  });

  const handleAddAccordianItem = () => {
    const clonedItem = structuredClone(selectedItem);
    const newObject = {
      type: "AccordionItem",
      props: {
        ...toAddInElement,
        id: `AccordionItem-${nanoid()}`,
      },
    };
    clonedItem?.props.content.push(newObject);
    const cloned: any = structuredClone(appState.data);
    const findIndex = cloned.content.findIndex((d: any) => {
      return d.props.id == selectedItem?.props.id;
    });
    cloned.content[findIndex] = clonedItem;
    dispatch({
      type: "setData",
      data: cloned,
    });
  };

  const handleCopyAccordianItem = (el: any) => {
    const clonedItem: any = structuredClone(selectedItem);
    el.props.id = `AccordionItem-${nanoid()}`;
    clonedItem?.props.content.push(el);
    const cloned: any = structuredClone(appState.data);
    const findIndex = cloned.content.findIndex((d: any) => {
      return d.props.id == selectedItem?.props.id;
    });
    cloned.content[findIndex] = clonedItem;
    dispatch({
      type: "setData",
      data: cloned,
    });
  };

  const handleDeleteAccordianItem = (id: string) => {
    const clonedItem: any = structuredClone(selectedItem);
    clonedItem.props.content = clonedItem.props.content.filter(
      (d: any) => d.props.id != id,
    );
    const cloned: any = structuredClone(appState.data);
    const findIndex = cloned.content.findIndex((d: any) => {
      return d.props.id == selectedItem?.props.id;
    });
    cloned.content[findIndex] = clonedItem;
    dispatch({
      type: "setData",
      data: cloned,
    });
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-2 transition-colors"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          className="text-blue-600 flex-shrink-0 transition-transform duration-200"
          style={{ transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)" }}
        >
          <path
            d="M2 4l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-semibold text-blue-600 tracking-wide">
          Elements
        </span>
      </button>

      {!collapsed && (
        <div className="pb-4 border-t border-slate-100 pt-3">
          {/* Element list */}
          <div className="space-y-2 mb-3">
            {items.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
                No elements yet
              </div>
            ) : (
              items.map((el: any, index: number) => (
                <ElementRow
                  key={el.props.id}
                  element={el}
                  index={index}
                  handleCopyAccordianItem={handleCopyAccordianItem}
                  handleDeleteAccordianItem={handleDeleteAccordianItem}
                />
              ))
            )}
          </div>

          {/* Add Element */}
          <button
            onClick={handleAddAccordianItem}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium mb-4 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M6 2v8M2 6h8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            Add Element
          </button>

          {/*  
          <div className="h-px bg-slate-100 mb-3" />


          <button className="w-full py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
            Apply Structure Template
          </button> */}
        </div>
      )}
    </div>
  );
}

// ─── elementsFields config ────────────────────────────────────────────────────

export const elementsFields = {
  type: "custom" as const,
  label: "Elements",
  render: () => {
    return <ElementsPanel />;
  },
};
