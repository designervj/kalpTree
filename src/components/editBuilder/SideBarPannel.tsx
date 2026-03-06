import React from 'react'
// icons
import {
    ChevronDown,
    ChevronRight,
    Search,
    CheckCircle2,
    Plus,
    LayoutGrid,
    Palette,
    Sparkles,
    ShoppingCart,
    MoreHorizontal,
    MessageSquare,
    Home,
    FileText,
    Store,
    Shield,
    File,
    X,
    Pencil,
    Settings,
    Image as ImageIcon,
    ShoppingBag,
    UserPlus,
    Wrench,
} from "lucide-react";
import { Separator } from '@/components/ui/separator';

const HEADER_H = 40;
const RAIL_W = 92;
const PANEL_W = 360;

type SidebarKey =
    | "setup"
    | "elements"
    | "pages"
    | "styles"
    | "ai"
    | "store"
    | "seo"
    | "more"
    | "feedback";

type RailItem = {
    key: SidebarKey;
    label: string;
    icon: React.ReactNode;
};

type DividerItem = {
    key: "divider";
};

const SideBarPannel = ({ children }: { children?: React.ReactNode }) => {
    const [openKey, setOpenKey] = React.useState<SidebarKey | null>("seo");

    const contentLeft = RAIL_W + (openKey ? PANEL_W : 0);

    const railItems: (RailItem | DividerItem)[] = [
        { key: "setup", label: "Setup", icon: <CheckCircle2 className="h-5 w-5" /> },
        { key: "elements", label: "Elements", icon: <Plus className="h-5 w-5" /> },
        { key: "pages", label: "Pages", icon: <LayoutGrid className="h-5 w-5" /> },
        { key: "styles", label: "Styles", icon: <Palette className="h-5 w-5" /> },
        { key: "ai", label: "AI tools", icon: <Sparkles className="h-5 w-5" /> },
        { key: "divider" },
        { key: "store", label: "Store", icon: <ShoppingCart className="h-5 w-5" /> },
        { key: "seo", label: "SEO", icon: <Search className="h-5 w-5" /> },
        { key: "more", label: "More", icon: <MoreHorizontal className="h-5 w-5" /> },
    ];

    return (
        <>

            {/* Content wrapper with offset for sidebar */}
            <div
                style={{
                    marginLeft: `${contentLeft}px`,
                    transition: 'margin-left 300ms ease-in-out',
                }}
            >
                {children}
            </div>
        </>
    )
}

export default SideBarPannel

function RailButton({
    label,
    icon,
    active,
    onClick,
}: {
    label: string;
    icon: React.ReactNode;
    active?: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "w-full",
                "flex flex-col items-center justify-center",
                "gap-1.5",
                "px-2 py-3",
                "rounded-xl",
                "transition-colors",
                active ? "bg-violet-50" : "hover:bg-slate-50",
            ].join(" ")}
            style={{ paddingTop: "5px", paddingBottom: "10px" }}
        >
            <div
                className={[
                    "h-10 w-10 rounded-full",
                    "flex items-center justify-center",
                    active ? "bg-violet-100 text-violet-700" : "bg-slate-100 text-slate-700",
                ].join(" ")}
            >
                {icon}
            </div>
            <div className={["text-[12px] font-medium leading-none", active ? "text-violet-700" : "text-slate-700"].join(" ")}>
                {label}
            </div>
        </button>
    );
}

function PanelContent({ panelKey }: { panelKey: SidebarKey }) {
    const content: Record<SidebarKey, React.ReactNode> = {
        setup: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Getting Started</h3>
                    <p className="text-sm text-slate-600">Configure your site settings and preferences.</p>
                </div>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Settings className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Site Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Wrench className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Configuration</span>
                    </button>
                </div>
            </div>
        ),
        elements: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Add Elements</h3>
                    <p className="text-sm text-slate-600">Drag and drop elements to build your page.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-colors">
                        <FileText className="h-6 w-6 text-slate-600" />
                        <span className="text-xs font-medium text-slate-700">Text</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-colors">
                        <ImageIcon className="h-6 w-6 text-slate-600" />
                        <span className="text-xs font-medium text-slate-700">Image</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-colors">
                        <LayoutGrid className="h-6 w-6 text-slate-600" />
                        <span className="text-xs font-medium text-slate-700">Grid</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-4 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 transition-colors">
                        <ShoppingBag className="h-6 w-6 text-slate-600" />
                        <span className="text-xs font-medium text-slate-700">Product</span>
                    </button>
                </div>
            </div>
        ),
        pages: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Pages</h3>
                    <p className="text-sm text-slate-600">Manage your site pages.</p>
                </div>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Home className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Home</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <File className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">About</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <ShoppingCart className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Shop</span>
                    </button>
                </div>
                <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50 transition-colors">
                    <Plus className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Add New Page</span>
                </button>
            </div>
        ),
        styles: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Styles</h3>
                    <p className="text-sm text-slate-600">Customize your site's appearance.</p>
                </div>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Palette className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Colors</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <FileText className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Typography</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <LayoutGrid className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Layout</span>
                    </button>
                </div>
            </div>
        ),
        ai: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">AI Tools</h3>
                    <p className="text-sm text-slate-600">Use AI to enhance your content.</p>
                </div>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-colors text-left border border-violet-200">
                        <Sparkles className="h-5 w-5 text-violet-600" />
                        <span className="text-sm font-medium text-slate-700">Generate Content</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Pencil className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Improve Writing</span>
                    </button>
                </div>
            </div>
        ),
        store: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Store</h3>
                    <p className="text-sm text-slate-600">Manage your online store.</p>
                </div>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <ShoppingBag className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Products</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <ShoppingCart className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Orders</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <UserPlus className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Customers</span>
                    </button>
                </div>
            </div>
        ),
        seo: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">SEO Settings</h3>
                    <p className="text-sm text-slate-600">Optimize your site for search engines.</p>
                </div>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Search className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Meta Tags</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <FileText className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Sitemap</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Shield className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Schema Markup</span>
                    </button>
                </div>
            </div>
        ),
        more: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">More Options</h3>
                    <p className="text-sm text-slate-600">Additional tools and settings.</p>
                </div>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Settings className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Advanced Settings</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors text-left">
                        <Wrench className="h-5 w-5 text-slate-600" />
                        <span className="text-sm font-medium text-slate-700">Integrations</span>
                    </button>
                </div>
            </div>
        ),
        feedback: (
            <div className="space-y-4">
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-900">Feedback</h3>
                    <p className="text-sm text-slate-600">We'd love to hear from you!</p>
                </div>
                <div className="space-y-3">
                    <textarea
                        className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        rows={6}
                        placeholder="Share your thoughts, suggestions, or report issues..."
                    />
                    <button className="w-full px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors font-medium">
                        Send Feedback
                    </button>
                </div>
            </div>
        ),
    };

    return content[panelKey] || null;
}