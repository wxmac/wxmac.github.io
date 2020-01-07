
---
title: 一、React 多页面打包
date: 2019-12-06
tags:
  - react
  - js
  - webpack
---


## 缘由

之前我们用的是react单页面打包，方便是方便，开包即用。但是因为我们做的是活动页面，一般每次都只有一个页面，不仅要建大量的路由，而且资源冗杂，即使已经做了资源分割。还有做多页面最重要的原因是：单页面打包，会影响所有的页面，如果一个页面报错，那么其他的页面也无法访问。下面开始配置:


### 一.webpack及react版本

``` javascript
  "webpack": "^4.19.1",
  "react": "^16.8.3",
```

<!-- more -->

### 二.文件夹基本构造

``` javascript
config 
    - path.js
    - webpack.config.js
public 
    - index.html
src    
    - page 
        - home 
            - component.js
            - index.js 
            - index.less
index.js //必不可少，可以为空
```

<!-- More info: [Generating](https://hexo.io/docs/generating.html) -->

### 1.page下的index.js

home是一个单独的页面，包括 

component.js:
``` javascript
    class Home extends Component{
        constructor(props){
            super(props)
            this.state = {
                
            }
        }
        componentDidMount(){}
        render() {
            return(
                <div>
                    # ...
                </div>
            )
        }
    }
    export default Home;
```

index.js:
``` javascript
    import 'babel-polyfill'
    import React from 'react';
    import ReactDOM from 'react-dom';
    import Home from './component';
    ReactDOM.render(<Home />, document.getElementById('root'));
```

index.less是页面相关的样式

### 2.config下的path.js

``` javascript
    // 获取page/*/下的所有index
    const globby = require('globby');
    const entriesPath = globby.sync([resolveApp('src/page') + '/*/index.js']);
    module.exports = {
        ...
        entriesPath
    }
```

下面这里是关键，东西有点多，配错了就没效果了：⬇️
### 3.config下的webpack.config.js

``` javascript
    // 获取指定路径下的入口文件
    function getEntries(){
        const entries = {};
        const files = paths.entriesPath;
        files.forEach(filePath => {
            let tmp = filePath.split('/');
            let name = tmp[tmp.length - 2];
            entries[name] = [
                require.resolve('react-dev-utils/webpackHotDevClient'),
                filePath,
            ];
        });
        return entries;
    }

    // 入口文件对象
    const entries = getEntries();

    // 有多少个页面就new 多少个HtmlWebpackPlugin
    const htmlPlugin = Object.keys(entries).map(item => {
        return new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml, # pulblic/index.html 公共html模板
            filename:  item + '/' + item + '.html', # 这里是关键,访问入口由这里决定 http://localhost:3000/home/home.html
            chunks: [item]
        });
    });


    //更换入口
    entry: {
        # devtool: isEnvProduction
        # ? shouldUseSourceMap
        #     ? 'source-map'
        #     : false
        # : isEnvDevelopment && 'eval-source-map',
        entries
    }


    // 出口也顺便更改一下
    output:{
        #把对应资源放到对应页面下面,这里[name] 就是home
        #isEnvDevelopment 对应的内容一定要配，不然本地开发只能找到一个页面
        #version 是时间戳 const version = +new Date();
        filename: isEnvProduction
        ?    '[name]/static/js/[name].[chunkhash:8].'+version+'.js'
        : isEnvDevelopment && '[name]/static/js/bundle.js',

        chunkFilename: isEnvProduction
        ?    '[name]/static/js/[name].[chunkhash:8].'+version+'.chunk.js'
        : isEnvDevelopment && '[name]/static/js/[name].chunk.'+version+'.js',
    }

    //上面是js，css也改一下，全局搜索 MiniCssExtractPlugin
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename:   '[name]/static/css/[name].[contenthash:8].'+version+'.css',
        chunkFilename:  '[name]/static/css/[name].[contenthash:8].chunk.'+version+'.css',
    }),

    // 图片资源 全局搜索 .png ,图片是独立的
    {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader')  ,
        options: {
        limit: 10000,
        name: 'static/media/[name].[hash:8].'+version+'.[ext]',
        },
    },
```

### 4.打包效果

``` javascript
   dist
      - 1  // 打包出的公共的js文件
      - 2  // 打包出的公共的js文件
      - assets #本地静态资源
      - static #打包的静态图片资源
          - media
              - xxxx.png
      - home
          - home.html
          - static
              - css
                - xxx.css
              - js
                - xxx.js
       xxx
```

如果多个页面的话，其他页面效果和home文件一样。

### 4.最后一点

打完包，可能会出现资源访问不到，在 package.json 配置一下homepage

(1).我的是下面，根据项目路径来写：
``` javascript
   "homepage": "../",
```
顺便提一下，本地跨域，同样在 package.json 配置一下 proxy就可以了：
 
 ``` javascript
  "proxy": "域名",
```

打完包之后，放到服务器上，跳转访问路径也要配置的

 ``` javascript
 
    //比如本地 
    http://localhost:3000/home/home.html;

    //线上:
    https:www.baidu.com/dist/demo/home/home.html

    //那么当你跳转链接的时候，就要这样：

    //跳转
    const param = window.location.href.includes('baidu') ? '/dist/demo' : '';
    window.location.href = param + '/home/home.html';
```


