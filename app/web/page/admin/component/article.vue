<template>
  <div id="admin-user" v-loading="loading">
    <div class="admin-user-search">
      <el-form size="mini" :inline="true" :model="searchForm" class="admin-search-form">
        <el-form-item label="记录ID" prop="article_id">
          <el-input v-model="searchForm.article_id" :maxlength="15" placeholder="请填写ID"></el-input>
        </el-form-item>
        <el-form-item label="文章标题" prop="article_title">
          <el-input v-model="searchForm.article_title" :maxlength="15" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="admin-user-content">
        <el-table :data="articleList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="article_title" label="标题"></el-table-column>
          <el-table-column prop="article_desc" label="描述"></el-table-column>
          <el-table-column prop="user_id" label="作者ID"> </el-table-column>
          <el-table-column prop="user_name" label="作者"> </el-table-column>
          <el-table-column prop="create_time" label="发布时间"> </el-table-column>
           <el-table-column align="center" label="操作" width="150"> 
            <template slot-scope="scope">
              <el-button @click="showArticle(scope.row)" type="text" size="mini">查看文章</el-button>
              <el-button @click="delArticle(scope.row)" type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="admin-user-pagination">
           <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageIndex"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="pageSize"
              layout="sizes, prev, pager, next, total"
              :total="total">
          </el-pagination>
        </div>
    </div>
    <el-dialog
      :title="curArticle.article_title"
      :visible.sync="showArticleFlag"
      :modal-append-to-body = "false"
      center
      width="1000px">
      <div class="admin-article-content">
        <div class="admin-article-main">
          <!-- <h3>{{curArticle.article_title}}</h3> -->
          <p class="admin-article-info">作者：{{curArticle.user_name}} &nbsp;&nbsp;发布时间：{{curArticle.create_time}}</p>
          <div v-html="curArticle.article_content"></div>
        </div>        
      </div>
      <!-- <span slot="footer" class="dialog-footer"> -->
        <!-- <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
      <!-- </span> -->
    </el-dialog>
  </div>
</template>
<script type="text/babel">
import marked from 'marked';
export default {
  name:'adminUser',
  components: {},
  data() {
    return {
      // 查询
      searchForm:{
        article_id:'',
        article_title:''
      },
      // 用户表
      articleList:[],
      // 分页
      pageIndex:1,
      pageSize:10,
      total:0,
      // 角色列表
      roleList:[],
      loading:false,
      // 文章内容弹框
      showArticleFlag:false,
      curArticle:{},
    };
  },
  mounted() {
    import("service-worker-register").then(sw => {
      console.log(sw);
      sw.default.register("service-worker.js");
    });   
  },
  created(){
    this.getArticleList();
  },
  methods: {
    redictToLogin(res,that){
      if(res.hasOwnProperty('isLogin') && !res.isLogin){
        that.$router.push('/');
        return;
      }
    },
    getArticleList() {
      let that = this;
      this.loading = true;
      this.$fetch(`/api/article`,{
        article_id:this.searchForm.article_id,
        article_title:this.searchForm.article_title,
        pageIndex:this.pageIndex,
        pageSize:this.pageSize
      }).then(res => {
        console.log("文章列表");
        console.log(res);
        that.loading = false;
        that.redictToLogin(res,that);// 退出到登录页
        
        res.data.map(item=>{
          item.create_time = that.$util.coverDate(item.create_time);
          item.article_desc = item.article_desc.substring(0,42) + '......';
          return item;
        })
        that.articleList = res.data;
        that.total = res.total;
      });
    },
    onSubmit(){
      this.pageIndex = 1;
      this.getArticleList();
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.getArticleList();
    },
    handleCurrentChange(page){
      this.pageIndex = page;
      this.getArticleList();
    },
    delArticle(row){
      let that = this;
      this.$confirm('确定要删除该篇文章吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
         that.delAjax(row);
      }).catch(() => {});    
    },
    delAjax(row){
      this.$del(`/api/article/${row.article_id}`).then((res)=>{
        console.log('删除文章...')
        console.log(res)
        this.getArticleList();
      })
    },
    showArticle(row){
      row.article_content = marked(row.article_content);
      this.curArticle = row;
      this.showArticleFlag = true;
    }
  },
};
</script>
<style scoped>
  #admin-user{
    padding:0 20px;
    position:relative;
  }
  .admin-user-search{
    height:60px;
    overflow:hidden;
    background:#fff;
  }
  .admin-search-form{
    height:100%;
    height:30px;
    margin-top:15px;
    font-size:13px;
  } 
  #admin-user{
    height:100%;
    overflow:hidden;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  #admin-user .admin-user-content{
    position:absolute;
    left:20px;
    right:20px;
    bottom:20px;
    top:60px;
    overflow:hidden;
  }
  #admin-user .admin-user-pagination{
    position:absolute;    
    bottom:0;
    right:5px;
  }
  .admin-article-content{
    width:960px;
    height:600px;
    overflow:hidden;
  }
  .admin-article-content .admin-article-main{
    position:relative;
    width:960px;
    height:600px;
    padding-right:20px;
    /* overflow:hidden;  */
    overflow-y:auto;
  }
  .admin-article-content .admin-article-main h3{
    text-align:center;
  }
  .admin-article-content .admin-article-main p.admin-article-info{
    margin:0;
    color: #a8a8a8;
    font-size: 13px;
  }
</style>

