const fs = require('fs')

// function ab2str(buf) {
//   return String.fromCharCode.apply(null, new Uint16Array(buf));
// }


function base64Str2str(str) {
  var total2str = "";
  for (var i = 0; i < str.length; i++) {
        var num10 = str.charCodeAt(i);  ///< 以10进制的整数返回 某个字符 的unicode编码
        var str2 = num10.toString(2);   ///< 将10进制数字 转换成 2进制字符串

        if( total2str == "" ){
          total2str = str2;
        }else{
          total2str = total2str + " " + str2;
        }
  }
  return total2str;
}

//读取图片
fs.readFile('./binary/b.jpg', 'binary', (err,data)=>{
    if (err) throw err;
    let buffer = new Buffer(data, 'binary');
    buffer = buffer.toString('base64');
    //buffer = base64Str2str(buffer);
    fs.writeFile('./binary/b.txt', buffer, (err)=>{
        if(err) throw err;
        console.log('保存成功');
    });

    //img.src = 'data: image/'+ getImageType(fileName) +';base64,' + buffer.toString('base64');
});


//保存图片
function saveImg(){
    const base64 = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, ""); //必须去掉前缀
    const buffer = new Buffer(base64, 'base64');
    fs.writeFile('保存路径', buffer, function (err) {
        if(err) throw err;
        console.log('保存成功');
    });
}
