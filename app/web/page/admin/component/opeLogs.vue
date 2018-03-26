<template>
  <div id="admin-user" v-loading="loading">
    <div class="admin-user-search">
      <el-form size="mini" :inline="true" :model="searchForm" class="admin-search-form">
        <el-form-item label="记录ID" prop="id">
          <el-input v-model="searchForm.id" :maxlength="15" placeholder="请填写ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="user_name">
          <el-input v-model="searchForm.user_name" :maxlength="15" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="admin-user-content">
        <el-table :data="logList" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="user_id" label="用户ID"></el-table-column>
          <el-table-column prop="user_name" label="用户名称"></el-table-column>
          <el-table-column prop="operation_ip" label="IP"> </el-table-column>   
          <el-table-column prop="operation_method" label="METHOD"> </el-table-column>       
          <el-table-column prop="operation_url" label="URL"> </el-table-column>
          <el-table-column prop="operation_desc" label="描述"> </el-table-column>
          <el-table-column prop="operation_time" label="操作时间"> </el-table-column>
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
  </div>
</template>
<script type="text/babel">
export default {
  name:'adminUser',
  components: {},
  data() {
    return {
      // 查询
      searchForm:{
        id:'',
        user_name:''
      },
      // 用户表
      logList:[],
      // 分页
      pageIndex:1,
      pageSize:10,
      total:0,
      // 角色列表
      roleList:[],
      loading:false
    };
  },
  mounted() {
    import("service-worker-register").then(sw => {
      console.log(sw);
      sw.default.register("service-worker.js");
    });   
  },
  created(){
    this.getLogList();
  },
  methods: {
    redictToLogin(res,that){
      if(res.hasOwnProperty('isLogin') && !res.isLogin){
        that.$router.push('/');
        return;
      }
    },
    getLogList() {
      let that = this;
      this.loading = true;
      this.$fetch(`/api/logs`,{
        id:this.searchForm.id,
        user_name:this.searchForm.user_name,
        pageIndex:this.pageIndex,
        pageSize:this.pageSize,
        state:2
      }).then(res => {
        console.log("日志列表");
        console.log(res);
        that.loading = false;
        that.redictToLogin(res,that);// 退出到登录页

        res.data.map(item=>{
          item.operation_time = that.$util.coverDate(item.operation_time);
          return item;
        })
        that.logList = res.data;
        that.total = res.total;
      });
    },
    onSubmit(){
      this.pageIndex = 1;
      this.getLogList();
    },
    handleSizeChange(size){
      this.pageSize = size;
      this.getLogList();
    },
    handleCurrentChange(page){
      this.pageIndex = page;
      this.getLogList();
    },
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
</style>

