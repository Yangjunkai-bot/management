<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 视频管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.id"
                  placeholder="请输入"
                  class="handle-input mr10">
          <template slot="prepend">会员ID</template>
        </el-input>
        <el-input v-model="query.number"
                  placeholder="请输入"
                  class="handle-input mr10">
          <template slot="prepend">视频编号</template>
        </el-input>
        <el-input v-model="query.title"
                  placeholder="请输入"
                  class="handle-input mr10">
          <template slot="prepend">视频标题</template>
        </el-input>
        <el-select v-model="query.types"
                   placeholder="视频分类"
                   class="handle-select mr10">
          <el-option v-for="(data,index) in selectOption"
                     :key="index"
                     :label="data.name"
                     :value="data.id"></el-option>
        </el-select>
        <el-button type="primary"
                   icon="el-icon-search"
                   v-preventClick
                   v-allow="{name: 'content:movie:list'}"
                   @click="handleSearch">搜索</el-button>
        <el-button type="danger"
                   v-preventClick
                   v-allow="{name: 'content:movie:list'}"
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
                         label="上传会员ID"></el-table-column>
        <el-table-column prop="number"
                         show-overflow-tooltip
                         align='center'
                         label="视频编号"></el-table-column>
        <el-table-column prop="title"
                         show-overflow-tooltip
                         align='center'
                         label="视频标题"></el-table-column>
        <el-table-column prop="description"
                         show-overflow-tooltip
                         align='center'
                         label="视频简介"></el-table-column>
        <el-table-column prop="videoTime"
                         show-overflow-tooltip
                         align='videoTime'
                         label="视频时长"></el-table-column>
        <el-table-column prop="url"
                         show-overflow-tooltip
                         align='center'
                         label="播放地址"></el-table-column>
        <el-table-column width="110px"
                         align='center'
                         label="视频封面">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px"
                      :src="scope.row.noticeImg"
                      :preview-src-list="[scope.row.images]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         align='center'
                         label="视频类型">
          <template slot-scope="scope">
            <span v-if="scope.row.free === 0 || scope.row.free === 1">
              {{scope.row.free === 0 ? '免费视频' : 'vip视频'}}
            </span>
            <span v-else> 点播视频(¥{{scope.row.currency}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="videoType"
                         show-overflow-tooltip
                         align='center'
                         label="视频分类"></el-table-column>
        <el-table-column prop="createTime"
                         show-overflow-tooltip
                         align='center'
                         label="上传时间"></el-table-column>
        <el-table-column prop="frequency"
                         show-overflow-tooltip
                         align='center'
                         label="播放量"></el-table-column>
        <el-table-column label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       v-allow="{name: 'content:movie:update'}"
                       @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text"
                       class="red"
                       v-allow="{name: 'content:movie:delete'}"
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
    <el-dialog title="编辑"
               :show-close='false'
               :close-on-click-modal='false'
               :visible.sync="editVisible"
               width="900px">
      <el-form ref="formRules"
               :rules="rules"
               :model="form"
               label-width="90px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="上传会员ID">
              {{form.useridx}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频编号">
              {{form.number}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="视频地址">
              {{form.url}}
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="视频时长">
              {{form.videoTime}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="视频标题"
                          prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频分类"
                          prop="types">
              <el-select v-model="form.types"
                         placeholder="视频分类"
                         style="width:100%">
                <el-option v-for="(data,index) in selectOption"
                           :key="index"
                           :label="data.name"
                           :value="data.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="视频类型"
                          prop="free">
              <el-radio-group v-model="form.free">
                <el-radio :label="0">免费视频</el-radio>
                <el-radio :label="1">vip视频</el-radio>
                <el-radio :label="2">点播视频</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if='form.free === 2'
                          label="点播价格"
                          prop="currency">
              <el-input v-model="form.currency"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="精选"
                          prop="boutique">
              <el-switch v-model="form.boutique">
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if='form.boutique === true'
                          label="精选排序"
                          prop="description">
              <el-input-number style="width:100%"
                               :min="1"
                               v-model="form.boutiqueSequence"
                               controls-position="right"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="视频简介"
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
import allwo from '@/utils/allow.js'
import { getMoviePage, MovieClassificationList, updateMovie } from '@/api/index';
export default {
  name: 'basetable',
  data () {
    return {
      query: {
        current: 1,
        size: 20
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      tableHeight: window.innerHeight - 320,
      selectOption: [],
      rules: {
        title: [
          { required: true, message: '请输入视频标题', trigger: 'blur' },
          { max: 20, message: '最大输入20个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入视频简介', trigger: 'blur' },
        ],
        free: [
          { required: true, message: '请选择视频类型', trigger: 'change' },
        ],
        currency: [
          { required: true, message: '请输入点播价格', trigger: 'blur' },
        ],
        types: [
          { required: true, message: '请选择视频分类', trigger: 'change' },
        ],
        boutiqueSequence: [
          { required: true, message: '请输入精品排序', trigger: 'blur' },
        ],
      },
    };
  },
  created () {
    allwo.Permissions('content:movie:list').then((res) => {
      if (res === true) {
        this.getData();
        this.getMovieClassificationList()
      }
    })

  },
  methods: {
    remove () {
      this.query = {
        current: 1,
        size: 20
      },
        this.getData()
    },
    getMovieClassificationList () {
      MovieClassificationList().then(res => {
        if (res.data.code === 0) {
          this.selectOption = res.data.body
        }
      })
    },
    // 获取 easy-mock 的模拟数据
    getData () {
      getMoviePage(this.query).then(res => {
        this.tableData = res.data.body.list;
        this.pageTotal = res.data.body.totalCount || 50;
      });
    },
    handleSizeChange (val) {
      this.$set(this.query, 'size', val);
      this.getData()
    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'current', 1);
      this.getData();
    },
    // 删除操作
    handleDelete (index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功');
          this.tableData.splice(index, 1);
        })
        .catch(() => { });
    },
    // 多选操作
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },

    // 编辑操作
    handleEdit (index, row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.form.types = this.form.types.toString()
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
          this.form.boutique = this.form.boutique ? 1 : 0;
          updateMovie(this.form).then((res) => {
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
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'current', val);
      this.getData();
    }
  }
};
</script>

<style scoped>
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
