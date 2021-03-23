<template>
  <div>

    <div class="handle-box">
      <el-select v-model="selectTitle"
                 class="handle-select mr10">
        <el-option key="1"
                   label="操作人"
                   value="operator"></el-option>
        <el-option key="2"
                   label="操作IP"
                   value="ip"></el-option>
      </el-select>
      <el-input v-model="selectContent"
                placeholder="搜索内容"
                class="handle-input mr10"></el-input>
      <el-input v-model="query.module"
                placeholder="请输入"
                class="handle-inputs mr10">
        <template slot="prepend">项目名称</template>
      </el-input>
      <el-input v-model="query.functionName"
                placeholder="请输入"
                class="handle-inputs mr10">
        <template slot="prepend">模块名称</template>
      </el-input>
      <el-date-picker class="handle-selectdata mr10"
                      v-model="selectData"
                      @change='handeSlectData'
                      type="datetimerange"
                      :default-time="['00:00:00', '23:59:59']"
                      value-format="timestamp"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
      </el-date-picker>

      <el-button type="primary"
                 icon="el-icon-search"
                 v-preventClick
                 v-allow="{name: 'sys:log:operate'}"
                 @click="handleSearch">搜索</el-button>
      <el-button type="danger"
                 v-preventClick
                 v-allow="{name: 'sys:log:operate'}"
                 @click="remove">重制</el-button>
    </div>

    <el-table :data="tableData"
              border
              :height="tableHeight"
              class="table"
              ref="multipleTable"
              header-cell-class-name="table-header">
      <el-table-column label="序列"
                       width="80"
                       type="index"
                       align="center">
      </el-table-column>
      <el-table-column prop="module"
                       show-overflow-tooltip
                       align='center'
                       label="项目"></el-table-column>
      <el-table-column prop="functionName"
                       show-overflow-tooltip
                       align='center'
                       label="模块"></el-table-column>
      <el-table-column prop="event"
                       show-overflow-tooltip
                       align='center'
                       label="事件"></el-table-column>
      <el-table-column prop="operator"
                       show-overflow-tooltip
                       align='center'
                       label="操作人"></el-table-column>
      <el-table-column show-overflow-tooltip
                       align='center'
                       label="时间">
        <template slot-scope="scope">
          {{scope.row.createTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column prop="ip"
                       show-overflow-tooltip
                       align='center'
                       label="IP"></el-table-column>
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
</template>

<script>
import allwo from '@/utils/allow.js'
import moment from 'moment'
import { operateList } from '@/api/index';
export default {
  name: 'operating',
  data () {
    return {
      query: {
        size: 20,
        current: 1,
      },
      selectContent: '',
      selectTitle: 'ip',
      tableHeight: window.innerHeight - 380,
      selectData: [],
      pageTotal: 0,
      tableData: [],
      multipleSelection: [],
      channelList: [],
    };
  },
  created () {
    allwo.Permissions('sys:log:operate').then((res) => {
      if (res === true) {
        this.getData();
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
        size: 20
      },
        this.selectData = []
      this.selectContent = ''
      this.getData()
    },
    handeSlectData (data) {
      if (data) {
        this.query.beginTime = data[0] / 1000
        this.query.endTime = data[1] / 1000
      } else {
        delete this.query.beginTime
        delete this.query.endTime
      }


    },
    handleSizeChange (val) {
      this.$set(this.query, 'size', val);
      this.getData()
    },
    // 获取 easy-mock 的模拟数据
    getData () {
      operateList(this.query).then(res => {
        this.tableData = res.data.body.content;
        this.pageTotal = res.data.body.totalElements
        this.query = {
          current: res.data.body.number + 1,
          size: res.data.body.size
        }
      });
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
    // 分页导航
    handlePageChange (val) {
      this.$set(this.query, 'current', val);
      this.getData();
    }
  }
};
</script>

<style scoped>
.tag {
    margin: 0 10px 10px 0;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 90px;
}
.handle-input {
    width: 200px;
}
.handle-inputs {
    width: 250px;
}
.handle-selectdata {
    width: 300px;
    /* display: inline-block; */
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
