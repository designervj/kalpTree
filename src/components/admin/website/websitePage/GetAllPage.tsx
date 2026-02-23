import { fetchWebsitePages } from "@/hooks/slices/website/WebsitePageThunk";
import { AppDispatch, RootState } from "@/store/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const GetAllPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { currentBusiness } = useSelector((state: RootState) => state.business);
  const { hasFetched, websitePages } = useSelector(
    (state: RootState) => state.websitePage,
  );

  useEffect(() => {
    if (
      !hasFetched &&
      websitePages &&
      websitePages.length == 0 &&
      currentBusiness &&
      currentBusiness._id
    ) {
      console.log("fetching pages with website id", currentBusiness._id);
      dispatch(fetchWebsitePages(currentBusiness._id));
    }
  }, [hasFetched, websitePages, currentBusiness]);
  return null;
};

export default GetAllPage;
