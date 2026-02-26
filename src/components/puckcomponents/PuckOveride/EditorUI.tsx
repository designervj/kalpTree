import { EditorHeader } from "./HeaderOveride";
import { LeftSidebar } from "./LeftSidebar";
import { Canvas } from "./PuckCanvas";
import { RightSidebar } from "./RightSidebar";

export function EditorUI() {
  return (
    <div className="flex h-screen flex-col bg-slate-100 font-sans antialiased">
      <EditorHeader />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <Canvas />
        <RightSidebar />
      </div>
    </div>
  );
}
