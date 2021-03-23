<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 商户管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="selectTitle"
                   class="handle-select mr10">
          <el-option key="1"
                     label="商户号"
                     value="merchNo"></el-option>
          <el-option key="2"
                     label="商户名称"
                     value="merchName"></el-option>
        </el-select>
        <el-input v-model="selectContent"
                  placeholder="搜索内容"
                  class="handle-input mr10"></el-input>
        <el-select v-model="query.status"
                   class="handle-select mr10">
          <el-option key="0"
                     label="启用"
                     :value="1"></el-option>
          <el-option key="1"
                     label="停用"
                     :value="0"></el-option>
        </el-select>
        <el-button type="primary"
                   icon="el-icon-search"
                   v-preventClick
                   v-allow="{name: 'finance:merch:list'}"
                   @click="handleSearch">搜索</el-button>
        <el-button type="danger"
                   v-preventClick
                   v-allow="{name: 'finance:merch:list'}"
                   @click="remove">重制</el-button>

        <el-button type="primary"
                   style="float:right"
                   v-allow="{name: 'finance:merch:save'}"
                   @click="handleEdit('add')"
                   class="mr10">新增商户</el-button>
      </div>
      <el-table :data="tableData"
                :height="tableHeight"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column type="index"
                         align='center'
                         label="排序"
                         width="50">
        </el-table-column>
        <el-table-column prop="merchName"
                         show-overflow-tooltip
                         label="商户名称"
                         align='center'></el-table-column>
        <el-table-column label="商户号"
                         show-overflow-tooltip
                         align='center'
                         prop='merchNo'>
        </el-table-column>
        <el-table-column label="累计充值金额"
                         show-overflow-tooltip
                         align='center'
                         prop='totalCharge'>
        </el-table-column>
        <el-table-column label="最后操作人"
                         show-overflow-tooltip
                         align='center'
                         prop='operator'>
        </el-table-column>
        <el-table-column label="最后操作时间"
                         show-overflow-tooltip
                         align='center'
                         prop='updateTime'>
          <template slot-scope="scope">
            {{scope.row.updateTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="开关"
                         v-if="allowsVal"
                         align='center'>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       @change='(event)=>{handleSwitch(event,scope.row)}'>
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-allow="{name: 'finance:merch:update'}"
                       @click="handleEdit('edit',scope.$index, scope.row)">编辑</el-button>
            <el-button type="text"
                       class="red"
                       v-allow="{name: 'finance:merch:delete'}"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       :page-sizes="[20, 50, 100, 200]"
                       layout="total, sizes, prev, pager, next, jumper"
                       :current-page="query.current"
                       :page-size="query.size"
                       :total="pageTotal"
                       @size-change="handleSizeChange"
                       @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="operationTitle"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="editVisible"
               width="600px">
      <el-form ref="formRules"
               :rules="rules"
               :model="form"
               label-width="90px">

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商户名称"
                          prop="merchName">
              <el-input v-model="form.merchName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户code"
                          prop="merchCode">
              <el-input v-model="form.merchCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商户号"
                          prop="merchNo">
              <el-input v-model="form.merchNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户密钥"
                          prop="md5Key">
              <el-input v-model="form.md5Key"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="商户私钥"
                          prop="privateKey">
              <el-input v-model="form.privateKey"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商户公钥"
                          prop="publicKey">
              <el-input v-model="form.publicKey"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注"
                      prop="remark">
          <el-input type="textarea"
                    v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import allwo from '@/utils/allow.js'
import moment from 'moment'
import { settingList, settingSave, settingUpdate, settingDelete, settingUpdateStatus } from '@/api/index';
export default {
  name: 'basetable',

  data () {
    const settlementPeriodRule = (rule, value, callback) => {
      if (value >= this.form.adTime) {
        callback(new Error('不能大于等于广告时间'))
      } else {
        callback()
      }
    }
    return {
      query: {
        size: 20,
        current: 1,
      },
      operationTitle: '',
      tableData: [],
      selectTitle: 'merchNo',
      selectContent: '',
      editVisible: false,
      allowsVal: false,
      tableHeight: window.innerHeight - 310,
      pageTotal: 0,
      form: {},
      rules: {
        merchName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' },
        ],
        merchCode: [
          { required: true, message: '请输入商户code', trigger: 'blur' },
        ],
        merchNo: [
          { required: true, message: '请输入商户号', trigger: 'blur' },
        ],
        md5Key: [
          { required: true, message: '请输入商户密钥', trigger: 'blur' },
        ],
        privateKey: [
          { required: true, message: '请输入商户私钥', trigger: 'blur' },
        ],
        publicKey: [
          { required: true, message: '请输入商户公钥', trigger: 'blur' },
        ],
      },
    };
  },
  created () {
    allwo.Permissions('finance:merch:update').then((res) => {
      this.allowsVal = res
    })
    allwo.Permissions('finance:merch:list').then((res) => {
      if (res === true) {
        this.getData();
      }
    })
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    getData () {
      settingList(this.query).then(res => {
        this.tableData = res.data.body.records;
        this.tableData.forEach(element => {
          element.updateTime = element.updateTime * 1000
          element.status = element.status === 0 ? false : true
        });
        this.pageTotal = res.data.body.total
        this.query = {
          size: res.data.body.size,
          current: res.data.body.current
        }
      });
    },
    handleSwitch (value, row) {
      const newStatr = value ? 1 : 0
      settingUpdateStatus({ 'id': row.id, 'status': newStatr }).then((res) => {
        if (res.data.code === 0) {
          this.getData()
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })
    },
    handlePageChange (page) {
      this.query.current = page
      this.getData()
    },
    // 触发搜索按钮
    handleSearch () {
      if (this.selectContent !== '') {
        this.query[this.selectTitle] = this.selectContent
      } else {
        delete this.query[this.selectTitle]
      }
      this.$set(this.query, 'current', 1);
      this.getData();
    },
    remove () {
      this.query = {
        current: 1,
        size: 20
      },
        this.selectContent = ''
      this.selectData = []
      this.getData()
    },
    handleSizeChange (val) {
      this.$set(this.query, 'size', val);
      this.getData()
    },
    // 删除操作
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          settingDelete(row.id).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getData()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          })
        })
        .catch(() => { });
    },
    // 编辑操作
    handleEdit (operation, index, row) {
      if (operation === 'add') {
        this.operationTitle = '新增商户'
        this.form = {}
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.formRules.clearValidate();
        })
      } else {
        this.operationTitle = '编辑商户'
        this.form = JSON.parse(JSON.stringify(row));
        this.form.fileList = [{ name: '预选图片', url: this.form.noticeImg }]
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.formRules.clearValidate();
        })
      }

    },
    saveEdit () {
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          (this.operationTitle === '新增广告' ? settingSave : settingUpdate)(this.form).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: this.operationTitle === '新增广告' ? '新增成功' : '编辑成功',
                type: 'success'
              });
              this.getData()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }

          })
        } else {
          return false;
        }
      });
    },
  }
};
</script>

<style scoped>
.modelIpntWidth {
    width: 100%;
}
.handle-box {
    margin-bottom: 10px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
