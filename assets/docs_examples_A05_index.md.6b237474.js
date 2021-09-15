import{o as n,c as s,e as a}from"./app.4dcb24bf.js";const t='{"title":"KOA example","description":"","frontmatter":{},"relativePath":"docs/examples/A05/index.md","lastUpdated":1631590646294}',p={},o=[a('<h1 id="koa-example" tabindex="-1">KOA example <a class="header-anchor" href="#koa-example" aria-hidden="true">#</a></h1><ol><li>工作于 <strong>playground</strong> 目录</li><li>安装 npm install koa @swtc/lib @swtc/api</li><li>创建 koa 文件 koaweb.js</li></ol><div class="language-javascript"><pre><code><span class="token keyword">const</span> Koa <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;koa&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> app <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Koa</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> RemoteLib <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@swtc/lib&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Remote\n<span class="token keyword">const</span> RemoteApi <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@swtc/api&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Remote\n<span class="token keyword">const</span> remotelib <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RemoteLib</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> remoteapi <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RemoteApi</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// logger</span>\n\napp<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">ctx<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">await</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> rt <span class="token operator">=</span> ctx<span class="token punctuation">.</span>response<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token string">&quot;X-Response-Time&quot;</span><span class="token punctuation">)</span>\n  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ctx<span class="token punctuation">.</span>method<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ctx<span class="token punctuation">.</span>url<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> - </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>rt<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// x-response-time</span>\n\napp<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token punctuation">(</span><span class="token parameter">ctx<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">const</span> start <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">await</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token keyword">const</span> ms <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> start\n  ctx<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token string">&quot;X-Response-Time&quot;</span><span class="token punctuation">,</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>ms<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">ms</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">)</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\n<span class="token comment">// response</span>\n\napp<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span><span class="token keyword">async</span> <span class="token parameter">ctx</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>remotelib<span class="token punctuation">.</span><span class="token function">isConnected</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">try</span> <span class="token punctuation">{</span>\n      <span class="token keyword">await</span> remotelib<span class="token punctuation">.</span><span class="token function">connectPromise</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;remote connected&quot;</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;remote was connected&quot;</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  ctx<span class="token punctuation">.</span>body <span class="token operator">=</span> <span class="token string">&quot;&lt;div&gt;Hello World&lt;/div&gt;&quot;</span>\n  <span class="token keyword">let</span> result_api <span class="token operator">=</span> <span class="token keyword">await</span> remoteapi<span class="token punctuation">.</span><span class="token function">getOrderBooks</span><span class="token punctuation">(</span>\n    <span class="token string">&quot;SWT&quot;</span><span class="token punctuation">,</span>\n    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">CNY+</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>remotelib<span class="token punctuation">.</span>_token<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">,</span>\n    <span class="token punctuation">{</span> results_per_page<span class="token operator">:</span> <span class="token number">10</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">)</span>\n  ctx<span class="token punctuation">.</span>body <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  &lt;div&gt;\n  \t&lt;h1&gt;using api remote&lt;/h1&gt;\n\t&lt;pre&gt;\n\t  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>result_api<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n\t&lt;/pre&gt;\n  &lt;/div&gt;\n  </span><span class="token template-punctuation string">`</span></span>\n  <span class="token keyword">let</span> result_lib <span class="token operator">=</span> <span class="token keyword">await</span> remotelib\n    <span class="token punctuation">.</span><span class="token function">requestOrderBook</span><span class="token punctuation">(</span><span class="token punctuation">{</span>\n      gets<span class="token operator">:</span> remotelib<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      pays<span class="token operator">:</span> remotelib<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token string">&quot;CNY&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      limit<span class="token operator">:</span> <span class="token number">10</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">.</span><span class="token function">submitPromise</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  ctx<span class="token punctuation">.</span>body <span class="token operator">+=</span> <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">\n  &lt;div&gt;\n  \t&lt;h1&gt;using lib remote&lt;/h1&gt;\n\t&lt;pre&gt;\n\t  </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span>result_lib<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token number">4</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\n\t&lt;/pre&gt;\n  &lt;/div&gt;\n  </span><span class="token template-punctuation string">`</span></span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span>\n\nconsole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&quot;starting server on port 3000&quot;</span><span class="token punctuation">)</span>\napp<span class="token punctuation">.</span><span class="token function">listen</span><span class="token punctuation">(</span><span class="token number">3000</span><span class="token punctuation">)</span>\n</code></pre></div><ol start="4"><li>脚本式运行</li></ol><div class="language-bash"><pre><code>$ node koaweb.js\n</code></pre></div><ol start="5"><li>输出</li></ol><div class="language-bash"><pre><code>starting server on port <span class="token number">3000</span>\nremote connected\nGET / - 4731ms\nremote was connected\nGET /favicon.ico - 1441ms\nremote was connected\nGET / - 1672ms\nremote was connected\nGET /favicon.ico - 1521ms\n</code></pre></div>',7)];p.render=function(a,t,p,e,c,u){return n(),s("div",null,o)};export{t as __pageData,p as default};
