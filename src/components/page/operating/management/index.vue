<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 视频分类
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-button type="primary"
                   @click="handleEdit('add')"
                   class="mr10">新增视频分类</el-button>
      </div>
      <el-table :data="tableData"
                stripe
                v-loading="loading"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column type="index"
                         label="排序"
                         width="50">
        </el-table-column>
        <el-table-column prop="title"
                         label="公告标题"></el-table-column>
        <el-table-column label="公告类型">
          <template slot-scope="scope">
            {{options[scope.row.type].label}}
          </template>
        </el-table-column>
        <el-table-column prop="content"
                         label="公告内容">
        </el-table-column>
        <el-table-column label="公告照片">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px"
                      :src="scope.row.noticeImg"
                      :preview-src-list="[scope.row.noticeImg]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="accepter"
                         label="接收人"></el-table-column>
        <el-table-column label="开始时间">
          <template slot-scope="scope">
            {{scope.row.startTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">
            {{scope.row.endTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column prop="createBy"
                         label="最后编辑人"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{status[scope.row.status].label}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-if="scope.row.status === 1"
                       @click="storeStart(0, scope.row,'已发布')">发布</el-button>
            <el-button type="text"
                       v-if="scope.row.status == 0"
                       class="red"
                       @click="storeStart(3, scope.row,'已停用')">停用</el-button>
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
        <el-form-item label="公告标题"
                      prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="公告类型"
                      prop="type">
          <el-select class="modelIpntWidth"
                     v-model="form.type"
                     placeholder="请选择公告类型">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间"
                      prop="startTime">
          <el-date-picker v-model="form.startTime"
                          class="modelIpntWidth"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间"
                      prop="endTime">
          <el-date-picker v-model="form.endTime"
                          class="modelIpntWidth"
                          type="datetime"
                          placeholder="选择日期"
                          value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="fileList">
          <el-upload class="upload-demo"
                     drag
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
        <el-form-item label="公告内容"
                      prop="content">
          <el-input type="textarea"
                    v-model="form.content"></el-input>
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
import { noticePage, addNotice, uploadPic, updateNotice } from '@/api/index';
export default {
  name: 'basetable',
  data () {
    return {
      query: {
        "page": 1,
        "pageSize": 10
      },
      operationTitle: '',
      tableData: [],
      multipleSelection: [],
      editVisible: false,
      pageTotal: 0,
      form: {
        fileList: [],
      },
      idx: -1,
      id: -1,
      rules: {
        title: [
          { required: true, message: '请输入公告标题', trigger: 'blur' },
          { max: 20, message: '最大输入20个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择公告类型', trigger: 'change' }
        ],
        startTime: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        endTime: [
          { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        fileList: [{
          message: '请上传',
          trigger: 'change',
          required: true
        }],
        content: [
          { required: true, message: '请输入公告内容', trigger: 'blur' },
        ],
      },
      loading: false,

      status: [
        { value: '0', label: '发布' },
        { value: '1', label: '未发布' },
        { value: '2', label: '已停用' }
      ],
      options: [{
        value: 1,
        label: '弹窗公告'
      }, {
        value: 2,
        label: '消息公告'
      }],
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
    // 获取 easy-mock 的模拟数据
    getData () {
      this.loading = true
      noticePage(this.query).then(res => {
        console.log(res)

        this.tableData = res.data.body.list;
        this.tableData.forEach(element => {
          element.startTime = element.startTime * 1000
          element.endTime = element.endTime * 1000
        });
        this.pageTotal = res.data.body.totalCount || 0
        this.loading = false
      })
        .catch(error => {
          this.loading = false
        })
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    uploadFile (param) {
      this.form.fileList = []
      console.log(param.file.name)
      var form = new FormData();
      form.append("file", param.file);
      form.append("type", 2);
      uploadPic(form).then((res) => {
        console.log(res)
        if (res.data.code === 0) {
          console.log(this.form)
          console.log(res.data.body)
          this.form.noticeImg = res.data.body
          this.form.fileList = [{ name: param.file.name, url: this.form.noticeImg }]
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warning'
          });
        }
      })

    },
    // 删除操作
    handleDelete (index, row) {
      console.log(row)

      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          storeStart(3, row, '删除成功')
        })
        .catch(() => { });
    },
    storeStart (status, row, mes) {
      const NewRow = JSON.parse(JSON.stringify(row))
      NewRow.status = status
      NewRow.startTime = NewRow.startTime / 1000;
      NewRow.endTime = NewRow.endTime / 1000;
      updateNotice(NewRow).then((res) => {
        if (res.data.code === 0) {
          this.$message({
            message: mes,
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
    // 编辑操作
    handleEdit (operation, index, row) {
      if (operation === 'add') {
        this.operationTitle = '新增视频分类'
        this.form = {}
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.formRules.clearValidate();
          this.$refs.clearUpload.clearFiles()
        })
      } else {
        this.operationTitle = '编辑视频分类'
        this.form = JSON.parse(JSON.stringify(row));
        this.form.fileList = [{ name: '预选图片', url: this.form.noticeImg }]
        this.editVisible = true;
        this.$nextTick(() => {
          this.$refs.formRules.clearValidate();
          // this.$refs.clearUpload.clearFiles()
        })
      }
    },
    // 保存编辑
    saveEdit () {
      console.log(this.form)
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          // if (this.operationTitle === '新增视频分类') {
          this.form.status = '2';
          this.form.startTime = this.form.startTime / 1000;
          this.form.endTime = this.form.endTime / 1000;

          (this.operationTitle === '新增视频分类' ? addNotice : updateNotice)(this.form).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: this.operationTitle === '新增视频分类' ? '新增成功' : '编辑成功',
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
          // } else {

          //   updateNotice(this.form).then((res) => {
          //     if (res.data.code === 0) {
          //       this.$message({
          //         message: 编辑成功,
          //         type: 'success'
          //       });
          //       this.getData()
          //     } else {
          //       this.$message({
          //         message: res.data.msg,
          //         type: 'warning'
          //       });
          //     }

          //   })
          // }
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
    handlePageChange (page) {
      console.log(page)
      this.query.page = page
      this.getData()
    }
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
