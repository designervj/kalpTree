import { ProductModel } from "../../type/ProductModel";


export const getSignglePageHtml = (selectedProduct: ProductModel) => {
    if (!selectedProduct) return "";

    const styleHtml = `
    <style>
    :root {
        --black: #333333;
        --gray: #767676;
        --light-gray: #e5e5e5;
        --border: #e5e5e5;
        --sku-bg: #967249;
        --bg: #ffffff;
        --container-width: 1200px;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: "Inter", sans-serif;
        color: var(--black);
        background-color: var(--bg);
        line-height: 1.6;
    }

    .gjs-section {
        padding: 0;
    }

    .gjs-container {
        max-width: var(--container-width);
        margin: 0 auto;
        padding: 0 40px;
    }

        /* --- NAVIGATION --- */
        #inav {
            padding: 15px 0;
            border-bottom: 1px solid var(--light-gray);
            position: sticky;
            top: 0;
            background: #fff;
            z-index: 1000;
        }

        #inavcnt {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-family: "Montserrat";
            letter-spacing: 4px;
            font-size: 1.2rem;
            font-weight: 800;
        }

        .nav-icons {
            display: flex;
            gap: 20px;
            font-size: 1.1rem;
            cursor: pointer;
            color: var(--gray);
        }

        /* --- BREADCRUMBS --- */
        #ibreadcrumbs {
            padding: 20px 0;
        }

        #ibreadcnt {
            font-size: 12px;
            color: var(--gray);
            text-transform: uppercase;
        }

        .breadcrumb-sep {
            margin: 0 10px;
            opacity: 0.5;
        }

        /* --- MAIN PRODUCT LAYOUT --- */
        #iproduct-main {
            padding-bottom: 60px;
        }

        #iproduct-row {
            display: grid;
            grid-template-columns: 1.2fr 0.8fr;
            gap: 60px;
        }

        /* Left: Gallery */
        .gallery-wrap {
            display: flex;
            gap: 15px;
        }

        .thumb-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 80px;
        }

        .thumb-list img {
            width: 100%;
            aspect-ratio: 3/4;
            object-fit: cover;
            cursor: pointer;
            border: 1px solid transparent;
            opacity: 0.6;
        }

        .thumb-list img.active {
            border-color: var(--black);
            opacity: 1;
        }

        .main-view {
            flex-grow: 1;
            position: relative;
            border: 1px solid var(--border);
            overflow: hidden;
        }

        .main-view img {
            width: 100%;
            height: auto;
            display: block;
            transition: 0.5s;
        }

        .main-view:hover img {
            transform: scale(1.05);
        }

        /* Right: Info */
        .sticky-info {
            position: sticky;
            top: 100px;
            height: fit-content;
        }

        .brand-label {
            font-size: 11px;
            font-weight: 700;
            color: var(--gray);
            margin-bottom: 10px;
            display: block;
        }

        .title {
            font-size: 28px;
            margin-bottom: 10px;
            font-weight: 800;
            line-height: 1.2;
        }

        .price {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 20px;
            color: #222;
        }

        .meta-info-row {
            margin-bottom: 25px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            border-top: 1px solid #f0f0f0;
            padding-top: 15px;
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            color: #111;
        }

        .meta-label {
            font-weight: 700;
            color: #333;
        }

        .meta-value {
            color: #6b7280;
        }

        .meta-value a {
            color: #6b7280;
            text-decoration: none;
        }

        .meta-value a:hover {
            text-decoration: underline;
        }

        .meta-value a:not(:last-child)::after {
            content: ", ";
        }

        .selector-title {
            font-size: 13px;
            font-weight: 700;
            text-transform: uppercase;
            margin-bottom: 15px;
            display: block;
        }

        .size-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 35px;
        }

        .size-btn {
            border: 1px solid #d4bda2;
            padding: 10px 15px;
            min-width: 65px;
            text-align: center;
            font-size: 13px;
            cursor: pointer;
            background: #fff;
            border-radius: 5px;
            transition: 0.2s;
            font-weight: 500;
        }

        .size-btn:hover,
        .size-btn.active {
            border-color: var(--sku-bg);
            background: #fdf8f2;
        }

        .action-row {
            display: flex;
            gap: 15px;
            padding: 25px 0;
            border-top: 1px solid #eee;
            border-bottom: 1px solid #eee;
            margin-bottom: 20px;
        }

        .qty-box {
            display: flex;
            border: 1px solid var(--border);
        }

        .qty-box button {
            padding: 10px 18px;
            border: none;
            background: #fff;
            cursor: pointer;
            font-size: 18px;
        }

        .qty-box input {
            width: 45px;
            text-align: center;
            border: none;
            font-weight: 700;
            outline: none;
        }

        .add-cart-btn {
            flex-grow: 1;
            background: var(--black);
            color: #fff;
            border: none;
            padding: 18px;
            font-weight: 700;
            text-transform: uppercase;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        /* --- TABS SECTION --- */
        #itabs {
            padding: 60px 0;
        }

        .tabs-header {
            display: flex;
            gap: 40px;
            border-bottom: 1px solid var(--light-gray);
            margin-bottom: 30px;
            flex-wrap: wrap;
        }

        .tab-trigger {
            padding: 20px 0;
            background: none;
            border: none;
            font-family: "Montserrat";
            font-weight: 700;
            font-size: 13px;
            color: #999;
            cursor: pointer;
            position: relative;
            text-transform: uppercase;
        }

        .tab-trigger.active {
            color: #333;
        }

        .tab-trigger.active::after {
            content: "";
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #333;
        }

        .tab-content {
            display: none;
            color: #555;
            font-size: 15px;
            animation: fadeIn 0.4s;
        }

        .tab-content.active {
            display: block;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }

        .overview-list {
            list-style: none;
            margin-top: 20px;
        }

        .overview-list li {
            margin-bottom: 10px;
            padding-left: 20px;
            position: relative;
        }

        .overview-list li::before {
            content: "•";
            position: absolute;
            left: 0;
            color: var(--gray);
        }

        .guide-flex {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: 40px;
            align-items: center;
        }

        .guide-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .guide-table th,
        .guide-table td {
            padding: 12px;
            border-bottom: 1px solid #eee;
            text-align: center;
        }

        .guide-table th {
            background: #f9f9f9;
            text-transform: uppercase;
            font-size: 12px;
        }

        .info-table {
            width: 100%;
            max-width: 800px;
        }

        .info-row {
            display: flex;
            border-bottom: 1px solid #eee;
            padding: 12px 0;
        }

        .info-label {
            width: 150px;
            font-weight: bold;
            color: #333;
        }

        .info-value {
            flex: 1;
            color: var(--gray);
            font-size: 14px;
        }

        /* --- RELATED --- */
        #irelated {
            padding: 80px 0;
            background: var(--light-gray);
        }

        .section-title-alt {
            font-family: "Montserrat";
            text-align: center;
            text-transform: uppercase;
            letter-spacing: 3px;
            margin-bottom: 40px;
            font-size: 22px;
        }

        .product-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
        }

        .product-card {
            cursor: pointer;
        }

        .product-card img {
            width: 100%;
            aspect-ratio: 3/4;
            object-fit: cover;
            margin-bottom: 15px;
        }

        .product-card h4 {
            font-size: 14px;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .product-card p {
            font-weight: 700;
            font-size: 14px;
        }

        /* --- FOOTER --- */
        #ifooter {
            background: #fcfcfc;
            border-top: 1px solid var(--border);
            padding: 80px 0 0;
        }

        .footer-grid {
            display: grid;
            grid-template-columns: 2fr 1fr 1fr 1.5fr;
            gap: 50px;
            margin-bottom: 60px;
        }

        .footer-col h4 {
            font-size: 13px;
            margin-bottom: 25px;
        }

        .footer-col li {
            list-style: none;
            margin-bottom: 12px;
            font-size: 13px;
            color: var(--gray);
            cursor: pointer;
        }

        .copyright {
            text-align: center;
            font-size: 11px;
            color: var(--gray);
            border-top: 1px solid #ddd;
            padding: 20px 0;
            text-transform: uppercase;
        }

        .gjs-plg-flex-row {
            display: flex;
            flex-direction: row;
        }

        .gjs-plg-flex-column {
            display: flex;
            flex-direction: column;
        }

        @media (max-width: 900px) {
            .gjs-container {
                padding: 0 20px;
            }

            #iproduct-row {
                grid-template-columns: 1fr;
            }

            .guide-flex {
                grid-template-columns: 1fr;
            }

            .footer-grid {
                grid-template-columns: 1fr 1fr;
            }

            .product-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (max-width: 520px) {
            .thumb-list {
                width: 70px;
            }

            .product-grid {
                grid-template-columns: 1fr;
            }

            .footer-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
    `;

    const navgatipnHtml = `
        <section id="inav" class="gjs-section">
            <div id="inavcnt" class="gjs-container">
                <div id="ilogo" class="logo">MILITARY GEAR</div>
                <div id="inavicons" class="nav-icons">
                <i class="fa fa-search"></i>
                <i id="iuser" class="fa fa-user-alt"></i>
                <i id="icart" class="fa fa-shopping-cart"></i>
            </div>
        </div>
    </section>
`;

    const breadcrumbHtml = `
        <section id="ibreadcrumbs" class="gjs-section">
            <div id="ibreadcnt" class="gjs-container">
                <span id="ibread1">Home</span>
                <span class="breadcrumb-sep">/</span>
                <span id="ibread2">${selectedProduct.brand}</span>
            </div>
        </section>
    `;

    const gallletImage = selectedProduct.imageUrls && selectedProduct.imageUrls.length > 0
        ? selectedProduct.imageUrls
        : [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600",
            "https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?w=600"
        ];

    const galleryHtml = gallletImage.map((image, index) => {
        return `
            <img src="${image}" onclick="setMainImg(this.src, this)" id="ithumb${index}" class="${index === 0 ? 'active' : ''}" />
        `;
    }).join("");

    const mainGallery = `
        <div id="imain-view" class="main-view">
            <img id="mainImg" src="${gallletImage[0]}" alt="Product Image" />
        </div>
    `;

    const completgalleryHtml = `
        <div id="igalcol" data-type-role="flex-row" class="gjs-plg-flex-row gallery-wrap">
            <div id="ithumbs" class="thumb-list">
                ${galleryHtml}
            </div>
            ${mainGallery}
        </div>
    `;

    const productInfoHtml = `
        <div id="iinfocol" data-type-role="flex-column" class="gjs-plg-flex-column sticky-info">
            <span id="ibrand-label" class="brand-label">Limited Edition Series</span>
            <h1 id="ititle" class="title gjs-t-h1">${selectedProduct.title || "Jacquard Embroidered Shirt (Propper® Series F4520)"}</h1>
            <div id="iprice" class="price">$124.99</div>

            <div id="imeta" class="meta-info-row">
                <div class="meta-item">
                    <span class="meta-label">SKU:</span>
                    <span id="isku" class="meta-value">${selectedProduct?.variants?.[0]?.sku ?? "N/A"}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Categories:</span>
                    <span id="icats" class="meta-value">
                        <a href="#" class="gjs-t-link">Footwear</a>
                        <a href="#" class="gjs-t-link">Military Boots</a>
                        <a href="#" class="gjs-t-link">Tactical Gear</a>
                    </span>
                </div>
            </div>

            <p id="idesc-short" style="font-size: 14px; color: #555; margin-bottom: 25px;">
                ${selectedProduct.description || "No description available."}
            </p>

            <span id="isize-title" class="selector-title">Select Size:</span>
            <div id="isize-grid" class="size-grid">
                <div class="size-btn active" onclick="selectSize(this)">XS</div>
                <div class="size-btn" onclick="selectSize(this)">S</div>
                <div class="size-btn" onclick="selectSize(this)">M</div>
                <div class="size-btn" onclick="selectSize(this)">L</div>
                <div class="size-btn" onclick="selectSize(this)">XL</div>
                <div class="size-btn" onclick="selectSize(this)">XXL</div>
                    </div>

            <div id="iactions" class="action-row">
                <div class="qty-box">
                    <button onclick="changeQty(-1)">-</button>
                    <input type="text" id="qty" value="1" readonly />
                    <button onclick="changeQty(1)">+</button>
                </div>
                <button id="iadd-cart" class="add-cart-btn gjs-t-button">
                    <i class="fa fa-shopping-cart"></i>
                    ADD TO CART
                </button>
            </div>

            <div id="iwish-share"
                style="display: flex; gap: 20px; color: var(--gray); font-size: 13px; font-weight: 600; cursor: pointer;">
                <span id="iwishlist"><i class="fa-regular fa-heart"></i> ADD TO WISHLIST</span>
                <span id="ishare"><i class="fa fa-share-nodes"></i> SHARE</span>
            </div>
        </div>
`;

    const tabsHtml = `
        <section id="itabs" class="gjs-section">
            <div class="gjs-container">
                <div class="tabs-header">
                    <button class="tab-trigger active" onclick="openTab(event, 'tab-overview')">Overview</button>
                    <button class="tab-trigger" onclick="openTab(event, 'tab-specifications')">Specifications</button>
                    <button class="tab-trigger" onclick="openTab(event, 'tab-size-guide')">Size Guide</button>
                    <button class="tab-trigger" onclick="openTab(event, 'tab-reviews')">Reviews (12)</button>
                        </div>

                <div id="tab-overview" class="tab-content active">
                    <p>Designed for professionals and enthusiasts alike, this piece combines rugged durability with modern aesthetic. Crafted from premium materials that ensure comfort and longevity.</p>
                    <ul class="overview-list">
                        <li>Durable water-repellent (DWR) coating</li>
                        <li>Reinforced stitching at high-stress points</li>
                        <li>Breathable mesh lining for climate control</li>
                        <li>Secure zipper pockets for essential gear</li>
                    </ul>
                </div>

                <div id="tab-specifications" class="tab-content">
                    <div class="info-table">
                        <div class="info-row"><div class="info-label">Material</div><div class="info-value">Ripstop Nylon / Polyester Blend</div></div>
                        <div class="info-row"><div class="info-label">Weight</div><div class="info-value">450g (Size M)</div></div>
                        <div class="info-row"><div class="info-label">Country of Origin</div><div class="info-value">United States</div></div>
                        <div class="info-row"><div class="info-label">Care</div><div class="info-value">Machine wash cold, tumble dry low</div></div>
                    </div>
                </div>

                <div id="tab-size-guide" class="tab-content">
                    <div class="guide-flex">
                        <img src="https://images.unsplash.com/photo-1523381235312-3a1647fa9917?w=500" alt="Size Guide Image" style="width:100%; height:auto;" />
                        <div>
                            <table class="guide-table">
                                <thead><tr><th>Size</th><th>Chest (in)</th><th>Waist (in)</th><th>Sleeve (in)</th></tr></thead>
                                <tbody>
                                    <tr><td>XS</td><td>32-34</td><td>26-28</td><td>31-32</td></tr>
                                    <tr><td>S</td><td>35-37</td><td>29-31</td><td>32-33</td></tr>
                                    <tr><td>M</td><td>38-40</td><td>32-34</td><td>33-34</td></tr>
                                    <tr><td>L</td><td>41-43</td><td>35-37</td><td>34-35</td></tr>
                                    <tr><td>XL</td><td>44-46</td><td>38-40</td><td>35-36</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div id="tab-reviews" class="tab-content">
                    <p>Customer reviews will be displayed here.</p>
                </div>
            </div>
        </section>
    `;

    const relatedProductsHtml = `
        <section id="irelated" class="gjs-section">
            <div class="gjs-container">
                <h3 class="section-title-alt">You May Also Like</h3>
                <div class="product-grid">
                    <div class="product-card">
                        <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" alt="Related Product 1" />
                        <h4>Tactical Runner X1</h4>
                        <p>$89.00</p>
                    </div>
                    <div class="product-card">
                        <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400" alt="Related Product 2" />
                        <h4>Stealth Walker</h4>
                        <p>$115.00</p>
                    </div>
                    <div class="product-card">
                        <img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" alt="Related Product 3" />
                        <h4>Urban Explorer v2</h4>
                        <p>$145.00</p>
                    </div>
                    <div class="product-card">
                        <img src="https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400" alt="Related Product 4" />
                        <h4>Desert Storm Boot</h4>
                        <p>$129.00</p>
                    </div>
                </div>
            </div>
        </section>
    `;

    const productFooterHtml = `
          <footer id="ifooter" class="gjs-section">
            <div class="gjs-container">
                <div id="ifooter-grid" class="footer-grid">
                    <div id="ifoot-col1" class="footer-col">
                        <div id="ifoot-logo" class="logo" style="margin-bottom: 15px;">ESSENTIALS</div>
                        <p id="ifoot-text" style="font-size: 13px; color: var(--gray);">
                            Premium silhouettes designed for the modern individual. Quality, longevity, and sustainability.
                        </p>
                    </div>

                    <div id="ifoot-col2" class="footer-col">
                        <h4 id="ifoot-h1">Customer Support</h4>
                        <ul id="ifoot-list1">
                            <li>Contact Us</li>
                            <li>Shipping &amp; Returns</li>
                            <li>Size Guide</li>
                            <li>Order Tracking</li>
                        </ul>
                    </div>

                    <div id="ifoot-col3" class="footer-col">
                        <h4 id="ifoot-h2">Legal</h4>
                        <ul id="ifoot-list2">
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                            <li>Cookie Policy</li>
                        </ul>
                    </div>

                    <div id="ifoot-col4" class="footer-col">
                        <h4 id="ifoot-h3">Newsletter</h4>
                        <div id="ifoot-form" style="border-bottom: 1px solid #000; display: flex; padding: 5px 0;">
                            <input type="email" placeholder="EMAIL ADDRESS"
                                style="border: none; outline: none; background: none; flex: 1; font-size: 12px;"
                                id="ifoot-email" />
                            <i class="fa fa-arrow-right"></i>
                        </div>
                    </div>
                </div>

                <div id="icopyright" class="copyright">&copy; 2026 Essentials Brand. All rights reserved.</div>
            </div>
        </footer>
    `;

    return `
        ${styleHtml}
        ${navgatipnHtml}
        ${breadcrumbHtml}
        <section id="iproduct-main" class="gjs-section">
            <div class="gjs-container">
                <div id="iproduct-row">
                    ${completgalleryHtml}
                    ${productInfoHtml}
                </div>
            </div>
        </section>
        ${tabsHtml}
        ${relatedProductsHtml}
        ${productFooterHtml}
    `;
};