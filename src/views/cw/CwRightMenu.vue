<template>
    <div class="context-menu-div" :id="rightclickInfo.menuId">
        <div class="context-menu-list" v-for="(item,index) in rightclickInfo.menulists" :key="item.btnName"
            @click.stop="fnHandler(item)">
            <div class="context-menu-item">
                <div class="context-menu-text">{{ item.btnName }}</div>
                <div class="context-menu-shortcut-key" v-if="item.shortcutKey">{{ item.shortcutKey }}</div>
                <div class="context-menu-more" v-if="item.children.length>0">
                    <i class="el-icon-caret-right" />
                </div>
                <div class="context-menu-list-children">
                    <div class="context-menu-list" v-for="it in item.children" :key="it.btnName"
                        @click.stop="fnHandler(it)">
                        <div class="context-menu-item">
                            <div class="context-menu-text">{{ it.btnName }}</div>
                            <!-- <div class="context-menu-shortcut-key" v-if="it.shortcut">{{ it.shortcut }}</div> -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CwRightMenu",
        props: {
            // 接收右键点击的信息
            rightclickInfo: {
                type: Object,
                default: () => {
                    return {
                        menuId: null,
                        position: {
                            // 右键点击的位置
                            x: null,
                            y: null,
                        },
                        menulists: [
                            {
                                fnName: "",  // 点击菜单项的事件名
                                params: {},  // 点击的参数
                                shortcutKey: "", // 快捷键名
                                btnName: "", // 按钮名
                                children: [] // 子菜单
                            },
                        ],
                    };
                },
            },
        },
        watch: {
            // 监听右键点击时点击位置的变化
            "rightclickInfo.position"(val) {
                this.$nextTick(() =>{
                    let x = val.x + 15; // 获取x轴坐标
                    let y = val.y + 15; // 获取y轴坐标
                    let innerWidth = document.querySelector('.main_designer_main').clientWidth + document.querySelector('.main_designer_left').clientWidth; // 获取页面可是区域宽度
                    let innerHeight = document.querySelector('.main_designer_main').clientHeight; // 获取可视区域高度

                    // let menu = document.getElementsByClassName("context-menu-div")[this.classIndex];
                    let menu = document.getElementById(this.rightclickInfo.menuId)
                    menu.style.display = "block";
                    let menuHeight = menu.clientHeight; // 菜单容器高
                    let menuWidth = menu.clientWidth; // 菜单容器宽
                    // 菜单的位置计算 不超过可视区域
                    menu.style.top = (y + menuHeight > innerHeight ? innerHeight - menuHeight : y) + "px";
                    menu.style.left = (x + menuWidth > innerWidth ? innerWidth - menuWidth : x) + "px";
                    
                    // 左键关闭菜单
                    document.addEventListener("mousedown", this.hide, false);
                })
            },
        },
        methods: {
            hide(e) {
                // 使点击节点时menu不关闭
                // let menu = document.getElementsByClassName("context-menu-div")[this.classIndex];
                let menu = document.getElementById(this.rightclickInfo.menuId)
                if(menu)
                    if ((e.button === 0 || e.button === 2) && !(menu.contains(e.target))) {
                        // 0是左键、1是滚轮按钮或中间按钮（若有）、2鼠标右键
                        menu.style.display = "none"; // 菜单关闭
                        document.removeEventListener("mouseup", this.hide);
                    }
            },
            fnHandler(item) {
                if (item.children.length == 0) {
                // let menu = document.getElementsByClassName("context-menu-div")[this.classIndex];
                let menu = document.getElementById(this.rightclickInfo.menuId)
                    menu.style.display = "none"; // 菜单关闭
                }
                this.$emit(item.fnName, item.params);
            },
        }


    };
</script>

<style lang='less' scoped>
    .context-menu-div {
        display: none;
        position: absolute;
        border-radius: 4px;
        border: 1px solid #e6e5e5;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    }

    .context-menu-list {
        position: relative;
        min-width: 150px;
        max-width: 190px;
        font-size: 12px;
        line-height: 1;
        color: #333;
        user-select: none;
        padding: 5px 0;
        background: #fff;
        z-index: 3000;
    }

    .context-menu-item {
        display: flex;
        position: relative;
        align-items: center;
        -webkit-box-align: center;
        padding: 8px 10px;
        cursor: pointer;
        height: 32px;
        box-sizing: border-box;

        &:hover {
            background-color: #f6f6f6;

            &>.context-menu-list-children {
                display: block;
            }
        }
    }

    .context-menu-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .context-menu-shortcut-key {
        margin-left: auto;
        color: #999;
        transform: scale(0.85);
    }

    .context-menu-more {
        margin-left: auto;
        color: #bbb;
        transform: scale(0.6, 0.8);
    }

    .context-menu-list-children {
        display: none;
        position: absolute;
        top: 0;
        right: calc(-100% - 10px);
        padding-left: 10px;

        &>.context-menu-list {
            box-shadow: 0 4px 10px #0001;
        }
    }
</style>