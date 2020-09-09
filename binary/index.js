/*
通过ArrayBuffer的格式读取Ajax请求数据
*/

//client
const xhr = new XMLHttpRequest();
xhr.open("GET", "ajax", true);
xhr.responseType = "arraybuffer";
xhr.onload = function () {
    console.log(xhr.response)
}
xhr.send();


//service

const app = new Koa();
app.use(async (ctx) => {
  if (pathname = '/ajax') {
    ctx.body = 'hello world';
    ctx.status = 200;
  }
}).listen(3000)
