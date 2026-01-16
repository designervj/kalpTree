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
    content: `
       <style>
       :root{

  --primary: #5a2dff;

  --primary-dark: #4a22e8;

  --text: #0f172a;

  --muted: #64748b;

  --bg: #ffffff;

  --soft: #f6f7fb;

  --border: rgba(15, 23, 42, 0.12);

  --shadow: 0 18px 45px rgba(15, 23, 42, 0.10);

  --radius: 16px;

}
 
*{ box-sizing: border-box; }

html{ scroll-behavior: smooth; }

body{

  margin: 0;

  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;

  color: var(--text);

  background: var(--bg);

}
 
a{ color: inherit; text-decoration: none; }

img{ max-width: 100%; display: block; }
 
.container{

  width: min(1120px, calc(100% - 48px));

  margin: 0 auto;

}
 
.section{ padding: 80px 0; }

.center{ text-align: center; }

.mt-24{ margin-top: 24px; }
 
/* ---------------- HEADER ---------------- */

.site-header{

  position: fixed;

  top: 0;

  left: 0;

  right: 0;

  z-index: 50;

  background: rgba(255,255,255,0.70);

  backdrop-filter: blur(10px);

  border-bottom: 1px solid rgba(255,255,255,0.35);

}
 
.header-inner{

  height: 74px;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 16px;

}
 
.logo{

  font-weight: 800;

  letter-spacing: 0.2px;

  font-size: 22px;

}
 
.nav{

  display: flex;

  gap: 24px;

  font-weight: 600;

  font-size: 14px;

  color: rgba(15,23,42,0.85);

}
 
.nav a{

  padding: 10px 0;

  position: relative;

}
 
.nav a::after{

  content: "";

  position: absolute;

  left: 0;

  bottom: 2px;

  width: 0%;

  height: 2px;

  background: var(--primary);

  transition: width .25s ease;

}
 
.nav a:hover::after{ width: 100%; }
 
.nav-toggle{

  display: none;

  border: 1px solid var(--border);

  background: #fff;

  border-radius: 12px;

  padding: 10px 12px;

  cursor: pointer;

}
 
/* ---------------- HERO ---------------- */

.hero{

  min-height: 92vh;

  display: grid;

  align-items: center;

  position: relative;

  padding-top: 74px;

  background:

    url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&am…

    center/cover no-repeat;

}
 
.hero-overlay{

  position: absolute;

  inset: 0;

  background: linear-gradient(

    90deg,

    rgba(15,23,42,0.70) 0%,

    rgba(15,23,42,0.45) 40%,

    rgba(15,23,42,0.25) 100%

  );

}
 
.hero-content{

  position: relative;

  z-index: 2;

}
 
.hero-text{

  max-width: 640px;

  color: #fff;

}
 
.hero h1{

  font-size: clamp(34px, 4vw, 54px);

  line-height: 1.1;

  margin: 0 0 14px;

  font-weight: 850;

  letter-spacing: -0.5px;

}
 
.hero p{

  margin: 0 0 22px;

  color: rgba(255,255,255,0.85);

  max-width: 560px;

}
 
/* ---------------- BUTTONS ---------------- */

.btn{

  display: inline-flex;

  align-items: center;

  justify-content: center;

  gap: 10px;

  padding: 12px 26px;

  border-radius: 999px;

  border: 1px solid transparent;

  font-weight: 700;

  font-size: 14px;

  cursor: pointer;

  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;

}
 
.btn:active{ transform: translateY(1px); }
 
.btn-primary{

  background: var(--primary);

  color: #fff;

  box-shadow: 0 12px 25px rgba(90,45,255,0.28);

}

.btn-primary:hover{ background: var(--primary-dark); }
 
.btn-outline{

  background: transparent;

  border: 1px solid rgba(90,45,255,0.45);

  color: var(--primary);

}

.btn-outline:hover{

  background: rgba(90,45,255,0.07);

}
 
.btn-ghost{

  background: rgba(255,255,255,0.14);

  color: #fff;

  border: 1px solid rgba(255,255,255,0.35);

}

.btn-ghost:hover{

  background: rgba(255,255,255,0.20);

}
 
/* ---------------- TITLES ---------------- */

.section-title{ margin-bottom: 34px; }

.section-title h2{

  margin: 8px 0 10px;

  font-size: clamp(26px, 2.6vw, 36px);

  letter-spacing: -0.3px;

}

.section-title p{

  margin: 0 auto;

  color: var(--muted);

  max-width: 720px;

  font-size: 15px;

  line-height: 1.7;

}
 
.kicker{

  display: inline-block;

  font-weight: 800;

  letter-spacing: 0.5px;

  font-size: 12px;

  color: var(--primary);

  text-transform: uppercase;

}

.kicker.light{ color: rgba(255,255,255,0.75); }
 
/* ---------------- FEATURES ---------------- */

.section-features{ background: #fff; }
 
.features-grid{

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 26px;

  margin-top: 26px;

}
 
.feature-card{

  background: #fff;

  border: 1px solid rgba(15,23,42,0.08);

  border-radius: var(--radius);

  padding: 26px 22px;

  box-shadow: 0 12px 35px rgba(15,23,42,0.05);

  transition: transform .2s ease, box-shadow .2s ease;

}
 
.feature-card:hover{

  transform: translateY(-4px);

  box-shadow: var(--shadow);

}
 
.feature-icon{

  width: 54px;

  height: 54px;

  border-radius: 999px;

  display: grid;

  place-items: center;

  border: 1px solid rgba(90,45,255,0.22);

  background: rgba(90,45,255,0.06);

  margin: 0 auto 16px;

}
 
.feature-icon.fill{

  background: var(--primary);

  border-color: transparent;

}
 
.feature-icon svg{

  width: 24px;

  height: 24px;

  fill: var(--primary);

}
 
.feature-icon.fill svg{ fill: #fff; }
 
.feature-card h3{

  margin: 0 0 8px;

  font-size: 18px;

  text-align: center;

}

.feature-card p{

  margin: 0;

  color: var(--muted);

  line-height: 1.7;

  font-size: 14px;

  text-align: center;

}
 
/* ---------------- ABOUT (PURPLE) ---------------- */

.about{

  background: var(--primary);

  color: #fff;

  padding: 90px 0;

}
 
.about-grid{

  display: grid;

  grid-template-columns: 1.05fr 0.95fr;

  gap: 36px;

  align-items: center;

}
 
.about-text h2{

  margin: 10px 0 12px;

  font-size: clamp(28px, 3vw, 44px);

  letter-spacing: -0.4px;

}
 
.about-text p{

  margin: 0 0 12px;

  line-height: 1.8;

  color: rgba(255,255,255,0.86);

}
 
.about-text .muted{

  color: rgba(255,255,255,0.72);

}
 
.about-media img{

  width: 100%;

  border-radius: 18px;

  box-shadow: 0 18px 50px rgba(0,0,0,0.25);

  border: 1px solid rgba(255,255,255,0.18);

}
 
/* ---------------- VIDEO SECTION ---------------- */

.video{

  position: relative;

  padding: 95px 0;

  color: #fff;

  background:

    url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&am…

    center/cover no-repeat fixed;

}
 
.video-overlay{

  position: absolute;

  inset: 0;

  background: linear-gradient(

    180deg,

    rgba(15,23,42,0.62),

    rgba(15,23,42,0.55)

  );

}

 
.video-inner{

  position: relative;

  z-index: 2;

  text-align: center;

  max-width: 820px;

}
 
.video h2{

  margin: 10px 0 10px;

  font-size: clamp(26px, 3vw, 40px);

}
 
.video p{

  margin: 0 auto 22px;

  max-width: 650px;

  color: rgba(255,255,255,0.82);

  line-height: 1.8;

}
 
.play-btn{

  width: 110px;

  height: 110px;

  margin: 0 auto;

  border-radius: 999px;

  display: grid;

  place-items: center;

  background: rgba(90,45,255,0.95);

  box-shadow: 0 18px 40px rgba(90,45,255,0.35);

  border: 1px solid rgba(255,255,255,0.25);

  gap: 6px;

}
 
.play-btn span{

  font-size: 26px;

  margin-top: 6px;

}

.play-btn small{

  font-size: 11px;

  letter-spacing: 0.5px;

  opacity: .9;

  text-transform: uppercase;

}
 
/* ---------------- PORTFOLIO ---------------- */

.portfolio{ background: #fff; }
 
.portfolio-grid{

  display: grid;

  grid-template-columns: 1.2fr 0.8fr;

  gap: 18px;

}
 
.work{

  border-radius: 18px;

  overflow: hidden;

  border: 1px solid rgba(15,23,42,0.08);

  box-shadow: 0 16px 40px rgba(15,23,42,0.08);

  transition: transform .25s ease;

}
 
.work:hover{ transform: translateY(-4px); }
 
.work img{

  width: 100%;

  height: 100%;

  object-fit: cover;

}
 
.work.tall{

  grid-row: span 2;

}
 
@media (min-width: 900px){

  .portfolio-grid{

    grid-template-columns: 1fr 1fr;

  }

}
 
/* ---------------- TESTIMONIALS ---------------- */

.testimonials{ background: var(--soft); }
 
.testi-grid{

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  margin-top: 24px;

}
 
.testi-card{

  background: #fff;

  border: 1px solid rgba(15,23,42,0.08);

  border-radius: var(--radius);

  padding: 24px 22px;

  box-shadow: 0 12px 34px rgba(15,23,42,0.06);

}
 
.quote{

  font-size: 48px;

  line-height: 1;

  color: rgba(90,45,255,0.35);

  margin-bottom: 6px;

  font-weight: 900;

}
 
.testi-card p{

  margin: 0 0 18px;

  color: rgba(15,23,42,0.82);

  line-height: 1.8;

  font-size: 14px;

}
 
.testi-user{

  display: flex;

  gap: 12px;

  align-items: center;

  border-top: 1px solid rgba(15,23,42,0.08);

  padding-top: 14px;

}
 
.testi-user img{

  width: 44px;

  height: 44px;

  border-radius: 999px;

}
 
.testi-user strong{ display: block; font-size: 14px; }

.testi-user span{ display: block; font-size: 12px; color: var(--muted); }
 
/* ---------------- CTA ---------------- */

.cta{

  position: relative;

  padding: 90px 0;

  color: #fff;

  background:

    url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=2000&am…

    center/cover no-repeat fixed;

}
 
.cta-overlay{

  position: absolute;

  inset: 0;

  background: rgba(15,23,42,0.60);

}
 
.cta-inner{

  position: relative;

  z-index: 2;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 18px;

}
 
.cta h2{

  margin: 0;

  font-size: clamp(22px, 2.6vw, 34px);

  letter-spacing: -0.3px;

}
 
/* ---------------- BLOG ---------------- */

.blog{ background: #fff; }
 
.blog-grid{

  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 18px;

  margin-top: 18px;

}
 
.post{

  border: 1px solid rgba(15,23,42,0.08);

  border-radius: 18px;

  overflow: hidden;

  box-shadow: 0 14px 36px rgba(15,23,42,0.07);

  transition: transform .2s ease;

  background: #fff;

}
 
.post:hover{ transform: translateY(-4px); }
 
.post img{

  height: 180px;

  width: 100%;

  object-fit: cover;

}
 
.post-body{

  padding: 18px 18px 20px;

}
 
.post h3{

  margin: 0 0 8px;

  font-size: 17px;

}
 
.post p{

  margin: 0 0 12px;

  color: var(--muted);

  line-height: 1.7;

  font-size: 14px;

}
 
.post-link{

  color: var(--primary);

  font-weight: 800;

  font-size: 13px;

}
 
/* logos row */

.logos{

  margin-top: 28px;

  padding-top: 20px;

  border-top: 1px solid rgba(15,23,42,0.08);

  display: flex;

  flex-wrap: wrap;

  gap: 12px;

  justify-content: center;

}
 
.logo-pill{

  padding: 10px 16px;

  border-radius: 999px;

  background: var(--soft);

  border: 1px solid rgba(15,23,42,0.08);

  color: rgba(15,23,42,0.70);

  font-weight: 800;

  font-size: 12px;

  letter-spacing: 0.3px;

}
 
/* ---------------- FOOTER ---------------- */

.footer{

  background: #0b1220;

  color: rgba(255,255,255,0.88);

  padding: 60px 0 20px;

}
 
.footer-inner{

  display: grid;

  grid-template-columns: 1.2fr 0.8fr 0.8fr 1.2fr;

  gap: 22px;

}
 
.footer h4{

  margin: 0 0 12px;

  font-size: 14px;

  letter-spacing: 0.4px;

  text-transform: uppercase;

  color: rgba(255,255,255,0.75);

}
 
.footer a{

  display: block;

  padding: 7px 0;

  color: rgba(255,255,255,0.86);

  font-size: 14px;

}
 
.footer a:hover{ color: #fff; }
 
.footer-logo{

  color: #fff;

  margin-bottom: 10px;

}
 
.footer .muted{

  color: rgba(255,255,255,0.68);

  line-height: 1.8;

}
 
.newsletter{

  display: flex;

  gap: 10px;

  flex-wrap: wrap;

}
 
.newsletter input{

  flex: 1;

  min-width: 200px;

  padding: 12px 14px;

  border-radius: 12px;

  border: 1px solid rgba(255,255,255,0.18);

  outline: none;

  background: rgba(255,255,255,0.06);

  color: #fff;

}
 
.newsletter input::placeholder{ color: rgba(255,255,255,0.55); }
 
.footer-bottom{

  border-top: 1px solid rgba(255,255,255,0.12);

  margin-top: 32px;

  padding-top: 16px;

  text-align: center;

  color: rgba(255,255,255,0.62);

  font-size: 13px;

}
 
/* ---------------- RESPONSIVE ---------------- */

@media (max-width: 980px){

  .features-grid,

  .testi-grid,

  .blog-grid{

    grid-template-columns: 1fr;

  }
 
  .about-grid{

    grid-template-columns: 1fr;

  }
 
  .cta-inner{

    flex-direction: column;

    text-align: center;

  }
 
  .footer-inner{

    grid-template-columns: 1fr;

  }
 
  .nav{

    position: fixed;

    top: 74px;

    right: 16px;

    left: 16px;

    background: #fff;

    border: 1px solid rgba(15,23,42,0.10);

    border-radius: 16px;

    padding: 14px;

    flex-direction: column;

    gap: 10px;

    box-shadow: var(--shadow);

    transform: translateY(-10px);

    opacity: 0;

    pointer-events: none;

    transition: .2s ease;

  }
 
  body.nav-open .nav{

    transform: translateY(0);

    opacity: 1;

    pointer-events: auto;

  }
 
  .nav-toggle{ display: inline-flex; }

}
 
       </style>
       <body>
       <header class="site-header">
      <div class="container header-inner">
        <a class="logo" href="#">Joy</a>
 
        <nav class="nav">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#blog">Blog</a>
          <a href="#contact">Contact</a>
        </nav>
 
        <button class="nav-toggle" aria-label="Open menu" onclick="document.body.classList.toggle('nav-open')">
          ☰
        </button>
      </div>
    </header>
 
    <section id="home" class="hero">
      <div class="hero-overlay"></div>
 
      <div class="container hero-content">
        <div class="hero-text">
          <h1>This is an awesome company<br />for creatives.</h1>
          <p>
            We craft beautiful websites and digital products for startups, agencies and brands.
            Simple, clean, and modern — feel free to explore the sections below.
          </p>
          <a class="btn btn-primary" href="#services">Get Started</a>
        </div>
      </div>
    </section>
 
    <!-- FEATURES -->
    <section id="services" class="section section-features">
      <div class="container">
        <div class="section-title center">
          <span class="kicker">Our Service</span>
          <h2>We Design Creative & Innovative Solutions</h2>
          <p>
            A clean and minimal layout with strong typography, clear spacing and a modern purple accent.
          </p>
        </div>
 
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <!-- simple inline icon -->
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 6h16v10H4V6zm2 2v6h12V8H6zm-2 12h16v2H4v-2z"></path>
              </svg>
            </div>
            <h3>Creativity</h3>
            <p>
              Unique ideas, modern UI blocks and a polished visual style that feels premium.
            </p>
          </div>
 
          <div class="feature-card">
            <div class="feature-icon fill">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2a7 7 0 017 7c0 2.5-1.3 4.2-2.4 5.3-.7.7-1.1 1.6-1.1 2.6V18H8.5v-1.2c0-1-.4-1.9-1.1-2.6C6.3 13.2 5 11.5 5 9a7 7 0 017-7zm-3 18h6v2H9v-2z"></path>
              </svg>
            </div>
            <h3>Professional</h3>
            <p>
              Built with structure, reusable sections, and a consistent spacing system.
            </p>
          </div>
 
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"></path>
              </svg>
            </div>
            <h3>Fast Support</h3>
            <p>
              We respond quickly and keep the project moving with clear communication.
            </p>
          </div>
        </div>
      </div>
    </section>
 
    <!-- ABOUT (PURPLE SECTION) -->
    <section class="section about">
      <div class="container about-grid">
        <div class="about-text">
          <span class="kicker light">About Us</span>
          <h2>The Creation</h2>
          <p>
            We build modern web experiences with great typography, clean components,
            and layouts that look professional on every device.
          </p>
          <p class="muted">
            This section matches the screenshot style: purple background, white text,
            and a clean button.
          </p>
          <a class="btn btn-ghost" href="#portfolio">Read More</a>
        </div>
 
        <div class="about-media">
          <img
            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&am…
            alt="Office"
          />
        </div>
      </div>
    </section>
 
    <!-- VIDEO / PARALLAX -->
    <section class="video">
      <div class="video-overlay"></div>
      <div class="container video-inner">
        <span class="kicker light">Who Choose Us?</span>
        <h2>We Lead From The Front</h2>
        <p>
          Strong visuals with an overlay + call-to-action. Perfect for agency style pages.
        </p>
 
        <a class="play-btn" href="javascript:void(0)" aria-label="Play video">
          <span>▶</span>
          <small>Play Video</small>
        </a>
      </div>
    </section>
 
    <!-- PORTFOLIO -->
    <section id="portfolio" class="section portfolio">
      <div class="container">
        <div class="section-title">
          <span class="kicker">Our Portfolio</span>
          <h2>The Inspirations</h2>
        </div>
 
        <div class="portfolio-grid">
          <a class="work" href="#">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80%22 alt="Work 1" />
          </a>
 
          <a class="work tall" href="#">
            <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80%22 alt="Work 2" />
          </a>
 
          <a class="work" href="#">
            <img src="https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80%22 alt="Work 3" />
          </a>
 
          <a class="work" href="#">
            <img src="https://images.unsplash.com/photo-1519181245277-cffeb31da2fb?auto=format&fit=crop&w=900&q=80%22 alt="Work 4" />
          </a>
        </div>
 
        <div class="center mt-24">
          <a class="btn btn-outline" href="#">View All</a>
        </div>
      </div>
    </section>
 
    <!-- TESTIMONIALS -->
    <section class="section testimonials">
      <div class="container">
        <div class="section-title center">
          <span class="kicker">Testimonial</span>
          <h2>The Pleasure</h2>
        </div>
 
        <div class="testi-grid">
          <div class="testi-card">
            <div class="quote">“</div>
            <p>
              They delivered an amazing design with clean sections and perfect spacing. Very professional team.
            </p>
            <div class="testi-user">
              <img src="https://i.pravatar.cc/100?img=12" alt="User" />
              <div>
                <strong>Mr Jacob James</strong>
                <span>UI Designer</span>
              </div>
            </div>
          </div>
 
          <div class="testi-card">
            <div class="quote">“</div>
            <p>
              Smooth process, fast support, and the final page looks premium. Love the purple theme!
            </p>
            <div class="testi-user">
              <img src="https://i.pravatar.cc/100?img=32" alt="User" />
              <div>
                <strong>Mrs Emma Clark</strong>
                <span>Product Owner</span>
              </div>
            </div>
          </div>
 
          <div class="testi-card">
            <div class="quote">“</div>
            <p>
              Great typography, modern layout and responsive design. Everything looks clean on mobile too.
            </p>
            <div class="testi-user">
              <img src="https://i.pravatar.cc/100?img=18" alt="User" />
              <div>
                <strong>Mr Sam Smith</strong>
                <span>Founder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
 
    <!-- CTA -->
    <section id="contact" class="cta">
      <div class="cta-overlay"></div>
      <div class="container cta-inner">
        <h2>Feel Free To Get In Touch With Us!</h2>
        <a class="btn btn-primary" href="#">Contact</a>
      </div>
    </section>
 
    <!-- BLOG -->
    <section id="blog" class="section blog">
      <div class="container">
        <div class="section-title">
          <span class="kicker">Blog Post</span>
          <h2>Lastest News</h2>
        </div>
 
        <div class="blog-grid">
          <article class="post">
            <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&am… alt="Blog 1" />
            <div class="post-body">
              <h3>Test MBA Market in Ready</h3>
              <p>Short clean description for your blog post. Keep it crisp and readable.</p>
              <a class="post-link" href="#">Read More →</a>
            </div>
          </article>
 
          <article class="post">
            <img src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&am… alt="Blog 2" />
            <div class="post-body">
              <h3>5 Tips for the developer</h3>
              <p>Use consistent spacing, clear hierarchy, and keep your sections structured.</p>
              <a class="post-link" href="#">Read More →</a>
            </div>
          </article>
 
          <article class="post">
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&am… alt="Blog 3" />
            <div class="post-body">
              <h3>Harvest Great Ideas</h3>
              <p>Good design is a balance of typography, layout grid, and meaningful contrast.</p>
              <a class="post-link" href="#">Read More →</a>
            </div>
          </article>
        </div>
 
        <div class="logos">
          <div class="logo-pill">Creative</div>
          <div class="logo-pill">Unique</div>
          <div class="logo-pill">Delicious</div>
          <div class="logo-pill">Modern</div>
          <div class="logo-pill">Premium</div>
        </div>
      </div>
    </section>
 
    <!-- FOOTER -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-col">
          <div class="logo footer-logo">Joy</div>
          <p class="muted">
            A clean agency landing page layout inspired by your screenshot. Replace text/images as needed.
          </p>
        </div>
 
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#blog">Blog</a>
        </div>
 
        <div class="footer-col">
          <h4>Support</h4>
          <a href="#">Help Center</a>
          <a href="#">Terms</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
 
        <div class="footer-col">
          <h4>Newsletter</h4>
          <form class="newsletter" onsubmit="return false;">
            <input type="email" placeholder="Email address" required />
            <button class="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
      </div>
 
      <div class="container footer-bottom">
        <p>© <span id="year"></span> Joy. All Rights Reserved.</p>
      </div>
    </footer>
    </body>
       `,
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
