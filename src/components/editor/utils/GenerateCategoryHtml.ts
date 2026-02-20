import { ProductModel } from "@/components/admin/product/type/ProductModel";
import { CategoryPageHtmlOptions, FilterAttributeModal } from "@/components/categoryPage/CategoryPage";
import { useMemo } from "react";

/**
 * HTML-escape a string so it is safe to embed in attribute values and text nodes.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}


export function generateCategoryPageHtml(
  products: ProductModel[],
  filters: FilterAttributeModal,
  options: CategoryPageHtmlOptions = {}
): string {

  const {
    categoryTitle = 'New Arrivals',
    heroImageUrl = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop',
    desktopColumns = 3,
    showHero = true,
  } = options;

  // Unique section ID — stable because it is derived from category title
  const sectionId = `cat-page-${categoryTitle.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 24)}`;
  const flagName = `__${sectionId.replace(/-/g, '_')}Loaded`;

  // ── Build filter sidebar HTML ──────────────────────────────────────────────
  const filterGroupsHtml = Object.entries(filters)
    .map(([key, values]) => {
      const groupId = `fg-${key.toLowerCase().replace(/\s+/g, '-')}`;
      const uniqueValues = [...new Set(values)];

      const checkboxesHtml = uniqueValues
        .map(
          (val) => `
        <label class="cp-check-item" data-filter-key="${escapeHtml(key)}" data-filter-value="${escapeHtml(val)}">
          <input type="checkbox" class="cp-filter-checkbox" data-filter-key="${escapeHtml(key)}" data-filter-value="${escapeHtml(val)}">
          <span class="cp-check-label">${escapeHtml(val)}</span>
        </label>`
        )
        .join('');

      return `
      <div class="cp-filter-group" data-group-id="${groupId}">
        <div class="cp-filter-header" data-toggle-target=".${groupId}-content" data-group="${groupId}">
          <h3 class="cp-filter-title">${escapeHtml(key)}</h3>
          <span class="cp-filter-arrow">▲</span>
        </div>
        <div class="cp-filter-content ${groupId}-content">
          ${checkboxesHtml}
        </div>
      </div>`;
    })
    .join('');

  // ── Build product cards HTML ───────────────────────────────────────────────
  const productCardsHtml = products
    .map((product) => {
      console.log(" each product", product)
      // Safely coerce basePrice — the corrected schema stores it as a number,
      // but the field may still arrive as a string from older records.
      const basePriceNum = Number(product.basePrice ?? 0);

      const minPrice =
        product.variants && product.variants.length > 0
          ? Math.min(
            ...product.variants.map((v) => parseFloat(v.price || '0'))
          )
          : basePriceNum;

      const hasSale = basePriceNum > 0 && minPrice < basePriceNum;

      // Collect all attribute values for filter matching.
      // attributeName / value may be undefined on malformed records — guard both.
      const allAttrJson = JSON.stringify(
        (product.variants || []).flatMap((v) =>
          (v.attributes || []).map((a) => ({
            k: a.attributeName ?? '',
            v: a.value ?? '',
          }))
        )
      ).replace(/"/g, '&quot;');

      // Image resolution priority:
      // 1. imageUrls  — set by the admin product creation API (POST /api/admin/product)
      // 2. gallery     — alternative array field used by some older records
      // 3. photo       — legacy single-image field
      const imageUrl =
        product.imageUrls && product.imageUrls.length > 0
          ? product.imageUrls[0]
          : product.gallery && product.gallery.length > 0
            ? product.gallery[0]
            : product.photo
              ? product.photo
              : '';

      const escapedTitle = escapeHtml(product.title ?? '');
      console.log("imageUrl", imageUrl)
      console.log("escapedTitle", escapedTitle)

      return `
      <div class="cp-product-card"
           data-product-id="${escapeHtml(String(product._id ?? ''))}"
           data-price="${basePriceNum.toFixed(2)}"
           data-attrs="${allAttrJson}">
        <div class="cp-img-box">
          ${hasSale ? '<span class="cp-badge-sale">Sale</span>' : ''}
        <div class="cp-img-placeholder"><span>🛍</span></div>
        </div>
        <div class="cp-product-info">
            <h3> ${escapedTitle}</h3>
          <div class="cp-price">
            ${hasSale ? `<span class="cp-old-price">₹${basePriceNum.toFixed(2)}</span>` : ''}
            <span class="cp-new-price">₹${minPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>`;
    })
    .join('');

  const totalProducts = products.length;
  const colClass = desktopColumns === 2 ? 'cp-cols-2' : desktopColumns === 4 ? 'cp-cols-4' : 'cp-cols-3';

  // ── Hero section ──────────────────────────────────────────────────────────
  const heroHtml = showHero
    ? `
  <header class="cp-hero">
    <img src="${escapeHtml(heroImageUrl)}" alt="${escapeHtml(categoryTitle)}" class="cp-hero-bg">
    <div class="cp-hero-overlay"></div>
    <h1 class="cp-hero-title">${escapeHtml(categoryTitle)}</h1>
  </header>`
    : '';

  // ── Full HTML output ───────────────────────────────────────────────────────
  return `
<style>
  /* ── Layout ── */
  #${sectionId} {
    font-family: var(--font-body);
    background-color: var(--bg);
    color: #000000;
    min-height: 100vh;
  }
  #${sectionId} .cp-hero {
    position: relative;
    width: 100%;
    height: 40vh;
    min-height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 0;
  }
  #${sectionId} .cp-hero-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  #${sectionId} .cp-hero-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.25);
  }
  #${sectionId} .cp-hero-title {
    position: relative;
    font-family: var(--font-heading);
    font-size: var(--h1-size);
    font-weight: var(--h1-weight);
    letter-spacing: var(--h1-ls);
    color: #d51a1aff;
    text-transform: uppercase;
    text-shadow: 2px 2px 12px rgba(0,0,0,0.4);
    text-align: center;
    padding: 0 20px;
    margin: 0;
  }

  /* ── Container ── */
  #${sectionId} .cp-container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 var(--container-pad, 5%);
    padding-bottom: 80px;
  }

  /* ── Toolbar ── */
  #${sectionId} .cp-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 20px 0;
    border-bottom: 1px solid var(--border);
    margin-bottom: 28px;
  }
  #${sectionId} .cp-toolbar-left {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
  #${sectionId} .cp-toolbar-right {
    text-align: right;
  }
  #${sectionId} .cp-tool-btn {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 10px 18px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-button);
    outline: none;
    border-radius: var(--radius-sm);
    transition: border-color 200ms, background-color 200ms;
  }
  #${sectionId} .cp-tool-btn:hover {
    border-color: var(--primary);
  }
  #${sectionId} .cp-sort-select {
    appearance: none;
    padding-right: 32px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
  }
  #${sectionId} .cp-product-count {
    font-size: 13px;
    color: var(--muted-text);
    margin-bottom: 4px;
  }
  #${sectionId} .cp-pagination-top {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
  }
  #${sectionId} .cp-pagination-top span {
    cursor: pointer;
    color: var(--muted-text);
    transition: color 160ms;
  }
  #${sectionId} .cp-pagination-top span.active,
  #${sectionId} .cp-pagination-top span:hover {
    color: var(--text);
    text-decoration: underline;
  }

  /* ── Page layout ── */
  #${sectionId} .cp-page-body {
    display: flex;
    gap: 48px;
    align-items: flex-start;
  }

  /* ── Sidebar ── */
  #${sectionId} .cp-sidebar {
    width: 256px;
    flex-shrink: 0;
    position: sticky;
    top: 20px;
  }
  #${sectionId} .cp-sidebar.cp-hidden {
    display: none;
  }
  #${sectionId} .cp-filter-group {
    margin-bottom: 24px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 18px;
  }
  #${sectionId} .cp-filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 8px 0;
    user-select: none;
  }
  #${sectionId} .cp-filter-title {
    font-family: var(--font-heading);
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text);
    margin: 0;
  }
  #${sectionId} .cp-filter-arrow {
    font-size: 11px;
    color: var(--muted-text);
    transition: transform 200ms;
  }
  #${sectionId} .cp-filter-content {
    overflow: hidden;
    max-height: 400px;
    transition: max-height 300ms ease;
  }
  #${sectionId} .cp-filter-content.cp-collapsed {
    max-height: 0;
    overflow: hidden;
  }
  #${sectionId} .cp-check-item {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
    font-size: 13px;
    cursor: pointer;
    color: var(--muted-text);
  }
  #${sectionId} .cp-filter-checkbox {
    accent-color: var(--primary);
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
  #${sectionId} .cp-check-label {
    color: var(--text);
  }

  /* ── Product grid ── */
  #${sectionId} .cp-product-container {
    flex-grow: 1;
    min-width: 0;
  }
  #${sectionId} .cp-product-grid {
    display: grid;
    gap: 36px 22px;
  }
  #${sectionId} .cp-product-grid.cp-cols-2 { grid-template-columns: repeat(2, 1fr); }
  #${sectionId} .cp-product-grid.cp-cols-3 { grid-template-columns: repeat(3, 1fr); }
  #${sectionId} .cp-product-grid.cp-cols-4 { grid-template-columns: repeat(4, 1fr); }

  /* ── Product card ── */
  #${sectionId} .cp-product-card {
    position: relative;
    cursor: pointer;
  }
  #${sectionId} .cp-product-card.cp-hidden-card {
    display: none;
  }
  #${sectionId} .cp-img-box {
    position: relative;
    aspect-ratio: 3/4;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    overflow: hidden;
    margin-bottom: 12px;
  }
  #${sectionId} .cp-product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 600ms ease;
    display: block;
  }
  #${sectionId} .cp-product-card:hover .cp-product-img {
    transform: scale(1.05);
  }
  #${sectionId} .cp-img-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 56px;
    color: var(--muted-text);
    opacity: 0.3;
  }
  #${sectionId} .cp-badge-sale {
    position: absolute;
    top: 10px;
    left: 10px;
    background: var(--primary);
    color: #ce1313ff;
    padding: 3px 10px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-radius: var(--radius-sm);
    z-index: 1;
  }
  #${sectionId} .cp-product-info {
    padding: 0 2px;
  }
  #${sectionId} .cp-stars {
    font-size: 11px;
    color: #f59e0b;
    margin-bottom: 5px;
  }
  #${sectionId} .cp-product-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #${sectionId} .cp-price {
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  #${sectionId} .cp-old-price {
    text-decoration: line-through;
    color: var(--muted-text);
  }
  #${sectionId} .cp-new-price {
    font-weight: 700;
    color: var(--primary);
  }

  /* ── Empty state ── */
  #${sectionId} .cp-empty-state {
    grid-column: 1 / -1;
    text-align: center;
    padding: 60px 20px;
    color: var(--muted-text);
    font-size: 15px;
  }

  /* ── Bottom pagination ── */
  #${sectionId} .cp-pagination-bottom {
    display: flex;
    justify-content: center;
    margin-top: 60px;
    gap: 8px;
  }
  #${sectionId} .cp-page-link {
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 200ms, color 200ms, border-color 200ms;
  }
  #${sectionId} .cp-page-link.active,
  #${sectionId} .cp-page-link:hover {
    background: var(--primary);
    color: #1fc640ff;
    border-color: var(--primary);
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    #${sectionId} .cp-product-grid.cp-cols-4 { grid-template-columns: repeat(3, 1fr); }
    #${sectionId} .cp-product-grid.cp-cols-3 { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    #${sectionId} .cp-page-body { flex-direction: column; }
    #${sectionId} .cp-sidebar { width: 100%; position: static; }
    #${sectionId} .cp-product-grid { grid-template-columns: repeat(2, 1fr); }
    #${sectionId} .cp-toolbar { flex-direction: column; align-items: flex-start; }
    #${sectionId} .cp-toolbar-right { width: 100%; text-align: left; }
  }
  @media (max-width: 480px) {
    #${sectionId} .cp-product-grid { grid-template-columns: 1fr; }
  }
