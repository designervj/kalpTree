export const convertName = (name: string) => {
  const timestamp = Date.now();
  const comp = new Date(timestamp);
  const day = comp.getUTCDate();
  const month = comp.getUTCMonth();
  const year = comp.getUTCFullYear();
  const final = `${day}-${month}-${year}-${timestamp}-${name}`;
  return final;
};

export const demoPages = [
  {
    title: "Home",
     content:`<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vitalmin - Expert Skincare</title>
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        :root {
            --bg-light: #e3f0e1;
            --bg-mid: #d2e1d0;
            --bg-dark-green: #6c9366;
            --accent-green: #5a8254;
            --text-dark: #2c2c2c;
            --text-muted: #555;
            --white: #ffffff;
            --container-width: 1200px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: var(--text-dark);
            background-color: #fff;
            line-height: 1.6;
        }

        h1, h2, h3, .serif {
            font-family: 'Playfair Display', serif;
        }

        .container {
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 0 20px;
        }

        /* --- Header --- */
        header {
            background-color: var(--bg-light);
            padding: 20px 0;
        }

        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-dark);
        }

        .nav-links {
            display: flex;
            gap: 30px;
        }

        .nav-links a {
            text-decoration: none;
            color: var(--text-muted);
            font-size: 14px;
            font-weight: 500;
        }

        .nav-icons {
            display: flex;
            gap: 20px;
            font-size: 18px;
        }

        /* --- Hero Section --- */
        .hero {
            background-color: var(--bg-light);
            padding: 60px 0 100px 0;
            position: relative;
            overflow: hidden;
        }

        .hero-grid {
            display: grid;
            grid-template-columns: 1fr 1.2fr 1fr;
            align-items: center;
            gap: 20px;
        }

        .step-tag {
            background: #cbdcc9;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            display: inline-block;
            margin-bottom: 20px;
        }

        .hero-title {
            font-size: 36px;
            font-weight: 500;
            line-height: 1.1;
        }

        .hero-title span {
            display: block;
            font-size: 80px;
            font-style: italic;
            margin-top: -10px;
        }

        .hero-desc {
            font-size: 14px;
            color: var(--text-muted);
            max-width: 320px;
            margin: 20px 0;
        }

        .price-row {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 30px 0;
        }

        .price-label { font-size: 18px; font-weight: 500; border-right: 1px solid #ccc; padding-right: 15px;}
        .price-value { font-size: 24px; font-weight: 700; }

        .btn-primary {
            background-color: var(--accent-green);
            color: white;
            padding: 14px 35px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            display: inline-block;
            box-shadow: 0 10px 20px rgba(90, 130, 84, 0.2);
        }

        .btn-link {
            margin-left: 20px;
            text-decoration: underline;
            color: var(--text-dark);
            font-weight: 600;
        }

        /* Hero Center Image */
        .hero-center {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .main-bottle {
            width: 250px;
            z-index: 2;
            filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
        }

        .podium {
            width: 220px;
            height: 120px;
            background: #fff;
            border-radius: 50%;
            margin-top: -60px;
            z-index: 1;
        }

        .succulent {
            position: absolute;
            right: 0;
            bottom: 40px;
            width: 150px;
            z-index: 2;
        }

        /* Hero Right */
        .badge-new {
            width: 100px;
            height: 100px;
            margin-bottom: 30px;
            position: relative;
            animation: rotate 10s linear infinite;
        }

        @keyframes rotate { from {transform: rotate(0deg)} to {transform: rotate(360deg)} }

        .promo-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            width: 140px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.05);
            margin-bottom: 30px;
        }
        .promo-card img { width: 50px; margin-bottom: 10px; }
        .promo-card p { font-weight: 700; font-size: 18px; }

        /* --- Partner Section --- */
        .partners {
            background-color: var(--bg-dark-green);
            color: white;
            padding: 60px 0;
            text-align: center;
        }

        .partners h2 { font-size: 28px; font-weight: 500; margin-bottom: 40px; }

        .logo-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-family: 'Playfair Display', serif;
            font-size: 24px;
            opacity: 0.9;
        }

        /* --- Featured Products --- */
        .featured { padding: 100px 0; }

        .section-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 60px;
        }

        .section-header h2 { font-size: 44px; flex: 1; }
        .section-header p { flex: 1; padding-left: 40px; color: var(--text-muted); font-size: 14px; border-left: 1px solid #ddd; }

        .product-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }

        .feat-card {
            background: #fdfdfd;
            border-radius: 20px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            box-shadow: 0 10px 40px rgba(0,0,0,0.03);
        }

        .feat-card-header {
            background-color: var(--accent-green);
            color: white;
            width: fit-content;
            padding: 10px 30px;
            border-radius: 0 0 15px 0;
            font-size: 14px;
        }

        .feat-content {
            padding: 40px;
            display: flex;
            align-items: center;
        }

        .feat-text { flex: 1.2; }
        .feat-img { flex: 0.8; text-align: right; }
        .feat-img img { width: 100%; max-width: 180px; filter: drop-shadow(0 10px 20px rgba(0,0,0,0.1)); }

        .feat-text h3 { font-size: 24px; margin: 15px 0; font-family: 'Inter', sans-serif; font-weight: 600;}
        .feat-text p { font-size: 13px; color: var(--text-muted); margin-bottom: 30px; }

        .shop-btn-large {
            display: block;
            width: 200px;
            margin: 20px auto 0;
            background: var(--accent-green);
            color: white;
            text-align: center;
            padding: 15px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }

        /* --- About Brand Section --- */
        .about-brand {
            background-color: var(--bg-light);
            padding: 100px 0;
            position: relative;
        }

        .palm-leaf { position: absolute; width: 250px; opacity: 0.6; pointer-events: none; }
        .leaf-top-right { top: 0; right: 0; transform: rotate(180deg); }
        .leaf-bottom-left { bottom: 0; left: 0; }

        .brand-gallery {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-top: 50px;
        }

        .gallery-item img {
            width: 100%;
            height: 350px;
            object-fit: cover;
            border-radius: 10px;
            margin-bottom: 15px;
        }

        .gallery-item p { font-size: 12px; color: var(--text-muted); line-height: 1.4; }

        /* --- Skincare Tips --- */
        .tips { padding: 100px 0; }

        .tip-row {
            display: flex;
            align-items: center;
            gap: 60px;
            margin-bottom: 80px;
        }

        .tip-row.reverse { flex-direction: row-reverse; }

        .tip-text { flex: 1; }
        .tip-img { flex: 1; }
        .tip-img img { width: 100%; border-radius: 15px; }

        .tip-text h3 { font-size: 24px; margin-bottom: 20px; }
        .tip-text p { color: var(--text-muted); margin-bottom: 20px; font-size: 14px;}

        .btn-outline {
            display: block;
            width: 180px;
            margin: 40px auto 0;
            border: 1px solid #ddd;
            padding: 12px;
            text-align: center;
            text-decoration: none;
            color: var(--text-dark);
            border-radius: 8px;
            font-weight: 500;
        }

        /* --- Expert Products --- */
        .expert-products { padding: 100px 0; background: #fff; }

        .prod-carousel {
            display: flex;
            gap: 20px;
            margin-top: 40px;
            overflow-x: auto;
            padding-bottom: 40px;
        }

        .prod-card {
            min-width: 250px;
            flex: 1;
            background: #fdfdfd;
            border: 1px solid #f0f0f0;
            padding: 20px;
            border-radius: 15px;
            text-align: center;
        }

        .prod-card img { height: 180px; object-fit: contain; margin-bottom: 15px; }
        .prod-card h4 { font-size: 16px; margin-bottom: 5px; }
        .prod-card span { font-weight: 700; color: var(--text-dark); display: block; margin-bottom: 15px;}
        .buy-now { color: var(--accent-green); text-decoration: underline; font-size: 13px; font-weight: 600; cursor: pointer;}

        /* --- Newsletter --- */
        .newsletter {
            padding: 60px 0;
            background: white;
        }

        .news-box {
            background: white;
            border: 1px solid #eee;
            padding: 60px;
            border-radius: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: relative;
        }

        .news-input-wrap {
            display: flex;
            border: 1px solid #ddd;
            border-radius: 10px;
            overflow: hidden;
            width: 450px;
        }

        .news-input-wrap input {
            border: none;
            padding: 15px 20px;
            flex: 1;
            outline: none;
        }

        .news-input-wrap button {
            background: var(--text-dark);
            color: white;
            border: none;
            padding: 0 30px;
            cursor: pointer;
            font-weight: 600;
        }

        /* --- Footer --- */
        footer {
            background: #333;
            color: #888;
            padding: 60px 0 20px;
        }

        .footer-top {
            display: flex;
            justify-content: space-between;
            padding-bottom: 40px;
            border-bottom: 1px solid #444;
        }

        .footer-logo { color: white; font-size: 22px; font-weight: 700; }
        .footer-links a { color: #888; text-decoration: none; margin-left: 25px; font-size: 13px; }
        .footer-socials i { margin-left: 20px; color: white; cursor: pointer; }

        .copyright { text-align: center; padding-top: 20px; font-size: 12px; }

        /* Responsive Mobile */
        @media (max-width: 992px) {
            .hero-grid { grid-template-columns: 1fr; text-align: center; }
            .hero-title span { font-size: 60px; }
            .hero-desc { margin: 20px auto; }
            .price-row { justify-content: center; }
            .hero-center { margin: 50px 0; }
            .section-header { flex-direction: column; gap: 20px; }
            .section-header p { padding: 0; border: none; }
            .product-grid, .brand-gallery, .tip-row { grid-template-columns: 1fr; display: block; }
            .tip-row { margin-bottom: 40px; }
            .news-box { flex-direction: column; gap: 30px; text-align: center; }
            .news-input-wrap { width: 100%; }
        }
    </style>
</head>
<body>

    <!-- Header -->
    <header>
        <div class="container">
            <nav>
                <div class="logo">Vitalmin</div>
                <div class="nav-links">
                    <a href="#">Product</a>
                    <a href="#">Features</a>
                    <a href="#">Reviews</a>
                    <a href="#">About us</a>
                </div>
                <div class="nav-icons">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <i class="fa-solid fa-cart-shopping"></i>
                    <i class="fa-regular fa-user"></i>
                </div>
            </nav>
        </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <div class="hero-grid">
                <!-- Left -->
                <div class="hero-left">
                    <span class="step-tag">01</span>
                    <h1 class="hero-title">
                        Unlock Your Skin's Natural
                        <span>Beauty</span>
                    </h1>
                    <p class="hero-desc">Welcome to the world of Vitalmin Skincare, where we believe that beauty starts with healthy, radiant skin. Our mission is simple yet transformative.</p>
                    <div class="price-row">
                        <span class="price-label">Price</span>
                        <span class="price-value">$39.99</span>
                    </div>
                    <div>
                        <a href="#" class="btn-primary">Shop Now</a>
                        <a href="#" class="btn-link">Learn More</a>
                    </div>
                </div>

                <!-- Center -->
                <div class="hero-center">
                    <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600" alt="Serum Bottle" class="main-bottle">
                    <div class="podium"></div>
                    <img src="https://images.unsplash.com/photo-1509423350716-97f9360b4e09?auto=format&fit=crop&q=80&w=400" alt="Plant" class="succulent">
                </div>

                <!-- Right -->
                <div class="hero-right">
                    <img src="https://cdn-icons-png.flaticon.com/512/8146/8146003.png" alt="New Badge" class="badge-new">
                    <div class="promo-card">
                        <img src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=100" alt="Mini Product">
                        <p>$49.99</p>
                    </div>
                    <div style="font-size: 14px;">
                        <h4 style="margin-bottom: 5px;">What we offer</h4>
                        <p style="color: var(--text-muted); margin-bottom: 10px;">Our Serums Offer You Not Just Skincare, But An Experience.</p>
                        <a href="#" style="color: black; font-weight: 600;">Explore More &rarr;</a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Partners -->
    <section class="partners">
        <div class="container">
            <h2>Joining with industry leaders.</h2>
            <div class="logo-row">
                <span>Dove</span>
                <span>L'ORÉAL</span>
                <span>NIVEA</span>
                <span>Garnier</span>
                <span>Avon</span>
            </div>
        </div>
    </section>

    <!-- Featured Products -->
    <section class="featured">
        <div class="container">
            <div class="section-header">
                <h2>Featured Products</h2>
                <p>Our featured collection showcases the best of our skincare expertise, designed to address a variety of skin concerns and deliver exceptional results. Each crafted to elevate your skincare routine.</p>
            </div>

            <div class="product-grid">
                <!-- Serum Card -->
                <div class="feat-card">
                    <div class="feat-card-header">Serums</div>
                    <div class="feat-content">
                        <div class="feat-text">
                            <h3>Vitality Serum</h3>
                            <p>Welcome to the world of Vitalmin Skincare, where we believe beauty starts with radiant skin. Simple yet transformative.</p>
                        </div>
                        <div class="feat-img">
                            <img src="https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=400" alt="Serum">
                        </div>
                    </div>
                </div>

                <!-- Oil Card -->
                <div class="feat-card" style="background-color: #f1f8f0;">
                    <div class="feat-card-header">Oils</div>
                    <div class="feat-content">
                        <div class="feat-text">
                            <h3>Natural Glow Oil</h3>
                            <p>Oils have emollient properties to support the skin barrier and lock in moisture. Naturally rich in antioxidants.</p>
                        </div>
                        <div class="feat-img">
                            <img src="https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&q=80&w=400" alt="Oil">
                        </div>
                    </div>
                </div>
            </div>
            <a href="#" class="shop-btn-large">Shop Now</a>
        </div>
    </section>

    <!-- About Brand -->
    <section class="about-brand">
        <img src="https://pngimg.com/uploads/palm_leaf/palm_leaf_PNG28.png" class="palm-leaf leaf-top-right">
        <img src="https://pngimg.com/uploads/palm_leaf/palm_leaf_PNG28.png" class="palm-leaf leaf-bottom-left">
        
        <div class="container">
            <div style="max-width: 600px;">
                <span class="step-tag">About Us</span>
                <h2 style="font-size: 40px; margin-bottom: 20px;">About Our Brand</h2>
                <p style="font-size: 14px; color: var(--text-muted);">Welcome to Vitalmin Skincare, where we believe that beauty starts with healthy, radiant skin. Our mission is simple yet transformative: to unlock your skin's natural beauty potential.</p>
            </div>

            <div class="brand-gallery">
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400" alt="Process">
                    <p>Our journey began with a passion for skincare and the belief that everyone deserves high-quality products.</p>
                </div>
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400" alt="Brushes">
                    <p>At Vitalmin, our commitment is to your skin's health and your confidence. We take that responsibility seriously.</p>
                </div>
                <div class="gallery-item">
                    <img src="https://images.unsplash.com/photo-1481325544411-6650b848063e?auto=format&fit=crop&q=80&w=400" alt="Model">
                    <p>Our serums harness the power of science and nature to deliver results. We pair expert advice with cutting-edge tech.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Skincare Tips -->
    <section class="tips">
        <div class="container">
            <div class="section-header">
                <div>
                    <span class="step-tag">Tips</span>
                    <h2>Skincare Tips And Insights</h2>
                </div>
                <p>We believe that achieving beautiful skin goes beyond using our products—it's about understanding your unique needs and nurturing it with care.</p>
            </div>

            <div class="tip-row">
                <div class="tip-text">
                    <h3>1. The Power of Face Serums</h3>
                    <p>Face serums are skincare superheroes that deliver concentrated ingredients to your skin. They're lightweight, fast-absorbing, and can address specific concerns like hydration, anti-aging, or brightening.</p>
                    <img src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=400" style="width: 100%; height: 250px; object-fit: cover; border-radius: 15px;">
                </div>
                <div class="tip-img">
                    <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=600" alt="Model 1">
                </div>
            </div>

            <div class="tip-row reverse">
                <div class="tip-text">
                    <h3>2. The Importance of a Routine</h3>
                    <p>Consistency is key to healthy skin. Establishing a daily routine that includes cleansing, toning, serum application, and moisturizing can make a significant difference in the long-term health and appearance of your skin.</p>
                    <div style="height: 150px; border: 1px solid #eee; border-radius: 15px; padding: 30px;">
                        <i>"Consistency is the key to seeing real transformation in your skin health."</i>
                    </div>
                </div>
                <div class="tip-img">
                    <img src="https://images.unsplash.com/photo-1591130901618-3f31f2a104e7?auto=format&fit=crop&q=80&w=600" alt="Model 2">
                </div>
            </div>

            <a href="#" class="btn-outline">See more</a>
        </div>
    </section>

    <!-- Expert Skincare -->
    <section class="expert-products">
        <div class="container">
            <span class="step-tag">Products</span>
            <div class="section-header" style="margin-bottom: 20px;">
                <h2>Expert Skincare For Your Beautiful Skin</h2>
                <p>Our specialized collection is designed to give you that extra boost of radiance and confidence every single day.</p>
            </div>

            <div class="prod-carousel">
                <div class="prod-card">
                    <img src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=200">
                    <h4>Hydro Boost Hyaluronic</h4>
                    <span>$124.00</span>
                    <div class="buy-now">Buy Now</div>
                </div>
                <div class="prod-card">
                    <img src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&q=80&w=200">
                    <h4>Anti-Aging Serum</h4>
                    <span>$144.00</span>
                    <div class="buy-now">Buy Now</div>
                </div>
                <div class="prod-card">
                    <img src="https://images.unsplash.com/photo-1594125350485-c5dfd4cd5121?auto=format&fit=crop&q=80&w=200">
                    <h4>Brightening Serum</h4>
                    <span>$135.00</span>
                    <div class="buy-now">Buy Now</div>
                </div>
                <div class="prod-card">
                    <img src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=200">
                    <h4>Vitamin C Serums</h4>
                    <span>$149.00</span>
                    <div class="buy-now">Buy Now</div>
                </div>
            </div>
            <div style="text-align: right; margin-top: 10px;">
                <a href="#" style="color: black; font-weight: 600;">See all</a>
            </div>
        </div>
    </section>

    <!-- Newsletter -->
    <section class="newsletter">
        <div class="container">
            <div class="news-box">
                <div>
                    <h2 style="font-size: 32px; font-family: 'Inter', sans-serif;">Get Discount 20% off</h2>
                    <p style="color: var(--text-muted);">Subscribe our news letter and get 20% off</p>
                </div>
                <div class="news-input-wrap">
                    <input type="email" placeholder="Your email address">
                    <button>Subscribe</button>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-top">
                <div class="footer-logo">Vitalmin</div>
                <div class="footer-links">
                    <a href="#">Product</a>
                    <a href="#">Features</a>
                    <a href="#">Reviews</a>
                    <a href="#">About us</a>
                </div>
                <div class="footer-socials">
                    <i class="fa-brands fa-facebook-f"></i>
                    <i class="fa-brands fa-instagram"></i>
                    <i class="fa-brands fa-twitter"></i>
                </div>
            </div>
            <div class="copyright">
                © 2023 Vitalmin. All rights reserved.
            </div>
        </div>
    </footer>

</body>
</html>`,
    slug: "home",
    status: "published",
    createdAt: new Date(),
    updatedAr: new Date(),
    publishedAt: new Date(),
    websiteId: "",
    tenantId: "",
  },
  {
    title: "About",
    content: `
       <style>
       :root{
  --primary:#4f2dff;
  --primary-dark:#3e21e6;
  --text:#0f172a;
  --muted:#64748b;
  --soft:#f6f7fb;
  --border:rgba(15,23,42,.10);
  --radius:16px;
}
 
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{
  margin:0;
  font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial;
  color:var(--text);
  background:#fff;
}
a{color:inherit;text-decoration:none}
img{max-width:100%;display:block}
 
.container{
  width:min(1120px,calc(100% - 48px));
  margin:0 auto;
}
 
.kicker{
  display:inline-block;
  font-size:12px;
  font-weight:800;
  letter-spacing:.4px;
  text-transform:uppercase;
  color:var(--primary);
}
.kicker.light{color:rgba(255,255,255,.75)}
 
.btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:12px 22px;
  border-radius:999px;
  font-weight:800;
  font-size:12px;
  letter-spacing:.4px;
  border:1px solid transparent;
  cursor:pointer;
  transition:.2s ease;
}
.btn:active{transform:translateY(1px)}
.btn.ghost{
  background:rgba(255,255,255,.14);
  border-color:rgba(255,255,255,.35);
  color:#fff;
}
.btn.ghost:hover{background:rgba(255,255,255,.22)}
 
.section-title{
  margin-bottom:28px;
}
.section-title.center{text-align:center}
.section-title h2{
  margin:8px 0 0;
  font-size:clamp(26px,2.8vw,40px);
  letter-spacing:-.4px;
}
 
/* ================= HERO ================= */
.hero{
  position:relative;
  min-height:360px;
  display:flex;
  flex-direction:column;
  justify-content:center;
  background:
    url("https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=2000&am…
    center/cover no-repeat;
}
 
.hero-overlay{
  position:absolute; inset:0;
  background:linear-gradient(180deg, rgba(0,0,0,.45), rgba(0,0,0,.45));
}
 
.topbar{
  position:absolute;
  top:0; left:0; right:0;
  z-index:5;
}
.topbar-inner{
  height:76px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:18px;
}
 
.brand{
  font-size:22px;
  font-weight:900;
  color:#fff;
  letter-spacing:.3px;
}
 
.nav{
  display:flex;
  align-items:center;
  gap:22px;
  color:rgba(255,255,255,.88);
  font-weight:700;
  font-size:12px;
  letter-spacing:.3px;
  text-transform:uppercase;
}
.nav a{
  opacity:.9;
  position:relative;
  padding:10px 0;
}
.nav a:hover{opacity:1}
.nav a.active{opacity:1}
.nav a.active::after{
  content:"";
  position:absolute;
  left:0; right:0;
  bottom:4px;
  height:2px;
  background:rgba(255,255,255,.9);
  border-radius:2px;
}
 
.nav-actions{
  display:flex;
  align-items:center;
  gap:10px;
}
 
.icon-btn{
  width:40px; height:40px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.25);
  background:rgba(255,255,255,.08);
  display:grid;
  place-items:center;
  cursor:pointer;
}
.icon-btn svg{
  width:18px; height:18px;
  fill:#fff;
  opacity:.9;
}
 
.menu-btn{
  display:none;
  width:44px;height:40px;
  border-radius:12px;
  border:1px solid rgba(255,255,255,.25);
  background:rgba(255,255,255,.08);
  color:#fff;
  font-size:18px;
  cursor:pointer;
}
 
.hero-content{
  position:relative;
  z-index:4;
  text-align:center;
  padding-top:40px;
  padding-bottom:20px;
}
.hero-content h1{
  margin:0 0 8px;
  color:#fff;
  font-size:clamp(30px,3.5vw,44px);
  letter-spacing:-.3px;
}
.crumb{
  margin:0;
  color:rgba(255,255,255,.80);
  font-weight:700;
  font-size:12px;
}
.crumb span{margin:0 6px}
.crumb a{opacity:.95}
.crumb a:hover{opacity:1}
 
.hero-dots{
  position:absolute;
  left:50%;
  transform:translateX(-50%);
  bottom:18px;
  z-index:4;
  display:flex;
  gap:10px;
}
.dot{
  width:10px;height:10px;
  border-radius:999px;
  border:2px solid rgba(255,255,255,.7);
  opacity:.9;
}
.dot.active{
  background:#fff;
  border-color:#fff;
}
 
/* ================= ABOUT PURPLE ================= */
.about{
  background:var(--primary);
  padding:90px 0;
}
.about-grid{
  display:grid;
  grid-template-columns:1.05fr .95fr;
  gap:36px;
  align-items:center;
}
.about-text{
  color:#fff;
  max-width:520px;
}
.about-text h2{
  margin:10px 0 12px;
  font-size:clamp(28px,3.2vw,44px);
  letter-spacing:-.4px;
}
.about-text p{
  margin:0 0 12px;
  line-height:1.85;
  color:rgba(255,255,255,.85);
  font-size:14px;
}
.about-text p.muted{color:rgba(255,255,255,.72)}
 
.about-media img{
  width:100%;
  border-radius:18px;
  border:1px solid rgba(255,255,255,.18);
  box-shadow:0 18px 50px rgba(0,0,0,.25);
}
 
/* ================= TEAM ================= */
.team{
  padding:90px 0;
  background:#fff;
}
.team-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:22px;
  margin-top:22px;
}
.team-card{
  border:1px solid rgba(15,23,42,.08);
  border-radius:18px;
  padding:26px 18px;
  text-align:center;
  background:#fff;
  box-shadow:0 14px 34px rgba(15,23,42,.06);
  transition:.2s ease;
}
.team-card:hover{transform:translateY(-4px)}
.avatar{
  width:88px;height:88px;
  border-radius:999px;
  margin:0 auto 12px;
  border:6px solid rgba(79,45,255,.10);
  object-fit:cover;
}
.team-card h3{
  margin:0 0 6px;
  font-size:14px;
}
.role{
  margin:0;
  font-size:12px;
  color:var(--primary);
  font-weight:800;
}
 
/* ================= TESTIMONIALS ================= */
.testimonials{
  position:relative;
  padding:90px 0;
  color:#fff;
  background:
    url("https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2000&am…
    center/cover no-repeat;
}
.testi-overlay{
  position:absolute; inset:0;
  background:rgba(0,0,0,.62);
}
.testi-inner{
  position:relative;
  z-index:3;
  text-align:center;
  max-width:900px;
}
.testi-inner h2{
  margin:10px 0 18px;
  font-size:clamp(26px,3vw,40px);
  letter-spacing:-.4px;
}
 
.testi-box{
  display:grid;
  grid-template-columns:60px 1fr 60px;
  align-items:center;
  gap:10px;
  margin:0 auto;
  max-width:760px;
}
 
.arrow{
  width:46px;height:46px;
  border-radius:999px;
  border:1px solid rgba(255,255,255,.25);
  background:rgba(255,255,255,.08);
  color:#fff;
  font-size:28px;
  cursor:pointer;
  display:grid;
  place-items:center;
  transition:.2s ease;
}
.arrow:hover{background:rgba(255,255,255,.14)}
 
.testi-content{
  padding:10px 12px;
}
.testi-avatar{
  width:64px;height:64px;
  border-radius:999px;
  margin:0 auto 10px;
  border:4px solid rgba(255,255,255,.18);
}
.testi-content h4{
  margin:0;
  font-size:14px;
}
.small{
  margin:6px 0 10px;
  font-size:11px;
  letter-spacing:.5px;
  opacity:.8;
  font-weight:800;
}
.quote{
  margin:0 auto;
  max-width:560px;
  color:rgba(255,255,255,.82);
  line-height:1.85;
  font-size:13px;
}
 
/* ================= LOGOS STRIP ================= */
.logos{
  background:#fff;
  padding:26px 0;
  border-top:1px solid rgba(15,23,42,.06);
}
.logos-row{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:16px;
  flex-wrap:wrap;
}
.logo-pill{
  padding:10px 16px;
  border-radius:999px;
  border:1px solid rgba(15,23,42,.10);
  background:#fafafa;
  color:rgba(15,23,42,.45);
  font-weight:900;
  font-size:12px;
  letter-spacing:.4px;
}
.logo-pill.active{
  color:var(--primary);
  border-color:rgba(79,45,255,.30);
  background:rgba(79,45,255,.06);
}
 
/* ================= FOOTER ================= */
.footer{
  padding:24px 0;
  background:#0b1220;
  color:rgba(255,255,255,.70);
  text-align:center;
  font-size:13px;
}
 
/* ================= RESPONSIVE ================= */
@media (max-width: 980px){
  .about-grid{grid-template-columns:1fr}
  .team-grid{grid-template-columns:1fr}
  .nav{display:none}
 
  .menu-btn{display:inline-flex;align-items:center;justify-content:center}
 
  body.menu-open .nav{
    display:flex;
    position:absolute;
    top:76px;
    left:24px;
    right:24px;
    padding:14px;
    background:rgba(15,23,42,.88);
    border:1px solid rgba(255,255,255,.12);
    border-radius:16px;
    flex-direction:column;
    gap:10px;
  }
 
  .testi-box{
    grid-template-columns:48px 1fr 48px;
  }
}
       </style>
       <body>
    <!-- HERO + NAV -->
    <header class="hero">
      <div class="hero-overlay"></div>
 
      <div class="topbar">
        <div class="container topbar-inner">
          <a class="brand" href="#">Joy</a>
 
          <nav class="nav">
            <a href="#">Home</a>
            <a href="#">Services</a>
            <a href="#">Portfolio</a>
            <a class="active" href="#">About</a>
            <a href="#">Pricing</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </nav>
 
          <div class="nav-actions">
            <button class="icon-btn" aria-label="Search">
              <!-- search icon -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M10 2a8 8 0 105.3 14l4.4 4.4 1.4-1.4-4.4-4.4A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z"
                />
              </svg>
            </button>
 
            <button class="menu-btn" aria-label="Open menu" onclick="document.body.classList.toggle('menu-open')">
              ☰
            </button>
          </div>
        </div>
      </div>
 
      <div class="container hero-content">
        <h1>About us</h1>
        <p class="crumb">
          <a href="#">Home</a> <span>»</span> <span>About</span>
        </p>
      </div>
 
      <div class="hero-dots">
        <span class="dot"></span>
        <span class="dot active"></span>
        <span class="dot"></span>
      </div>
    </header>
 
    <!-- PURPLE ABOUT SECTION -->
    <section class="about">
      <div class="container about-grid">
        <div class="about-text">
          <span class="kicker light">About Us</span>
          <h2>The Creation</h2>
          <p>
            In pretium neque a libero congue ullamcorper. In diam lectus, maximus
            vel nisl eget, gravida magna. Ut in posuere semper. In egestas feugiat
            interdum.
          </p>
          <p class="muted">
            Clean typography, strong spacing, and a premium purple accent — just
            like your screenshot.
          </p>
          <a class="btn ghost" href="#">READ MORE</a>
        </div>
 
        <div class="about-media">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&am…
            alt="Business"
          />
        </div>
      </div>
    </section>
 
    <!-- TEAM SECTION -->
    <section class="team">
      <div class="container">
        <div class="section-title center">
          <span class="kicker">Our Team</span>
          <h2>The Perfect Combine</h2>
        </div>
 
        <div class="team-grid">
          <article class="team-card">
            <img class="avatar" src="https://i.pravatar.cc/140?img=47" alt="Mr Jessie James" />
            <h3>Mr Jessie James</h3>
            <p class="role">Manager</p>
          </article>
 
          <article class="team-card">
            <img class="avatar" src="https://i.pravatar.cc/140?img=12" alt="Mrs Karen Guillian" />
            <h3>Mrs Karen Guillian</h3>
            <p class="role">Marketer</p>
          </article>
 
          <article class="team-card">
            <img class="avatar" src="https://i.pravatar.cc/140?img=33" alt="Mr Sam Smith" />
            <h3>Mr Sam Smith</h3>
            <p class="role">Product manager</p>
          </article>
        </div>
      </div>
    </section>
 
    <!-- TESTIMONIAL BANNER -->
    <section class="testimonials">
      <div class="testi-overlay"></div>
 
      <div class="container testi-inner">
        <span class="kicker light">Testimonial</span>
        <h2>The Pleasure</h2>
 
        <div class="testi-box">
          <button class="arrow left" aria-label="Previous">‹</button>
 
          <div class="testi-content">
            <img class="testi-avatar" src="https://i.pravatar.cc/120?img=18" alt="Mr Jessie James" />
            <h4>Mr Jessie James</h4>
            <p class="small">MANAGER</p>
            <p class="quote">
              Thank you for your prompt response and real help. You always have a quick
              solution to any problem.
            </p>
          </div>
 
          <button class="arrow right" aria-label="Next">›</button>
        </div>
      </div>
    </section>
 
    <!-- LOGOS STRIP -->
    <section class="logos">
      <div class="container logos-row">
        <div class="logo-pill">PREMIUM</div>
        <div class="logo-pill">Delicious</div>
        <div class="logo-pill">UNIQUE</div>
        <div class="logo-pill">Premium</div>
        <div class="logo-pill">COMPANY</div>
        <div class="logo-pill active">MARKET</div>
      </div>
    </section>
 
    <!-- FOOTER -->
    <footer class="footer">
      <div class="container footer-inner">
        <p>© <span id="year"></span> Joy. All Rights Reserved.</p>
      </div>
    </footer>
 
    <script>
      document.getElementById("year").textContent = new Date().getFullYear();
    </script>
  </body>
       `,
    slug: "about",
    status: "published",
    createdAt: new Date(),
    updatedAr: new Date(),
    publishedAt: new Date(),
    websiteId: "",
    tenantId: "",
  },
];

