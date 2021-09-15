import{o as n,c as a,e as s}from"./app.4dcb24bf.js";const t='{"title":"The SWTC Wallet Package","description":"","frontmatter":{},"headers":[{"level":2,"title":"@swtc/wallet == jingtum-base-lib","slug":"swtc-wallet-jingtum-base-lib"},{"level":2,"title":"but it is beyond","slug":"but-it-is-beyond"},{"level":3,"title":"import","slug":"import"}],"relativePath":"docs/swtcwallet/README.md","lastUpdated":1631590649595}',e={},p=[s('<h1 id="the-swtc-wallet-package" tabindex="-1">The SWTC Wallet Package <a class="header-anchor" href="#the-swtc-wallet-package" aria-hidden="true">#</a></h1><h2 id="swtc-wallet-jingtum-base-lib" tabindex="-1">@swtc/wallet == jingtum-base-lib <a class="header-anchor" href="#swtc-wallet-jingtum-base-lib" aria-hidden="true">#</a></h2><h2 id="but-it-is-beyond" tabindex="-1">but it is beyond <a class="header-anchor" href="#but-it-is-beyond" aria-hidden="true">#</a></h2><h3 id="import" tabindex="-1">import <a class="header-anchor" href="#import" aria-hidden="true">#</a></h3><div class="language-javascript"><pre><code><span class="token keyword">const</span> Wallet <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@swtc/wallet&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Wallet <span class="token comment">// 井通钱包</span>\n<span class="token keyword">const</span> wallet <span class="token operator">=</span> Wallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> base <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Wallet</span><span class="token punctuation">(</span>wallet<span class="token punctuation">.</span>secret<span class="token punctuation">)</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>wallet<span class="token punctuation">)</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>base<span class="token punctuation">.</span><span class="token function">sign</span><span class="token punctuation">(</span><span class="token string">&quot;hello world&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> Factory <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@swtc/wallet&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Factory\n<span class="token keyword">const</span> BizainWallet <span class="token operator">=</span> <span class="token function">Factory</span><span class="token punctuation">(</span><span class="token string">&quot;bizain&quot;</span><span class="token punctuation">)</span> <span class="token comment">// 商链钱包</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>BizainWallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> RippleWallet <span class="token operator">=</span> <span class="token function">Factory</span><span class="token punctuation">(</span><span class="token string">&quot;ripple&quot;</span><span class="token punctuation">)</span> <span class="token comment">// 瑞波钱包</span>\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>RippleWallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>\n</code></pre></div>',5)];e.render=function(s,t,e,o,c,l){return n(),a("div",null,p)};export{t as __pageData,e as default};
