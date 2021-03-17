<template>
  <div>

    <div class="handle-box">
      <el-select v-model="selectTitle"
                 class="handle-select mr10">
        <el-option key="1"
                   label="后台账号"
                   value="username"></el-option>
        <el-option key="2"
                   label="登陆ip"
                   value="ip"></el-option>
      </el-select>
      <el-input v-model="selectContent"
                placeholder="搜索内容"
                class="handle-input mr10"></el-input>
      <el-select v-model="query.result"
                 placeholder='请选择结果'
                 class="handle-select mr10">
        <el-option key="1"
                   label="成功"
                   value="true"></el-option>
        <el-option key="2"
                   label="失败"
                   value="false"></el-option>
      </el-select>
      <el-date-picker class="handle-selectdata mr10"
                      v-model="selectData"
                      @change='handeSlectData'
                      type="datetimerange"
                      value-format="timestamp"
                      :default-time="['00:00:00', '23:59:59']"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
      </el-date-picker>

      <el-button type="primary"
                 icon="el-icon-search"
                 v-preventClick
                 @click="handleSearch">搜索</el-button>
      <el-button type="danger"
                 v-preventClick
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
      <el-table-column prop="username"
                       show-overflow-tooltip
                       align='center'
                       label="后台账号"></el-table-column>
      <el-table-column show-overflow-tooltip
                       align='center'
                       label="时间">
        <template slot-scope="scope">
          {{scope.row.loginTime | formatDate}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       prop="onlineTime"
                       align='center'
                       label="在线时长">
      </el-table-column>
      <el-table-column prop="ip"
                       show-overflow-tooltip
                       align='center'
                       label="ip"></el-table-column>
      <el-table-column prop="os"
                       show-overflow-tooltip
                       align='center'
                       label="设备"></el-table-column>
      <el-table-column prop="browser"
                       show-overflow-tooltip
                       align='center'
                       label="浏览器"></el-table-column>
      <el-table-column show-overflow-tooltip
                       align='center'
                       label="结果">
        <template slot-scope="scope">
          <span style="color:red"
                v-if="scope.row.result == 0">{{'失败'}}</span>
          <span style="color:rgb(19, 206, 102)"
                v-if="scope.row.result == 1">{{ '成功'}}</span>
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
</template>

<script>
import moment from 'moment'
import { sysloginList } from '@/api/index';
export default {
  name: 'operating',
  data () {
    return {
      query: {
        size: 20,
        current: 1,
      },
      selectContent: '',
      selectTitle: 'username',
      selectData: [],
      pageTotal: 0,
      tableHeight: window.innerHeight - 380,
      tableData: [],
    };
  },
  created () {
    this.getData();
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
        this.selectContent = ''
      this.selectData = []
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
      sysloginList(this.query).then(res => {
        this.tableData = res.data.body.content;
        this.pageTotal = res.data.body.totalElements
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
    width: 120px;
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
