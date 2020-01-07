---
title: 七、不刷新修改url链接
date: 2019-12-25
tags:
  - url
  - pushState
---
有一个这样的需求，点击分页，不刷新页面。


```javascript
    //我们的page参数是记录在url里的： https://xxx.html?page=1
    //如果采取硬拼接的方式，无疑会刷新页面
    window.location.href = window.location.pathname + `?page=${page}`
```

<!-- more -->

## 1.pushState() 方法

[MDN链接](https://developer.mozilla.org/zh-CN/docs/Web/API/History_API)
一个状态对象, 一个标题 (目前被忽略), 和 (可选的) 一个URL. 让我们来解释下这三个参数详细内容：：


```javascript
- 状态对象 — 状态对象state是一个JavaScript对象，通过pushState () 创建新的历史记录条目。无论什么时候用户导航到新的状态，popstate事件就会被触发，且该事件的state属性包含该历史记录条目状态对象的副本
- 标题 — Firefox 目前忽略这个参数，但未来可能会用到。在此处传一个空字符串应该可以安全的防范未来这个方法的更改。或者，你可以为跳转的state传递一个短标题
- URL — 该参数定义了新的历史URL记录。注意，调用 pushState() 后浏览器并不会立即加载这个URL，但可能会在稍后某些情况下加载这个URL，比如在用户重新打开浏览器时。新URL不必须为绝对路径。如果新URL是相对路径，那么它将被作为相对于当前URL处理。新URL必须与当前URL同源，否则 pushState() 会抛出一个异常。该参数是可选的，缺省为当前URL

```
## 2.pushState使用
```javascript
    const pageSize = 2;
    const url = `${window.location.pathname}?page=${pageSize}`
    window.history.pushState({url: url}, '', url);  
```

以上就能实现页面无刷新修改url链接。

顺便放上获取和修改url的函数：
## 3.获取和修改url的函数：

### 获取url参数

```javascript
    function getParams (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
```

### 更改url参数
```javascript
function replaceParamVal(paramName,replaceWith) {
    var oUrl = window.location.href.toString();
    var re = evil('/('+ paramName+'=)([^&]*)/gi');
    var nUrl = oUrl.replace(re,paramName+'='+replaceWith);
    this.location = nUrl;
    window.location.href=nUrl
}

function evil(fn) {
    let Fn = Function; //一个变量指向Function，防止有些前端编译工具报错
    return new Fn('return ' + fn)();
}
```
