"use client";
import React, { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchFooterById } from "@/hooks/slices/footer/FooterThunk";
import EditButton from "../(frontend)/(clientpages)/EditButton";
import {
  getAllWebsites,
  getCurrentWebsites,
} from "@/hooks/slices/websites/WebsiteThunk";
import { Website } from "@/components/admin/AppShell";
import { clearPageEdit } from "@/hooks/slices/pageEditSlice";

const FooterContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const websiteId = searchParams.get("websiteId");
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { page, updatePage, type } = useSelector(
    (state: RootState) => state.pageEdit,
  );
  const { currentWebsite } = useSelector((state: RootState) => state.websites);

  useEffect(() => {
    // Only fetch footer if page is null OR if type is not 'header'
    if (id && (page == null || type !== "footer")) {
      dispatch(fetchFooterById({ id }));
    }
  }, [id, page, type, dispatch]);

  const currentPage = useMemo(() => {
    return page;
  }, [page]);

  useEffect(() => {
    if (websiteId && currentWebsite == null) {
      dispatch(getCurrentWebsites({ id: websiteId }));
    }
  }, [websiteId, currentWebsite, dispatch]);

  return (
    <>
      {page && (
        <>
          <EditButton
            pageData={page}
            currentWebsite={currentWebsite as Website}
            user={user as any}
            type="footer"
          />
          {currentPage && currentPage.content && (
            <div key={currentPage._id?.toString()} className="p-4">
              <div
                dangerouslySetInnerHTML={{
                  __html: currentPage.content.replace(/\\n/g, "") || "",
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default FooterContent;
