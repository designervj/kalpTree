import { Button } from "@/components/ui/button";
import { fetchFooters } from "@/hooks/slices/footer/FooterThunk";
import { AppDispatch, RootState } from "@/store/store";
import { Layout, Trash2 } from "lucide-react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TemplateDocument } from "../templates/TemplateType";
import { setPageEdit } from "@/hooks/slices/pageEditSlice";

const GetWebsiteFooter = () => {
  const { currentFooter, hasFetched } = useSelector(
    (state: RootState) => state.footer,
  );
  const { currentBusiness } = useSelector((state: RootState) => state.business);

  const dispatch = useDispatch<AppDispatch>();

  // fetch the current footer based on tenantId
  useEffect(() => {
    if (
      currentFooter == null &&
      currentBusiness &&
      currentBusiness._id &&
      currentBusiness.tenantId
    ) {
      dispatch(fetchFooters({ tenantId: currentBusiness._id }));
    }
  }, [currentFooter, currentBusiness]);

  const handleBuilderEdit = async (footer: TemplateDocument) => {
    dispatch(
      setPageEdit({
        page: footer,
        type: "footer",
      }),
    );

    //  router.push(`/${copied.slug}`);
    window.open(
      `/footer?id=${footer._id}&websiteId=${footer.websiteId}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleDelete = () => {
    // Add your delete logic here
    console.log("Delete clicked");
  };

  return (
    <div>
      {!hasFetched && (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}
      {hasFetched &&
        currentFooter &&
        currentFooter._id &&
        currentFooter._id.toString() &&
        currentFooter.content ? (
        <div className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
          {/* Header with action buttons */}
          <div className="flex items-center justify-between gap-2 p-2 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-700 flex-1 text-center">
              Website Footer
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-green-500 hover:text-green-700 hover:bg-green-50"
                onClick={() => handleBuilderEdit(currentFooter)}
                title="Builder"
              >
                <Layout className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Footer content */}
          <div key={currentFooter._id.toString()} className="p-4">
            <div
              dangerouslySetInnerHTML={{
                __html: currentFooter.content.replace(/\\n/g, ""),
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">No Footer link with this website</p>
        </div>
      )}
    </div>
  );
};

export default GetWebsiteFooter;
