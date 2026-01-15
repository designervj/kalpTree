import { configureStore } from "@reduxjs/toolkit";
import pageEditReducer from "../hooks/slices/pageEditSlice";
import userSlice from "../hooks/slices/user/userSlice";
import categoryReducer from "../hooks/slices/category/CategorySlice";
import websitesReducer from "../hooks/slices/websites/WebsiteSlice";
import attributeReducer from "../hooks/slices/attribute/AttributeSlice";
import brandReducer from "../hooks/slices/brand/BrandSlice";
import accountReducer from "../hooks/slices/user/accountSlice";
import productReducer from "../hooks/slices/product/ProductSlice";
import tenantsReducer from "../hooks/slices/tenants/TenantSlice";
import llmSettingReducer from "../hooks/slices/setting/llmSetting/LLMSettingSlice";
import BlockReducer from "../hooks/slices/blocks/BlockSlice";
import websitePageReducer from "../hooks/slices/website/websitePageSlice";
import agencyReducer from "../hooks/slices/user/agencySlice";
import rolePermissionReducer from "../hooks/slices/RolePermissions/rolePermissionSlice";
import businessReducer from "../hooks/slices/business/BusinessSlice";
import templateReducer from "../hooks/slices/templates/TemplateSlice";
import headerReducer from "../hooks/slices/header/HeaderSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    agency: agencyReducer,
    business: businessReducer,
    websites: websitesReducer,
    websitePage: websitePageReducer,
    header: headerReducer,
    pageEdit: pageEditReducer,
    category: categoryReducer,
    brand: brandReducer,
    template: templateReducer,
    attribute: attributeReducer,
    product: productReducer,
   
    tenants: tenantsReducer,
    llmSetting: llmSettingReducer,
    block: BlockReducer,

    rolePermission: rolePermissionReducer,
    account: accountReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
