## 移动开发

::: details 移动开发支持

```shell
Documents xcliu$ tns create bipapp --js
Documents xcliu$ cd bipapp
bipapp xcliu$ npm install bip32 bip39 @swtc/wallet @swtc/nativescript
bipapp xcliu$ echo "更新webpack配置 更新程序引入bip和swtc"
bipapp xcliu$ git diff
diff --git a/webpack.config.js b/webpack.config.js
index 59360c3..e6583c2 100644
--- a/webpack.config.js
+++ b/webpack.config.js
@@ -120,7 +120,7 @@ module.exports = env => {
                 `node_modules/${coreModulesPackageName}`,
                 "node_modules",
             ],
-            alias,
+            alias: Object.assign({}, alias, require("@swtc/nativescript").aliases),
             // resolve symlinks to symlinked modules
             symlinks: true
         },
@@ -134,6 +134,7 @@ module.exports = env => {
             "timers": false,
             "setImmediate": false,
             "fs": "empty",
+            "process": "mock",
             "__dirname": false,
         },
         devtool: hiddenSourceMap ? "hidden-source-map" : (sourceMap ? "inline-source-map" : "none"),
@@ -225,7 +226,7 @@ module.exports = env => {
             // Define useful constants like TNS_WEBPACK
             new webpack.DefinePlugin({
                 "global.TNS_WEBPACK": "true",
-                "process": "global.process",
+                // "process": "global.process",
             }),
             // Remove all files from the out dir.
             new CleanWebpackPlugin(itemsToClean, { verbose: !!verbose }),
bipapp xcliu$ git diff app
diff --git a/app/main-view-model.js b/app/main-view-model.js
index 0903f55..046e416 100755
--- a/app/main-view-model.js
+++ b/app/main-view-model.js
@@ -1,21 +1,37 @@
 const Observable = require("tns-core-modules/data/observable").Observable;
+const { Wallet } = require("@swtc/wallet")
+const bip32 = require("bip32")
+const bip39 = require("bip39")
+bip39.setDefaultWordlist('chinese_simplified')
+let b32

-function getMessage(counter) {
+function getMessage(counter, mnemonic, seed, b32) {
     if (counter <= 0) {
         return "Hoorraaay! You unlocked the NativeScript clicker achievement!";
     } else {
-        return `${counter} taps left`;
+        return `${counter} ${mnemonic}
+                       bip39: ${seed}
+                               bip32: ${b32}
+               `;
     }
 }

 function createViewModel() {
     const viewModel = new Observable();
     viewModel.counter = 42;
-    viewModel.message = getMessage(viewModel.counter);
+    viewModel.mnemonic = bip39.generateMnemonic();
+       viewModel.seed = bip39.mnemonicToSeedSync(viewModel.mnemonic)
+    b32 = bip32.fromSeed(viewModel.seed)
+    viewModel.b32 = b32.privateKey
+    viewModel.message = getMessage(viewModel.counter, viewModel.mnemonic, viewModel.seed.toString("hex"), viewModel.b32.toString("hex"));

     viewModel.onTap = () => {
         viewModel.counter--;
-        viewModel.set("message", getMessage(viewModel.counter));
+        viewModel.mnemonic = bip39.generateMnemonic();
+           viewModel.seed = bip39.mnemonicToSeedSync(viewModel.mnemonic)
+        b32 = bip32.fromSeed(viewModel.seed)
+        viewModel.b32 = b32.privateKey
+        viewModel.set("message", getMessage(viewModel.counter, viewModel.mnemonic, viewModel.seed.toString("hex"), viewModel.b32.toString("hex")));
     };

    return viewModel;
bipapp xcliu$ tns run android
```

:::
