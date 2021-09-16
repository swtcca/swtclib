import{o as n,c as s,e as a}from"./app.2c18be1c.js";const t='{"title":"浏览器交互运行","description":"","frontmatter":{},"headers":[{"level":2,"title":"准备","slug":"准备"},{"level":2,"title":"运行方式","slug":"运行方式"},{"level":2,"title":"这样我们就可以得到如下的运行于浏览器终端中的版本，直接更新信息到网页上","slug":"这样我们就可以得到如下的运行于浏览器终端中的版本，直接更新信息到网页上"}],"relativePath":"docs/examples/W01/index.md","lastUpdated":1631590646720}',p={},o=[a('<h1 id="浏览器交互运行" tabindex="-1">浏览器交互运行 <a class="header-anchor" href="#浏览器交互运行" aria-hidden="true">#</a></h1><h2 id="准备" tabindex="-1">准备 <a class="header-anchor" href="#准备" aria-hidden="true">#</a></h2><ol><li>进入 playground 目录</li></ol><div class="language-bash"><pre><code>$ <span class="token builtin class-name">cd</span> playground\n</code></pre></div><ol start="2"><li>(可选)生成一个默认配置文件 package.json</li></ol><div class="language-bash"><pre><code>$ <span class="token function">npm</span> init -y\n</code></pre></div><ol start="3"><li>生成网页文件</li></ol><div class="language-bash"><pre><code><span class="token comment"># 拷贝风格文件</span>\n$ <span class="token function">cp</span> <span class="token punctuation">..</span>/<span class="token punctuation">..</span>/styles.css <span class="token builtin class-name">.</span>\n<span class="token comment"># 目录结构</span>\n$ tree\n<span class="token builtin class-name">.</span>\n├── index.html\n├── styles.css\n</code></pre></div><ol start="4"><li>index.html， 简单的内容如下</li></ol><div class="language-html"><pre><code><span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>en<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">&gt;</span></span>浏览器运行时<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>utf-8<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span>\n      <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>viewport<span class="token punctuation">&quot;</span></span>\n      <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no<span class="token punctuation">&quot;</span></span>\n    <span class="token punctuation">/&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>stylesheet<span class="token punctuation">&quot;</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>styles.css<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n    <span class="token comment">&lt;!-- 装扮一下页面 --&gt;</span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">src</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>https://unpkg.com/@swtc/lib<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>head</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>body</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>main</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h1</span><span class="token punctuation">&gt;</span></span>浏览器<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h1</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h3</span><span class="token punctuation">&gt;</span></span>钱包<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h3</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hr</span> <span class="token punctuation">/&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>section</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>js-wallet<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>section</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h3</span><span class="token punctuation">&gt;</span></span>帐本<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h3</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hr</span> <span class="token punctuation">/&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>section</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>js-ledger<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>section</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h3</span><span class="token punctuation">&gt;</span></span>价格<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h3</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>hr</span> <span class="token punctuation">/&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>section</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>js-price<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>section</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>main</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>body</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>html</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><h2 id="运行方式" tabindex="-1">运行方式 <a class="header-anchor" href="#运行方式" aria-hidden="true">#</a></h2><ol><li>交互式运行</li></ol><ul><li>浏览器中打开 index.html</li><li>打开 Javascript Console, 处于浏览器运行时的交互模式</li><li>类似于 node.js 交互式运行，每个命令都有即时反馈</li><li>不同于 node.js 运行，导入@swtc/lib 是在 html 文件中指定了</li><li><a href="./../C01/">除了导入库不同外其他代码和 node.js 完全不变</a></li></ul><div class="language-javascript"><pre><code><span class="token operator">&gt;</span> <span class="token keyword">const</span> Wallet <span class="token operator">=</span> swtc_lib<span class="token punctuation">.</span>Wallet\n  <span class="token keyword">const</span> Remote <span class="token operator">=</span> swtc_lib<span class="token punctuation">.</span>Remote\n<span class="token keyword">undefined</span>\n</code></pre></div><ol start="2"><li>javascript 除了在终端中显示信息外，更可以直接操纵网页元素</li></ol><div class="language-javascript"><pre><code><span class="token operator">&gt;</span> <span class="token keyword">const</span> dom_wallet <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;.js-wallet&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> dom_ledger <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;.js-ledger&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> dom_price <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;.js-price&#39;</span><span class="token punctuation">)</span>\n<span class="token keyword">undefined</span>\n<span class="token operator">&gt;</span> dom_wallet<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;h3&gt;钱包&lt;/h3&gt;</span><span class="token template-punctuation string">`</span></span>\n  <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">&quot;alert可以代替console.log&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">undefined</span>\n</code></pre></div><h2 id="这样我们就可以得到如下的运行于浏览器终端中的版本，直接更新信息到网页上" tabindex="-1">这样我们就可以得到如下的运行于浏览器终端中的版本，直接更新信息到网页上 <a class="header-anchor" href="#这样我们就可以得到如下的运行于浏览器终端中的版本，直接更新信息到网页上" aria-hidden="true">#</a></h2><div class="language-javascript"><pre><code><span class="token operator">&gt;</span> <span class="token keyword">const</span> Wallet <span class="token operator">=</span> swtc_lib<span class="token punctuation">.</span>Wallet\n  <span class="token keyword">const</span> Remote <span class="token operator">=</span> swtc_lib<span class="token punctuation">.</span>Remote\n  <span class="token keyword">const</span> dom_wallet <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;.js-wallet&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> dom_ledger <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;.js-ledger&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> dom_price <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">querySelector</span><span class="token punctuation">(</span><span class="token string">&#39;.js-price&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> remote <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Remote</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> currency_swt <span class="token operator">=</span> remote<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> currency_cny <span class="token operator">=</span> remote<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token string">&#39;CNY&#39;</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> swt_vs_cny <span class="token operator">=</span> <span class="token punctuation">{</span> limit<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span> gets<span class="token operator">:</span> currency_swt<span class="token punctuation">,</span> pays<span class="token operator">:</span> currency_cny <span class="token punctuation">}</span>\n\n  <span class="token comment">// 收到ROUND次数的帐本后结束程序</span>\n  <span class="token keyword">const</span> <span class="token constant">ROUND</span> <span class="token operator">=</span> <span class="token number">20</span>\n  <span class="token keyword">var</span> round <span class="token operator">=</span> <span class="token number">0</span>\n  <span class="token comment">// 定义查询价格的函数</span>\n  <span class="token keyword">const</span> <span class="token function-variable function">query_price</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token parameter">remote</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span>  remote<span class="token punctuation">.</span><span class="token function">requestOrderBook</span><span class="token punctuation">(</span>swt_vs_cny<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">submitPromise</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">orderbooks</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> price_list <span class="token operator">=</span> <span class="token string">&#39;&#39;</span>\n        orderbooks<span class="token punctuation">.</span>offers<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span> <span class="token parameter">offer</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n          <span class="token keyword">let</span> quantity <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token function">parseInt</span><span class="token punctuation">(</span>offer<span class="token punctuation">.</span>TakerPays <span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">1000000</span><span class="token punctuation">)</span>\n          <span class="token keyword">let</span> price <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token number">1000000</span> <span class="token operator">*</span> <span class="token number">1000</span> <span class="token operator">*</span> <span class="token number">100</span> <span class="token operator">/</span> <span class="token function">Number</span><span class="token punctuation">(</span>offer<span class="token punctuation">.</span>quality<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">100000</span>\n          price_list <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\\n价格: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>price<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\t挂单量: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>quantity<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\t</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>offer<span class="token punctuation">.</span>Account<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n      dom_price<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;pre&gt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>price_list<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/pre&gt;</span><span class="token template-punctuation string">`</span></span>\n\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span>console<span class="token punctuation">.</span>error<span class="token punctuation">)</span>\n\n  <span class="token comment">// 每十秒钟生成一个钱包并且打印出来</span>\n  <span class="token function">setInterval</span><span class="token punctuation">(</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token keyword">let</span> wallet <span class="token operator">=</span> Wallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;\\n...新钱包...&quot;</span><span class="token punctuation">)</span>\n      dom_wallet<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;pre&gt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>wallet<span class="token punctuation">,</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/pre&gt;</span><span class="token template-punctuation string">`</span></span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">10000</span>\n  <span class="token punctuation">)</span>\n\n  <span class="token comment">// 连接到服务器</span>\n  remote<span class="token punctuation">.</span><span class="token function">connectPromise</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token parameter">server_info</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;\\n...服务器信息...&quot;</span><span class="token punctuation">)</span>\n      <span class="token comment">// 订阅帐本变动</span>\n      remote<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&#39;ledger_closed&#39;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">ledger_data</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n          console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;\\n...最新帐本...&quot;</span><span class="token punctuation">)</span>\n          dom_ledger<span class="token punctuation">.</span>innerHTML <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">&lt;pre&gt;</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>ledger_data<span class="token punctuation">,</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">&lt;/pre&gt;</span><span class="token template-punctuation string">`</span></span>\n          round <span class="token operator">+=</span> <span class="token number">1</span>\n          <span class="token keyword">if</span> <span class="token punctuation">(</span> round <span class="token operator">&gt;=</span> <span class="token constant">ROUND</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span>\n            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;\\n...结束程序...&quot;</span><span class="token punctuation">)</span>\n            remote<span class="token punctuation">.</span><span class="token function">disconnect</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n            <span class="token function">alert</span><span class="token punctuation">(</span><span class="token string">&quot;已断开连接&quot;</span><span class="token punctuation">)</span>\n          <span class="token punctuation">}</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">)</span>\n      <span class="token comment">// 每10秒钟查询价格</span>\n      <span class="token function">setInterval</span><span class="token punctuation">(</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">query_price</span><span class="token punctuation">(</span>remote<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">10000</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">)</span>\n  <span class="token punctuation">.</span><span class="token function">catch</span><span class="token punctuation">(</span>console<span class="token punctuation">.</span>error<span class="token punctuation">)</span>\n\n  <span class="token keyword">undefined</span>\n\n<span class="token operator">...</span>服务器信息<span class="token operator">...</span>\n<span class="token constant">VM30787</span><span class="token operator">:</span><span class="token number">34</span>\n<span class="token operator">...</span>新钱包<span class="token operator">...</span>\n<span class="token constant">VM30787</span><span class="token operator">:</span><span class="token number">49</span>\n<span class="token operator">...</span>最新帐本<span class="token operator">...</span>\n<span class="token constant">VM30787</span><span class="token operator">:</span><span class="token number">20</span>\n<span class="token operator">...</span>出价<span class="token operator">...</span>\n<span class="token constant">VM30787</span><span class="token operator">:</span><span class="token number">34</span>\n<span class="token operator">...</span>新钱包<span class="token operator">...</span>\n<span class="token constant">VM30787</span><span class="token operator">:</span><span class="token number">49</span>\n<span class="token operator">...</span>最新帐本<span class="token operator">...</span>\n<span class="token constant">VM30787</span><span class="token operator">:</span><span class="token number">20</span>\n<span class="token operator">...</span>出价<span class="token operator">...</span>\n</code></pre></div>',18)];p.render=function(a,t,p,e,c,l){return n(),s("div",null,o)};export{t as __pageData,p as default};
