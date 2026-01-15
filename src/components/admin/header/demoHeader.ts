export const headerData = {
    id: "header-demo-001",
    slug: "header",
    tenantId: "your-tenant-id",
    content: `
    <div class="font-sans bg-gray-800 p-5 text-white">
      <h1 class="text-center mb-8 text-white text-3xl font-bold">Header Format Types</h1>
      
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <!-- Type 1: Simple Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div>
              <div class="text-sm font-medium text-gray-200">PORTS</div>
              <div class="text-xs text-gray-400">Invoice 3 - Shop 01</div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Simple header with title and subtitle</div>
        </div>

        <!-- Type 2: Header with Success Badge -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-gray-200">PORTS</div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-green-500 text-white">✓ Active</span>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with success status badge</div>
        </div>

        <!-- Type 3: Header with Error Badge -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-gray-200">PORTS</div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-red-500 text-white">✕ Error</span>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with error status badge</div>
        </div>

        <!-- Type 4: Header with Blue Action -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-br from-sky-500 to-sky-700 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-white">PORTS</div>
            <button class="bg-white/20 border border-white/30 px-3 py-1.5 rounded-md text-white text-xs cursor-pointer transition-all hover:bg-white/30 hover:-translate-y-0.5">View Details</button>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with blue gradient and action button</div>
        </div>

        <!-- Type 5: Header with Pink Action -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-br from-pink-500 to-pink-700 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-white">PORTS</div>
            <button class="bg-white/20 border border-white/30 px-3 py-1.5 rounded-md text-white text-xs cursor-pointer transition-all hover:bg-white/30 hover:-translate-y-0.5">+ Add New</button>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with pink gradient and add button</div>
        </div>

        <!-- Type 6: Header with Red Action -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-br from-red-500 to-red-700 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-white">PORTS</div>
            <button class="bg-white/20 border border-white/30 px-3 py-1.5 rounded-md text-white text-xs cursor-pointer transition-all hover:bg-white/30 hover:-translate-y-0.5">Delete</button>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with red gradient and delete button</div>
        </div>

        <!-- Type 7: Header with Icons -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-gray-200">PORTS</div>
            <div class="flex gap-2">
              <button class="w-7 h-7 rounded-md bg-white/10 border-0 text-gray-200 cursor-pointer flex items-center justify-center transition-all hover:bg-white/20">⚙</button>
              <button class="w-7 h-7 rounded-md bg-white/10 border-0 text-gray-200 cursor-pointer flex items-center justify-center transition-all hover:bg-white/20">⋮</button>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with action icons</div>
        </div>

        <!-- Type 8: Header with Search -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex gap-3 items-center">
            <div class="text-sm font-medium text-gray-200">PORTS</div>
            <input type="text" class="flex-1 bg-white/10 border border-white/20 px-3 py-1.5 rounded-md text-white text-xs placeholder:text-gray-400" placeholder="Search...">
          </div>
          <div class="p-4 text-sm text-gray-300">Header with integrated search</div>
        </div>

        <!-- Type 9: Header with Tabs -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 p-0">
            <div class="flex gap-0">
              <button class="flex-1 px-4 py-3 bg-transparent border-0 text-blue-500 cursor-pointer border-b-2 border-blue-500 transition-all text-xs hover:bg-white/5">Overview</button>
              <button class="flex-1 px-4 py-3 bg-transparent border-0 text-gray-400 cursor-pointer border-b-2 border-transparent transition-all text-xs hover:bg-white/5">Details</button>
              <button class="flex-1 px-4 py-3 bg-transparent border-0 text-gray-400 cursor-pointer border-b-2 border-transparent transition-all text-xs hover:bg-white/5">Settings</button>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with tab navigation</div>
        </div>

        <!-- Type 10: Header with Progress -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3">
            <div class="text-sm font-medium text-gray-200">PORTS</div>
            <div class="text-xs text-gray-400">Loading Services...</div>
            <div class="w-full h-1 bg-white/10 rounded-sm mt-2 overflow-hidden">
              <div class="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-sm transition-all" style="width: 65%"></div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with progress indicator</div>
        </div>

        <!-- Type 11: Header with Warning Badge -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-gray-200">PORTS</div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-amber-500 text-white">⚠ Pending</span>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with warning status badge</div>
        </div>

        <!-- Type 12: Header with Info Badge -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-gray-200">PORTS</div>
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold bg-blue-500 text-white">ℹ Info</span>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with info status badge</div>
        </div>

      </div>
    </div>
  `
};

