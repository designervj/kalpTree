"use client";
import { Website } from "@/components/admin/AppShell";
import { TemplateDocument } from "@/components/admin/templates/TemplateType";
import { WebsitePageModel } from "@/components/admin/website/websitePage/WebsitePageType";
import { IUser } from "@/models/user";
import React, { useEffect } from "react";
import EditButton from "../../EditButton";
import RenderHtml from "./RenderHtml";
import SideBarPannel from "../../../../../components/editBuilder/SideBarPannel";
import EditeBuilderHome from "@/components/editBuilder/EditeBuilderHome";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setCurrentWebsite } from "@/hooks/slices/websites/WebsiteSlice";

import { useRouter } from "next/navigation";
import ComingSoonPage from "@/components/comingsoon/ComingSoonPage";

import { fetchWebsitePages } from "@/hooks/slices/website/WebsitePageThunk";
import { setUser } from "@/hooks/slices/user/userSlice";

type props = {
  html: string;
  headerData: TemplateDocument | null;
  footerData: TemplateDocument | null;
  currentWebsite: Website | null;
  user: IUser | null;
  website: WebsitePageModel | TemplateDocument;
};
const SlugPageHome = ({
  user,
  currentWebsite,
  website,
  html,
  headerData,
  footerData,
}: props) => {
  const router = useRouter();
  const { currentWebsite: currentWebsiteData } = useSelector(
    (state: RootState) => state.websites,
  );
  const { user: userdata } = useSelector((state: RootState) => state.user);
  const { websitePages, hasFetched } = useSelector(
    (state: RootState) => state.websitePage,
  );

  // update current website
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (currentWebsiteData == null && currentWebsite) {
      dispatch(setCurrentWebsite(currentWebsite));
    }
  }, [currentWebsite, currentWebsiteData, dispatch]);

  //get all pages

  useEffect(() => {
    if (
      currentWebsite &&
      currentWebsite.websiteId &&
      websitePages.length == 0 &&
      !hasFetched
    ) {
      dispatch(fetchWebsitePages(currentWebsite.websiteId));
    }
  }, [currentWebsite, websitePages, hasFetched, dispatch]);

  // update the user
  useEffect(() => {
    if (user && userdata === null) {
      dispatch(setUser(user));
    }
  }, [user, dispatch, userdata]);

  return (
    <>
      {currentWebsite && currentWebsite.isComingSoon ? (
        <>
          <ComingSoonPage />
        </>
      ) : (
        <div className="primary-main">
          <EditeBuilderHome />

          {/* <EditButton
            pageData={website}
            currentWebsite={currentWebsite}
            user={user || {}}
            type="page"
          /> */}
          <div className="primary-inner">
            <RenderHtml
              html={html}
              currentWebsite={currentWebsite}
              headerData={headerData || {}}
              footerData={footerData || {}}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default SlugPageHome;
