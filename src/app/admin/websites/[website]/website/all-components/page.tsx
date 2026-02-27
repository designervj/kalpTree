"use client";

import { ColorPicker } from "@/components/editor/color-picker/color-picker";
import React from "react";

const AllComponentsPage = () => {
    return (
        <div>
            <h1 className="font-semibold mb-2">Color Picker:- </h1>
             <ColorPicker color="#000000" onChange={(color) => console.log(color)} />
        </div>



    );
};

export default AllComponentsPage;