// Header Template 2: Advanced Navigation Headers
export const headerDataAdvanced = {
    id: "header-demo-002",
    slug: "header-advanced",
    tenantId: "your-tenant-id",
    content: `
    <div class="font-sans bg-gray-800 p-5 text-white">
      <h1 class="text-center mb-8 text-white text-3xl font-bold">Advanced Header Types</h1>
      
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <!-- Type 13: Header with Breadcrumb -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3">
            <div class="text-sm font-medium text-gray-200 mb-2">Dashboard</div>
            <div class="flex items-center gap-2 text-xs text-gray-400">
              <span class="hover:text-blue-400 cursor-pointer">Home</span>
              <span>/</span>
              <span class="hover:text-blue-400 cursor-pointer">Projects</span>
              <span>/</span>
              <span class="text-white">Current</span>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with breadcrumb navigation</div>
        </div>

        <!-- Type 14: Header with Notification Bell -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-white">Notifications</div>
            <div class="relative">
              <button class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">🔔</button>
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center">3</span>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with notification badge</div>
        </div>

        <!-- Type 15: Header with User Avatar -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-gray-200">My Profile</div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <div class="text-xs font-medium text-gray-200">John Doe</div>
                <div class="text-xs text-gray-400">Admin</div>
              </div>
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-sm font-bold">JD</div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with user profile avatar</div>
        </div>

        <!-- Type 16: Header with Dropdown Menu -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-white">Categories</div>
            <button class="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-md hover:bg-white/30 transition-all">
              <span class="text-xs text-white">Select</span>
              <span class="text-white">▼</span>
            </button>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with dropdown selector</div>
        </div>

        <!-- Type 17: Header with Multiple Actions -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-gray-200">Project Manager</div>
            <div class="flex gap-2">
              <button class="px-3 py-1 bg-blue-500 rounded text-xs hover:bg-blue-600 transition-all">Save</button>
              <button class="px-3 py-1 bg-green-500 rounded text-xs hover:bg-green-600 transition-all">Export</button>
              <button class="px-3 py-1 bg-gray-500 rounded text-xs hover:bg-gray-600 transition-all">Cancel</button>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with multiple action buttons</div>
        </div>

        <!-- Type 18: Header with Filter Tags -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3">
            <div class="text-sm font-medium text-gray-200 mb-2">Active Filters</div>
            <div class="flex gap-2 flex-wrap">
              <span class="px-2 py-1 bg-blue-500/30 border border-blue-500 rounded text-xs flex items-center gap-1">
                Status: Active <span class="cursor-pointer hover:text-red-400">✕</span>
              </span>
              <span class="px-2 py-1 bg-green-500/30 border border-green-500 rounded text-xs flex items-center gap-1">
                Type: Premium <span class="cursor-pointer hover:text-red-400">✕</span>
              </span>
              <span class="px-2 py-1 bg-purple-500/30 border border-purple-500 rounded text-xs flex items-center gap-1">
                Date: Today <span class="cursor-pointer hover:text-red-400">✕</span>
              </span>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with removable filter tags</div>
        </div>

        <!-- Type 19: Header with Stats Counter -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-orange-500 to-red-500 px-4 py-3">
            <div class="text-sm font-medium text-white mb-2">Analytics Dashboard</div>
            <div class="flex gap-4">
              <div>
                <div class="text-xs text-white/70">Views</div>
                <div class="text-lg font-bold text-white">1,234</div>
              </div>
              <div>
                <div class="text-xs text-white/70">Clicks</div>
                <div class="text-lg font-bold text-white">567</div>
              </div>
              <div>
                <div class="text-xs text-white/70">Rate</div>
                <div class="text-lg font-bold text-white">46%</div>
              </div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with live statistics</div>
        </div>

        <!-- Type 20: Header with Time Display -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-slate-600 to-slate-800 px-4 py-3 flex justify-between items-center">
            <div>
              <div class="text-sm font-medium text-white">Session Timer</div>
              <div class="text-xs text-gray-300">Active since 10:30 AM</div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-mono font-bold text-green-400">02:45:12</div>
              <div class="text-xs text-gray-400">Elapsed Time</div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Header with timer display</div>
        </div>

      </div>
    </div>
  `
};

