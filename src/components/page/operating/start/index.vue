<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 启动广告
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary"
                   @click="handleEdit('add')"
                   class="mr10">新增广告</el-button>
      </div>
      <el-table :data="tableData"
                stripe
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column type="index"
                         align='center'
                         label="排序"
                         width="50">
        </el-table-column>
        <el-table-column prop="title"
                         show-overflow-tooltip
                         label="广告名称"
                         align='center'></el-table-column>
        <el-table-column label="广告说明"
                         show-overflow-tooltip
                         align='center'
                         prop='description'>
        </el-table-column>
        <el-table-column label="宣传图"
                         align='center'>
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px"
                      :src="scope.row.image"
                      :preview-src-list="[scope.row.image]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column align='center'
                         label="广告时间">
          <template slot-scope="scope">
            {{scope.row.adTime}}s
          </template>
        </el-table-column>
        <el-table-column align='center'
                         show-overflow-tooltip
                         label="创建时间">
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="有效时间"
                         align='center'>
          <template slot-scope="scope">
            {{scope.row.validTime}}s
          </template>
        </el-table-column>
        <el-table-column label="最后编辑人"
                         align='center'>
          <template slot-scope="scope">
            {{scope.row.updateBy ? scope.row.updateBy : '-'}}
          </template>
        </el-table-column>
        <el-table-column label="开关"
                         align='center'>
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status"
                       @change='(event)=>{handleSwitch(event,scope.row)}'
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="handleEdit('edit',scope.$index, scope.row)">编辑</el-button>
            <el-button type="text"
                       class="red"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="query.page"
                       :page-size="query.pageSize"
                       :total="pageTotal"
                       @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="operationTitle"
               :visible.sync="editVisible"
               width="40%">
      <el-form ref="formRules"
               :rules="rules"
               :model="form"
               label-width="90px">
        <el-form-item label="广告名称"
                      prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="广告时间"
                      prop="adTime">
          <el-input-number v-model="form.adTime"
                           controls-position="right"
                           class="modelIpntWidth"
                           :min="1"
                           :max="10"></el-input-number>
        </el-form-item>
        <el-form-item label="有效时间"
                      prop="validTime">
          <el-input-number v-model="form.validTime"
                           controls-position="right"
                           class="modelIpntWidth"
                           :min="1"
                           :max="5"></el-input-number>
        </el-form-item>
        <el-form-item label=""
                      prop="fileList">
          <el-upload class="upload-demo"
                     :file-list="form.fileList"
                     ref='clearUpload'
                     action="/"
                     :limit='1'
                     :http-request="uploadFile"
                     :on-exceed="handleExceed">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip"
                 slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="广告说明"
                      prop="description">
          <el-input type="textarea"
                    v-model="form.description"></el-input>
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
import moment from 'moment'
import { getAdPage, addAd, updateAd, uploadPic } from '@/api/index';
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
        pageSize: 10,
        page: 1,
        type: 1
      },
      operationTitle: '',
      tableData: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      rules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
          { max: 20, message: '最大输入20个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入广告说明', trigger: 'blur' },
          { max: 20, message: '最大输入20个字符', trigger: 'blur' }
        ],
        adTime: [
          { required: true, message: '请输入广告时间', trigger: 'blur' },
        ],
        validTime: [
          { required: true, message: '请输入广告有效时间', trigger: 'blur' },
          { validator: settlementPeriodRule, trigger: 'blur' }
        ],
        fileList: [{
          message: '请上传',
          trigger: 'change',
          required: true
        }]
      },
    };
  },
  created () {
    this.getData();
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    getData () {
      getAdPage(this.query).then(res => {
        this.tableData = res.data.body.list;
        this.tableData.forEach(element => {
          element.createTime = element.createTime * 1000
          element.status = element.status === 0 ? true : false
        });
        this.pageTotal = res.data.body.totalCount
      });
    },
    handleSwitch (value, row) {
      const newStatr = value ? 0 : 1
      this.storeStart(newStatr, row)

    },
    storeStart (status, row) {
      const NewRow = JSON.parse(JSON.stringify(row))
      NewRow.status = status
      NewRow.createTime = NewRow.createTime / 1000;
      let mess = ''
      if (status === 0) {
        mess = '已启动'
      } else if (status === 1) {
        mess = '已禁用'
      } else {
        mess = '删除成功'
      }
      updateAd(NewRow).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: mess,
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
    },
    handlePageChange (page) {
      this.query.page = page
      this.getData()
    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'pageIndex', 1);
      this.getData();
    },
    // 删除操作
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.storeStart(2, row)
        })
        .catch(() => { });
    },
    // 编辑操作
    handleEdit (operation, index, row) {
      if (operation === 'add') {
        this.operationTitle = '新增广告'
        this.form = {}
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.formRules.clearValidate();
          this.$refs.clearUpload.clearFiles()
        })
      } else {
        this.operationTitle = '编辑广告'
        this.form = JSON.parse(JSON.stringify(row));
        this.form.fileList = [{ name: '预选图片', url: this.form.noticeImg }]
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.formRules.clearValidate();
          // this.$refs.clearUpload.clearFiles()
        })
      }

    },
    uploadFile (param) {

      var form = new FormData();
      form.append("file", param.file);
      form.append("type", 1);
      uploadPic(form).then((res) => {
        if (res.data.code === 0) {
          this.form.fileList = []
          this.form.image = res.data.body
          this.form.fileList = [{ name: param.file.name, url: this.form.noticeImg }]
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })

    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    saveEdit () {
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          delete this.form.fileList
          this.form.type = 1;
          this.form.createTime ? this.form.createTime = this.form.createTime / 1000 : null;
          this.form.status ? this.form.status = 1 : this.form.status = 0;
          (this.operationTitle === '新增广告' ? addAd : updateAd)(this.form).then((res) => {
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
    text-align: right;
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
