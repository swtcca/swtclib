import{o as e,c as t,e as l}from"./app.4dcb24bf.js";const r='{"title":"swtc-proxy API服务 - 代理至井通节点","description":"","frontmatter":{},"headers":[{"level":2,"title":"在线文档","slug":"在线文档"},{"level":2,"title":"描述","slug":"描述"},{"level":3,"title":"@swtc/lib使用websocket，兼容性和规模化有一定的问题","slug":"swtc-lib使用websocket，兼容性和规模化有一定的问题"},{"level":3,"title":"swtc-proxy提供REST服务，代理到井通节点解决上述问题","slug":"swtc-proxy提供rest服务，代理到井通节点解决上述问题"},{"level":2,"title":"约定","slug":"约定"},{"level":2,"title":"使用","slug":"使用"},{"level":3,"title":"kubernetes (通过环境变量设置上游/调试/基于 IP 的访问限制)","slug":"kubernetes-通过环境变量设置上游-调试-基于-ip-的访问限制"},{"level":3,"title":"docker (通过环境变量设置上游/调试/基于 IP 的访问限制)","slug":"docker-通过环境变量设置上游-调试-基于-ip-的访问限制"},{"level":3,"title":"源代码","slug":"源代码"},{"level":2,"title":"定制","slug":"定制"},{"level":3,"title":"源代码","slug":"源代码-1"},{"level":3,"title":"修改 start.js","slug":"修改-start-js"},{"level":3,"title":"修改源文件 tssrc/","slug":"修改源文件-tssrc"}],"relativePath":"docs/swtcproxy/index.md","lastUpdated":1631665890744}',a={},i=[l('<h1 id="swtc-proxy-api服务-代理至井通节点" tabindex="-1"><code>swtc-proxy API</code>服务 - 代理至井通节点 <a class="header-anchor" href="#swtc-proxy-api服务-代理至井通节点" aria-hidden="true">#</a></h1><h2 id="在线文档" tabindex="-1">在线文档 <a class="header-anchor" href="#在线文档" aria-hidden="true">#</a></h2><ul><li><a href="http://swtcproxy.swtclib.ca:5080/swagger" target="_blank" rel="noopener noreferrer">http://swtcproxy.swtclib.ca:5080/swagger</a></li><li><a href="https://app.swaggerhub.com/apis/lospringliu/swtc-proxy/v3" target="_blank" rel="noopener noreferrer">https://app.swaggerhub.com/apis/lospringliu/swtc-proxy/v3</a></li><li><a href="https://swtcdoc.netlify.com" target="_blank" rel="noopener noreferrer">https://swtcdoc.netlify.com</a></li><li><a href="https://hub.docker.com/repository/docker/lospringliu/swtcproxy" target="_blank" rel="noopener noreferrer">docker image</a></li></ul><h2 id="描述" tabindex="-1">描述 <a class="header-anchor" href="#描述" aria-hidden="true">#</a></h2><h3 id="swtc-lib使用websocket，兼容性和规模化有一定的问题" tabindex="-1"><code>@swtc/lib</code>使用<code>websocket</code>，兼容性和规模化有一定的问题 <a class="header-anchor" href="#swtc-lib使用websocket，兼容性和规模化有一定的问题" aria-hidden="true">#</a></h3><h3 id="swtc-proxy提供rest服务，代理到井通节点解决上述问题" tabindex="-1"><code>swtc-proxy</code>提供<code>REST</code>服务，代理到井通节点解决上述问题 <a class="header-anchor" href="#swtc-proxy提供rest服务，代理到井通节点解决上述问题" aria-hidden="true">#</a></h3><h2 id="约定" tabindex="-1">约定 <a class="header-anchor" href="#约定" aria-hidden="true">#</a></h2><ol start="0"><li>安全第一， 确保密钥不出本机</li><li>尽量保持数据结构 和 <code>@swtc/lib</code> 对应一致</li><li>所有 API 应答均为 json object， 包括数据和错误</li><li>尽量支持可选参数， 几乎所有<code>@swtc/lib</code>支持的参数都可以通过 query 获得支持</li><li>集成至 <code>@swtc/transaction</code> 和 <code>@swtc/api</code></li><li>精简为主， 面向所有用户。 提供缺省配置和 docker image</li><li>swagger-ui 标准文档</li></ol><h2 id="使用" tabindex="-1">使用 <a class="header-anchor" href="#使用" aria-hidden="true">#</a></h2><h3 id="kubernetes-通过环境变量设置上游-调试-基于-ip-的访问限制" tabindex="-1">kubernetes (通过环境变量设置上游/调试/基于 IP 的访问限制) <a class="header-anchor" href="#kubernetes-通过环境变量设置上游-调试-基于-ip-的访问限制" aria-hidden="true">#</a></h3><ol start="0"><li><code>kubectl create -f https://raw.githubusercontent.com/swtcca/swtcproxy/master/kubernetes.yaml</code></li></ol><h3 id="docker-通过环境变量设置上游-调试-基于-ip-的访问限制" tabindex="-1">docker (通过环境变量设置上游/调试/基于 IP 的访问限制) <a class="header-anchor" href="#docker-通过环境变量设置上游-调试-基于-ip-的访问限制" aria-hidden="true">#</a></h3><ol><li><code>docker run --rm -e UPSTREAM=wss://s.jingtum.com:5020 -e DEBUG=true -e RATE=100 -d -p 5080:5080 lospringliu/swtcproxy</code></li></ol><h3 id="源代码" tabindex="-1">源代码 <a class="header-anchor" href="#源代码" aria-hidden="true">#</a></h3><ol><li><code>git clone https://github.com/swtcca/swtcproxy.git</code></li><li><code>cd swtcproxy</code></li><li><code>npm install</code></li><li><code>npm run test</code></li><li><code>env UPSTREAM=wss://s.jingtum.com:5020 RATE=100 npm run start</code></li><li>本地文档： <a href="http://localhost:5080/swagger" target="_blank" rel="noopener noreferrer">http://localhost:5080/swagger</a><blockquote><ul><li>相应修改 <code>static/swagger.json</code> 的<code>server.url</code></li></ul></blockquote></li></ol><ul><li>配合<a href="./../api/">@swtc/api</a>使用，提供和<code>@swtc/lib</code>相似的接口 <ul><li>避免 websocket</li><li>完整接口</li></ul></li></ul><h2 id="定制" tabindex="-1">定制 <a class="header-anchor" href="#定制" aria-hidden="true">#</a></h2><h3 id="源代码-1" tabindex="-1">源代码 <a class="header-anchor" href="#源代码-1" aria-hidden="true">#</a></h3><ol><li><code>git clone https://github.com/swtcca/swtclib.git</code></li><li><code>cd swtclib/packages/swtc-proxy</code></li><li><code>npm install</code></li><li><code>npm run test</code></li><li><code>npm run start</code></li><li>本地文档： <a href="http://localhost:5080/swagger" target="_blank" rel="noopener noreferrer">http://localhost:5080/swagger</a><blockquote><ul><li>相应修改 <code>static/swagger.json</code> 的<code>server.url</code></li></ul></blockquote></li></ol><h3 id="修改-start-js" tabindex="-1">修改 start.js <a class="header-anchor" href="#修改-start-js" aria-hidden="true">#</a></h3><ul><li>配置</li><li>中间件</li><li>后端</li><li>日志</li><li>扩展</li></ul><h3 id="修改源文件-tssrc" tabindex="-1">修改源文件 tssrc/ <a class="header-anchor" href="#修改源文件-tssrc" aria-hidden="true">#</a></h3>',22)];a.render=function(l,r,a,c,o,s){return e(),t("div",null,i)};export{r as __pageData,a as default};
