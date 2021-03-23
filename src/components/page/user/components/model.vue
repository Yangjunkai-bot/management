<template>
  <el-dialog title="会员详情"
             :show-close='false'
             :close-on-click-modal='false'
             :visible.sync="editVisible"
             top="3vh"
             width="1200px">
    <el-form ref="formRules"
             class="forms"
             :rules="rules"
             :model="form"
             label-width="110px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="box-cardTitle">

            <div slot="header"
                 class="clearfix">
              <h4>基本信息</h4>
            </div>
            <div class="text item contentTile">
              <el-row :gutter="20">
                <el-col :span="6">
                  <el-image style="width: 100px; height: 100px"
                            src="/"
                            fit="cover"></el-image>
                </el-col>
                <el-col :span="18">
                  <el-row class="usercontent"
                          :gutter="20">
                    <el-col :span='12'
                            class="oversflow">

                      <text-over-tooltip refName="testName2"
                                         :content="'会员ID：'+form.useridx"></text-over-tooltip>
                    </el-col>
                    <el-col :span='12'
                            class="oversflow">
                      <text-over-tooltip refName="testName2"
                                         :content="'昵称：'+form.nickname"></text-over-tooltip>
                    </el-col>
                  </el-row>
                  <el-row class="usercontent"
                          :gutter="20">
                    <el-col :span='12'
                            class="oversflow">

                      <text-over-tooltip refName="testName2"
                                         :content="'绑定手机：'+form.mobilePhone"></text-over-tooltip>
                    </el-col>
                    <el-col :span='12'
                            class="oversflow">
                      <text-over-tooltip refName="testName2"
                                         :content="'上级代理：'+form.parentAgentName"></text-over-tooltip>
                    </el-col>
                  </el-row>
                  <el-row class="usercontent">
                    <el-col :span='24'
                            class="oversflow">
                      <text-over-tooltip refName="testName2"
                                         content="会员等级:-"></text-over-tooltip>
                    </el-col>
                  </el-row>
                  <el-row class="usercontent"
                          :gutter="20">
                    <el-tooltip class="item"
                                effect="dark"
                                :content="form.agentParam"
                                placement="top">
                      <el-col :span='12'
                              class="oversflow">
                        <text-over-tooltip refName="testName2"
                                           :content="'邀请码：'+form.agentParam"></text-over-tooltip>
                      </el-col>
                    </el-tooltip>
                    <el-tooltip class="item"
                                effect="dark"
                                :content="form.spreadNum"
                                placement="top">
                      <el-col :span='12'
                              class="oversflow">
                        <text-over-tooltip refName="testName2"
                                           :content="'推广人数：'+form.spreadNum"></text-over-tooltip>
                      </el-col>
                    </el-tooltip>
                  </el-row>
                </el-col>
              </el-row>
            </div>
            <div>

              <el-form-item class="forms"
                            label="个人简介:"
                            prop="description">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-input v-if="isVisiTitle"
                              @blur="inputBlur('isVisiTitle')"
                              v-model="form.description"></el-input>
                    <span v-else>{{form.description}}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button v-if="!isVisiTitle"
                               type="text"
                               @click="handeEdit('isVisiTitle')">编辑</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="性别:">
                <el-radio-group v-model="form.radio">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                  <el-radio :label="3">其他</el-radio>
                </el-radio-group>

              </el-form-item>
              <el-form-item label="生日:"
                            prop="birthday">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-date-picker v-if="isVisiOld"
                                    v-model="form.birthday"
                                    @blur="inputBlur('isVisiOld')"
                                    type="date"
                                    placeholder="请选择"
                                    value-format="timestamp">
                    </el-date-picker>
                    <span v-else>{{form.birthday | formatDate}}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button v-if="!isVisiOld"
                               type="text"
                               @click="handeEdit('isVisiOld')">编辑</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="所在地:"
                            prop="area">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-input v-if="isVisiHome"
                              @blur="inputBlur('isVisiHome')"
                              v-model="form.area"></el-input>
                    <span v-else>{{form.area}}</span>
                  </el-col>
                  <el-col :span="6">
                    <el-button v-if="!isVisiHome"
                               type="text"
                               @click="handeEdit('isVisiHome')">编辑</el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="注册来源:">
                {{form.contentregtype === 0 ? '普通注册' : '一键注册' }}
              </el-form-item>
              <el-form-item label="注册IP/地区:">
                {{form.registerIp}}/{{form.ipArea}}
              </el-form-item>
              <el-form-item label="最后登陆时间:">
                {{form.lastLoginTime}}
              </el-form-item>
              <el-form-item label="最后登陆IP:">
                {{form.lastLoginIp}}
              </el-form-item>

            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <div>
            <el-card class="box-card">
              <div slot="header"
                   class="clearfix">
                <span>基础设置</span>
              </div>
              <div class="text item">
                <el-form-item label="账户状态:">
                  <el-radio-group v-model="form.userStatus">
                    <el-radio :label="1">正常</el-radio>
                    <el-radio :label="2">停权</el-radio>
                    <el-radio :label="3">冻结</el-radio>
                  </el-radio-group>

                </el-form-item>
                <!-- <el-form-item label="权限设置:">
                  <el-checkbox-group v-model="form.list">
                    <el-checkbox label="禁止视频播放"></el-checkbox>
                    <el-checkbox label="禁止电视播放"></el-checkbox>
                    <el-checkbox label="禁止直播观看"></el-checkbox>
                  </el-checkbox-group>

                </el-form-item> -->
                <!-- <el-form-item label="会员层级:"
                              prop="types">
                  <el-select v-model="form.types"
                             placeholder="会员层级"
                             style="width:200px">
                    <el-option key="1"
                               label="男"
                               value="1"></el-option>
                    <el-option key="1"
                               label="女"
                               value="1"></el-option>
                  </el-select>

                </el-form-item>
                <el-form-item label="会员标签:"
                              prop="types">
                  <el-select v-model="value2"
                             multiple
                             collapse-tags
                             style="width:200px"
                             placeholder="请选择">
                    <el-option v-for="item in vipoptions"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>

                </el-form-item> -->
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header"
                   class="clearfix">
                <span>资金信息</span>
              </div>
              <div class="text item">
                <el-form-item label="账户余额:">
                  {{form.gameGold}}
                </el-form-item>
                <el-form-item label="直播钱包:">
                  {{form.rmbGold}}
                </el-form-item>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header"
                   class="clearfix">
                <span>资金信息</span>
              </div>
              <div class="text item">
                <el-form-item label="充值次数:">
                  {{form.chargeTimes}}
                </el-form-item>
                <el-form-item label="充值金额:">
                  {{form.chargeNum}}
                </el-form-item>
              </div>
            </el-card>
          </div>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="editVisible = false">取 消</el-button>
      <el-button type="primary"
                 @click="saveEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'