// Header Template 3: E-commerce & Shopping Headers
export const headerDataEcommerce = {
    id: "header-demo-003",
    slug: "header-ecommerce",
    tenantId: "your-tenant-id",
    content: `
    <div class="font-sans bg-gray-800 p-5 text-white">
      <h1 class="text-center mb-8 text-white text-3xl font-bold">E-commerce Header Types</h1>
      
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <!-- Type 21: Shopping Cart Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 flex justify-between items-center">
            <div class="text-sm font-medium text-white">Shopping Cart</div>
            <div class="flex items-center gap-3">
              <span class="text-xs bg-white/20 px-2 py-1 rounded">5 items</span>
              <div class="text-lg font-bold">$249.99</div>
              <button class="bg-white text-emerald-600 px-3 py-1 rounded text-xs font-semibold hover:bg-gray-100 transition-all">Checkout</button>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">E-commerce cart header with total</div>
        </div>

        <!-- Type 22: Product Category Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3">
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-200">Electronics</div>
              <span class="text-xs text-gray-400">1,245 products</span>
            </div>
            <div class="flex gap-2 text-xs">
              <button class="px-2 py-1 bg-blue-500 rounded hover:bg-blue-600 transition-all">All</button>
              <button class="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600 transition-all">Phones</button>
              <button class="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600 transition-all">Laptops</button>
              <button class="px-2 py-1 bg-gray-500 rounded hover:bg-gray-600 transition-all">Tablets</button>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Category header with filters</div>
        </div>

        <!-- Type 23: Order Status Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm font-medium text-white">Order #ORD-12345</div>
                <div class="text-xs text-blue-200">Placed on Jan 15, 2026</div>
              </div>
              <span class="px-3 py-1 bg-green-500 rounded-full text-xs font-semibold">Delivered</span>
            </div>
            <div class="mt-2 flex gap-1">
              <div class="flex-1 h-1 bg-green-400 rounded"></div>
              <div class="flex-1 h-1 bg-green-400 rounded"></div>
              <div class="flex-1 h-1 bg-green-400 rounded"></div>
              <div class="flex-1 h-1 bg-green-400 rounded"></div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Order tracking header with progress</div>
        </div>

        <!-- Type 24: Price Range Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3">
            <div class="text-sm font-medium text-gray-200 mb-3">Price Range</div>
            <div class="flex justify-between items-center gap-3">
              <input type="number" placeholder="Min" class="w-20 px-2 py-1 bg-gray-700 border border-gray-500 rounded text-xs text-white">
              <span class="text-gray-400">-</span>
              <input type="number" placeholder="Max" class="w-20 px-2 py-1 bg-gray-700 border border-gray-500 rounded text-xs text-white">
              <button class="px-3 py-1 bg-blue-500 rounded text-xs hover:bg-blue-600 transition-all">Apply</button>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Filter header with price inputs</div>
        </div>

        <!-- Type 25: Wishlist Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-pink-500 to-rose-600 px-4 py-3 flex justify-between items-center">
            <div class="flex items-center gap-2">
              <span class="text-xl">❤️</span>
              <div>
                <div class="text-sm font-medium text-white">My Wishlist</div>
                <div class="text-xs text-pink-100">12 saved items</div>
              </div>
            </div>
            <button class="bg-white/20 px-3 py-1.5 rounded text-xs hover:bg-white/30 transition-all">Share</button>
          </div>
          <div class="p-4 text-sm text-gray-300">Wishlist header with item count</div>
        </div>

        <!-- Type 26: Discount Banner Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 px-4 py-3">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm font-bold text-white">🎉 FLASH SALE</div>
                <div class="text-xs text-white/90">Up to 70% OFF - Limited Time!</div>
              </div>
              <div class="text-right">
                <div class="text-xs text-white/80">Ends in</div>
                <div class="text-sm font-mono font-bold text-white">02:45:30</div>
              </div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Promotional banner with countdown</div>
        </div>

        <!-- Type 27: Inventory Status Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gray-600 px-4 py-3">
            <div class="flex justify-between items-center mb-2">
              <div class="text-sm font-medium text-gray-200">Product Inventory</div>
              <span class="px-2 py-1 bg-orange-500 rounded text-xs font-semibold">Low Stock</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex-1 h-2 bg-gray-700 rounded overflow-hidden">
                <div class="h-full bg-orange-500" style="width: 25%"></div>
              </div>
              <span class="text-xs text-gray-400">25/100</span>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Inventory header with stock level</div>
        </div>

        <!-- Type 28: Review Rating Header -->
        <div class="bg-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3">
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm font-medium text-white">Customer Reviews</div>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex text-yellow-400 text-sm">★★★★★</div>
                  <span class="text-xs text-white/80">4.8 out of 5</span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-white">4.8</div>
                <div class="text-xs text-white/70">2,456 reviews</div>
              </div>
            </div>
          </div>
          <div class="p-4 text-sm text-gray-300">Review header with star rating</div>
        </div>

      </div>
    </div>
  `
};

// Type definition for the data structure
export interface HeaderData {
    id: string;
    slug: string;
    tenantId: string;
    content: string;
}

// Export all templates
export const allHeaderTemplates = [headerData, headerDataAdvanced, headerDataEcommerce];

// Export default
export default headerData;
