# 承诺 Promise

### 可以把回调方式
```javascript
doSomethingAsync(function(error, result))
```

### 改写成
```javascript
doSomethingAsync()
	.then(function(result))
	.catch(function(error))
```

# async/await

### 可以进而改写为
```javascript
(async function () {
	try {
		result = await doSomethingAsync()
		// handle result
	} catch (error) {
		// handle error
	}
})()
```
