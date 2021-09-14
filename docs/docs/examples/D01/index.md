# electron 将 web 应用包装成桌面程序

> #### 可以封装 [常规 web 应用](../W02/) 或者 [打包的 web 应用](../W03/) 或者 [vue.js web 应用](../W05/)
>
> #### 可能需要修改 html 文件内部的相对应用或者绝对引用路径

## 准备- 以 [打包 web 应用](../W03/) 为例

1. 进入 playground 目录

```bash
$ cd playground
```

2. 确保我们的 [打包 web 应用](../W03/) 在浏览器中运行正常
3. 此时的目录结构为

```bash
$ tree
.
├── dist
│   └── main.js
├── index.html
├── src
│   └── index.js
└── styles.css
```

4. 安装 electron

```bash
$ npm install electron
```

5. 以桌面应用的方式运行

```bash
$ node_modules/.bin/electron index.html
```

6. 可以打包分发到 windows/linux/macos
7. 目前已经有相当数量优秀的桌面应用使用 electron 打包分发
