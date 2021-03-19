# 安装依赖

注：第一次使用vue和express要全局安装下vue-cli和express

vue: npm install -g vue-cli
express：npm i -g express-generator

cd vueMall(进入项目文件下)
npm install （安装依赖）

express:(进入项目文件下)
cd server
npm install（安装依赖）

# 本地开发

浏览器访问http://localhost:8081

express监听的是3001端口http://localhost:3001

开启服务器：
express:（先进入到server/bin目录下）
node www

开发环境下启动项目，打开前端页面:
npm run dev

# 构建生产
npm run build