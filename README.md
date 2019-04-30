> 这两天需要写几个不同的纯静态页面，为了方便，基于`gulp`搭建本地开发环境。以后再有相关需求，可以很快设置环境。

### 主要功能
- 启动本地服务，并热加载
- saas转css
- css autoprefixer
- 文件压缩
- 替换html文件中引用静态资源路径并使用hash命名的文件
- 构建发布文件

### 相关命令

安装依赖文件
```js
yarn
```

启动本地服务
```js
gulp server // or yarn server
```

开启开发环境：本地服务+热加载+sass转css
```js
gulp dev // or yarn dev
```

build
```js
gulp build // or yarn build
```