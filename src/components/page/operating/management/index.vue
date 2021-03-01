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
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column type="index"
                         label="排序"
                         width="50">
        </el-table-column>
        <el-table-column prop="name"
                         label="公告标题"></el-table-column>
        <el-table-column prop="money"
                         label="公告类型">
        </el-table-column>
        <el-table-column prop="money"
                         label="公告内容">
        </el-table-column>
        <el-table-column label="公告照片">
          <template slot-scope="scope">
            <el-image style="width: 100px; height: 100px"
                      :src="scope.row.thumb"
                      :preview-src-list="[scope.row.thumb]">
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="address"
                         label="接收人"></el-table-column>
        <el-table-column prop="date"
                         label="开始时间"></el-table-column>
        <el-table-column prop="date"
                         label="结束时间"></el-table-column>
        <el-table-column prop="date"
                         label="最后编辑人"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{scope.row.name}}
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
    </div>

    <!-- 编辑弹出框 -->
    <el-dialog :title="operationTitle"
               :visible.sync="editVisible"
               width="40%">
      <el-form ref="form"
               :model="form"
               label-width="70px">
        <el-form-item label="公告标题">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="公告类型">
          <el-select class="modelIpntWidth"
                     v-model="form.value"
                     placeholder="请选择公告类型">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接收人">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="form.value1"
                          class="modelIpntWidth"
                          type="datetime"
                          placeholder="开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="form.value1"
                          class="modelIpntWidth"
                          type="datetime"
                          placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-upload class="upload-demo"
                     drag
                     action="https://jsonplaceholder.typicode.com/posts/"
                     multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip"
                 slot="tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="公告内容">
          <el-input type="textarea"
                    v-model="form.address"></el-input>
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
import { fetchData } from '@/api/index';
export default {
  name: 'basetable',
  data () {
    return {
      operationTitle: '',
      tableData: [],
      multipleSelection: [],
      delList: [],
      editVisible: false,
      pageTotal: 0,
      form: {},
      idx: -1,
      id: -1,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
    };
  },
  created () {
    this.getData();
  },
  methods: {
    // 获取 easy-mock 的模拟数据
    getData () {
      fetchData(this.query).then(res => {
        console.log(res);
        this.tableData = res.list;
        this.pageTotal = res.pageTotal || 50;
      });
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
          this.$message.success('删除成功');
          this.tableData.splice(index, 1);
        })
        .catch(() => { });
    },
    // 编辑操作
    handleEdit (operation, index, row) {
      if (operation === 'add') {
        this.operationTitle = '新增视频分类'
        this.form = {}
        this.editVisible = true;
      } else {
        this.operationTitle = '编辑视频分类'
        this.idx = index;
        this.form = row;
        this.editVisible = true;
      }

    },
    // 保存编辑
    saveEdit () {
      this.editVisible = false;
      this.$message.success(`修改第 ${this.idx + 1} 行成功`);
      this.$set(this.tableData, this.idx, this.form);
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
