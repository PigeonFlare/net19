// net19 handmade theme: Fox News, 2019. Fox News has no dark mode on the web; default detection keeps it light.
// Later additions labelled in the menus: OutKick (2021), the AI section, Games, Deals, "Listen" to articles.
globalThis.net19Theme = { later: /^(?:outkick(?: sports| culture| betting| analysis)?|games|deals|listen to this article|you can now listen to fox news articles!?|add fox news on google)$/i, keepLabels: /^(?:video|watch tv)$/i };
