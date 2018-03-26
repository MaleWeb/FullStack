<template>
  <div id="admin-user" v-loading="loading">
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
          <el-button type="primary" @click="newUser">新增</el-button>
          <el-button type="primary" @click="roleSet">角色设置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="admin-user-content">
      <el-table :data="userList" style="width: 100%">
        <el-table-column prop="id" label="id"></el-table-column>
        <el-table-column prop="user_name" label="用户名称"></el-table-column>
        <el-table-column prop="role_name" label="用户角色"> </el-table-column>
        <el-table-column prop="create_time" label="创建时间"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editorUser(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="editorRole(scope.row)">角色</el-button>
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
            <el-option v-for="role, index in roleList" :value="role.id" :key="index" :label="role.role_name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="editorCommit">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增用户" :visible.sync="newUserVisible" style="width:1000px">
      <el-form :model="addForm" ref="createUser" :rules="addrules" label-width="80px" label-position="left">
        <el-form-item label="用户名字" prop="user_name">
          <el-input v-model="addForm.user_name" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role_id">
          <el-select v-model="addForm.role_id">
            <el-option v-for="role, index in roleList" :key="index" :value="role.id" :label="role.role_name"></el-option>
          </el-select>
        </el-form-item>
        <p style="color: #999">默认密码:UU888@asdf</p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewUser">保 存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑角色" :visible.sync="isRoleShow">
      <el-form label-width="80px" ref="roleForm">
        <el-form-item label="角色">
          <el-select v-model="roleForm.role_id">
            <el-option v-for="item, index in roleList" :key="index" :value="item.id" :label="item.role_name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="角色设置" :visible.sync="isRoleSetShow">
      <el-form label="80px">
        <el-form-item label="资源类型">
          <el-radio-group v-model="roleType" @change="getResource">
            <el-radio label="api">接口</el-radio>
            <el-radio label="resource">资源</el-radio>
          </el-radio-group>
          
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="roleResource.role_id" @change="getResource">
            <el-option v-for="item, index in roleList" :value="item.id" :label="item.role_name" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="资源列表">
          <div style="height: 500px;overflow: auto;">
            <el-tree 
            ref="tree"
            :data="treeData" 
            :props="defaultProps" 
            show-checkbox 
            node-key="id" 
            :default-checked-keys="defaultTreeData"></el-tree>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script type="text/babel">
export default {
  name: "adminUser",
  components: {},
  data() {
    return {
      defaultTreeData: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      roleResource: {  // 角色设置表单
        role_id: '',
        resource_ids: '',
      },
      roleType: 'api', // 资源类型
      isRoleSetShow: false, // 角色设置开关
      isRoleShow: false, // 角色弹窗开关
      // 角色变价表单
      editorForm: {
        user_name: "", // 用户名字
        user_age: "", // 年龄
        user_photo: "", // 照片
        user_email: "", // 邮箱
        role_id: "", // 角色 id
        id: "" // 用户ID
      },
      roleForm: {
        id: '',
        role_id: '',
      },
      addForm: {
        user_name: "",
        role_id: ""
      },
      addrules: {
        user_name: [
          { required: true, trigger: "blur", message: "请输入用户名" }
        ],
        role_id: [{ required: true, trigger: "blur", message: "请选择角色" }]
      },
      // 详情弹窗控制按钮
      dialogTableVisible: false,
      // 新增用户弹窗
      newUserVisible: false,
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
      ids: 8,
      loading:false
    };
  },
  mounted() {
    import("service-worker-register").then(sw => {
      sw.default.register("service-worker.js");
    });
  },
  created() {
    this.onSubmit();
    this.getRoleList();
    // this.getUser();
  },
  methods: {
    // 角色设置
    roleSet () {
      this.roleResource.role_id = this.roleList[0].id;
      this.isRoleSetShow = true;
      this.getResource();
    },
    // 获取权限资源
    getNavAuth () {
      this.$fetch('/api/userauthnav', {role_id: this.roleResource.role_id}).then(res => {
        if (res.status) {
          this.defaultTreeData = [];
          this.treeData = this.coverNavResource(res.data);
        }
        console.log(res);
      }).catch(error => {
        console.log(error);
      })
    },
    // 获取权限接口
    getApiAuth () {
      this.$fetch('/api/userauthapi', {role_id: this.roleResource.role_id}).then(res => {
        if (res.status) {
          this.defaultTreeData = [];
          this.treeData = res.data.map(item => {
            if (item.isSelect) {
              this.defaultTreeData.push(item.id);
            }
            return item;
          })
        }
      }).catch(error => {
        console.log(error);
      })
    },
    // 处理导航资源
    coverNavResource (data) {
      data.map(item => {
        if (item.isSelect) {
          this.defaultTreeData.push(item.id);
        }
        if (item.children.length) {
          this.coverNavResource(item.children);
        }
        return item;
      })
      return data;
    },
    // 获取资源
    getResource () {
      if (this.roleType === 'api') {
        this.getApiAuth();
      } else if (this.roleType === 'resource') {
        this.getNavAuth();
      }
    },
    // 角色编辑
    editorRole (row) {
      // 重置表单
      this.copyProp(this.roleForm);
      this.isRoleShow = true;
      this.roleForm.id = row.id;
    },
    // 角色改动提交
    roleCommit () {
      let data = Object.assign({}, this.roleForm);
      this.$put('/api/role', data);
    },
    redictToLogin(res, that) {
      if (res.hasOwnProperty("isLogin") && !res.isLogin) {
        that.$router.push("/");
        return;
      }
    },
    newUser() {
      this.newUserVisible = true;
      this.$nextTick(() => {
        this.$refs["createUser"].resetFields();
      });
    },
    addNewUser() {
      const that = this;
      this.$refs["createUser"].validate(valid => {
        if (valid) {
          that.addUser();
        } else {
          that.$message.warning("请完善表单信息");
          return false;
        }
      });
    },
    // 添加用户
    addUser() {
      this.addForm.user_password = 'UU888@asdf'
      this.$post("/api/user", this.addForm)
        .then(res => {
          if (res.status) {
            this.$message.success(res.message);
            this.newUserVisible = false;
            this.getUserList();
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$del(`/api/user/${row.id}`)
            .then(res => {
              if (res.status) {
                this.$message.success(res.message);
                this.getUserList();
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch(error => {
              this.getUserList();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 属性拷贝
    copyProp() {
      if (arguments.length === 1) {
        Object.keys(arguments[0]).map(item => {
          return (arguments[0][item] = "");
        });
      } else {
        const props = [];
        for (let i = 1; i < arguments.length; i++) {
          props.push(arguments[i]);
        }
        const obj2 = Object.assign(...props);
        Object.keys(arguments[0]).map(item => {
          return (arguments[0][item] = obj2[item]);
        });
      }
    },
    // 提交修改
    editorCommit() {
      const data = Object.assign({}, this.editorForm);
      this.$put(`/api/user/${this.editorForm.id}`, data)
        .then(res => {
          if (res.status) {
            this.$message.success(res.message);
          } else {
            this.$message.warn(res.message);
          }
          this.getUserList();
          this.dialogTableVisible = false;
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 编辑用户
    editorUser(row) {
      this.dialogTableVisible = true;
      this.copyProp(this.editorForm, row);
    },
    // 获取角色列表
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
    // 获取用户列表
    getUserList() {
      let that = this;
      this.loading = true;
      this.$fetch(`/api/user`, {
        id: this.searchForm.id,
        user_name: this.searchForm.user_name,
        role_id: this.searchForm.role_id,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        console.log("用户列表");
        console.log(res);
        that.loading = false;
        //that.redictToLogin(res,that);// 退出到登录页
        res.data.map(item=>{
          item.create_time = that.$util.coverDate(item.create_time);
        })

        that.userList = res.data;
        that.total = res.data.total;
      });
    },
    onSubmit() {
      this.pageIndex = 1;
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

