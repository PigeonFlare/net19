globalThis.net19Theme = (() => {
  const host = location.hostname;
  const site = host.startsWith('faq.') ? 'faq' : host.startsWith('blog.') ? 'blog' : 'www';
  document.documentElement.setAttribute('data-n19-wa', site);
  return {
    light: site === 'faq' ? { '#1B8755': '#1cb39b', '#128C7E': '#1ebea5', '#02A698': '#1cb39b', '#25D366': '#01e675' } : {},
    dark: site === 'faq' ? { '#1B8755': '#1cb39b', '#128C7E': '#1ebea5', '#02A698': '#1cb39b', '#25D366': '#01e675' } : {},
    later: /^(?:meta ai|channels|whatsapp plus|ask meta ai)$/i,
  };
})();
(() => {
  if (document.documentElement.getAttribute('data-n19-wa') === 'faq') return;
  const BG = { 'rgb(252, 245, 235)': 'cream', 'rgb(17, 27, 33)': 'dark', 'rgb(230, 255, 218)': 'mint', 'rgb(11, 20, 26)': 'dark' };
  const INK = { 'rgb(37, 211, 102)': 'green', 'rgb(67, 205, 102)': 'green', 'rgb(0, 168, 132)': 'green', 'rgb(16, 57, 40)': 'deep', 'rgb(0, 128, 105)': 'green' };
  const seenSections = new WeakSet();
  const mark = scope => {
    for (const el of [scope, ...scope.querySelectorAll('*')]) {
      if (el.namespaceURI !== 'http://www.w3.org/1999/xhtml' || el.hasAttribute('data-n19-wa-seen') || seenSections.has(el)) continue;
      if (el.tagName === 'SECTION') seenSections.add(el); else el.setAttribute('data-n19-wa-seen', '');
      const cs = getComputedStyle(el);
      const bg = BG[cs.backgroundColor]; if (bg) el.setAttribute('data-n19-wa-bg', bg);
      const ink = INK[cs.color]; if (ink && !el.closest('a[class*="_9u4i"]')) el.setAttribute('data-n19-wa-ink', ink);
      if (parseFloat(cs.fontSize) >= 30 && el.childElementCount < 4) el.setAttribute('data-n19-wa-type', 'display');
      if (el.matches('#content-wrapper ._ain8')) el.setAttribute('data-net19-keep', '');
    }
  };
  const parts = () => {
    const head = document.querySelector('header');
    if (head && !head.hasAttribute('data-n19-wa-part') && head.querySelector('a[href*="faq.whatsapp.com"], a[href$="/privacy"], a[href*="/download"]')) { head.setAttribute('data-n19-wa-part', 'head'); head.setAttribute('data-net19-keep', ''); }
    const foot = document.querySelector('footer');
    if (foot && !foot.hasAttribute('data-n19-wa-part')) { foot.setAttribute('data-n19-wa-part', 'foot'); foot.setAttribute('data-net19-keep', ''); }
  };
  let pending = new Set(), queued = false;
  const flush = () => { queued = false; parts(); const list = [...pending]; pending = new Set(); for (const n of list) if (n.isConnected) mark(n); };
  const start = () => {
    parts(); mark(document.body);
    new MutationObserver(records => {
      for (const r of records) for (const n of r.addedNodes) if (n.nodeType === 1) pending.add(n);
      if (pending.size && !queued) { queued = true; setTimeout(flush, 120); }
    }).observe(document.body, { childList: true, subtree: true });
    addEventListener('load', () => { for (const el of document.querySelectorAll('[data-n19-wa-seen]:not([data-n19-wa-bg]):not([data-n19-wa-ink])')) el.removeAttribute('data-n19-wa-seen'); parts(); mark(document.body); }, { once: true });
  };
  net19.onBody(start);
})();
(() => {
  if (document.documentElement.getAttribute('data-n19-wa') !== 'www') return;
  const LATER = /^(?:New! Call on WhatsApp Web|With private messaging and calling.*|Never miss a moment.*|Keep in touch\s*with your groups|Say what\s*you feel|Stay up to date)$/i;
  const WORDS = new Map([['Message privately', 'Simple. Secure. Reliable messaging.'], ['Speakfreely', 'Security by Default'], ['Transformyour business', 'WhatsApp Business']]);
  const fix = () => {
    for (const h of document.querySelectorAll('section h1, section h2')) {
      const text = h.textContent.replace(/\s+/g, ' ').trim();
      const joined = h.textContent.replace(/\s+/g, '');
      const section = h.closest('section');
      if (!section) continue;
      if ((LATER.test(globalThis.net19English(text)) || LATER.test(joined)) && !section.hasAttribute('data-n19-wa-later')) section.setAttribute('data-n19-wa-later', '');
      const to = WORDS.get(text) || WORDS.get(joined);
      if (to && h.textContent !== to) { h.textContent = to; if (h.tagName === 'H1') h.setAttribute('data-n19-wa-hero', ''); }
    }
  };
  const start = () => { fix(); new MutationObserver(() => requestAnimationFrame(fix)).observe(document.body, { childList: true, subtree: true }); };
  net19.onBody(start);
})();
globalThis.net19Theme.words = {"Avisos de seguridad": "Security Advisories", "Avisos de seguridad más recientes de WhatsApp": "WhatsApp's latest security advisories", "Mapa del sitio": "Sitemap", "Avis de sécurité": "Security Advisories", "Derniers avis de WhatsApp concernant la sécurité": "WhatsApp's latest security advisories", "Plan du site": "Sitemap", "Criar uma conta": "Create an account", "Insira seu número de telefone": "Enter your phone number", "Sujeito a taxas de mensagens e dados. Leia nossa": "Message and data rates may apply. Read our", "Política de Privacidade": "Privacy Policy", "e clique em \"Começar\" para aceitar os": "and click “Get started” to accept the", "Termos de Serviço": "Terms of Service", "Começar": "Get started", "Já tem uma conta?": "Already have an account?", "Entrar": "Log in", "Alertas de Segurança": "Security Advisories", "Avisos de segurança recentes do WhatsApp": "WhatsApp's latest security advisories", "Avvisi sulla sicurezza": "Security Advisories", "Ultimi avvisi di WhatsApp sulla sicurezza": "WhatsApp's latest security advisories", "Mappa del sito": "Sitemap", "セキュリティ勧告": "Security Advisories", "WhatsAppの最新のセキュリティ勧告": "WhatsApp's latest security advisories", "サイトマップ": "Sitemap", "创建账户": "Create an account", "输入你的电话号码": "Enter your phone number", "这可能会产生短信和流量费用。阅读我们的": "Message and data rates may apply. Read our", "隐私政策": "Privacy Policy", "，然后点击“立即开始”以接受": "and click “Get started” to accept the", "服务条款": "Terms of Service", "立即开始": "Get started", "已经有账户了？": "Already have an account?", "登录": "Log in", "安全声明": "Security Advisories", "WhatsApp 的最新安全建议": "WhatsApp's latest security advisories", "网站地图": "Sitemap", "YouTube": "Youtube", "보안 권고": "Security Advisories", "WhatsApp의 최신 보안 권고": "WhatsApp's latest security advisories", "사이트맵": "Sitemap", "Информация о безопасности": "Security Advisories", "Обновленный справочный центр по безопасности в WhatsApp": "WhatsApp's latest security advisories", "Карта сайта": "Sitemap", "सुरक्षा सलाह": "Security Advisories", "WhatsApp की सुरक्षा से जुड़ी हाल ही की सलाह": "WhatsApp's latest security advisories", "साइटमैप": "Sitemap", "إنشاء حساب": "Create an account", "أدخِل رقم هاتفك": "Enter your phone number", "قد تنطبق رسوم الرسائل واستخدام البيانات. اقرأ": "Message and data rates may apply. Read our", "سياسة الخصوصية": "Privacy Policy", "وانقر على \"بدء الاستخدام\" لقبول": "and click “Get started” to accept the", "شروط الخدمة": "Terms of Service", "بدء الاستخدام": "Get started", "هل لديك حساب بالفعل؟": "Already have an account?", "تسجيل الدخول": "Log in", "تنبيهات الأمان": "Security Advisories", "أحدث هيئة استشارية للأمان في واتساب": "WhatsApp's latest security advisories", "خريطة الموقع": "Sitemap"};
