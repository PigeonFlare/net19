// net19 handmade theme: Baidu, 2019. Baidu has no dark mode; default detection keeps it light and the device's dark
// setting flips the page. Entry points that came after 2019 are hidden by their labels: 文心一言 / 文心助手 (ERNIE Bot,
// 2023), 库库AI, 百度搭子 and the AI search and writing tools.
globalThis.net19Theme = {
  later: /^(?:文心(?:一言|助手|智能体)?|文心大模型|库库\s*AI|百度搭子|AI\s*(?:搜索|助手|伙伴|写作|绘画|作图|翻译|对话|问答|工具|创作|笔记|智能体)|智能体|问一问|AI\s*帮我写)$/i,
};
// AI answers in results (the "AI总结…" card and cards marked as model output) are hidden one result at a time, by the
// label Baidu prints under them; the result block is the smallest element holding the answer.
(() => {
  const AI = /^(?:AI总结\d*篇?.*生成|内容由AI生成|由文心大模型生成|AI生成|以上内容由AI.*)$/;
  const fix = () => {
    for (const result of document.querySelectorAll('#content_left > .c-container:not([data-net19-hidden])')) {
      for (const node of result.querySelectorAll('span, div, p')) {
        if (node.children.length || !AI.test((node.textContent || '').trim())) continue;
        result.setAttribute('data-net19-hidden', '');
        break;
      }
    }
  };
  let queued = false;
  const later = () => { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; fix(); }); };
  const start = () => { fix(); new MutationObserver(later).observe(document.body, { childList: true, subtree: true }); };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start, { once: true });
})();