</style>

<section id="${sectionId}" data-gjs-custom-name="Category Page">
  ${heroHtml}

  <div class="cp-container">
    <!-- Toolbar -->
    <div class="cp-toolbar">
      <div class="cp-toolbar-left">
        <button class="cp-tool-btn cp-toggle-sidebar-btn">
          ☰ <span class="cp-filter-btn-text">Hide Filters</span>
        </button>
        <select class="cp-tool-btn cp-sort-select cp-sort-select-el">
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
          <option value="az">Name: A–Z</option>
        </select>
      </div>
      <div class="cp-toolbar-right">
        <div class="cp-product-count cp-count-label">Showing 1–${Math.min(12, totalProducts)} of ${totalProducts} Products</div>
        <div class="cp-pagination-top cp-top-pages"></div>
      </div>
    </div>

    <!-- Body -->
    <div class="cp-page-body">
      <!-- Sidebar -->
      <aside class="cp-sidebar" data-gjs-custom-name="Filter Sidebar">
        ${filterGroupsHtml || '<p style="color:var(--muted-text);font-size:13px;">No filters available.</p>'}
      </aside>

      <!-- Products -->
      <div class="cp-product-container">
        <main class="cp-product-grid ${colClass}" data-gjs-custom-name="Product Grid">
          ${productCardsHtml || '<div class="cp-empty-state">No products found in this category.</div>'}
        </main>

        <!-- Bottom Pagination -->
        <div class="cp-pagination-bottom cp-bottom-pages"></div>
      </div>
    </div>
  </div>
