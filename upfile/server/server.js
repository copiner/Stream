const koa = require('koa');
const app = new koa();

const Router = require('koa-router');
const router = new Router();

const fs = require('fs');
const cors = require('koa2-cors');

const path = require('path');
const koaStatic = require('koa-static');

const Busboy = require('busboy');
// 写入目录
const mkdirsSync = (dirname) => {
  if (fs.existsSync(dirname)) {
    return true
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname)
      return true
    }
  }
  return false
}

getSuffix = (fileName) =>{
  return fileName.split('.').pop()
}
// 重命名
Rename = (fileName)=>{
  return Math.random().toString(16).substr(2) + '.' + getSuffix(fileName)
}

uploadFile = (ctx, options)=>{
  const _emmiter = new Busboy({headers: ctx.req.headers});
  const fileType = options.fileType;
  const filePath = path.join(options.path, fileType);
  const fileArr = [];
  const confirm = mkdirsSync(filePath);
  //console.log('filePath : '+filePath);// E:\hub\upfile\uploads\doc
  if (!confirm) {
    return
  }
  console.log('start uploading...')
  return new Promise((resolve, reject) => {
    _emmiter.on('file', function (fieldname, file, filename, encoding, mimetype) {
      console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
      file.on('data', function(data) {
        console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
      });
      file.on('end', function () {

        console.log('File [' + fieldname + ']: filename: ' + filename + ' Finished');
        const fileName = Rename(filename);
        const saveTo = path.join(filePath, fileName);
        file.pipe(fs.createWriteStream(saveTo));
        fileArr.push({
          filePath: `${fileType}/${fileName}`,
          fileName: `${fileName}`
        });

      })
    })

    _emmiter.on('finish', function () {
      console.log('finished...');
      resolve({
        fileDetails : fileArr,
        prefixPath : "http://localhost:3001/uploads/"
      })
    })

    _emmiter.on('error', function (err) {
      console.log('err...')
      reject(err)
    })

    ctx.req.pipe(_emmiter)
  })
}

router.post('/upload', async (ctx)=>{
  const serverPath = path.join(__dirname, '/uploads/');//服务端文件路径
  // 获取上传文件
  const result = await uploadFile(ctx, {
    fileType: 'any',
    path: serverPath
  });
  //console.log(result.filePath);
  //const filePath = path.join(serverPath, result.filePath);
  ctx.body = result;
  // ctx.body = {
  //   fileUrl: `http://localhost:3001/uploads/${result.filePath}`
  // }
});


app.use(koaStatic(path.join(__dirname)))
   .use(cors())
   .use(router.routes());

app.listen(3001, ()=>{
    console.log('koa is listening in 3001');
});
