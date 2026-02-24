"use client";
import React, { useEffect } from "react";
import { Website } from "../admin/AppShell";
import { WebsitePageModel } from "../admin/website/websitePage/WebsitePageType";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setAllWebsitePages } from "@/hooks/slices/website/websitePageSlice";
import GrapesJSEditor from "../editor";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";
import GetGlobalStyle from "../admin/settings/global-styles/GetGlobalStyle";
import { HeaderDataModel } from "../admin/header/HeaderType";
import { TemplateDocument } from "../admin/templates/TemplateType";
import { setCurrentFooter } from "@/hooks/slices/footer/FooterSlice";
import { setCurrentHeader } from "@/hooks/slices/header/HeaderSlice";
import { setCurrentBusiness } from "@/hooks/slices/business/BusinessSlice";

type WebsiteBuilderProps = {
  pages: WebsitePageModel[];
  website: any;
  search?: { slug: string };
  headerData: HeaderDataModel;
  // footerData: TemplateDocument;
};
const WebsiteBuilder = ({
  pages,
  website,
  search,
  headerData,
}: WebsiteBuilderProps) => {
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const { websitePages } = useSelector((state: RootState) => state.websitePage);
  const { currentHeader } = useSelector((state: RootState) => state.header);
  const { currentFooter } = useSelector((state: RootState) => state.footer);
  // update current website
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (currentBusiness == null && website) {
      dispatch(setCurrentBusiness(website));
    }
  }, [website, currentBusiness, dispatch]);

  // add pages to redux
  useEffect(() => {
    // Set pages to redux if not already set
    if (websitePages.length == 0 && pages.length > 0) {
      dispatch(setAllWebsitePages(pages));
    }

    // Determine which page to set
    if (pages.length > 0) {
      let pageToSet: WebsitePageModel | null = null;

      // If search slug is provided, try to find that page
      if (search?.slug) {
        const foundPage = pages.find((page) => page.slug === search.slug);
        if (foundPage) {
          pageToSet = foundPage;
        } else {
          console.log("no page found for slug:", search.slug);
          // Fallback to first page if slug not found
          pageToSet = pages[0];
        }
      } else {
        // If no search slug, use first page
        pageToSet = pages[0];
      }

      // Set the page if we have one
      if (pageToSet) {
        dispatch(
          setPageEdit({
            page: pageToSet,
            type: "page",
          }),
        );
      }
    } else {
      console.log("no page found");
      dispatch(
        setPageEdit({
          page: pages[0],
          type: "page",
        }),
      );
    }
  }, [websitePages, pages, search, dispatch]);

  // get Header
  useEffect(() => {
    if (currentBusiness && currentHeader == null) {
      dispatch(setCurrentHeader(headerData));
    }
  }, [currentBusiness, currentHeader, dispatch]);


  return (
    <>
      <GetGlobalStyle />
      <GrapesJSEditor />
    </>
  );
};

export default WebsiteBuilder;
