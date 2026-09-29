globalThis.net19Theme = {
  intended: '[data-n19-later]',
  later: /^(?:AIモード(?:で検索)?|AIアシスタント|AIエージェント|Agent\s*i|AIに質問(?:する)?|AIチャット|AIで(?:回答|要約|質問|検索)|AI(?:回答|要約|検索|で要約する)|AIが(?:回答|要約)|NEW\s*Agent\s*i|i\s*と探す|AIと探す)$/i,
};
(() => {
  const SERVICES_LATER = /^(ZOZOTOWN|ふるさと納税|出前館|LINE MUSIC|LINE 占い|LINE STORE|LINEスキマニ|マイベスト|toto|ズバトク|おこづかい稼ぎ|PayPay残高確認|X（旧Twitter）データについて|写真を使ってAIでオリジナル画像を作ろう)$/;
  const fix = () => {
    for (const heading of document.querySelectorAll('h2, h3')) if (heading.textContent.trim() === 'AIに聞いてみよう' && !heading.closest('[data-n19-later]')) (heading.closest('section') || heading.parentElement).setAttribute('data-n19-later', '');
    for (const link of document.querySelectorAll('#ToolList a:not([data-n19-seen]), a:not([data-n19-seen])')) {
      link.setAttribute('data-n19-seen', '');
      if (SERVICES_LATER.test(link.textContent.replace(/\s+/g, ' ').trim())) (link.closest('#ToolList li') || link.closest('li') || link).setAttribute('data-n19-later', '');
    }
  };
  const later = net19.watch(fix);
})();