</section>

<script>
(function () {
  if (window.${flagName}) return;
  window.${flagName} = true;

  const root = document.querySelector('#${sectionId}');
  if (!root) return;

  // ── Constants ──────────────────────────────────────────────────
  const ITEMS_PER_PAGE = 12;

  // ── State ──────────────────────────────────────────────────────
  let activeFilters = {};   // { [key]: Set<string> }
  let sortMode = 'price-high';
  let currentPage = 1;
  let sidebarVisible = true;

  // ── Helpers ────────────────────────────────────────────────────
  function getAllCards() {
    return Array.from(root.querySelectorAll('.cp-product-card'));
  }

  function cardMatchesFilters(card) {
    const keys = Object.keys(activeFilters);
    if (keys.length === 0) return true;
    let attrsRaw = card.getAttribute('data-attrs') || '[]';
    let attrs;
    try { attrs = JSON.parse(attrsRaw.replace(/&quot;/g, '"')); } catch(e) { attrs = []; }

    return keys.every(function(key) {
      const selectedValues = activeFilters[key];
      if (!selectedValues || selectedValues.size === 0) return true;
      return attrs.some(function(a) {
        return a.k === key && selectedValues.has(String(a.v).trim());
      });
    });
  }

  function sortCards(cards) {
    return cards.slice().sort(function(a, b) {
      const pa = parseFloat(a.getAttribute('data-price') || '0');
      const pb = parseFloat(b.getAttribute('data-price') || '0');
      const ta = (a.querySelector('.cp-product-title') || {}).textContent || '';
      const tb = (b.querySelector('.cp-product-title') || {}).textContent || '';
      if (sortMode === 'price-low') return pa - pb;
      if (sortMode === 'price-high') return pb - pa;
      if (sortMode === 'az') return ta.localeCompare(tb);
      return 0;
    });
  }

  // ── Render ─────────────────────────────────────────────────────
  function render() {
    const allCards = getAllCards();
    const matched = allCards.filter(cardMatchesFilters);
    const sorted  = sortCards(matched);
    const total   = sorted.length;

    currentPage = Math.min(currentPage, Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)));
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIdx   = startIdx + ITEMS_PER_PAGE;
    const pageCards = sorted.slice(startIdx, endIdx);

    // Show / hide cards
    allCards.forEach(function(c) { c.classList.add('cp-hidden-card'); });
    pageCards.forEach(function(c) {
      c.classList.remove('cp-hidden-card');
      const grid = root.querySelector('.cp-product-grid');
      if (grid) grid.appendChild(c);
    });

    // Empty state
    let empty = root.querySelector('.cp-empty-state');
    if (!empty) {
      empty = document.createElement('div');
      empty.className = 'cp-empty-state';
      empty.textContent = 'No products match the selected filters.';
      root.querySelector('.cp-product-grid').appendChild(empty);
    }
    empty.style.display = pageCards.length === 0 ? 'block' : 'none';

    // Count label
    const countEl = root.querySelector('.cp-count-label');
    if (countEl) {
      const from = total === 0 ? 0 : startIdx + 1;
      const to   = Math.min(endIdx, total);
      countEl.textContent = 'Showing ' + from + '–' + to + ' of ' + total + ' Products';
    }

    // Pagination
    renderPagination(total);
  }

  function renderPagination(total) {
    const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
    const containers = [
      root.querySelector('.cp-top-pages'),
      root.querySelector('.cp-bottom-pages'),
    ];

    containers.forEach(function(container) {
      if (!container) return;
      container.innerHTML = '';

      // Build page numbers
      const pages = buildPageList(currentPage, totalPages);
      pages.forEach(function(p) {
        const el = document.createElement('span');
        el.textContent = String(p);
        if (p === currentPage) el.className = 'active';
        if (typeof p === 'number') {
          el.style.cursor = 'pointer';
          el.addEventListener('click', function() {
            currentPage = p;
            render();
            root.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
          // Also apply as page-link style for bottom nav
          if (container.classList.contains('cp-bottom-pages')) {
            el.className = 'cp-page-link' + (p === currentPage ? ' active' : '');
          }
        } else {
          el.style.cursor = 'default';
        }
        container.appendChild(el);
      });
    });
  }

  function buildPageList(current, total) {
    if (total <= 7) {
      var arr = [];
      for (var i = 1; i <= total; i++) arr.push(i);
      return arr;
    }
    if (current <= 3) return [1, 2, 3, 4, '…', total];
    if (current >= total - 2) return [1, '…', total-3, total-2, total-1, total];
    return [1, '…', current-1, current, current+1, '…', total];
  }

  // ── Filter accordion toggle ────────────────────────────────────
  root.querySelectorAll('.cp-filter-header').forEach(function(header) {
    header.addEventListener('click', function() {
      const group = header.closest('.cp-filter-group');
      if (!group) return;
      const content = group.querySelector('.cp-filter-content');
      const arrow   = header.querySelector('.cp-filter-arrow');
      if (!content) return;
      content.classList.toggle('cp-collapsed');
      if (arrow) arrow.textContent = content.classList.contains('cp-collapsed') ? '▼' : '▲';
    });
  });

  // ── Filter checkbox change ─────────────────────────────────────
  root.querySelectorAll('.cp-filter-checkbox').forEach(function(cb) {
    cb.addEventListener('change', function() {
      const key = cb.getAttribute('data-filter-key');
      const val = String(cb.getAttribute('data-filter-value')).trim();
      if (!activeFilters[key]) activeFilters[key] = new Set();
      if (cb.checked) {
        activeFilters[key].add(val);
      } else {
        activeFilters[key].delete(val);
        if (activeFilters[key].size === 0) delete activeFilters[key];
      }
      currentPage = 1;
      render();
    });
  });

  // ── Sort change ────────────────────────────────────────────────
  const sortEl = root.querySelector('.cp-sort-select-el');
  if (sortEl) {
    sortEl.addEventListener('change', function() {
      sortMode = sortEl.value;
      currentPage = 1;
      render();
    });
  }

  // ── Toggle sidebar ─────────────────────────────────────────────
  const toggleBtn = root.querySelector('.cp-toggle-sidebar-btn');
  const sidebar   = root.querySelector('.cp-sidebar');
  const filterBtnText = root.querySelector('.cp-filter-btn-text');
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebarVisible = !sidebarVisible;
      sidebar.classList.toggle('cp-hidden', !sidebarVisible);
      if (filterBtnText) filterBtnText.textContent = sidebarVisible ? 'Hide Filters' : 'Show Filters';
    });
  }

  // ── Initial render ─────────────────────────────────────────────
  render();
})();
</script>
`.trim();
}
