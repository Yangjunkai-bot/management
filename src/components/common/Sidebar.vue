<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu"
             :default-active="onRoutes"
             :collapse="collapse"
             background-color="#2c2e2f"
             text-color="#bfcbd9"
             active-text-color="#20a0ff"
             unique-opened
             router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index"
                      :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs"
                          :index="subItem.index"
                          :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs"
                              :key="i"
                              :index="threeItem.index">{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else
                            :index="subItem.index"
                            :key="subItem.index">{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index"
                        :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';
export default {
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-edit',
          index: 'dashboard',
          title: '系统首页'
        },
        {
          icon: 'el-icon-data-line',
          index: 'operating',
          title: '运营管理',
          subs: [
            {
              index: 'topvideos',
              title: '视频分类'
            },
            {
              index: 'communitylabel',
              title: '社区标签管理'
            },
            {
              index: 'start',
              title: '启动广告'
            },
            {
              index: 'management',
              title: '公告管理'
            },
            {
              index: 'channel',
              title: '渠道管理'
            }
          ]
        },
        {
          icon: 'el-icon-s-custom',
          index: 'backstage',
          title: '后台管理',
          subs: [
            {
              index: 'administrator',
              title: '管理员账号'
            },
            {
              index: 'journal',
              title: '后台操作日志'
            },
          ]
        },
        {
          icon: 'el-icon-user-solid',
          index: 'user',
          title: '用户管理',
          subs: [
            {
              index: 'usermanagement',
              title: '会员管理'
            },
          ]
        },
        {
          icon: 'el-icon-user-solid',
          index: 'financial',
          title: '财务管理',
          subs: [
            {
              index: 'merchants',
              title: '商户管理'
            },
          ]
        },
        {
          icon: 'el-icon-document',
          index: 'activity',
          title: '活动管理',
          subs: [
            {
              index: 'signin',
              title: '签到活动'
            },
          ]
        },
        {
          icon: 'el-icon-s-order',
          index: 'resources',
          title: '资源管理',
          subs: [
            {
              index: 'movie',
              title: '视频管理'
            },
            {
              index: 'television',
              title: '电视管理'
            },
            {
              index: 'shortVideo',
              title: '短视频管理'
            },
            {
              index: 'community',
              title: '社区管理'
            }

          ]
        },
        {
          icon: 'el-icon-tickets',
          index: 'report',
          title: '报表管理',
          subs: [
            {
              index: 'reportoperating',
              title: '运营报表'
            },
            {
              index: 'vedio',
              title: '视频报表'
            }
          ]
        },
        {
          icon: 'el-icon-lx-warn',
          index: '7',
          title: '错误处理',
          subs: [
            {
              index: 'permission',
              title: '权限测试'
            },
            {
              index: '404',
              title: '404页面'
            }
          ]
        }
      ]
    };
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '');
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
