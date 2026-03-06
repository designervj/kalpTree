import { PageTemplate } from "./Creator";

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    key: "home-modern-01",
    category: "home",
    name: "Homepage – Modern Premium",
    desc: "Hero, logos, features, showcase, testimonials, pricing, FAQ, footer",
    seo: {
      focusKeyword: "modern website",
      seoTitle: "Modern Premium Website Template",
      metaDescription:
        "A clean modern homepage layout with hero, features, testimonials and pricing. Ready to customize for your business.",
    },
    html: `
<!-- Header -->
<header style="position:sticky;top:0;z-index:10;background:#ffffff;border-bottom:1px solid #e2e8f0;">
  <div style="max-width:1100px;margin:0 auto;padding:14px 24px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:34px;height:34px;border-radius:12px;background:#7c3aed;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;">W</div>
      <div>
        <div style="font-weight:900;color:#0f172a;line-height:1;">Website</div>
        <div style="font-size:12px;color:#64748b;line-height:1;">Premium Builder</div>
      </div>
    </div>
    <nav style="display:flex;gap:16px;align-items:center;color:#334155;font-weight:700;font-size:13px;">
      <a href="#" style="text-decoration:none;">Home</a>
      <a href="#" style="text-decoration:none;">Features</a>
      <a href="#" style="text-decoration:none;">Pricing</a>
      <a href="#" style="text-decoration:none;">Contact</a>
    </nav>
    <div style="display:flex;gap:10px;align-items:center;">
      <a href="#" style="text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:10px 12px;border-radius:12px;font-weight:800;font-size:13px;">Login</a>
      <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:10px 12px;border-radius:12px;font-weight:900;font-size:13px;">Get Started</a>
    </div>
  </div>
</header>

<!-- Hero -->
<section style="padding:56px 24px;font-family:ui-sans-serif,system-ui;background:linear-gradient(180deg,#ffffff 0%,#faf5ff 100%);">
  <div style="max-width:1100px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:18px;align-items:center;">
    <div>
      <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;">
        <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;"></span>
        New: Premium templates included
      </div>
      <h1 style="font-size:44px;line-height:1.1;margin:14px 0 12px;color:#0f172a;">
        Build stunning pages fast — <span style="color:#7c3aed;">no design stress</span>
      </h1>
      <p style="margin:0;color:#475569;max-width:68ch;font-size:16px;line-height:1.75;">
        Use ready-made full page templates for Home, About, Services and Contact.
        Edit HTML instantly and preview right away.
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px;">
        <a href="#" style="text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;">Create Page</a>
        <a href="#" style="text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:12px 16px;border-radius:14px;font-weight:900;background:#fff;">View Templates</a>
      </div>

      <div style="display:flex;gap:14px;align-items:center;margin-top:18px;color:#64748b;font-size:13px;">
        <div style="display:flex;gap:8px;align-items:center;"><span style="width:10px;height:10px;border-radius:999px;background:#22c55e;display:inline-block;"></span> Live preview</div>
        <div style="display:flex;gap:8px;align-items:center;"><span style="width:10px;height:10px;border-radius:999px;background:#22c55e;display:inline-block;"></span> SEO fields</div>
        <div style="display:flex;gap:8px;align-items:center;"><span style="width:10px;height:10px;border-radius:999px;background:#22c55e;display:inline-block;"></span> Fast editing</div>
      </div>
    </div>

    <div style="border:1px solid #e2e8f0;border-radius:18px;background:#fff;overflow:hidden;box-shadow:0 18px 60px rgba(2,6,23,.08);">
      <div style="padding:14px;border-bottom:1px solid #e2e8f0;background:#fafafa;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-weight:900;color:#0f172a;">Preview</div>
        <div style="font-size:12px;color:#64748b;">Your page</div>
      </div>
      <div style="padding:14px;">
        <div style="height:220px;border-radius:16px;background:linear-gradient(135deg,#ddd6fe,#fff);border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:800;">
          Image / Banner
        </div>
        <div style="margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;">
          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:10px;">
            <div style="font-weight:900;color:#0f172a;">Fast</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;line-height:1.5;">Quick edits</div>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:10px;">
            <div style="font-weight:900;color:#0f172a;">Clean</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;line-height:1.5;">Premium layout</div>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:14px;padding:10px;">
            <div style="font-weight:900;color:#0f172a;">SEO</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;line-height:1.5;">Optimized</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Logos -->
<section style="padding:24px 24px;background:#ffffff;">
  <div style="max-width:1100px;margin:0 auto;">
    <div style="color:#64748b;font-size:12px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;">
      Trusted by teams
    </div>
    <div style="margin-top:10px;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;">
      ${Array.from({ length: 6 })
        .map(
          (_, i) => `
      < div style="border:1px dashed #e2e8f0;border-radius:14px;height:44px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-weight:900;" >
      Logo ${i + 1}
