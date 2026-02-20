
import { fetchWebsitePages } from "@/hooks/slices/website/WebsitePageThunk";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { currentWebsite } = useSelector((state: RootState) => state.websites);
  const { hasFetched, websitePages } = useSelector(
    (state: RootState) => state.websitePage
  );

  useEffect(() => {
    if (!hasFetched && 
        websitePages && 
        websitePages.length==0&&
        currentWebsite && currentWebsite._id) {
          console.log("fetching pages with website id",currentWebsite._id);
      dispatch(fetchWebsitePages(currentWebsite._id));
    }
  }, [hasFetched, websitePages,currentWebsite]);
  return null;
};

export default GetAllPage;
