<template>
  <div class="drawer-container">
    <div>
      <h3 class="drawer-title">{{ $t('settings.title') }}</h3>

      <div class="drawer-item">
        <span>{{ $t('settings.theme') }}</span>
        <theme-picker
          style="float: right;height: 26px;margin: -3px 8px 0 0;"
          @change="themeChange"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.tagsView') }}</span>
        <el-switch
          v-model="tagsView"
          class="drawer-switch"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.fixedHeader') }}</span>
        <el-switch
          v-model="fixedHeader"
          class="drawer-switch"
        />
      </div>

      <div class="drawer-item">
        <span>{{ $t('settings.sidebarLogo') }}</span>
        <el-switch
          v-model="sidebarLogo"
          class="drawer-switch"
        />
      </div>
      <a
        v-if="isShowJob"
        href="https://panjiachen.github.io/vue-element-admin-site/zh/job/"
        target="_blank"
        class="job-link"
      >
        <!-- <el-alert
          title="有问题请联系杭可科技第三电池研究所物流软件组"
          type="success"
          :closable="false"
        /> -->
      </a>

      <div
        v-if="lang === 'zh'"
        class="drawer-item"
      >
        <span>菜单支持拼音搜索</span>
        <el-switch
          v-model="supportPinyinSearch"
          class="drawer-switch"
        />
      </div>
      <div>
        <div
          v-for='(item,i) in configMenu'
          :key="i+'tt'"
          class="drawer-item"
        >
          <span>{{item.name}}</span>
          <el-button
            type="primary"
            class="drawer-switch"
            @click="chemiSys(item)"
            size="mini"
            plain
          >{{item.state}}</el-button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import common from "@/utils/common";
import { getRoleZeroMenuList } from "@/api/role_menu";
import router from "@/router";
import { resetRouter } from "@/router";

export default {
  components: { ThemePicker },
  data() {
    return {
      configMenu: [],
      menulevelOptions: {},
    };
  },
  computed: {
    isShowJob() {
      return this.$store.getters.language === "zh";
    },
    fixedHeader: {
      get() {
        return this.$store.state.settings.fixedHeader;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "fixedHeader",
          value: val,
        });
      },
    },
    tagsView: {
      get() {
        return this.$store.state.settings.tagsView;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "tagsView",
          value: val,
        });
      },
    },
    sidebarLogo: {
      get() {
        return this.$store.state.settings.sidebarLogo;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "sidebarLogo",
          value: val,
        });
      },
    },
    supportPinyinSearch: {
      get() {
        return this.$store.state.settings.supportPinyinSearch;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "supportPinyinSearch",
          value: val,
        });
      },
    },

    lang() {
      return this.$store.getters.language;
    },
  },
  created() {
    const _data = { url: "/menuGrp/query-all-grp", params: {  } };
    this.$store
      .dispatch("fmsCommon/actionAuthPost", _data)
      .then((data) => {
        data.forEach((c) => {
          this.menulevelOptions[c.groupCode]=c.groupName;
        });
        getRoleZeroMenuList()
          .then((res) => {
            if (res.data.code === 200) {
              let { data } = res.data;

              let sysName = this.menulevelOptions; //||common['sysCode']()
             // Object.assign(sysName, common["sysCode"]());
              let newData = data.map((item) => {
                let name = "";
                for (let key in sysName) {
                  if (key === item) {
                    name = sysName[item]
                    break
                  }
                }
                let active = false;
                if (item === localStorage.getItem("current_application_code")) {
                  active = true;
                }
                return {
                  code: item,
                  name: name,
                  active: active,
                  state: active ? "RUNNING" : "JUST IT",
                };
              });
              this.configMenu = newData;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.error(err);
      });
  },
  methods: {
    themeChange(val) {
      this.$store.dispatch("settings/changeSetting", {
        key: "theme",
        value: val,
      });
    },
    // 系统切换点击事件
    chemiSys(item) {
      // 柔性制造
      //sessionStorage.setItem("current_application_code"
      this.configMenu.forEach((element) => {
        element.active = false;
        element.state = "JUST IT";
        if (element.code === item.code) {
          element.state = "RUNNING";
        }
      });
      localStorage.setItem("current_application_code", item.code);
      let menu = this.$store.dispatch("permission/sysChange", item.code);
      menu.then((data) => {
        //resetRouter()
        //router.addRoutes(data)
        //router.push("/")
      });
      //获取按钮权限
      this.$store.dispatch("permission/get_button", item.code);
    },
  },
};
</script>

<style lang="scss" scoped>
.drawer-container {
  padding: 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right;
  }

  .job-link {
    display: block;
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
  }
}
</style>
