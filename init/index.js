const http = require('http');
const fs = require('fs')

let serstream = http.createServer((req, res) => {

      //设置允许跨域的域名，*代表允许任意域名跨域
    res.setHeader("Access-Control-Allow-Origin","*");
    //跨域允许的header类型
    res.setHeader("Access-Control-Allow-Headers","Content-type,Content-Length,Authorization,Accept,X-Requested-Width");
    //跨域允许的请求方式
    res.setHeader("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    //设置响应头信息
    res.setHeader("X-Powered-By",' 3.2.1');
    //让options请求快速返回
    if(req.method == "OPTIONS"){
      return res.end();
    }

    let arr = [];

    req.on('data', data => {
        arr.push(data);
    });
    req.on('end', () => {
        let data = Buffer.concat(arr);
        // console.log(data)
        console.log(data.toString())
        //data
        //解析二进制文件上传数据
        let post = {};
        let files = {};
        console.log(req.headers['content-type']);
        if (req.headers['content-type']) {

            let str = req.headers['content-type'].split('; ')[1];
            if (str) {
                let boundary = '--' + str.split('=')[1];

                //1.用"分隔符切分整个数据"
                let arr = (data.toString()).split(boundary);

                //2.丢弃头尾两个数据
                arr.shift();
                arr.pop();

                //3.丢弃掉每个数据头尾的"\r\n"
                arr = arr.map(buffer => buffer.slice(2, buffer.length - 2));

                //4.每个数据在第一个"\r\n\r\n"处切成两半
                arr.forEach(buffer => {
                    let n = buffer.indexOf('\r\n\r\n');

                    let disposition = buffer.slice(0, n);
                    let content = buffer.slice(n + 4);

                    disposition = disposition.toString();

                    if (disposition.indexOf('\r\n') === -1) {
                        //普通数据
                        //Content-Disposition: form-data; name="user"
                        content = content.toString();

                        let name = disposition.split('; ')[1].split('=')[1];
                        name = name.substring(1, name.length - 1);

                        post[name] = content;
                    } else {
                        //文件数据
                        /*Content-Disposition: form-data; name="f1"; filename="a.txt"\r\n
                        Content-Type: text/plain*/
                        let [line1, line2] = disposition.split('\r\n');
                        let [, name, filename] = line1.split('; ');
                        let type = line2.split(': ')[1];

                        name = name.split('=')[1];
                        name = name.substring(1, name.length - 1);
                        filename = filename.split('=')[1];
                        filename = filename.substring(1, filename.length - 1);

                        let path = "./"+filename;

                        fs.writeFile(path, content, err => {
                            if (err) {
                                console.log('文件写入失败', err);
                            } else {
                                files[name] = {filename, path, type};
                                //console.log(files);
                            }
                        });
                    }
                });


                //5.完成
                //console.log(post);
            }
        }


        res.end();
    });
});
serstream.listen(8000,()=>{
  console.log('server is listening in 8000');
});