import TextOverTooltip from './TextOverTooltip.vue';
import { accountDetail, accountUpdate } from '@/api/index';
export default {
  data () {
    return {
      editVisible: false,
      rules: {
        description: [
          { required: true, message: '请输入个人简介', trigger: 'blur' },
        ],
        area: [
          { required: true, message: '请输入所在地', trigger: 'blur' },
        ],

        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' },
        ]
      },
      form: {
        list: []
      },
      vipoptions: [{
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
      isVisiTitle: false,
      isVisiHome: false,
      isVisiOld: false
    }
  },
  components: {
    TextOverTooltip
  },
  filters: {
    formatDate: function (value) {
      if (value) {
        return moment(value).format('YYYY-MM-DD')
      }

    }
  },
  methods: {
    handeEdit (val) {
      this[val] = true
    },
    inputBlur (val) {
      this[val] = false
    },
    handeModel (row) {
      accountDetail(row.id).then((res) => {
        if (res.data.code === 0) {
          this.editVisible = true
          this.form = res.data.body
          this.form.birthday = this.form.birthday * 1000
          this.form.useridx = this.form.useridx.toString()
          this.$nextTick(() => {
            // this.$refs.formRules.clearValidate();
          })
        } else {
          this.$message.warning(res.data.msg)
        }
      })

    },
    // 保存编辑
    saveEdit () {
      this.$refs.formRules.validate((valid) => {
        if (valid) {
          this.editVisible = false;
          const newForm = {
            id: this.form.id,
            description: this.form.description,
            birthday: this.form.birthday / 1000,
            registerArea: this.form.registerArea,
            userStatus: this.form.userStatus,
            memberLevel: this.form.memberLevel,
            gameGold: this.form.gameGold,
          }
          accountUpdate(newForm).then((res) => {
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
  },

}
</script>

<style scoped>
.box-cardTitle {
    height: 720px;
}
.contentTile {
    border-bottom: 1px solid #ebeef5;
    margin: 0 0 20px 0;
}
.box-card {
    margin: 0 0 10px 0;
}
.el-form-item__label {
    font-size: 12px;
}
.forms {
    font-size: 12px;
}
.usercontent {
    margin: 0 0 20px 0;
    font-size: 12px;
}
.oversflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>