</div>`
        )
        .join("")}
</div>
  </div>
  </section>

  < !--Features -->
    <section style="padding:44px 24px;background:#ffffff;" >
      <div style="max-width:1100px;margin:0 auto;" >
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap;" >
          <div style="max-width:700px;" >
            <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;" > Everything you need </h2>
              < p style = "margin:10px 0 0;color:#475569;line-height:1.7;" >
                Use templates, edit HTML quickly, preview instantly and manage SEO.
        </p>
                  </div>
                  < a href = "#" style = "text-decoration:none;border:1px solid #e2e8f0;padding:10px 12px;border-radius:12px;font-weight:900;color:#0f172a;background:#fff;" > Explore </a>
                    </div>

                    < div style = "margin-top:16px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;" >
      ${[
        ["Template Gallery", "Choose full pages and sections with live thumbnails."],
        ["Inline Editing", "Edit code with line numbers and quick actions."],
        ["SEO Panel", "Add focus keyword, title and meta description."],
        ["Safe Preview", "Sandboxed iframe preview (no scripts)."],
        ["Reusable Pages", "Use the same template for multiple pages quickly."],
        ["Fast Publishing", "Save and publish when ready."],
      ]
        .map(
          ([t, d]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;">
        <div style="width:40px;height:40px;border-radius:14px;background:#f5f3ff;border:1px solid #ddd6fe;display:flex;align-items:center;justify-content:center;color:#7c3aed;font-weight:900;">★</div>
        <div style="margin-top:10px;font-weight:900;color:#0f172a;">${t}</div>
        <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
      </div>`
        )
        .join("")
      }
