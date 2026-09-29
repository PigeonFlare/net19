globalThis.net19Theme = {
  later: /^(?:文心(?:一言|助手|智能体)?|文心大模型|库库\s*AI|百度搭子|AI\s*(?:搜索|助手|伙伴|写作|绘画|作图|翻译|对话|问答|工具|创作|笔记|智能体)|智能体|问一问|AI\s*帮我写)$/i,
};
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
  net19.watch(fix);
})();
