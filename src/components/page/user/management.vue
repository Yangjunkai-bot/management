<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 会员管理
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input v-model="query.useridx"
                  placeholder="请输入"
                  class="handle-input mr10">
          <template slot="prepend">会员ID</template>
        </el-input>
        <el-input v-model="query.nickname"
                  placeholder="请输入"
                  class="handle-input mr10">
          <template slot="prepend">会员昵称</template>
        </el-input>
        <el-input v-model="query.mobilePhone"
                  placeholder="请输入"
                  class="handle-input mr10">
          <template slot="prepend">绑定手机</template>
        </el-input>
        <el-input v-model="query.parentAgentId"
                  placeholder="请输入"
                  class="handle-input mr10">
          <template slot="prepend">上级代理人ID</template>
        </el-input>
        <el-button type="primary"
                   icon="el-icon-search"
                   v-preventClick
                   @click="handleSearch">搜索</el-button>
        <el-button type="danger"
                   v-preventClick
                   @click="remove">重制</el-button>
      </div>
      <el-table :data="tableData"
                :height="tableHeight"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column prop="useridx"
                         show-overflow-tooltip
                         align='center'
                         label="会员ID"></el-table-column>
        <el-table-column prop="nickname"
                         show-overflow-tooltip
                         align='center'
                         label="会员昵称"></el-table-column>
        <el-table-column prop="mobilePhone"
                         show-overflow-tooltip
                         align='center'
                         label="绑定手机"></el-table-column>
        <el-table-column prop="parentAgentName"
                         show-overflow-tooltip
                         align='center'
                         label="上级代理"></el-table-column>
        <el-table-column show-overflow-tooltip
                         align='videoTime'
                         label="状态">
          <template slot-scope="scope">
            {{scope.row.userStatus}}
          </template>
        </el-table-column>
        <el-table-column prop="agentParam"
                         show-overflow-tooltip
                         align='center'
                         label="邀请码"></el-table-column>

        <el-table-column prop="spreadNum"
                         show-overflow-tooltip
                         align='center'
                         label="推广人数"></el-table-column>
        <el-table-column prop="vipEndTime"
                         show-overflow-tooltip
                         align='center'
                         label="会员卡/到期时间"></el-table-column>
        <el-table-column prop="gameGold"
                         show-overflow-tooltip
                         align='center'
                         label="余额"></el-table-column>
        <el-table-column show-overflow-tooltip
                         align='center'
                         label="总充值">
          <template slot-scope="scope">
            {{'-'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         align='center'
                         label="注册来源/注册时间">
          <template slot-scope="scope">
            {{'-'}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip
                         align='center'
                         label="标签">
          <template slot-scope="scope">
            {{'-'}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120"
                         align="center">
          <template slot-scope="scope">
            <el-button type="text"
                       @click="handleEdit(scope.$index, scope.row)">详情</el-button>
            <el-button type="text">调额</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Model ref="models" />
      <div class="pagination">
        <el-pagination background
                       layout="total, prev, pager, next"
                       :current-page="query.current"
                       :page-size="query.size"
                       :total="pageTotal"
                       @current-change="handlePageChange"></el-pagination>
      </div>
    </div>

    <!-- 编辑弹出框 -->

  </div>
</template>

<script>
import Model from './components/model'
import { accountList, MovieClassificationList, updateMovie } from '@/api/index';
export default {
  name: 'basetable',
  data () {
    return {
      query: {
        current: 1,
        size: 10
      },
      tableData: [],
      multipleSelection: [],
      delList: [],
      pageTotal: 0,
      tableHeight: window.innerHeight - 320,
      selectOption: [],

    };
  },
  components: {
    Model
  },
  created () {
    this.getData();
    this.getMovieClassificationList()
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
      accountList(this.query).then(res => {
        this.tableData = res.data.body.records;
        this.pageTotal = res.data.body.total || 50;
      });
    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'current', 1);
      this.getData();
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
      this.$refs.models.handeModel(row)
      // this.form = JSON.parse(JSON.stringify(row));
      // this.form.list = []
      // this.editVisible = true;
      // this.$nextTick(() => {
      //   // this.$refs.formRules.clearValidate();
      // })
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
    width: 250px;
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
