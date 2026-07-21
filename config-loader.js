/* Config Loader for Sem Parar Client Site */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Track Visitor
    fetch("api.php?action=track")
        .then(res => res.json())
        .catch(err => console.error("Tracking error:", err));

    // 2. Fetch and apply configuration
    fetch("api.php?action=config")
        .then(res => res.json())
        .then(config => {
            if (!config) return;
            applyConfig(config);
        })
        .catch(err => console.error("Config loading error:", err));
});

function applyConfig(config) {
    // --- APP DOWNLOAD REDIRECTIONS & CTA BUTTONS ---
    let downloadUrl = "";
    const app = config.app_download;
    
    if (app) {
        if (app.tipo === "apk") {
            downloadUrl = app.apk_url || "semparar.apk";
        } else if (app.tipo === "custom") {
            downloadUrl = app.link_customizado;
        } else {
            downloadUrl = app.google_play_url;
        }

        // Update all footer App Store buttons
        const playStoreBtns = document.querySelectorAll('a[href*="play.google.com/store/apps"]');
        playStoreBtns.forEach(btn => {
            btn.href = downloadUrl;
            // If there's an image inside, keep it
        });

        const appStoreBtns = document.querySelectorAll('a[href*="apps.apple.com"]');
        appStoreBtns.forEach(btn => {
            if (app.tipo === "apk") {
                // If it is APK, direct iOS users to the APK as well or to custom url
                btn.href = downloadUrl;
            } else if (app.tipo === "custom") {
                btn.href = app.link_customizado;
            } else {
                btn.href = app.app_store_url;
            }
        });

        // Update main call-to-action buttons to redirect to the configured download URL or WhatsApp
        // We target buttons that originally do signups or "eu quero"
        const ctaButtons = document.querySelectorAll('.buy-now-button, a[href="#planos-cartoes"], a[href="#planos-tag"]');
        ctaButtons.forEach(btn => {
            // Remove click events or attributes that open the original cart checkout
            btn.removeAttribute('data-action');
            btn.removeAttribute('data-product-sku');
            
            // If it is a button element, wrap or convert to click handler
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Redirect to download app
                window.location.href = downloadUrl;
            });
        });
        
        // Also update text if configured
        if (app.texto_botao) {
            const btnTexts = document.querySelectorAll('.buy-now-button span, a[href="#planos-cartoes"] span');
            btnTexts.forEach(span => {
                span.textContent = app.texto_botao.toUpperCase();
            });
        }
    }

    // --- TELEVENDAS & SUPORTE CONTACTS ---
    const t = config.contatos ? config.contatos.televendas : null;
    if (t) {
        // Capital Televendas
        const capitalLinks = document.querySelectorAll('a[href*="tel:30037367"]');
        capitalLinks.forEach(link => {
            link.href = "tel:" + t.telefone_capitais.replace(/[^0-9]/g, '');
            // update text content preserving sub-elements
            const p = link.querySelector('p');
            if (p) {
                p.innerHTML = `${t.telefone_capitais}<br><span class="contacts__label">${t.telefone_capitais_label}</span>`;
            } else {
                link.textContent = t.telefone_capitais;
            }
        });

        // Demais Localidades
        const demaisLinks = document.querySelectorAll('a[href*="tel:08007217367"]');
        demaisLinks.forEach(link => {
            link.href = "tel:" + t.telefone_demais.replace(/[^0-9]/g, '');
            const p = link.querySelector('p');
            if (p) {
                p.innerHTML = `${t.telefone_demais}<br><span class="contacts__label">${t.telefone_demais_label}</span>`;
            } else {
                link.textContent = t.telefone_demais;
            }
        });

        // Whatsapp Televendas
        const teleWhatsappLinks = document.querySelectorAll('a[href*="5511993158147"]');
        teleWhatsappLinks.forEach(link => {
            link.href = `https://api.whatsapp.com/send?phone=${t.whatsapp_numero}&text=Olá!`;
            const span = link.querySelector('span');
            if (span) {
                span.innerHTML = `${t.whatsapp_display}<br>`;
            } else {
                link.textContent = t.whatsapp_display;
            }
        });
    }

    const s = config.contatos ? config.contatos.suporte : null;
    if (s) {
        // Whatsapp Suporte
        const supportWhatsappLinks = document.querySelectorAll('a[href*="5511989912822"]');
        supportWhatsappLinks.forEach(link => {
            link.href = `https://api.whatsapp.com/send?phone=${s.whatsapp_numero}&text=Olá!`;
            const span = link.querySelector('span');
            if (span) {
                span.innerHTML = `${s.whatsapp_display}<br>`;
            } else {
                link.textContent = s.whatsapp_display;
            }
        });
    }

    // --- FOOTER CONTACT INFO ---
    const f = config.contatos ? config.contatos.footer : null;
    if (f) {
        // Footer Whatsapp link
        const footerWaLink = document.querySelector('.temporary-footer-column.sac a');
        if (footerWaLink) {
            footerWaLink.href = `https://api.whatsapp.com/send?phone=${f.whatsapp_atendimento_numero}&text=Olá!`;
            footerWaLink.textContent = f.whatsapp_atendimento;
        }

        // Relationship Central
        const relationshipCol = document.querySelector('.temporary-footer-column.auditivos');
        if (relationshipCol) {
            relationshipCol.innerHTML = `
                <span>Central de relacionamento:</span><br>
                <span>${f.central_capitais} (Capitais)</span><br>
                <span>${f.central_demais} (Demais localidades)</span>
            `;
        }

        // SAC & Ouvidoria
        const ouvidoriaCol = document.querySelector('.ouvidoria.temporary-footer-wrapper');
        if (ouvidoriaCol) {
            ouvidoriaCol.innerHTML = `
                <span class="temporary-footer-column mr-md-5">
                    <span>SAC:</span><br>
                    <span>${f.sac}</span><br>
                    <span>${f.sac_auditivos} (deficientes auditivos)</span>
                </span>
                <span class="temporary-footer-column">
                    <span>Ouvidoria Sem Parar:</span><br>
                    <span>${f.ouvidoria}</span>
                </span>
            `;
        }
    }

    // --- SOCIAL MEDIA LINKS ---
    const soc = config.redes_sociais;
    if (soc) {
        // Instagram
        const instaLinks = document.querySelectorAll('a[href*="instagram.com/sempararoficial"]');
        instaLinks.forEach(link => link.href = soc.instagram);

        // TikTok
        const tiktokLinks = document.querySelectorAll('a[href*="tiktok.com/@sempararoficial"]');
        tiktokLinks.forEach(link => link.href = soc.tiktok);

        // YouTube
        const ytLinks = document.querySelectorAll('a[href*="youtube.com/user/sempararoficial"]');
        ytLinks.forEach(link => link.href = soc.youtube);

        // Facebook
        const fbLinks = document.querySelectorAll('a[href*="facebook.com/sempararoficial"]');
        fbLinks.forEach(link => link.href = soc.facebook);

        // Twitter
        const twLinks = document.querySelectorAll('a[href*="twitter.com/sempararoficial"]');
        twLinks.forEach(link => link.href = soc.twitter);

        // Blog
        const blogLinks = document.querySelectorAll('a[href*="blog.semparar.com.br"]');
        blogLinks.forEach(link => link.href = soc.blog);
    }

    // --- HERO BANNER ---
    const ban = config.banner;
    if (ban) {
        // Badge
        const heroBadge = document.querySelector('.banner-home__badge');
        if (heroBadge && ban.badge) heroBadge.textContent = ban.badge;

        // Title
        const heroTitle = document.querySelector('.banner-home__title');
        if (heroTitle && ban.titulo_linha1) {
            heroTitle.innerHTML = `${ban.titulo_linha1}<span style="color: #d60b52;"><br>${ban.titulo_linha2}</span>`;
        }

        // Subtitle
        const heroSubtitle = document.querySelector('.banner-home__subtitle');
        if (heroSubtitle && ban.subtitulo) heroSubtitle.innerHTML = ban.subtitulo.replace(/\n/g, '<br>');

        // Button text
        const heroBtn = document.querySelector('.banner-home button span');
        if (heroBtn && ban.texto_botao) heroBtn.textContent = ban.texto_botao.toUpperCase();

        // Banner footer observation text
        const bannerSmall = document.querySelector('.banner-home small.banner-home__text');
        if (bannerSmall && ban.oferta_texto) bannerSmall.textContent = ban.oferta_texto;
    }

    // --- MENU NAVIGATION LINKS ---
    const nav = config.menu_links;
    if (nav) {
        const contaLinks = document.querySelectorAll('a[href*="minhaconta.semparar.com.br"]');
        contaLinks.forEach(link => link.href = nav.minha_conta);

        const planosLinks = document.querySelectorAll('a[href*="semparar.com.br/planos"]');
        planosLinks.forEach(link => link.href = nav.planos);

        const ativarLinks = document.querySelectorAll('a[href*="semparar.com.br/ative"]');
        ativarLinks.forEach(link => link.href = nav.ativar_tag);

        const parceriasLinks = document.querySelectorAll('a[href*="semparar.com.br/parcerias"]');
        parceriasLinks.forEach(link => link.href = nav.parcerias);

        const ondeUsarLinks = document.querySelectorAll('a[href*="semparar.com.br/onde-usar"]');
        ondeUsarLinks.forEach(link => link.href = nav.onde_usar);

        const comoFuncionaLinks = document.querySelectorAll('a[href*="semparar.com.br/como-funciona"]');
        comoFuncionaLinks.forEach(link => link.href = nav.como_funciona);

        const freeFlowLinks = document.querySelectorAll('a[href*="semparar.com.br/free-flow"]');
        freeFlowLinks.forEach(link => link.href = nav.free_flow);

        const segurosLinks = document.querySelectorAll('a[href*="semparar.com.br/seguros"]');
        segurosLinks.forEach(link => link.href = nav.seguros);

        const guinchoLinks = document.querySelectorAll('a[href*="semparar.com.br/sem-parar-agora"]');
        guinchoLinks.forEach(link => link.href = nav.guincho);

        const empresasLinks = document.querySelectorAll('a[href*="sempararempresas.com.br"]');
        empresasLinks.forEach(link => link.href = nav.empresas);

        const credenciadosLinks = document.querySelectorAll('a[href*="credenciados.semparar.com.br"]');
        credenciadosLinks.forEach(link => link.href = nav.credenciados);
    }
}
