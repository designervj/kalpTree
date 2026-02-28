import React from "react";
import HeroSlider from "@/components/puckcomponents/DirectComps/Hero";

export const Hero = {
    render: (props: any) => {
        const { puck } = props;
        return (
            <div style={{ position: "relative" }}>
                {/* Boundary Visualization — Only visible in editor mode */}
                {(puck?.renderMode === "editor" || puck?.isEditing) && (
                    <div style={{
                        position: "absolute",
                        inset: 0,
                        border: "1px dashed rgba(255, 255, 255, 0.3)",
                        pointerEvents: "none",
                        zIndex: 20,
                    }} />
                )}
                <HeroSlider />
            </div>
        );
    },
};
