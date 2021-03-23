<template>
  <div>
    <div class="handle-box">
      <el-input v-model="query.useridx"
                placeholder="请输入"
                class="handle-input mr10">
        <template slot="prepend">会员ID</template>
      </el-input>
      <el-input v-model="query.context"
                placeholder="请输入"
                class="handle-input mr10">
        <template slot="prepend">动态文本</template>
      </el-input>
      <el-select v-model="query.tagId"
                 placeholder="动态标签"
                 class="handle-select mr10">
        <el-option v-for="(data,index) in selectOption"
                   :key="index"
                   :label="data.name"
                   :value="data.id"></el-option>
      </el-select>
      <el-button type="primary"
                 icon="el-icon-search"
                 v-preventClick
                 v-allow="{name: 'content:userCommunity:verify'}"
                 @click="handleSearch">搜索</el-button>
      <el-button type="danger"
                 v-preventClick
                 v-allow="{name: 'content:userCommunity:verify'}"
                 @click="remove">重制</el-button>
    </div>
    <el-table :data="tableData"
              :height="tableHeight"
              border
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header"
              @selection-change="handleSelectionChange">
      <el-table-column type="index"
                       label="排序"
                       align='center'
                       show-overflow-tooltip
                       width="55"></el-table-column>
      <el-table-column prop="useridx"
                       show-overflow-tooltip
                       align='center'
                       label="发布会员ID"></el-table-column>
      <el-table-column prop="context"
                       show-overflow-tooltip
                       align='center'
                       label="动态文本"></el-table-column>
      <el-table-column show-overflow-tooltip
                       align='center'
                       width="110px"
                       label="动态图片">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px"
                    :src="scope.row.newAttachmentVoList ? scope.row.newAttachmentVoList[0] : null"
                    :preview-src-list="scope.row.newAttachmentVoList">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="url"
                       show-overflow-tooltip
                       align='center'
                       label="关联标签">
        <template slot-scope="scope">
          <span v-for="(data,index) in scope.row.tagList"
                :key='index'>{{data}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="createTime"
                       show-overflow-tooltip
                       align='center'
                       label="发布时间">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateTime"
                       show-overflow-tooltip
                       align='center'
                       label="最后操作时间"></el-table-column>
      <el-table-column prop="frequency"
                       show-overflow-tooltip
                       align='center'
                       label="最后操作人"></el-table-column>
      <el-table-column label="操作"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     v-allow="{name: 'content:userCommunity:detail'}"
                     @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="text"
                     v-allow="{name: 'content:userCommunity:pass'}"
                     @click="handleDelete( scope.row,'true')">通过</el-button>
          <el-button type="text"
                     v-allow="{name: 'content:userCommunity:refuse'}"
                     class="red"
                     @click="handleDelete(scope.row,'false')">拒绝</el-button>
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

    <!-- 编辑弹出框 -->
    <el-dialog title="编辑"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="editVisible"
               width="800px">
      <el-form ref="formRules"
               :rules="rules"
               :model="form"
               label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="动态文本"
                          prop="title">
              <el-input v-model="form.context"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="发布会员ID">
              {{form.useridx}}
            </el-form-item>
          </el-col>

        </el-row>
        <el-form-item label="动态图片">
          <div class="modelImg"
               v-for="(data,index) in (form.attachmentVoList ? form.attachmentVoList : []) "
               :key="index">
            <el-image :src="data.url"
                      fit="fit"
                      style="height:200px"></el-image>
            <i class="el-icon-close"
               @click="delImg(data,index)"></i>
          </div>

        </el-form-item>
        <el-form-item label="关联标签"
                      prop="titleTag">
          <el-checkbox-group v-model="form.titleTag">
            <el-checkbox v-for="(data,index) in selectOption"
                         :key='index'
                         :value='data.id'
                         :label="Number(data.id)">{{data.name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editVisible = false; getData()">取 消</el-button>
        <el-button type="primary"
                   @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import allwo from '@/utils/allow.js'
import moment from 'moment'
import { getUserCommunityPage, getTagList, updateUserCommunity, delUserCommunityImage } from '@/api/index';
export default {
  name: 'basetable',
  data () {
    return {
      query: {
        current: 1,
        size: 20,
        status: 3
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      tableHeight: window.innerHeight - 380,
      selectOption: [],
      rules: {
        title: [
          { required: true, message: '请输入动态文本', trigger: 'blur' },
          { max: 20, message: '最大输入20个字符', trigger: 'blur' }
        ],
        titleTag: [
          { type: 'array', required: true, message: '请至少选择一个标签', trigger: 'change' }
        ]
      },
    };
  },
  created () {
    allwo.Permissions('content:userCommunity:verify').then((res) => {
      if (res === true) {
        this.getData();
        this.getTagList()
      }
    })
  },
  filters: {
    formatDate: function (value) {
      if (value) {
        const newValue = value * 1000
        return moment(newValue).format('YYYY-MM-DD HH:mm:ss')
      }

    }
  },
  methods: {
    remove () {
      this.query = {
        current: 1,
        size: 20,
        status: 3
      },
        this.getData()
    },
    delImg (row, index) {
      delUserCommunityImage({ 'id': row.id, 'status': 1 }).then((res) => {
        if (res.data.code === 0) {
          this.form.attachmentVoList.splice(index, 1)
        }
      })
    },
    getTagList () {
      getTagList().then(res => {
        if (res.data.code === 0) {
          this.selectOption = res.data.body
        }
      })
    },
    // 获取 easy-mock 的模拟数据
    getData () {

      getUserCommunityPage(this.query).then(res => {
        this.tableData = res.data.body.list;
        res.data.body.list.forEach(element => {
          element.newAttachmentVoList = []
          if (element.attachmentVoList !== null) {
            element.attachmentVoList.forEach(res => {
              element.newAttachmentVoList.push(res.url)
            });
          }
        });
        // this.tableData.newAttachmentVoList = newAttachmentVoList
        this.pageTotal = res.data.body.totalCount;
      });

    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'current', 1);
      this.getData();
    },
    // 删除操作
    handleDelete (row, is) {
      row.status = is === 'true' ? 0 : 1
      updateUserCommunity(row).then((res) => {
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
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    delAllSelection () {
      const length = this.multipleSelection.length;
      let str = '';
      this.delList = this.delList.concat(this.multipleSelection);
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' ';
      }
      this.$message.error(`删除了${str}`);
      this.multipleSelection = [];
    },
    // 编辑操作
    handleEdit (index, row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.editVisible = true;
      this.$nextTick(() => {
        this.$refs.formRules.clearValidate();
      })
    },
    // 保存编辑
    saveEdit () {
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          updateUserCommunity(this.form).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                message: '编辑成功',
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
    handleSizeChange (val) {
      this.$set(this.query, 'size', val);
      this.getData()
    },
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'current', val);
      this.getData();
    }
  }
};
</script>

<style scoped>
.modelImg {
    width: 30%;
    margin: 0 10px 10px 10px;
    text-align: center;
    float: left;
}
.modelImg i {
    display: block;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 200px;
}

.handle-input {
    width: 300px;
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
