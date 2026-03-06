import { GalleryConfig, Product } from "../ProductGalleryPage";

/**
 * Generates a grid-style HTML gallery layout
 * Products are displayed in a responsive grid with all items visible at once
 */
export const generateGridGalleryHTML = (
  heading: string,
  subheading: string,
  description: string,
  products: Product[],
  config: GalleryConfig,
): string => {
  const columns = config.columns || 3;
  const gap = config.gap || 20;

  const productCards = products
    .map(
      (product) => `
<div class="grid-item" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
  <div style="position: relative;">
    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 280px; object-fit: cover;" />
    ${config.showBadge && product.badge ? `< span style = "position: absolute; top: 12px; right: 12px; background: #ef4444; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;" >${product.badge} </span>` : ""}
</div>
  < div style = "padding: 20px;" >
    <h3 pro - hint="price" style = "font-size: 18px; font-weight: 700; margin: 0 0 6px 0; color: #1f2937;" >${product.name} </h3>
    ${product.category ? `<p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">${product.category}</p>` : ""}
    ${config.showDescription && product.description ? `<p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">${product.description}</p>` : ""}
    ${config.showPrice ? `<p style="font-size: 22px; font-weight: 700; color: #059669; margin: 0;">$${product.price}</p>` : ""}
</div>
  </div>`,
    )
    .join("");

  return `
  <body>
<section class="product-gallery-grid" style="width: 100%; padding: 40px 20px;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 36px; font-weight: 800; color: #1f2937; margin: 0 0 12px 0;">${heading}</h1>
      ${subheading ? `< h2 style = "font-size: 20px; font-weight: 500; color: #6b7280; margin: 0 0 16px 0;" >${subheading} </h2>` : ""}
      ${description ? `<p style="font-size: 16px; color: #4b5563; line-height: 1.6; max-width: 700px; margin: 0 auto;">${description}</p>` : ""}
</div>
  < div class="grid-container" style = "display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${gap}px;" >
      ${productCards}
</div>
  </div>

  </section>
<style>
    .grid - item:hover {
  transform: translateY(-8px);
  box - shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
@media(max - width: 1024px) {
      .grid - container {
    grid - template - columns: repeat(2, 1fr)!important;
  }
}
@media(max - width: 640px) {
      .grid - container {
    grid - template - columns: 1fr!important;
  }
}
</style>
  </body>`;
};

/**
 * Generates a carousel-style HTML gallery layout
 * Products are displayed one at a time with navigation controls
 */
export const generateCarouselGalleryHTML = (
  heading: string,
  subheading: string,
  description: string,
  products: Product[],
  config: GalleryConfig,
): string => {
  const productCards = products
    .map(
      (product, index) => `
<div class="gallery-item" data-index="${product.id}" style="display: ${index === 0 ? "block" : "none"}">
  <div class="product-card" style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto;">
    <div style="position: relative;">
      <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 400px; object-fit: cover;" />
      ${config.showBadge && product.badge ? `< span style = "position: absolute; top: 16px; right: 16px; background: #ef4444; color: white; padding: 6px 12px; border-radius: 6px; font-size: 14px; font-weight: 600;" >${product.badge} </span>` : ""}
</div>
  < div style = "padding: 24px;" >
    <h3 pro - hint="price" style = "font-size: 24px; font-weight: 700; margin: 0 0 8px 0; color: #1f2937;" >${product.name} </h3>
      ${product.category ? `<p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">${product.category}</p>` : ""}
      ${config.showDescription && product.description ? `<p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">${product.description}</p>` : ""}
      ${config.showPrice ? `<p style="font-size: 28px; font-weight: 700; color: #059669; margin: 0;">$${product.price}</p>` : ""}
</div>
  </div>
  </div>`,
    )
    .join("");

  return `
  <body>
<section class="product-gallery-carousel" style="width: 100%; padding: 40px 20px;">
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 36px; font-weight: 800; color: #1f2937; margin: 0 0 12px 0;">${heading}</h1>
      ${subheading ? `< h2 style = "font-size: 20px; font-weight: 500; color: #6b7280; margin: 0 0 16px 0;" >${subheading} </h2>` : ""}
      ${description ? `<p style="font-size: 16px; color: #4b5563; line-height: 1.6; max-width: 600px; margin: 0 auto;">${description}</p>` : ""}
</div>
  < div class="gallery-items" style = "position: relative; min-height: 500px;" >${productCards} </div>
    < div style = "display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 30px;" >
      <button id="prevBtn" style = "background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;" > Previous </button>
        < div style = "font-size: 16px; font-weight: 600; color: #1f2937;" > <span id="currentIndex" > 1 < /span> / ${products.length} </div>
          < button id = "nextBtn" style = "background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; transition: all 0.3s;" > Next </button>
            </div>
            </div>

            </section>
              <script>
              (function () {
                let currentIndex = 0;
                const totalItems = ${products.length};
                const items = document.querySelectorAll('.gallery-item');
                const prevBtn = document.getElementById('prevBtn');
                const nextBtn = document.getElementById('nextBtn');
                const currentIndexEl = document.getElementById('currentIndex');

                function updateGallery(newIndex) {
                  items.forEach(item => {
                    item.style.display = 'none';
                    item.style.opacity = '0';
                  });
                  items[newIndex].style.display = 'block';
                  setTimeout(() => {
                    items[newIndex].style.transition = 'opacity 0.3s ease';
                    items[newIndex].style.opacity = '1';
                  }, 10);
                  currentIndexEl.textContent = newIndex + 1;
                  prevBtn.disabled = newIndex === 0;
                  nextBtn.disabled = newIndex === totalItems - 1;
                  prevBtn.style.opacity = newIndex === 0 ? '0.5' : '1';
                  nextBtn.style.opacity = newIndex === totalItems - 1 ? '0.5' : '1';
                  prevBtn.style.cursor = newIndex === 0 ? 'not-allowed' : 'pointer';
                  nextBtn.style.cursor = newIndex === totalItems - 1 ? 'not-allowed' : 'pointer';
                  currentIndex = newIndex;
                }

                prevBtn.addEventListener('click', () => { if (currentIndex > 0) updateGallery(currentIndex - 1); });
                nextBtn.addEventListener('click', () => { if (currentIndex < totalItems - 1) updateGallery(currentIndex + 1); });

                document.addEventListener('keydown', (e) => {
                  if (e.key === 'ArrowLeft' && currentIndex > 0) {
                    updateGallery(currentIndex - 1);
                  } else if (e.key === 'ArrowRight' && currentIndex < totalItems - 1) {
                    updateGallery(currentIndex + 1);
                  }
                });
              })();
</script>
  </body>`;
};

/**
 * Generates a masonry-style HTML gallery layout
 * Products are displayed in a Pinterest-like grid with varying heights
 */
export const generateMasonryGalleryHTML = (
  heading: string,
  subheading: string,
  description: string,
  products: Product[],
  config: GalleryConfig,
): string => {
  const columns = config.columns || 3;
  const gap = config.gap || 20;

  const productCards = products
    .map(
      (product) => `
<div class="masonry-item" style="break-inside: avoid; margin-bottom: ${gap}px; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.3s ease, box-shadow 0.3s ease;">
  <div style="position: relative;">
    <img src="${product.image}" alt="${product.name}" style="width: 100%; height: auto; object-fit: cover; display: block;" />
    ${config.showBadge && product.badge ? `< span style = "position: absolute; top: 12px; right: 12px; background: #ef4444; color: white; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600;" >${product.badge} </span>` : ""}
</div>
  < div style = "padding: 20px;" >
    <h3 pro - hint="price" style = "font-size: 18px; font-weight: 700; margin: 0 0 6px 0; color: #1f2937;" >${product.name} </h3>
    ${product.category ? `<p style="color: #6b7280; font-size: 13px; margin: 0 0 10px 0;">${product.category}</p>` : ""}
    ${config.showDescription && product.description ? `<p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 12px 0;">${product.description}</p>` : ""}
    ${config.showPrice ? `<p style="font-size: 22px; font-weight: 700; color: #059669; margin: 0;">$${product.price}</p>` : ""}
</div>
  </div>`,
    )
    .join("");

  return `
  <body>
<section class="product-gallery-masonry" style="width: 100%; padding: 40px 20px; background: #f9fafb;">
  <div style="max-width: 1200px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 40px;">
      <h1 style="font-size: 36px; font-weight: 800; color: #1f2937; margin: 0 0 12px 0;">${heading}</h1>
      ${subheading ? `< h2 style = "font-size: 20px; font-weight: 500; color: #6b7280; margin: 0 0 16px 0;" >${subheading} </h2>` : ""}
      ${description ? `<p style="font-size: 16px; color: #4b5563; line-height: 1.6; max-width: 700px; margin: 0 auto;">${description}</p>` : ""}
</div>
  < div class="masonry-container" style = "column-count: ${columns}; column-gap: ${gap}px;" >
      ${productCards}
</div>
  </div>

  </section>
 <style>
    .masonry - item:hover {
  transform: translateY(-4px);
  box - shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}
@media(max - width: 1024px) {
      .masonry - container {
    column - count: 2!important;
  }
}
@media(max - width: 640px) {
      .masonry - container {
    column - count: 1!important;
  }
}
</style>
  </body>`;
};

/**
 * Main gallery HTML generator - intelligently selects layout based on config
 */
export const generateGalleryHTML = (
  heading: string,
  subheading: string,
  description: string,
  products: Product[],
  config: GalleryConfig,
): string => {
  if (config.layout === "carousel") {
    return generateCarouselGalleryHTML(heading, subheading, description, products, config);
  } else if (config.layout === "masonry") {
    return generateMasonryGalleryHTML(heading, subheading, description, products, config);
  } else {
    // Default to grid layout
    return generateGridGalleryHTML(heading, subheading, description, products, config);
  }
};