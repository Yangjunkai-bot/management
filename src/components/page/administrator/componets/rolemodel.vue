<template>
  <el-dialog :title="modelTitle"
             :show-close='false'
             :close-on-click-modal='false'
             :visible.sync="dialogVisible"
             width="800px">
    <el-row>
      <el-form ref="formRules"
               :rules="rules"
               :model="form"
               label-width="80px">

        <el-col :span="7">
          <el-form-item label="角色名称"
                        prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="角色描述"
                        prop="description">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
        </el-col>
      </el-form>
      <el-col :span="4">
        <div class="grid-content grid-con-1">
          <div class="grid-cont-right">
            <div class="grid-num">{{perNum}}</div>
            <div>权限数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content grid-con-1">
          <div class="grid-cont-right">
            <div class="grid-num">{{usNum}}</div>
            <div>子账号数量</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <tree-table :data="roledata"
                :columns="columns"
                @getAuth="getAuth"
                ref="treeTableS"
                class="treeTable"
                border></tree-table>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button @click="saveEdit"
                 type="primary">确 定</el-button>
    </span>
  </el-dialog>

</template>

<script>

import treeTable from './TreeTableAuthor'
import { permissionList, roleAdd, roleUpdate } from '@/api/index';
export default {
  name: 'rolemodel',
  data () {
    return {
      form: {
        permissionList: []
      },
      roleList: [

      ],
      dialogVisible: false,
      columns: [
        {
          text: '菜单列表',
          value: 'description',
          width: 200,
          option: 'sonData1'
        },
        {
          text: '功能权限',
          value: 'sonData1',
          option: 'sonData1',
          act: 'act'
        }
      ],
      perNum: 0,
      usNum: 0,
      roledata: [],
      rules: {
        name: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { max: 20, message: '最大输入20个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { max: 20, message: '最大输入20个字符', trigger: 'blur' }
        ],

      },
    }
  },
  props: {
    modelTitle: {
      type: String,
      default: ''
    },
    defaultVal: {
      type: Object,
      default: ''
    }
  },
  components: { treeTable },
  methods: {
    openDia () {
      this.dialogVisible = true;
      this.$nextTick(() => {
        if (this.modelTitle !== '新增角色') {
          this.form = this.defaultVal
          this.perNum = this.defaultVal.permissionNum
          this.usNum = this.defaultVal.userNum
          this.getRoleList(this.defaultVal.id)

        } else {
          this.form = {
            permissionList: []
          }
          this.getRoleList('0')
        }
        this.$refs.formRules.clearValidate();

      })
    },
    saveEdit () {
      this.$refs.treeTableS.roleList();
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          (this.modelTitle === '新增角色' ? roleAdd : roleUpdate)(this.form).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: this.modelTitle === '新增角色' ? '新增成功' : '编辑成功',
                type: 'success'
              });
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
            this.dialogVisible = false
          })
        } else {
          return false;
        }
      });

    },
    getAuth (data) {
      let opt = []
      data.forEach(val => {
        if (val.children) {
          if (val.checkAll) {
            opt.push(val.id)
          }
          if (val.children) {
            val.children.forEach(el => {
              if (el.selectchecked.length) {
                opt.push(val.id)
                opt.push(el.id)
                opt.push(el.selectchecked)
              }
            })
          }
        }
      })

      this.form.permissionList = this.uniq(opt.join().split(',').filter(n => { return n }))
    },
    uniq (array) {
      var temp = [];
      for (var i = 0; i < array.length; i++) {
        //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
        if (array.indexOf(array[i]) == i) {
          temp.push(array[i])
        }
      }
      return temp;
    },
    getRoleList (id) {
      permissionList(id).then((res) => {
        if (res.data.code === 0) {
          this.defaultList(res.data.body)
        }
      })
    },
    defaultList (val) {
      const list = []
      val.forEach((res, index) => {
        list.push({
          'type': 0,
          'id': res.id,
          'description': res.name,
          'isIndeterminate': false,
          'act': '全选',
          'checkAll': false,
          'checked': false,
          'children': [],
          'newselectchecked': [],
        })
        if (res.children) {
          res.children.forEach((ele, index1) => {
            list[index].children.push({
              'type': 1,
              id: ele.id,
              'description': ele.name,
              'isIndeterminate': false,
              'selectchecked': [],
              'checkAll': false,
              'checked': false,
              'sonData1': []
            })
            if (ele.children) {
              ele.children.forEach((data, index2) => {
                if (data.hasAuthority === 1) {
                  list[index].children[index1].selectchecked.push(data.id)
                }
                list[index].children[index1].sonData1[index2] = {
                  'type': 2,
                  'id': data.id,
                  'checked': false,
                  'description': data.name,
                }
              })

            }
          })
        }
      })
      this.isChecked(list)
    },
    isChecked (val) {
      const list = JSON.parse(JSON.stringify(val))
      list.forEach((ele, index) => {
        if (ele.children) {
          ele.children.forEach((res, index1) => {
            if (list[index].children[index1].selectchecked.length === res.sonData1.length) {
              list[index].children[index1].checkAll = true
            } else if (list[index].children[index1].selectchecked.length < res.sonData1.length && list[index].children[index1].selectchecked.length !== 0) {
              list[index].children[index1].isIndeterminate = true
            }
            if (ele.children[index1].checkAll === true) {
              ele.newselectchecked.push(ele.children[index1].id)
            }
          })
        }
      })
      list.forEach((ele) => {
        if (ele.newselectchecked.length === ele.children.length) {
          ele.checkAll = true
        }
        ele.children.forEach((res) => {
          if (res.selectchecked.length > 0 && ele.checkAll !== true) {
            ele.isIndeterminate = true
          }
        })
      })

      this.roledata = list

    },
    NewList (val) {
      const list = []
      val.forEach((res, index) => {
        list.push({
          'type': 0,
          'id': res.id,
          'description': res.name,
          'isIndeterminate': false,
          'act': '全选',
          'checkAll': false,
          'checked': false,
          'children': []
        })
        if (res.children) {
          res.children.forEach((ele, index1) => {
            list[index].children.push({
              'type': 1,
              id: ele.id,
              'description': ele.name,
              'isIndeterminate': false,
              'selectchecked': [],
              'checkAll': false,
              'checked': false,
              'sonData1': []
            })
            if (ele.children) {
              ele.children.forEach((data, index2) => {
                list[index].children[index1].sonData1[index2] = {
                  'type': 2,
                  'id': data.id,
                  'checked': false,
                  'description': data.name,
                }
              })

            }
          })
        }
      })

      this.roledata = list
    }
  },
}
</script>

<style>
.treeTable {
    max-height: 500px;
    overflow-y: scroll;
}
.grid-content {
    display: flex;
    align-items: center;
}
.grid-con-1 .grid-num {
    font-size: 20px;
    color: rgb(45, 140, 240);
}
.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}
.inputWidth {
    width: 100%;
}
</style>