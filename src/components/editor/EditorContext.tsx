"use client";

import React, { createContext, useContext } from "react";
import { useEditor } from "@/hooks/use-editor";

// Define the type of the context value directly based on useEditor's return type
type EditorContextType = ReturnType<typeof useEditor>;

const EditorContext = createContext<EditorContextType | null>(null);

export const EditorProvider = ({
    children,
    editorState,
}: {
    children: React.ReactNode;
    editorState: EditorContextType;
}) => {
    return (
        <EditorContext.Provider value={editorState}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error("useEditorContext must be used within an EditorProvider");
    }
    return context;
};
