<template>
  <el-drawer
    title="请求内容"
    :direction="direction"
    :visible.sync="drawer"
    size="50%"
    :before-close="handleClose">
    <div style="height: 700px;overflow: auto;padding-left: 30px;font-weight: bold;background: #000;width: 100%">
      <el-button type="primary" style="margin-bottom: 10px;position: absolute;
      right: 0px;margin-top: 10px;margin-right: 10px"
                 @click="exportText()"  icon="el-icon-download"
                 circle title="报文下载"></el-button>
      <pre style="color: #909090;word-wrap: break-word; word-break: break-all;" v-html="content"></pre>
    </div>
  </el-drawer>
</template>

<script>
  export default {
    name: "ContentShow",
    /* props: {
       cols: Array,
       table_mark: String
     },*/
    data() {
      return {
        content: '',
        direction: 'rtl',
        drawer: false,
        contentDown:'',
      }
    },
    methods: {
      exportText() {

        let temp = this.content
          .replaceAll("<span class=\"key\">","")
          .replaceAll("</span>","")
          .replaceAll("<span class=\"string\">","")
          .replaceAll("<span class=\"number\">","")
        const name = "报文内容"
        const element = document.createElement('a')
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent( temp))
        element.setAttribute('download', name)
        element.style.display = 'none'
        element.click()
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
      },
      detail(content) {
        this.drawer = true
        this.contentDown = content
        this.content = this.syntaxHighlight(content)
      },
      checkJson(json) {
        if (typeof json == 'string') {
          try {
            JSON.parse(json);
            return true;
          } catch (e) {
            return false;
          }
        }
      },
      syntaxHighlight(json) {
        if (this.checkJson(json)) {
          json = JSON.parse(json);
        }
        if (typeof json != 'string') {
          json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
          var cls = 'number';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'key';
            } else {
              cls = 'string';
            }
          } else if (/true|false/.test(match)) {
            cls = 'boolean';
          } else if (/null/.test(match)) {
            cls = 'null';
          }
          return '<span class="' + cls + '">' + match + '</span>';
        });
      },
    }
  }
</script>

<style>
  .edit-input {
    padding-right: 100px;
  }

  .cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
  }

  .filter-item {
    margin-left: 3px;
  }

  pre {
    outline: 1px solid #000;
    padding: 5px;
    margin: 5px;
    white-space: pre-wrap;
    white-space: -moz-pre-wrap;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
  }

  .string {
    color: green;
  }

  .number {
    color: darkorange;
  }

  .boolean {
    color: blue;
  }

  .null {
    color: magenta;
  }

  .key {
    color: #92278f;
  }

</style>
