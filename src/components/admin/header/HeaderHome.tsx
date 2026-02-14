"use client";
import React from "react";
import GetAllHeader from "./GetAllHeader";
import ShowHeader from "./ShowHeader";
import AddHeader from "./AddHeader";
import GetAllWebsiteHeader from "./GetAllWebsiteHeader";

const HeaderHome = () => {
    return (
        <>
            <GetAllHeader/>
            <ShowHeader/>
            <GetAllWebsiteHeader/>           
        </>
  )
}

export default HeaderHome