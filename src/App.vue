<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import common from "@/utils/common";
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      code: undefined,
      isRunning: false,
      isRouterAlive: true,
      isExpire:false
    };
  },
  created() {
    window.addEventListener(
      "click",
      () => {
        // 为了方便，我们把点击事件的时间直接存到sessionStorage中去，这样方便获取比较
        sessionStorage.setItem("lastClickTime", new Date().getTime());
        this.isExpire = false
      },
      true
    );
    //if (common.enableI18N) this.initI18NScript();
  },
  mounted() {
    this.$nextTick(() => {
      this.timer = setInterval(this.connectWebsocket, 5000);
    });
  },
  methods: {
    initI18NScript() {
      const _this = this;
      _this.code = "";
      const _data = {
        url: "/page-conf/guest/get-script",
        params: { data: { bizType: "I18N", bizCode: "CommonI18N" } },
      };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data)
        .then((data) => {
          _this.code = data.scripts;
          if (!data) return;
          let script = this.resloveScript(data);
          if (!script) {
            this.$message({
              type: "warin",
              message: "国际化脚本初始化失败,没有找到国际化脚本",
            });
            return;
          }
          common.commonI18N = script;
        })
        .catch((err) => {
          console.error(err);
        });

      //循环获取其他的国际化
      if (common.getGlobalParameters("selectLang")) {
        let selectLang = common.getGlobalParameters("selectLang");
        //language
        selectLang.forEach((element) => {
          const _data1 = {
            url: "/page-conf/guest/get-script",
            params: {
              data: {
                bizType: "I18N",
                bizCode: `MetaI18N_${element.language}`,
              },
            },
          };
          this.$store
            .dispatch("fmsCommon/actionTaskPost", _data1)
            .then((data) => {
              if (!data) return;
              let script = this.resloveScript(data);
              if (script) {
                common.metaI18N[element.language] = script;
               }
             
            })
            .catch((err) => {
              console.error(err);
            });
        });
      }
      const _data2 = {
        url: "/page-conf/guest/get-script",
        params: { data: { bizType: "I18N", bizCode: `MetaI18N_all` } },
      };
      this.$store
        .dispatch("fmsCommon/actionTaskPost", _data2)
        .then((data) => {
          if (!data) return;
          let script = this.resloveScript(data);
          if (script) {
            common.metaI18NAll = script;
          }                  
        })
        .catch((err) => {
          console.error(err);
        });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => (this.isRouterAlive = true));
    },
    isLogin() {
      let username = sessionStorage.getItem("userInfo");
      if (username == null || username == "") return;
      let sessKey = sessionStorage.getItem("login_session_key");
      if (sessKey == null || sessKey == "") return;
      let userDto = {
        userName: username,
        sessionKey: sessKey,
      };
      //检验头信息
      const header = getToken();
      if (header == null || header == "") return;
      const _data = { url: "/user/is-login", params: { data: userDto } };
      this.$store
        .dispatch("fmsCommon/actionAuthPost", _data)
        .then((data) => {
          if (data.sessionKey != sessKey) {
            //注销登录
            this.$store.dispatch("user/logout");
            //this.$router.push(`/login`)
            this.$router.push(`/login?redirect=${this.$route.fullPath}`);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    connectWebsocket() {
      //判断用户最近一段时间是否操作过
      var lastClickTime = sessionStorage.getItem("lastClickTime")
      var currentTime = new Date().getTime();
      if(lastClickTime===undefined|| lastClickTime===null) lastClickTime = new Date().getTime();
      if(typeof lastClickTime=== 'string') lastClickTime = parseInt(lastClickTime)
      var expire =  common.getGlobalParameters('defaultLogoutExpireTime')*1000;
      var divideTime = currentTime - lastClickTime
      if(!this.isExpire && expire<divideTime){
        this.isExpire = true
        this.$store.dispatch("user/logout");
        if (this.$route.fullPath.indexOf("redirect=") >= 0) {
          this.$router.push(`${this.$route.fullPath}`);
        } else {
          this.$router.push(`/login?redirect=${this.$route.fullPath}`);
        }
        this.$message({
                  type: "error",
                  message: "Timeout Logout",
                });
      }
      // 建立连接
      if (this.isRunning) return;
      let username = sessionStorage.getItem("userInfo");
      if (username == null || username == "") return;
      let sessKey = sessionStorage.getItem("login_session_key");
      if (sessKey == null || sessKey == "") return;
      let userDto = {
        userName: username,
        sessionKey: sessKey,
      };
      //检验头信息
      const header = getToken();
      if (header == null || header == "") return;
      let websocket;
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
        return;
      } else {
        let protocol = "ws";
        let url = "";
        if (window.location.protocol == "https:") {
          protocol = "wss";
        }
        //获取当前访问的主机名
        let host = window.location.host;
        let port = window.location.port;
        url = `${protocol}://${host}${common.authPath(
          ""
        )}/security/${username}_${sessKey}`;
        //url = `${protocol}://localhost:10001/security/${username}_${sessKey}`;
        // 打开一个websocket
        try {
          websocket = new WebSocket(url);
          websocket.onopen = () => {
            // 发送数据
            this.isRunning = true;
            let timer = setInterval(() => {
              sessKey = sessionStorage.getItem("login_session_key");
              if (
                websocket &&
                websocket != null &&
                !(
                  sessKey == null ||
                  sessKey == "" ||
                  username == null ||
                  username == ""
                )
              ) {
                websocket.send(sessKey);
              } else {
                clearInterval(timer);
              }
            }, 5000);
          };
          // 客户端接收服务端返回的数据
          websocket.onmessage = (evt) => {
            let res = JSON.parse(evt.data);
            //console.log(sessKey,res.data.sessionKey)
            if (res.code == 200) {
              let ssk = res.data.sessionKey || res.data.SessionKey;
              if (ssk !== sessKey) {
                //注销登录
                this.isRunning = false;
                websocket = null;
                console.log("websocket关闭：", evt);
                this.$message({
                  type: "error",
                  message: "你已被强制退出",
                });
                //注销登录
                this.$store.dispatch("user/logout");
                //this.$router.push(`/login`)
                if (this.$route.fullPath.indexOf("redirect=") >= 0) {
                  this.$router.push(`${this.$route.fullPath}`);
                } else {
                  this.$router.push(`/login?redirect=${this.$route.fullPath}`);
                }
              }
            } else if (res.code == 300) {
              console.log("欢迎登陆系统", evt);
            }
          };
          // 发生错误时
          websocket.onerror = (evt) => {
            console.log("websocket错误：", evt);
            websocket = null;
            //注销登录
            this.isRunning = false;
          };
          // 关闭连接
          websocket.onclose = (evt) => {
            this.isRunning = false;
            websocket = null;
            console.log("websocket关闭：", evt);
          };
        } catch (e) {
          console.log("error", e);
        }
      }
    },
  },
};
</script>
