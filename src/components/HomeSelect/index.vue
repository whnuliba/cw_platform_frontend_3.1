<template>
    <div>
        <el-popover placement="bottom-end" :title="commonI18n('common.changeSys')" :width="650" trigger="click" ref="popover">
            <template #reference>
                <!-- <svg-icon class-name="my-menu-icon" icon-class="table" v-popover:popover @click="handleSelectSystem" /> -->
                <i class="el-icon-s-home" v-popover:popover @click="handleSelectSystem"></i>
            </template>

            <div class="home-sys" style="width: 100%;min-height: 200px;">
                <div class="home-sys-item" v-for="item in configMenu" @click="chemiSys(item)"
                    :style="{color:item.active?'#28C3F5':''}">
                    <div class="home-sys-item-icon" :style="{backgroundColor:item.state}"><svg-icon class-name="my-system-options" icon-class="sys"
                            style="width: 50px;height: 50px;" @click="handleSelectSystem" /></div>
                    <div class="home-sys-item-text"><span>{{commonI18n(item.name)}}</span></div>
                </div>
            </div>
        </el-popover>
    </div>
</template>

<script>
    import { getRoleZeroMenuList } from "@/api/role_menu";

    export default {
        components: {},
        computed: {
            language() {
                return this.$store.getters.language
            }
        },
        data() {
            return {
                dialogSelectSystemVisible: false,
                configMenu: [],
                menulevelOptions: {},

            }
        },
        created() {
            this.initSystem()
        },
        methods: {
            handleExportClose() {
                this.dialogSelectSystemVisible = false
            },
            handleSelectSystem() {
                this.dialogSelectSystemVisible = true
            },
            initSystem() {
                const _data = { url: "/menuGrp/query-all-grp", params: {} };
                this.$store
                    .dispatch("fmsCommon/actionAuthPost", _data)
                    .then((data) => {
                        data.forEach((c) => {
                            this.menulevelOptions[c.groupCode] = c;
                        });
                        getRoleZeroMenuList()
                            .then((res) => {
                                if (res.data.code === 200) {
                                    let { data } = res.data;

                                    let sysName = this.menulevelOptions; //||common['sysCode']()
                                    // Object.assign(sysName, common["sysCode"]());
                                    let newData = data.map((item) => {
                                        let name = {};
                                        for (let key in sysName) {
                                            if (key === item) {
                                                name = {title:sysName[item].groupName,field:sysName[item].groupCode,en_title:sysName[item].udf1}
                                                break
                                            }
                                        }
                                        let active = false;
                                        if (item === localStorage.getItem("current_application_code")) {
                                            active = true;
                                        }
                                        return {
                                            code: item,
                                            name: name,//this.commonI18n(name),
                                            active: active,
                                            state: active ? "#28C3F5" : "#D5F0F8",
                                        };
                                    });
                                    this.configMenu = newData;
                                    // console.log(this.configMenu)
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
            chemiSys(item) {
                // 柔性制造
                //sessionStorage.setItem("current_application_code"
                this.configMenu.forEach((element) => {
                    element.active = false;
                    element.state = "#D5F0F8";
                    if (element.code === item.code) {
                        element.active = true;
                        element.state = "#28C3F5";
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
                this.dialogSelectSystemVisible = false
            },
            handleSetLanguage(lang) {
                this.$i18n.locale = lang
                this.$store.dispatch('app/setLanguage', lang)
                this.$message({
                    message: '选择语言成功',
                    type: 'success'
                })
                const code = localStorage.getItem("current_application_code")
                this.$store.dispatch("permission/sysChange", code)
                //获取按钮权限
                this.$store.dispatch('permission/get_button', code)
            }
        }
    }
</script>
<style lang="less">
    .home-sys-item {
        float: left;
        width: 90px;
        height: 90px;

        margin-left: 25px;
        margin-top: 10px;
        cursor:pointer;

        .home-sys-item-icon {
            width: 70px;
            height: 70px;
            margin-left: 10px;
            border-radius: 20px !important;
            padding: 10px;
        }

        .home-sys-item-text {
            padding-top: 5px;
            text-align: center;
            font-weight: bold;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
            font-size: 12px;
        }
    }
    .home-sys-item:hover{
       .home-sys-item-icon {
           background-color: #28C3F5;
       }
        .home-sys-item-text {
            color: #28C3F5;
        }
    }
.el-icon-s-home{
    font-size: 24px;
    padding-top: 13px;
}
</style>