export const demoProduct = [
  {
    id: "prod-womens-denim-jeans",
    name: "Women's High Waist Skinny Jeans",
    slug: "womens-high-waist-skinny-jeans",
    description:
      "Comfortable stretch denim jeans with high waist design and flattering skinny fit.",
    categoryId: "cat-women-jeans",
    brandId: "brand-denim-co",
    segment: "B2C",
    basePrice: 1499,
    currency: "INR",
    attributeSetId: "attrset-clothing",
    attributes: {
      fit: "fit-skinny",
      fabric: "fabric-denim",
      waist: "waist-high",
      style: "style-casual",
    },
    images: [
      {
        id: "img-jeans-blue-front",
        url: "https://example.com/images/jeans-blue-front.jpg",
        role: "main",
      },
      {
        id: "img-jeans-blue-back",
        url: "https://example.com/images/jeans-blue-back.jpg",
        role: "gallery",
      },
      {
        id: "img-jeans-black-front",
        url: "https://example.com/images/jeans-black-front.jpg",
        role: "gallery",
      },
    ],
    tags: ["trending", "bestseller"],
    variants: [
      {
        id: "var-jeans-blue-28",
        sku: "JEANS-BLU-28",
        attributes: {
          size: "size-28",
          color: "color-blue",
        },
        price: 1499,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 18,
        },
        imageId: "img-jeans-blue-front",
      },
      {
        id: "var-jeans-blue-30",
        sku: "JEANS-BLU-30",
        attributes: {
          size: "size-30",
          color: "color-blue",
        },
        price: 1499,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 22,
        },
        imageId: "img-jeans-blue-front",
      },
      {
        id: "var-jeans-blue-32",
        sku: "JEANS-BLU-32",
        attributes: {
          size: "size-32",
          color: "color-blue",
        },
        price: 1499,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 15,
        },
        imageId: "img-jeans-blue-front",
      },
      {
        id: "var-jeans-black-30",
        sku: "JEANS-BLK-30",
        attributes: {
          size: "size-30",
          color: "color-black",
        },
        price: 1549,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 12,
        },
        imageId: "img-jeans-black-front",
      },
    ],
  },
  {
    id: "prod-unisex-hoodie",
    name: "Unisex Cotton Blend Hoodie",
    slug: "unisex-cotton-blend-hoodie",
    description:
      "Warm and cozy cotton-polyester blend hoodie with kangaroo pocket and adjustable drawstring hood.",
    categoryId: "cat-unisex-hoodies",
    brandId: "brand-streetwear",
    segment: "B2C",
    basePrice: 1299,
    currency: "INR",
    attributeSetId: "attrset-clothing",
    attributes: {
      fit: "fit-regular",
      fabric: "fabric-cotton-blend",
      sleeve_type: "sleeve-full",
      style: "style-casual",
    },
    images: [
      {
        id: "img-hoodie-gray-front",
        url: "https://example.com/images/hoodie-gray-front.jpg",
        role: "main",
      },
      {
        id: "img-hoodie-gray-side",
        url: "https://example.com/images/hoodie-gray-side.jpg",
        role: "gallery",
      },
      {
        id: "img-hoodie-maroon-front",
        url: "https://example.com/images/hoodie-maroon-front.jpg",
        role: "gallery",
      },
    ],
    tags: ["new", "winter-collection"],
    variants: [
      {
        id: "var-hoodie-gray-s",
        sku: "HOODIE-GRY-S",
        attributes: {
          size: "size-s",
          color: "color-gray",
        },
        price: 1299,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 20,
        },
        imageId: "img-hoodie-gray-front",
      },
      {
        id: "var-hoodie-gray-m",
        sku: "HOODIE-GRY-M",
        attributes: {
          size: "size-m",
          color: "color-gray",
        },
        price: 1299,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 35,
        },
        imageId: "img-hoodie-gray-front",
      },
      {
        id: "var-hoodie-gray-l",
        sku: "HOODIE-GRY-L",
        attributes: {
          size: "size-l",
          color: "color-gray",
        },
        price: 1299,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 28,
        },
        imageId: "img-hoodie-gray-front",
      },
      {
        id: "var-hoodie-maroon-m",
        sku: "HOODIE-MAR-M",
        attributes: {
          size: "size-m",
          color: "color-maroon",
        },
        price: 1349,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 18,
        },
        imageId: "img-hoodie-maroon-front",
      },
      {
        id: "var-hoodie-black-xl",
        sku: "HOODIE-BLK-XL",
        attributes: {
          size: "size-xl",
          color: "color-black",
        },
        price: 1299,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 14,
        },
      },
    ],
  },
  {
    id: "prod-mens-formal-shirt",
    name: "Men's Formal Cotton Shirt",
    slug: "mens-formal-cotton-shirt",
    description:
      "Classic formal shirt in premium cotton fabric with wrinkle-resistant finish, perfect for office wear.",
    categoryId: "cat-men-shirts",
    brandId: "brand-premium-formals",
    segment: "B2C",
    basePrice: 1199,
    currency: "INR",
    attributeSetId: "attrset-clothing",
    attributes: {
      fit: "fit-regular",
      fabric: "fabric-cotton",
      sleeve_type: "sleeve-full",
      collar_type: "collar-spread",
    },
    images: [
      {
        id: "img-shirt-white-front",
        url: "https://example.com/images/shirt-white-front.jpg",
        role: "main",
      },
      {
        id: "img-shirt-white-detail",
        url: "https://example.com/images/shirt-white-detail.jpg",
        role: "gallery",
      },
      {
        id: "img-shirt-skyblue-front",
        url: "https://example.com/images/shirt-skyblue-front.jpg",
        role: "gallery",
      },
    ],
    tags: ["formal", "office-wear"],
    variants: [
      {
        id: "var-shirt-white-38",
        sku: "SHIRT-WHT-38",
        attributes: {
          size: "size-38",
          color: "color-white",
        },
        price: 1199,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 25,
        },
        imageId: "img-shirt-white-front",
      },
      {
        id: "var-shirt-white-40",
        sku: "SHIRT-WHT-40",
        attributes: {
          size: "size-40",
          color: "color-white",
        },
        price: 1199,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 30,
        },
        imageId: "img-shirt-white-front",
      },
      {
        id: "var-shirt-white-42",
        sku: "SHIRT-WHT-42",
        attributes: {
          size: "size-42",
          color: "color-white",
        },
        price: 1199,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 22,
        },
        imageId: "img-shirt-white-front",
      },
      {
        id: "var-shirt-skyblue-40",
        sku: "SHIRT-SKY-40",
        attributes: {
          size: "size-40",
          color: "color-skyblue",
        },
        price: 1249,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 16,
        },
        imageId: "img-shirt-skyblue-front",
      },
      {
        id: "var-shirt-pink-40",
        sku: "SHIRT-PNK-40",
        attributes: {
          size: "size-40",
          color: "color-pink",
        },
        price: 1249,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 12,
        },
      },
    ],
  },
  {
    id: "prod-womens-kurta",
    name: "Women's Cotton Printed Kurta",
    slug: "womens-cotton-printed-kurta",
    description:
      "Beautiful ethnic kurta with vibrant prints, perfect for casual and festive occasions.",
    categoryId: "cat-women-ethnic",
    brandId: "brand-ethnic-wear",
    segment: "B2C",
    basePrice: 899,
    currency: "INR",
    attributeSetId: "attrset-clothing",
    attributes: {
      fit: "fit-regular",
      fabric: "fabric-cotton",
      sleeve_type: "sleeve-three-quarter",
      pattern: "pattern-printed",
    },
    images: [
      {
        id: "img-kurta-floral-front",
        url: "https://example.com/images/kurta-floral-front.jpg",
        role: "main",
      },
      {
        id: "img-kurta-floral-back",
        url: "https://example.com/images/kurta-floral-back.jpg",
        role: "gallery",
      },
      {
        id: "img-kurta-geometric-front",
        url: "https://example.com/images/kurta-geometric-front.jpg",
        role: "gallery",
      },
    ],
    tags: ["ethnic", "trending", "bestseller"],
    variants: [
      {
        id: "var-kurta-floral-s",
        sku: "KURTA-FLR-S",
        attributes: {
          size: "size-s",
          color: "color-multicolor",
        },
        price: 899,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 28,
        },
        imageId: "img-kurta-floral-front",
      },
      {
        id: "var-kurta-floral-m",
        sku: "KURTA-FLR-M",
        attributes: {
          size: "size-m",
          color: "color-multicolor",
        },
        price: 899,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 35,
        },
        imageId: "img-kurta-floral-front",
      },
      {
        id: "var-kurta-floral-l",
        sku: "KURTA-FLR-L",
        attributes: {
          size: "size-l",
          color: "color-multicolor",
        },
        price: 899,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 24,
        },
        imageId: "img-kurta-floral-front",
      },
      {
        id: "var-kurta-geometric-m",
        sku: "KURTA-GEO-M",
        attributes: {
          size: "size-m",
          color: "color-blue",
        },
        price: 949,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 20,
        },
        imageId: "img-kurta-geometric-front",
      },
      {
        id: "var-kurta-solid-xl",
        sku: "KURTA-SLD-XL",
        attributes: {
          size: "size-xl",
          color: "color-maroon",
        },
        price: 849,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 15,
        },
      },
    ],
  },
  {
    id: "prod-mens-running-shoes",
    name: "Men's Lightweight Running Shoes",
    slug: "mens-lightweight-running-shoes",
    description:
      "Breathable mesh running shoes with cushioned sole for maximum comfort during workouts.",
    categoryId: "cat-men-footwear",
    brandId: "brand-sporty",
    segment: "B2C",
    basePrice: 1999,
    currency: "INR",
    attributeSetId: "attrset-footwear",
    attributes: {
      type: "type-running",
      material: "material-mesh",
      sole_type: "sole-eva",
      closure: "closure-lace",
    },
    images: [
      {
        id: "img-shoes-black-side",
        url: "https://example.com/images/shoes-black-side.jpg",
        role: "main",
      },
      {
        id: "img-shoes-black-top",
        url: "https://example.com/images/shoes-black-top.jpg",
        role: "gallery",
      },
      {
        id: "img-shoes-blue-side",
        url: "https://example.com/images/shoes-blue-side.jpg",
        role: "gallery",
      },
    ],
    tags: ["sports", "new", "running"],
    variants: [
      {
        id: "var-shoes-black-8",
        sku: "SHOES-BLK-8",
        attributes: {
          size: "size-8",
          color: "color-black",
        },
        price: 1999,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 15,
        },
        imageId: "img-shoes-black-side",
      },
      {
        id: "var-shoes-black-9",
        sku: "SHOES-BLK-9",
        attributes: {
          size: "size-9",
          color: "color-black",
        },
        price: 1999,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 22,
        },
        imageId: "img-shoes-black-side",
      },
      {
        id: "var-shoes-black-10",
        sku: "SHOES-BLK-10",
        attributes: {
          size: "size-10",
          color: "color-black",
        },
        price: 1999,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 18,
        },
        imageId: "img-shoes-black-side",
      },
      {
        id: "var-shoes-blue-9",
        sku: "SHOES-BLU-9",
        attributes: {
          size: "size-9",
          color: "color-blue",
        },
        price: 2099,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 12,
        },
        imageId: "img-shoes-blue-side",
      },
      {
        id: "var-shoes-gray-10",
        sku: "SHOES-GRY-10",
        attributes: {
          size: "size-10",
          color: "color-gray",
        },
        price: 1999,
        currency: "INR",
        inventory: {
          manageStock: true,
          quantity: 10,
        },
      },
    ],
  },
];

export const processedHTML = (html: string, products: any[]) => {
  let processedHtml = html;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const index = i + 1; // Since placeholders are 1-indexed (product_name_1, etc.)

    // Replace product name
    processedHtml = processedHtml.replace(
      new RegExp(`\\{\\{product_name_${index}\\}\\}`, "g"),
      product.name
    );

    // Replace product price
    processedHtml = processedHtml.replace(
      new RegExp(`\\{\\{product_price_${index}\\}\\}`, "g"),
      product.basePrice.toString()
    );

    // Replace product image
    processedHtml = processedHtml.replace(
      new RegExp(`\\{\\{product_image_${index}\\}\\}`, "g"),
      "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    );
  }

  return processedHtml;
};
