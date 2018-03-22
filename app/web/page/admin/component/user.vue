<template>
  <div id="admin-user">
    <div class="admin-user-search">
      <el-form size="mini" :inline="true" :model="searchForm" class="admin-search-form">
        <el-form-item label="用户ID" prop="id">
          <el-input v-model="searchForm.id" :maxlength="15" placeholder="请填写ID"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="user_name">
          <el-input v-model="searchForm.user_name" :maxlength="15" placeholder="请填写姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role_id">
          <el-select v-model="searchForm.role_id" placeholder="请选择角色">
            <el-option label="全部" value=''></el-option>
            <el-option v-for="item,index in roleList" :label="item.role_name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="admin-user-content">
        <el-table :data="userList" style="width: 100%">
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column prop="user_name" label="用户名称"></el-table-column>
          <el-table-column prop="role_name" label="用户角色"> </el-table-column>
          <el-table-column prop="create_time" label="创建时间"> </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="100">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editorUser(scope.row)">编辑</el-button>
              <el-button type="text" size="small" @click="deleteUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

      <div class="admin-user-pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next, total" :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="用户编辑" :visible.sync="dialogTableVisible">
      <el-form :model="editorForm" ref="editor" label-width="80px" label-position="left">
        <el-form-item label="用户名字" prop="user_name">
          <el-input v-model="editorForm.user_name"></el-input>
        </el-form-item>
        <el-form-item label="用户年龄" prop="user_age">
          <el-input v-model.number="editorForm.user_age"></el-input>
        </el-form-item>
        <el-form-item label="用户照片">
          <el-input v-model="editorForm.user_photo"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱">
          <el-input v-model="editorForm.user_email"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="editorForm.role_id">
            <el-option v-for="role, index in roleList" :value="role.id" :label="role.role_name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="editorCommit">保 存</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script type="text/babel">
export default {
  name: "adminUser",
  components: {},
  data() {
    return {
      editorForm: {
        user_name: '',  // 用户名字
        user_age: '',  // 年龄
        user_photo: '',  // 照片
        user_email: '',  // 邮箱
        role_id: '',  // 角色 id
        id: ''  // 用户ID
      },
      // 详情弹窗控制按钮
      dialogTableVisible: false,
      // 查询
      searchForm: {
        id: "",
        user_name: "",
        role_id: ""
      },
      // 用户表
      userList: [],
      // 分页
      pageIndex: 1,
      pageSize: 10,
      total: 0,
      // 角色列表
      roleList: [],
      ids: 2
    };
  },
  mounted() {
    import("service-worker-register").then(sw => {
      console.log(sw);
      sw.default.register("service-worker.js");
    });
  },
  created() {
    this.getUserList();
    this.getRoleList();
    this.getUser();
  },
  methods: {
    redictToLogin(res, that) {
      if (res.hasOwnProperty("isLogin") && !res.isLogin) {
        that.$router.push("/");
        return;
      }
    },
    // 删除用户
    deleteUser (row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$post('/deleteuser', { id: row.id }).then(res => {
          this.$message(res.message);
          if (res.success) {
            this.getUserList();
          }
        }).catch(error => {
          this.getUserList();
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    // 属性拷贝
    copyProp () {
      if (arguments.length === 1) {
        Object.keys(arguments[0]).map(item => {
          return arguments[0][item] = '';
        })
      } else {
        const props = [];
        for (let i = 1; i < arguments.length; i ++) {
          props.push(arguments[i]);
        }
        const obj2 = Object.assign(...props);
        Object.keys(arguments[0]).map(item => {
          return arguments[0][item] = obj2[item];
        })
      }
    },
    // 提交修改
    editorCommit () {
      const data = Object.assign({}, this.editorForm);
      this.$post('/updateuser', data).then(res => {
        this.$message(res.message);
        if (res.success) {
          this.getUserList();
          this.dialogTableVisible = false;
        }
      }).catch(error => {
        console.log(error);
      })
    },
    // 编辑用户
    editorUser (row) {
      this.dialogTableVisible = true;
      this.copyProp(this.editorForm, row);
    },
    getRoleList() {
      let that = this;
      this.$fetch(`/api/role`).then(res => {
        console.log("角色列表");
        console.log(res);

        //that.redictToLogin(res,that);// 退出到登录页

        that.roleList = res;
        console.log(that.roleList);
      });
    },
    getUserList() {
      let that = this;
      this.$fetch(`/api/user`, {
        id: this.searchForm.id,
        user_name: this.searchForm.user_name,
        role_id: this.searchForm.role_id,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        console.log("用户列表");
        console.log(res);
        
        //that.redictToLogin(res,that);// 退出到登录页

        res.data.map(item=>{
          item.create_time = that.$util.coverDate(item.create_time);
          return item;
        });
        that.userList = res.data;
        that.total = res.data.total;
      });
    },
    updateUser() {
      let that = this;
      this.$put(`/api/user/${this.ids}`, {
        id: this.ids,
        user_name: "ceshi3"
      }).then(res => {
        console.log(res);
      });
    },
    delUser() {
      this.$del(`/api/user/${this.ids}`)
        .then(res => {
          alert("删除成功！");
        })
        .catch(err => {
          alert(err.error);
        });
    },
    getUser() {
      this.$fetch(`/api/user/${this.ids}`).then(res => {
        console.log(res);
      });
    },
    onSubmit() {
      this.getUserList();
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.onSubmit();
    },
    handleCurrentChange(page) {
      this.pageIndex = page;
      this.onSubmit();
    }
  }
};
</script>
<style scoped>
#admin-user {
  padding: 0 20px;
  position: relative;
}
.admin-user-search {
  height: 60px;
  overflow: hidden;
  background: #fff;
}
.admin-search-form {
  height: 100%;
  height: 30px;
  margin-top: 15px;
  font-size: 13px;
}
#admin-user {
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
#admin-user .admin-user-content {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 20px;
  top: 60px;
  overflow: hidden;
}
#admin-user .admin-user-pagination {
  position: absolute;
  bottom: 0;
  right: 5px;
}
</style>

