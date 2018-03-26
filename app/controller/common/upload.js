const fs = require('fs');
const path = require('path');
const Controller = require('egg').Controller;
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');

class UploadController extends Controller {
  async index() {
    const {ctx, service} = this;
    const stream = await this.ctx.getFileStream();
    // encodeURIComponent(stream.fields.name)
    let curD = new Date().getTime();
    const filename = curD +  path.extname(stream.filename).toLowerCase();
    const target = path.join(this.config.baseDir, 'app/web/asset/images', filename);
    const writeStream = fs.createWriteStream(target);
    try {
      await awaitWriteStream(stream.pipe(writeStream));
    } catch (err) {
      await sendToWormhole(stream);
      throw err;
    }
    ctx.body = {
        status:true,
        message:'上传成功',
        url:'/asset/images' + filename
    }
  }
}

module.exports = UploadController;