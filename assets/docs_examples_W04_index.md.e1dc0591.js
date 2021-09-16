import{o as n,c as s,e as a}from"./app.2c18be1c.js";const t='{"title":"Vue.js Web 应用","description":"","frontmatter":{},"headers":[{"level":2,"title":"准备","slug":"准备"}],"relativePath":"docs/examples/W04/index.md","lastUpdated":1631590647094}',p={},o=[a('<h1 id="vue-js-web-应用" tabindex="-1">Vue.js Web 应用 <a class="header-anchor" href="#vue-js-web-应用" aria-hidden="true">#</a></h1><h2 id="准备" tabindex="-1">准备 <a class="header-anchor" href="#准备" aria-hidden="true">#</a></h2><ol><li>进入 playground 目录</li></ol><div class="language-bash"><pre><code>$ <span class="token builtin class-name">cd</span> playground\n</code></pre></div><ol start="2"><li>全局安装 yarn</li></ol><div class="language-bash"><pre><code>$ <span class="token function">npm</span> <span class="token function">install</span> -g <span class="token function">yarn</span>\n</code></pre></div><ol start="3"><li>创建 react 工程</li></ol><div class="language-bash"><pre><code>$ npx create-react-app myreactweb\n$ <span class="token builtin class-name">cd</span> myreactweb\n</code></pre></div><ol start="4"><li>安装@swtc/lib</li></ol><div class="language-bash"><pre><code>$ <span class="token function">yarn</span> <span class="token function">add</span> @swtc/lib\n</code></pre></div><ol start="5"><li>启动开发服务器</li></ol><div class="language-bash"><pre><code>$ <span class="token function">yarn</span> start\n</code></pre></div><ol start="6"><li>浏览器访问</li><li>默认页面内容文件 src/App.js 如下</li></ol><div class="language-javascript"><pre><code><span class="token keyword">import</span> React<span class="token punctuation">,</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span>\n<span class="token keyword">import</span> logo <span class="token keyword">from</span> <span class="token string">&quot;./logo.svg&quot;</span>\n<span class="token keyword">import</span> <span class="token string">&quot;./App.css&quot;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;App&quot;</span><span class="token operator">&gt;</span>\n        <span class="token operator">&lt;</span>header className<span class="token operator">=</span><span class="token string">&quot;App-header&quot;</span><span class="token operator">&gt;</span>\n          <span class="token operator">&lt;</span>img src<span class="token operator">=</span><span class="token punctuation">{</span>logo<span class="token punctuation">}</span> className<span class="token operator">=</span><span class="token string">&quot;App-logo&quot;</span> alt<span class="token operator">=</span><span class="token string">&quot;logo&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span>\n          <span class="token operator">&lt;</span>p<span class="token operator">&gt;</span>\n            Edit <span class="token operator">&lt;</span>code<span class="token operator">&gt;</span>src<span class="token operator">/</span>App<span class="token punctuation">.</span>js<span class="token operator">&lt;</span><span class="token operator">/</span>code<span class="token operator">&gt;</span> and save to reload<span class="token punctuation">.</span>\n          <span class="token operator">&lt;</span><span class="token operator">/</span>p<span class="token operator">&gt;</span>\n          <span class="token operator">&lt;</span>a\n            className<span class="token operator">=</span><span class="token string">&quot;App-link&quot;</span>\n            href<span class="token operator">=</span><span class="token string">&quot;https://reactjs.org&quot;</span>\n            target<span class="token operator">=</span><span class="token string">&quot;_blank&quot;</span>\n            rel<span class="token operator">=</span><span class="token string">&quot;noopener noreferrer&quot;</span>\n          <span class="token operator">&gt;</span>\n            Learn React\n          <span class="token operator">&lt;</span><span class="token operator">/</span>a<span class="token operator">&gt;</span>\n        <span class="token operator">&lt;</span><span class="token operator">/</span>header<span class="token operator">&gt;</span>\n      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n</code></pre></div><ol start="8"><li>修改为如下示例内容</li></ol><div class="language-javascript"><pre><code><span class="token keyword">import</span> React<span class="token punctuation">,</span> <span class="token punctuation">{</span> Component <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span>\n<span class="token keyword">import</span> logo <span class="token keyword">from</span> <span class="token string">&quot;./logo.svg&quot;</span>\n<span class="token keyword">import</span> <span class="token string">&quot;./App.css&quot;</span>\n\n<span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token keyword">extends</span> <span class="token class-name">Component</span> <span class="token punctuation">{</span>\n  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">props</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">super</span><span class="token punctuation">(</span>props<span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>state <span class="token operator">=</span> <span class="token punctuation">{</span> wallet<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> ledger<span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span> price<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> state<span class="token operator">:</span> <span class="token string">&quot;&quot;</span> <span class="token punctuation">}</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">componentDidMount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>Wallet <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@swtc/lib&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Wallet\n    <span class="token keyword">const</span> Remote <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@swtc/lib&quot;</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Remote\n    <span class="token keyword">const</span> currency_swt <span class="token operator">=</span> remote<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> currency_cny <span class="token operator">=</span> remote<span class="token punctuation">.</span><span class="token function">makeCurrency</span><span class="token punctuation">(</span><span class="token string">&quot;CNY&quot;</span><span class="token punctuation">)</span>\n    <span class="token keyword">const</span> swt_vs_cny <span class="token operator">=</span> <span class="token punctuation">{</span> limit<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span> gets<span class="token operator">:</span> currency_swt<span class="token punctuation">,</span> pays<span class="token operator">:</span> currency_cny <span class="token punctuation">}</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>remote <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Remote</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>remote<span class="token punctuation">.</span><span class="token function">connect</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> server_info</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n      <span class="token keyword">if</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>error<span class="token punctuation">)</span>\n      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n        <span class="token comment">// 订阅帐本</span>\n        <span class="token keyword">this</span><span class="token punctuation">.</span>remote<span class="token punctuation">.</span><span class="token function">on</span><span class="token punctuation">(</span><span class="token string">&quot;ledger_closed&quot;</span><span class="token punctuation">,</span> <span class="token parameter">ledger</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> ledger<span class="token operator">:</span> ledger <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token comment">// 十秒钟查价格</span>\n        <span class="token function">setInterval</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n          <span class="token keyword">this</span><span class="token punctuation">.</span>remote\n            <span class="token punctuation">.</span><span class="token function">requestOrderBook</span><span class="token punctuation">(</span>swt_vs_cny<span class="token punctuation">)</span>\n            <span class="token punctuation">.</span><span class="token function">submit</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">error<span class="token punctuation">,</span> orderbooks</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n              <span class="token keyword">if</span> <span class="token punctuation">(</span>error<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n                <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> state<span class="token operator">:</span> <span class="token string">&quot;查询挂单出错了&quot;</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n              <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>\n                orderbooks<span class="token punctuation">.</span>offers<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token parameter">offer</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>\n                  <span class="token keyword">let</span> prices <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>\n                  <span class="token keyword">let</span> quantity <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token function">parseInt</span><span class="token punctuation">(</span>offer<span class="token punctuation">.</span>TakerPays<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">1000000</span><span class="token punctuation">)</span>\n                  <span class="token keyword">let</span> price <span class="token operator">=</span>\n                    Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token number">1000000</span> <span class="token operator">*</span> <span class="token number">1000</span> <span class="token operator">*</span> <span class="token number">100</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token function">Number</span><span class="token punctuation">(</span>offer<span class="token punctuation">.</span>quality<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">/</span>\n                    <span class="token number">100000</span>\n                  prices<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span>\n                    <span class="token template-string"><span class="token template-punctuation string">`</span><span class="token string">价格: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>price<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\t挂单量: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>quantity<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\t</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">${</span>offer<span class="token punctuation">.</span>Account<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">`</span></span>\n                  <span class="token punctuation">)</span>\n                  <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> price<span class="token operator">:</span> prices<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n                <span class="token punctuation">}</span><span class="token punctuation">)</span>\n              <span class="token punctuation">}</span>\n            <span class="token punctuation">}</span><span class="token punctuation">)</span>\n        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">10000</span><span class="token punctuation">)</span>\n      <span class="token punctuation">}</span>\n    <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> wallet<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>Wallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>timer_wallet <span class="token operator">=</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span>\n      <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setState</span><span class="token punctuation">(</span><span class="token punctuation">{</span> wallet<span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>Wallet<span class="token punctuation">.</span><span class="token function">generate</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">,</span>\n      <span class="token number">10000</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">componentWillUnmount</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token function">clearTimeout</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>timer_wallet<span class="token punctuation">)</span>\n    <span class="token keyword">this</span><span class="token punctuation">.</span>remote<span class="token punctuation">.</span><span class="token function">disconnect</span><span class="token punctuation">(</span><span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n  <span class="token function">render</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>\n    <span class="token keyword">return</span> <span class="token punctuation">(</span>\n      <span class="token operator">&lt;</span>div className<span class="token operator">=</span><span class="token string">&quot;App&quot;</span><span class="token operator">&gt;</span>\n        <span class="token operator">&lt;</span>header className<span class="token operator">=</span><span class="token string">&quot;App-header&quot;</span><span class="token operator">&gt;</span>\n          <span class="token operator">&lt;</span>img src<span class="token operator">=</span><span class="token punctuation">{</span>logo<span class="token punctuation">}</span> className<span class="token operator">=</span><span class="token string">&quot;App-logo&quot;</span> alt<span class="token operator">=</span><span class="token string">&quot;logo&quot;</span> <span class="token operator">/</span><span class="token operator">&gt;</span>\n          <span class="token operator">&lt;</span>div<span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>h3<span class="token operator">&gt;</span>钱包<span class="token operator">&lt;</span><span class="token operator">/</span>h3<span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>hr <span class="token operator">/</span><span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>pre<span class="token operator">&gt;</span><span class="token punctuation">{</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>wallet<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>pre<span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>h3<span class="token operator">&gt;</span>帐本<span class="token operator">&lt;</span><span class="token operator">/</span>h3<span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>hr <span class="token operator">/</span><span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>pre<span class="token operator">&gt;</span><span class="token punctuation">{</span><span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>ledger<span class="token punctuation">,</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>pre<span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>h3<span class="token operator">&gt;</span>价格<span class="token operator">&lt;</span><span class="token operator">/</span>h3<span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>hr <span class="token operator">/</span><span class="token operator">&gt;</span>\n            <span class="token operator">&lt;</span>pre<span class="token operator">&gt;</span><span class="token punctuation">{</span><span class="token keyword">this</span><span class="token punctuation">.</span>state<span class="token punctuation">.</span>price<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&quot;\\n&quot;</span><span class="token punctuation">)</span><span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>pre<span class="token operator">&gt;</span>\n          <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>\n          <span class="token operator">&lt;</span>a\n            className<span class="token operator">=</span><span class="token string">&quot;App-link&quot;</span>\n            href<span class="token operator">=</span><span class="token string">&quot;https://reactjs.org&quot;</span>\n            target<span class="token operator">=</span><span class="token string">&quot;_blank&quot;</span>\n            rel<span class="token operator">=</span><span class="token string">&quot;noopener noreferrer&quot;</span>\n          <span class="token operator">&gt;</span>\n            Learn React\n          <span class="token operator">&lt;</span><span class="token operator">/</span>a<span class="token operator">&gt;</span>\n        <span class="token operator">&lt;</span><span class="token operator">/</span>header<span class="token operator">&gt;</span>\n      <span class="token operator">&lt;</span><span class="token operator">/</span>div<span class="token operator">&gt;</span>\n    <span class="token punctuation">)</span>\n  <span class="token punctuation">}</span>\n<span class="token punctuation">}</span>\n\n<span class="token keyword">export</span> <span class="token keyword">default</span> App\n</code></pre></div><ol start="9"><li>添加一小段 css 美化页面 src/App.css</li></ol><div class="language-css"><pre><code><span class="token selector">pre</span> <span class="token punctuation">{</span>\n  <span class="token property">width</span><span class="token punctuation">:</span> 50%<span class="token punctuation">;</span>\n  <span class="token property">margin</span><span class="token punctuation">:</span> auto<span class="token punctuation">;</span>\n  <span class="token property">text-align</span><span class="token punctuation">:</span> left<span class="token punctuation">;</span>\n<span class="token punctuation">}</span>\n</code></pre></div>',18)];p.render=function(a,t,p,e,c,l){return n(),s("div",null,o)};export{t as __pageData,p as default};