</div>
  </div>
  </section>

  < !--Testimonials -->
    <section style="padding:44px 24px;background:#f8fafc;" >
      <div style="max-width:1100px;margin:0 auto;" >
        <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;" > What people say </h2>
          < div style = "margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;" >
      ${[
        ["“Clean UI and easy editing.”", "Rahul", "Admin"],
        ["“Templates saved a lot of time.”", "Aditi", "Marketing"],
        ["“Preview + SEO is perfect.”", "Vikram", "Founder"],
      ]
        .map(
          ([q, n, r]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;">
        <div style="color:#0f172a;font-weight:900;line-height:1.6;">${q}</div>
        <div style="margin-top:12px;display:flex;gap:10px;align-items:center;">
          <div style="width:38px;height:38px;border-radius:14px;background:#ddd6fe;display:flex;align-items:center;justify-content:center;font-weight:900;color:#4c1d95;">${n[0]}</div>
          <div>
            <div style="font-weight:900;color:#0f172a;line-height:1;">${n}</div>
            <div style="color:#64748b;font-size:12px;margin-top:4px;">${r}</div>
          </div>
        </div>
      </div>`
        )
        .join("")
      }
</div>
  </div>
  </section>

  < !--Pricing -->
    <section style="padding:44px 24px;background:#ffffff;" >
      <div style="max-width:1100px;margin:0 auto;" >
        <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;" > Pricing </h2>
          < p style = "margin:10px 0 0;color:#475569;line-height:1.7;" > Pick a plan and start building pages.</p>

            < div style = "margin-top:14px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;" >
              <div style="border:1px solid #e2e8f0;border-radius:18px;padding:18px;" >
                <div style="font-weight:900;color:#0f172a;" > Starter </div>
                  < div style = "color:#64748b;margin-top:6px;" > For small teams </div>
                    < div style = "margin-top:14px;font-size:30px;font-weight:900;color:#0f172a;" >$9, 999 </div>
                      < ul style = "margin:12px 0 0;padding-left:18px;color:#475569;line-height:1.8;" >
                        <li>Templates </li>
                        < li > Preview </li>
                        < li > Basic SEO </li>
                          </ul>
                          < a href = "#" style = "margin-top:14px;display:inline-block;text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:12px 14px;border-radius:12px;font-weight:900;" > Choose </a>
                            </div>

                            < div style = "border:1px solid #7c3aed;border-radius:18px;padding:18px;box-shadow:0 12px 40px rgba(124,58,237,.18);" >
                              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;" >
                                <div style="font-weight:900;color:#0f172a;" > Pro </div>
                                  < div style = "font-size:12px;font-weight:900;color:#7c3aed;border:1px solid #ddd6fe;padding:6px 10px;border-radius:999px;background:#f5f3ff;" > Popular </div>
                                    </div>
                                    < div style = "color:#64748b;margin-top:6px;" > For growing businesses </div>
                                      < div style = "margin-top:14px;font-size:30px;font-weight:900;color:#0f172a;" >$24, 999 </div>
                                        < ul style = "margin:12px 0 0;padding-left:18px;color:#475569;line-height:1.8;" >
                                          <li>All Starter </li>
                                            < li > Advanced templates </li>
                                              < li > Priority support </li>
                                                </ul>
                                                < a href = "#" style = "margin-top:14px;display:inline-block;text-decoration:none;background:#7c3aed;color:#fff;padding:12px 14px;border-radius:12px;font-weight:900;" > Choose </a>
                                                  </div>

                                                  < div style = "border:1px solid #e2e8f0;border-radius:18px;padding:18px;" >
                                                    <div style="font-weight:900;color:#0f172a;" > Enterprise </div>
                                                      < div style = "color:#64748b;margin-top:6px;" > Custom needs </div>
                                                        < div style = "margin-top:14px;font-size:30px;font-weight:900;color:#0f172a;" > Let’s talk </div>
                                                          < ul style = "margin:12px 0 0;padding-left:18px;color:#475569;line-height:1.8;" >
                                                            <li>Custom layouts </li>
                                                              < li > SLA support </li>
                                                                < li > Dedicated manager </li>
                                                                  </ul>
                                                                  < a href = "#" style = "margin-top:14px;display:inline-block;text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:12px 14px;border-radius:12px;font-weight:900;" > Contact </a>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    </section>

                                                                    < !--FAQ -->
                                                                      <section style="padding:44px 24px;background:#ffffff;" >
                                                                        <div style="max-width:1100px;margin:0 auto;" >
                                                                          <h2 style="margin:0;color:#0f172a;font-size:30px;line-height:1.2;" > FAQ </h2>
                                                                            < div style = "margin-top:14px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;" >
      ${[
        ["Can I edit the HTML?", "Yes, edit directly and preview instantly."],
        ["Can I reuse templates?", "Yes, apply templates to any page."],
        ["Does it support SEO?", "Add SEO title, meta description and keyword."],
        ["Is preview safe?", "Preview runs in sandbox iframe (no scripts)."],
      ]
        .map(
          ([q, a]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
        <div style="font-weight:900;color:#0f172a;">${q}</div>
        <div style="margin-top:6px;color:#64748b;line-height:1.7;">${a}</div>
      </div>`
        )
        .join("")
      }
</div>
  </div>
  </section>

  < !--Footer -->
    <footer style="padding:24px 24px;background:#0b1220;color:#cbd5e1;" >
      <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;" >
        <div style="font-weight:900;" > Website • Premium Builder </div>
          < div style = "display:flex;gap:14px;font-weight:800;font-size:13px;" >
            <a href="#" style = "text-decoration:none;color:#cbd5e1;" > Privacy </a>
              < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Terms </a>
                < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Support </a>
                  </div>
                  </div>
                  </footer>
                    `,
  },
  {
    key: "about-premium-01",
    category: "about",
    name: "About – Company Story",
    desc: "Hero, mission, values, timeline, team, CTA, footer",
    seo: {
      focusKeyword: "about company",
      seoTitle: "About Our Company",
      metaDescription:
        "Learn about our mission, values, team and journey. A premium about page layout ready to customize.",
    },
    html: `
                  < section style = "padding:56px 24px;font-family:ui-sans-serif,system-ui;background:#ffffff;" >
                    <div style="max-width:1100px;margin:0 auto;" >
                      <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;" >
                        <div style="max-width:720px;" >
                          <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;" >
                            <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;" > </span>
          About us
  </div>
  < h1 style = "margin:12px 0 10px;font-size:40px;line-height:1.12;color:#0f172a;" > We build premium experiences </h1>
    < p style = "margin:0;color:#475569;line-height:1.75;max-width:70ch;" >
      Write your company story here.Keep it simple, credible and focused on customer impact.
        </p>
        </div>
        < a href = "#" style = "text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;" > Work with us </a>
        </div>

        < div style = "margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;" >
          <div style="height:240px;background:linear-gradient(135deg,#ddd6fe,#ffffff);display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;" >
            Company Banner Image
              </div>
              </div>

              < div style = "margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:14px;" >
                <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;" >
                  <div style="font-weight:900;color:#0f172a;font-size:18px;" > Mission </div>
                    < div style = "margin-top:8px;color:#64748b;line-height:1.75;" >
                      Describe your mission in 2–4 lines.What do you do, for whom, and why does it matter ?
                        </div>
                        </div>
                        < div style = "border:1px solid #e2e8f0;border-radius:18px;padding:16px;" >
                          <div style="font-weight:900;color:#0f172a;font-size:18px;" > Vision </div>
                            < div style = "margin-top:8px;color:#64748b;line-height:1.75;" >
                              Describe the long - term vision and where you want to take your customers.
        </div>
                                </div>
                                </div>

                                < div style = "margin-top:18px;" >
                                  <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;" > Values </h2>
                                    < div style = "margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;" >
        ${[
        ["Quality", "Premium outcomes with attention to detail."],
        ["Speed", "Fast iterations without breaking trust."],
        ["Transparency", "Clear communication and no surprises."],
      ]
        .map(
          ([t, d]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
          <div style="width:40px;height:40px;border-radius:14px;background:#f5f3ff;border:1px solid #ddd6fe;display:flex;align-items:center;justify-content:center;color:#7c3aed;font-weight:900;">✓</div>
          <div style="margin-top:10px;font-weight:900;color:#0f172a;">${t}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        </div>`
        )
        .join("")
      }
</div>
  </div>

  < div style = "margin-top:18px;" >
    <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;" > Timeline </h2>
      < div style = "margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;" >
        ${[
        ["2022", "Started with a small team."],
        ["2023", "Launched first premium templates."],
        ["2024", "Scaled to multiple brands and clients."],
      ]
        .map(
          ([y, d]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
          <div style="font-weight:900;color:#7c3aed;font-size:18px;">${y}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        </div>`
        )
        .join("")
      }
</div>
  </div>

  < div style = "margin-top:18px;" >
    <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;" > Team </h2>
      < div style = "margin-top:12px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;" >
        ${["A", "B", "C", "D"]
        .map(
          (x, i) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:14px;background:#fff;">
          <div style="height:140px;border-radius:16px;background:#f1f5f9;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;">
            Photo
          </div>
          <div style="margin-top:10px;font-weight:900;color:#0f172a;">Member ${i + 1}</div>
          <div style="margin-top:4px;color:#64748b;font-size:12px;">Role title</div>
        </div>`
        )
        .join("")
      }
</div>
  </div>

  < div style = "margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#faf5ff;" >
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;" >
      <div>
      <div style="font-weight:900;color:#0f172a;font-size:18px;" > Want to collaborate ? </div>
        < div style = "margin-top:6px;color:#475569;line-height:1.7;" > Add your CTA message here.</div>
          </div>
          < a href = "#" style = "text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;" > Contact us </a>
            </div>
            </div>
            </div>
            </section>

            < footer style = "padding:24px 24px;background:#0b1220;color:#cbd5e1;font-family:ui-sans-serif,system-ui;" >
              <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;" >
                <div style="font-weight:900;" > Company </div>
                  < div style = "display:flex;gap:14px;font-weight:800;font-size:13px;" >
                    <a href="#" style = "text-decoration:none;color:#cbd5e1;" > Privacy </a>
                      < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Terms </a>
                        < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Support </a>
                          </div>
                          </div>
                          </footer>
                            `,
  },
  {
    key: "services-premium-01",
    category: "services",
    name: "Services – Premium List",
    desc: "Hero, service cards, process, case studies, CTA, footer",
    seo: {
      focusKeyword: "services",
      seoTitle: "Our Services",
      metaDescription:
        "Explore our services, process and case studies. A premium services page layout ready to customize.",
    },
    html: `
                          < section style = "padding:56px 24px;font-family:ui-sans-serif,system-ui;background:#ffffff;" >
                            <div style="max-width:1100px;margin:0 auto;" >
                              <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;" >
                                <div style="max-width:760px;" >
                                  <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;" >
                                    <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;" > </span>
Services
  </div>
  < h1 style = "margin:12px 0 10px;font-size:40px;line-height:1.12;color:#0f172a;" > Services that grow your business </h1>
    < p style = "margin:0;color:#475569;line-height:1.75;max-width:70ch;" >
      Add a short introduction.Keep it benefit - focused and simple.
        </p>
        </div>
        < a href = "#" style = "text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;" > Get a Quote </a>
          </div>

          < div style = "margin-top:18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;" >
      ${[
        ["Website Development", "Modern responsive pages with premium UI."],
        ["SEO & Content", "Optimize titles, descriptions and page structure."],
        ["Automation", "Integrations and automation rules for growth."],
        ["Email Templates", "Professional templates for marketing campaigns."],
        ["E-commerce Setup", "Catalog, coupons, quotations and checkout."],
        ["Analytics", "Track conversions and improve performance."],
      ]
        .map(
          ([t, d]) => `
      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
        <div style="width:40px;height:40px;border-radius:14px;background:#f5f3ff;border:1px solid #ddd6fe;display:flex;align-items:center;justify-content:center;color:#7c3aed;font-weight:900;">★</div>
        <div style="margin-top:10px;font-weight:900;color:#0f172a;">${t}</div>
        <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        <a href="#" style="margin-top:12px;display:inline-block;text-decoration:none;border:1px solid #e2e8f0;color:#0f172a;padding:10px 12px;border-radius:12px;font-weight:900;">Learn more</a>
      </div>`
        )
        .join("")
      }
</div>

  < div style = "margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#f8fafc;" >
    <div style="font-weight:900;color:#0f172a;font-size:18px;" > Our process </div>
      < div style = "margin-top:12px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;" >
        ${[
        ["1. Discover", "Understand goals and requirements."],
        ["2. Design", "Premium layouts and clean UI."],
        ["3. Build", "Implement and test thoroughly."],
        ["4. Launch", "Deploy and iterate with feedback."],
      ]
        .map(
          ([t, d]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:14px;background:#fff;">
          <div style="font-weight:900;color:#7c3aed;">${t}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${d}</div>
        </div>`
        )
        .join("")
      }
</div>
  </div>

  < div style = "margin-top:18px;" >
    <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-end;flex-wrap:wrap;" >
      <div>
      <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;" > Case studies </h2>
        < p style = "margin:10px 0 0;color:#475569;line-height:1.7;" > Show proof of results.</p>
          </div>
          </div>
          < div style = "margin-top:12px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;" >
        ${[1, 2, 3]
        .map(
          (i) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;overflow:hidden;background:#fff;">
          <div style="height:160px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;">Image</div>
          <div style="padding:14px;">
            <div style="font-weight:900;color:#0f172a;">Project ${i}</div>
            <div style="margin-top:6px;color:#64748b;line-height:1.7;">Short summary of what you delivered.</div>
          </div>
        </div>`
        )
        .join("")
      }
</div>
  </div>

  < div style = "margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#faf5ff;" >
    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;" >
      <div>
      <div style="font-weight:900;color:#0f172a;font-size:18px;" > Ready to start ? </div>
        < div style = "margin-top:6px;color:#475569;line-height:1.7;" > Add a CTA message here.</div>
          </div>
          < a href = "#" style = "text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;" > Contact </a>
            </div>
            </div>
            </div>
            </section>

            < footer style = "padding:24px 24px;background:#0b1220;color:#cbd5e1;font-family:ui-sans-serif,system-ui;" >
              <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;" >
                <div style="font-weight:900;" > Services </div>
                  < div style = "display:flex;gap:14px;font-weight:800;font-size:13px;" >
                    <a href="#" style = "text-decoration:none;color:#cbd5e1;" > Privacy </a>
                      < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Terms </a>
                        < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Support </a>
                          </div>
                          </div>
                          </footer>
                            `,
  },
  {
    key: "contact-premium-01",
    category: "contact",
    name: "Contact – Premium",
    desc: "CTA band, contact info, map placeholder, form layout, FAQ, footer",
    seo: {
      focusKeyword: "contact",
      seoTitle: "Contact Us",
      metaDescription:
        "Get in touch with us. Use this premium contact page layout with CTA, contact details and form section.",
    },
    html: `
                          < section style = "padding:56px 24px;font-family:ui-sans-serif,system-ui;background:#ffffff;" >
                            <div style="max-width:1100px;margin:0 auto;" >
                              <div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;" >
                                <div style="max-width:760px;" >
                                  <div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e2e8f0;border-radius:999px;padding:7px 10px;color:#334155;font-size:12px;background:#fff;" >
                                    <span style="width:8px;height:8px;border-radius:999px;background:#7c3aed;display:inline-block;" > </span>
Contact
  </div>
  < h1 style = "margin:12px 0 10px;font-size:40px;line-height:1.12;color:#0f172a;" > Let’s talk </h1>
    < p style = "margin:0;color:#475569;line-height:1.75;max-width:70ch;" >
      Add a short line about response time and what details the customer should share.
        </p>
        </div>
        < a href = "#" style = "text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;" > Book a Call </a>
          </div>

          < div style = "margin-top:18px;border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#f8fafc;" >
            <div style="display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;" >
              <div>
              <div style="font-weight:900;color:#0f172a;font-size:18px;" > Need quick help ? </div>
                < div style = "margin-top:6px;color:#475569;line-height:1.7;" > Email us and we’ll reply within 24 hours.</div>
                  </div>
                  < a href = "#" style = "text-decoration:none;background:#0f172a;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;" > support@example.com</a>
                    </div>
                    </div>

                    < div style = "margin-top:18px;display:grid;grid-template-columns:.9fr 1.1fr;gap:14px;" >
                      <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;" >
                        <div style="font-weight:900;color:#0f172a;font-size:18px;" > Contact info </div>
                          < div style = "margin-top:10px;color:#64748b;line-height:1.8;" >
                            <strong style="color:#0f172a;" > Email: </strong> support@example.com<br/ >
                              <strong style="color:#0f172a;" > Phone: </strong> +91 99999 99999<br/ >
                                <strong style="color:#0f172a;" > Address: </strong> Your address here
                                  </div>

                                  < div style = "margin-top:12px;border-top:1px solid #e2e8f0;padding-top:12px;" >
                                    <div style="font-weight:900;color:#0f172a;" > Office hours </div>
                                      < div style = "margin-top:6px;color:#64748b;" > Mon–Sat, 10:00 AM – 6:00 PM </div>
                                        </div>

                                        < div style = "margin-top:12px;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;" >
                                          <div style="height:180px;background:#f1f5f9;display:flex;align-items:center;justify-content:center;color:#64748b;font-weight:900;" >
                                            Map Placeholder
                                              </div>
                                              </div>
                                              </div>

                                              < div style = "border:1px solid #e2e8f0;border-radius:18px;padding:16px;background:#fff;" >
                                                <div style="font-weight:900;color:#0f172a;font-size:18px;" > Send a message </div>

                                                  < div style = "margin-top:12px;display:grid;grid-template-columns:1fr 1fr;gap:10px;" >
                                                    <div>
                                                    <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;" > Name </div>
                                                      < div style = "border:1px solid #e2e8f0;border-radius:12px;height:42px;background:#fff;" > </div>
                                                        </div>
                                                        < div >
                                                        <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;" > Email </div>
                                                          < div style = "border:1px solid #e2e8f0;border-radius:12px;height:42px;background:#fff;" > </div>
                                                            </div>
                                                            </div>

                                                            < div style = "margin-top:10px;" >
                                                              <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;" > Subject </div>
                                                                < div style = "border:1px solid #e2e8f0;border-radius:12px;height:42px;background:#fff;" > </div>
                                                                  </div>

                                                                  < div style = "margin-top:10px;" >
                                                                    <div style="font-size:12px;color:#475569;font-weight:900;margin-bottom:6px;" > Message </div>
                                                                      < div style = "border:1px solid #e2e8f0;border-radius:12px;height:140px;background:#fff;" > </div>
                                                                        </div>

                                                                        < a href = "#" style = "margin-top:12px;display:inline-block;text-decoration:none;background:#7c3aed;color:#fff;padding:12px 16px;border-radius:14px;font-weight:900;" >
                                                                          Submit
                                                                          </a>

                                                                          < div style = "margin-top:14px;color:#94a3b8;font-size:12px;line-height:1.7;" >
                                                                            Note: This is template UI.Replace with your real form integration.
        </div>
                                                                              </div>
                                                                              </div>

                                                                              < div style = "margin-top:18px;" >
                                                                                <h2 style="margin:0;color:#0f172a;font-size:28px;line-height:1.2;" > FAQ </h2>
                                                                                  < div style = "margin-top:12px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;" >
        ${[
        ["How fast do you respond?", "Usually within 24 hours on business days."],
        ["Can we schedule a call?", "Yes, add a link to your booking page."],
        ["Do you support WhatsApp?", "Add WhatsApp number if required."],
        ["Where are you located?", "Add your location in the map placeholder."],
      ]
        .map(
          ([q, a]) => `
        <div style="border:1px solid #e2e8f0;border-radius:18px;padding:16px;">
          <div style="font-weight:900;color:#0f172a;">${q}</div>
          <div style="margin-top:6px;color:#64748b;line-height:1.7;">${a}</div>
        </div>`
        )
        .join("")
      }
</div>
  </div>
  </div>
  </section>

  < footer style = "padding:24px 24px;background:#0b1220;color:#cbd5e1;font-family:ui-sans-serif,system-ui;" >
    <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;align-items:center;" >
      <div style="font-weight:900;" > Contact </div>
        < div style = "display:flex;gap:14px;font-weight:800;font-size:13px;" >
          <a href="#" style = "text-decoration:none;color:#cbd5e1;" > Privacy </a>
            < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Terms </a>
              < a href = "#" style = "text-decoration:none;color:#cbd5e1;" > Support </a>
                </div>
                </div>
                </footer>
                  `,
  },
];
