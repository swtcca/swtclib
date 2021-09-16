import{o as n,c as a,e as s}from"./app.d26c9b00.js";const t='{"title":"NativeScript Vue 移动应用","description":"","frontmatter":{},"headers":[{"level":2,"title":"准备","slug":"准备"}],"relativePath":"docs/examples/M02/index.md","lastUpdated":1631590646527}',p={},o=[s('<h1 id="nativescript-vue-移动应用" tabindex="-1">NativeScript Vue 移动应用 <a class="header-anchor" href="#nativescript-vue-移动应用" aria-hidden="true">#</a></h1><h2 id="准备" tabindex="-1">准备 <a class="header-anchor" href="#准备" aria-hidden="true">#</a></h2><ol><li>进入 playground 目录</li></ol><div class="language-bash"><pre><code>$ <span class="token builtin class-name">cd</span> playground\n</code></pre></div><ol start="2"><li>全局安装 <a href="https://docs.nativescript.org/start/quick-setup" target="_blank" rel="noopener noreferrer">nativescript cli</a></li></ol><div class="language-bash"><pre><code>$ <span class="token function">npm</span> <span class="token function">install</span> -g nativescript\n<span class="token comment">#  运行tns doctor来确认开发环境</span>\n$ tns doctor\n</code></pre></div><ol start="3"><li>创建 vue 工程, 选择用 npm 作为包管理</li></ol><div class="language-bash"><pre><code>$ tns create vuemobapp --vue\n$ <span class="token builtin class-name">cd</span> vuemobapp\n</code></pre></div><ol start="4"><li>安装@swtc/lib</li></ol><div class="language-bash"><pre><code>$ <span class="token function">npm</span> <span class="token function">install</span> @swtc/lib\n</code></pre></div><ol start="5"><li>更新 webpack 配置文件，应该只要添加/修改几行就可以了 <blockquote><ul><li>编辑 webpack.config.js</li><li>修改 env.config.resolve.alias, 在<code>vue: &#39;nativescript-vue&#39;</code> 上面添加添加 <code>...require(&#39;@swtc/nativescript&#39;).aliases,</code></li><li>修改 env.config.resolve.symlink, <code>false</code></li><li>修改 env.config.plugins, 注释掉<code>&quot;process&quot;: &quot;global.process&quot;</code></li></ul></blockquote></li><li>启动模拟器或者连接手机，调试</li></ol><div class="language-bash"><pre><code><span class="token comment"># tns preview 这里不能使用</span>\n$ tns run ios\n$ tns run android\n</code></pre></div><ol start="7"><li>Vue 的默认页面内容文件 app/components/Home.vue 如下</li></ol><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Page</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>page<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ActionBar</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>action-bar<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Label</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>action-bar-title<span class="token punctuation">&quot;</span></span> <span class="token attr-name">text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Home<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Label</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ActionBar</span><span class="token punctuation">&gt;</span></span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>GridLayout</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Label</span>\n        <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>info<span class="token punctuation">&quot;</span></span>\n        <span class="token attr-name">horizontalAlignment</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>center<span class="token punctuation">&quot;</span></span>\n        <span class="token attr-name">verticalAlignment</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>center<span class="token punctuation">&quot;</span></span>\n      <span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>FormattedString</span><span class="token punctuation">&gt;</span></span>\n          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>fa<span class="token punctuation">&quot;</span></span> <span class="token attr-name">text.decode</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token entity" title="">&amp;#xf135;</span> <span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Span</span> <span class="token attr-name">:text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>message<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>FormattedString</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Label</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>GridLayout</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Page</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n  computed<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">message</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token string">&quot;Blank {N}-Vue app&quot;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">scoped</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scss<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">\n// Start custom common variables\n<span class="token atrule"><span class="token rule">@import</span> <span class="token string">&quot;../app-variables&quot;</span><span class="token punctuation">;</span></span>\n<span class="token selector">// End custom common variables\n\n// Custom styles\n.fa</span> <span class="token punctuation">{</span>\n  <span class="token property">color</span><span class="token punctuation">:</span> $accent-dark<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n\n<span class="token selector">.info</span> <span class="token punctuation">{</span>\n  <span class="token property">font-size</span><span class="token punctuation">:</span> 20<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div><ol start="7"><li>修改为如下示例内容</li></ol><div class="language-vue"><pre><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Page</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>page<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>ActionBar</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>action-bar<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Label</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>action-bar-title<span class="token punctuation">&quot;</span></span> <span class="token attr-name">text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>Home<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Label</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>ActionBar</span><span class="token punctuation">&gt;</span></span>\n\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>GridLayout</span> <span class="token attr-name">rows</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>auto,*,auto<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>StackLayout</span> <span class="token attr-name">row</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>0<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Label</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>info<span class="token punctuation">&quot;</span></span> <span class="token attr-name">horizontalAlignment</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>center<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>钱包<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Label</span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>TextView</span> <span class="token attr-name">:text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>wallet_text<span class="token punctuation">&quot;</span></span> <span class="token attr-name">editable</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>TextView</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>StackLayout</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>StackLayout</span> <span class="token attr-name">row</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1<span class="token punctuation">&quot;</span></span> <span class="token attr-name">verticalAlignment</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>middle<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Label</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>info<span class="token punctuation">&quot;</span></span> <span class="token attr-name">horizontalAlignment</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>center<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>帐本<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Label</span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>TextView</span> <span class="token attr-name">:text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>ledger_text<span class="token punctuation">&quot;</span></span> <span class="token attr-name">editable</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>TextView</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>StackLayout</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>StackLayout</span> <span class="token attr-name">row</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>2<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Button</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>btn btn-primary full<span class="token punctuation">&quot;</span></span> <span class="token attr-name">horizontalAlignment</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>center<span class="token punctuation">&quot;</span></span>\n          <span class="token punctuation">&gt;</span></span>价格<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Button</span>\n        <span class="token punctuation">&gt;</span></span>\n        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>TextView</span> <span class="token attr-name">:text</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>price_text<span class="token punctuation">&quot;</span></span> <span class="token attr-name">editable</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>TextView</span><span class="token punctuation">&gt;</span></span>\n      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>StackLayout</span><span class="token punctuation">&gt;</span></span>\n    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>GridLayout</span><span class="token punctuation">&gt;</span></span>\n  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Page</span><span class="token punctuation">&gt;</span></span>\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">\n<span class="token keyword">const</span> SwtcLib <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@swtc/lib&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> Wallet <span class="token operator">=</span> SwtcLib<span class="token punctuation">.</span>Wallet\n<span class="token keyword">const</span> Remote <span class="token operator">=</span> SwtcLib<span class="token punctuation">.</span>Remote\n<span class="token keyword">const</span> remote <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Remote</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> currency_swt <span class="token operator">=</span> remote<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> currency_cny <span class="token operator">=</span> remote<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token string">&quot;CNY&quot;</span><span class="token punctuation">)</span>\n<span class="token keyword">const</span> swt_vs_cny <span class="token operator">=</span> <span class="token punctuation">{</span> limit<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span> gets<span class="token operator">:</span> currency_swt<span class="token punctuation">,</span> pays<span class="token operator">:</span> currency_cny <span class="token punctuation">}</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>\n  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">{</span>\n      wallet<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n      ledger<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>\n      price<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>\n      state<span class="token operator">:</span> <span class="token string">&quot;&quot;</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  computed<span class="token operator">:</span> <span class="token punctuation">{</span>\n    <span class="token function">wallet_text</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>wallet<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token function">ledger_text</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>ledger<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span>\n    <span class="token function">price_text</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>price<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&quot;\\n&quot;</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token function">created</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>wallet <span class="token operator">=</span> Wallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span><span class="token punctuation">,</span>\n  <span class="token keyword">async</span> <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">try</span> <span class="token punctuation">{</span>\n      <span class="token comment">// 同步连接</span>\n      <span class="token keyword">await</span> remote<span class="token punctuation">.</span><span class="token function">connectPromise</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      <span class="token comment">// 订阅帐本</span>\n      remote<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;ledger_closed&quot;</span><span class="token punctuation">,</span> <span class="token parameter">ledger_data</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>ledger <span class="token operator">=</span> ledger_data\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token string">&quot;连接不上&quot;</span>\n    <span class="token punctuation">}</span>\n    <span class="token comment">// 十秒钟一个钱包</span>\n    <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token keyword">this</span><span class="token punctuation">.</span>wallet <span class="token operator">=</span> Wallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n      console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>wallet<span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">10000</span><span class="token punctuation">)</span>\n    <span class="token comment">// 十秒钟查价格</span>\n    <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      remote<span class="token punctuation">.</span><span class="token function">requestOrderBook</span><span class="token punctuation">(</span>swt_vs_cny<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> orderbooks</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n        <span class="token keyword">if</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token string">&quot;查询挂单出错了&quot;</span>\n        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n          orderbooks<span class="token punctuation">.</span>offers<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">offer</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n            <span class="token keyword">let</span> quantity <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token function">parseInt</span><span class="token punctuation">(</span>offer<span class="token punctuation">.</span>TakerPays<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">1000000</span><span class="token punctuation">)</span>\n            <span class="token keyword">let</span> price <span class="token operator">=</span>\n              Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token number">1000000</span> <span class="token operator">*</span> <span class="token number">1000</span> <span class="token operator">*</span> <span class="token number">100</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token function">Number</span><span class="token punctuation">(</span>offer<span class="token punctuation">.</span>quality<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">/</span>\n              <span class="token number">100000</span>\n            <span class="token keyword">this</span><span class="token punctuation">.</span>price<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span>\n              <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">价格: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>price<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\t挂单量: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>quantity<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\t</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>offer<span class="token punctuation">.</span>Account<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n            <span class="token punctuation">)</span>\n            <span class="token keyword">this</span><span class="token punctuation">.</span>price<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span>\n          <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span>\n      <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">10000</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>\n\n<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>style</span> <span class="token attr-name">scoped</span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scss<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token style"><span class="token language-css">\n// Start custom common variables\n<span class="token atrule"><span class="token rule">@import</span> <span class="token string">&quot;../app-variables&quot;</span><span class="token punctuation">;</span></span>\n<span class="token selector">// End custom common variables\n\n// Custom styles\n.info</span> <span class="token punctuation">{</span>\n  <span class="token property">font-size</span><span class="token punctuation">:</span> 20<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>style</span><span class="token punctuation">&gt;</span></span>\n</code></pre></div>',16)];p.render=function(s,t,p,c,e,u){return n(),a("div",null,o)};export{t as __pageData,p as default};
