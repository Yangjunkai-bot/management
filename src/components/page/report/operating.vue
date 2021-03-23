<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>
          <i class="el-icon-lx-cascades"></i> 运维报表
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
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
        <el-select v-model="query.channel"
                   placeholder="地址"
                   class="handle-select mr10">
          <el-option v-for="(data,index) in channelList"
                     :key="index"
                     :label="data.name"
                     :value="data.id"></el-option>
        </el-select>
        <el-button type="primary"
                   icon="el-icon-search"
                   v-preventClick
                   v-allow="{name: 'report:operation:list'}"
                   @click="handleSearch">搜索</el-button>
        <el-button type="danger"
                   v-preventClick
                   v-allow="{name: 'report:operation:list'}"
                   @click="remove">重制</el-button>
        <el-button type="primary"
                   icon="el-icon-upload2"
                   v-preventClick
                   v-allow="{name: 'report:operation:download'}"
                   @click="rexport">导出报表</el-button>
      </div>
      <el-tag class="tag">注册用户：{{num.totalUser}}</el-tag>
      <el-tag class="tag">绑手机用户：{{num.totalBindPhone}}</el-tag>
      <el-tag class="tag">充值总额：{{num.totalPay}}</el-tag>
      <el-tag class="tag">首充会员：{{num.totalFirstPayUser}}</el-tag>

      <el-table :data="tableData"
                border
                :height="tableHeight"
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header">
        <el-table-column label="统计日期"
                         show-overflow-tooltip
                         align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatDate}}</template>
        </el-table-column>
        <el-table-column prop="channelName"
                         show-overflow-tooltip
                         align='center'
                         label="渠道"></el-table-column>
        <el-table-column prop="newUser"
                         show-overflow-tooltip
                         align='center'
                         label="新增用户"></el-table-column>
        <el-table-column prop="bindPhone"
                         show-overflow-tooltip
                         align='center'
                         label="绑定手机用户"></el-table-column>
        <el-table-column prop="activeUser"
                         show-overflow-tooltip
                         align='center'
                         label="活跃用户"></el-table-column>
        <el-table-column prop="rechargeAmount"
                         show-overflow-tooltip
                         align='center'
                         label="充值金额"></el-table-column>
        <el-table-column prop="rechargeUser"
                         show-overflow-tooltip
                         align='center'
                         label="充值人数"></el-table-column>
        <el-table-column prop="rechargeAvg"
                         show-overflow-tooltip
                         align='center'
                         label="平均充值"></el-table-column>
        <el-table-column prop="payRate"
                         show-overflow-tooltip
                         align='center'
                         label="付费率"></el-table-column>
        <el-table-column prop="firstPayAmount"
                         show-overflow-tooltip
                         align='center'
                         label="首充金额"></el-table-column>
        <el-table-column prop="firstPayUser"
                         show-overflow-tooltip
                         align='center'
                         label="首充人数"></el-table-column>
        <el-table-column prop="firstPayAvg"
                         show-overflow-tooltip
                         align='center'
                         label="首充平均充值"></el-table-column>
        <el-table-column prop="nextRemain"
                         show-overflow-tooltip
                         align='center'
                         label="次日留存"></el-table-column>
        <el-table-column prop="threeRemain"
                         show-overflow-tooltip
                         align='center'
                         label="3日留存"></el-table-column>
        <el-table-column prop="sevenRemain"
                         show-overflow-tooltip
                         align='center'
                         label="7日留存"></el-table-column>
        <el-table-column prop="fifteenRemain"
                         show-overflow-tooltip
                         align='center'
                         label="15日留存"></el-table-column>
        <el-table-column prop="thirtyRemain"
                         show-overflow-tooltip
                         align='center'
                         label="30日留存"></el-table-column>

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
  </div>
</template>

<script>
import allwo from '@/utils/allow.js'
import moment from 'moment'
import { getOperationReportPage, getChannelList, downloadOperationReport } from '@/api/index';
export default {
  name: 'operating',
  data () {
    return {
      query: {
        size: 20,
        current: 1,
      },
      selectData: [],
      tableHeight: window.innerHeight - 360,
      pageTotal: 0,
      tableData: [],
      multipleSelection: [],
      channelList: [],
      num: {}
    };
  },
  created () {
    allwo.Permissions('report:operation:list').then((res) => {
      if (res === true) {
        this.getData();
        this.getChannelList()
      }
    })
  },
  filters: {
    formatDate: function (value) {
      const newValue = value * 1000
      return moment(newValue).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    getChannelList () {
      getChannelList().then(res => {
        if (res.data.code === 0) {

          this.channelList = res.data.body
        }
      })
    },
    remove () {
      this.query = {
        current: 1,
        size: 20
      },
        this.selectData = []
      this.getData()
    },
    handeSlectData (data) {
      if (data) {
        this.query.start = data[0] / 1000
        this.query.end = data[1] / 1000
      } else {
        delete this.query.start
        delete this.query.end
      }
    },
    // 获取 easy-mock 的模拟数据
    getData () {
      getOperationReportPage(this.query).then(res => {
        this.num = res.data.body.total
        this.tableData = res.data.body.page.list;
        this.pageTotal = res.data.body.page.totalCount
      });
    },
    rexport () {
      downloadOperationReport(this.query).then((res) => {
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel" });  // res就是接口返回的文件流了
        let objectUrl = URL.createObjectURL(blob);
        window.location.href = objectUrl;

      })
    },
    // 触发搜索按钮
    handleSearch () {
      this.$set(this.query, 'current', 1);
      this.getData();
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
.tag {
    margin: 0 10px 10px 0;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
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
