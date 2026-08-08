{
    created(){
        this.initData('/bak-mes-task/dyn-database/query', {data:{sqlWhere:[]}});
    },
    mounted(){
      console.log(this.vueContext)
      const _this = this;
      this.addEventListener('CwButton','click',_this.clickTbData)
      this.addEventListener('CwTree','node-click',_this.treeNodeClick)
      this.addEventListener('CwTree','node-lazy-load',_this.loadNode1)
      _this.vueContext['CwDesignTable'].cols = [
          { field: 'BIZ_CODE', title: 'BIZ_CODE', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_NAME', title: 'TABLE_NAME', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_MAPPER', title: 'TABLE_MAPPER', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_TYPE', title: 'TABLE_TYPE', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_IS_VIEW', title: 'TABLE_IS_VIEW', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'JDBC_DRIVER', title: 'JDBC_DRIVER', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'JDBC_PASSWORD', title: 'JDBC_PASSWORD', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        ] 
    },
    clickTbData() {
          let _this = this;
          _this.vueContext['CwDesignDialog'].dialogOpen();
      },
    initData(url,param) {
        let _this= this;
      _this.vueContext['CwTree'].init(url,param)
    },
    treeNodeClick(e,nodeObj,nodes,nodeComp) {
      let _this= this;
      let colsColumns = [
          { field: 'COLUMN_NAME', title: '列名称', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'COLUMN_TYPE', title: '列类型', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'COLUMN_LENGTH', title: '列长度', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'COLUMN_COMMENTS', title: '列描述', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'COLUMN_DEFAULT', title: '默认', minWidth: 180, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'COLUMN_IS_NULL', title: '非空', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        ], colsTable = [
          { field: 'BIZ_CODE', title: 'BIZ_CODE', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_NAME', title: 'TABLE_NAME', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_MAPPER', title: 'TABLE_MAPPER', minWidth: 150, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_TYPE', title: 'TABLE_TYPE', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'TABLE_IS_VIEW', title: 'TABLE_IS_VIEW', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'JDBC_DRIVER', title: 'JDBC_DRIVER', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
          { field: 'JDBC_PASSWORD', title: 'JDBC_PASSWORD', minWidth: 100, align: "left", queryType: 'input', set: true, require: false, query: true, hide: false },
        ];
        _this.vueContext['CwTree'].treeNodeClick(nodes,['/dyn-table/query','/dyn-column/query'],[
            {
                data: {
                    sqlWhere: [
                      {
                      column: 'DB_ID',
                      condition: '=',
                      value: nodes.data.ID
                    }]
                  }
                  }, 
                      {
              data: {
                sqlWhere: [
                  {
                      column: 'TABLE_ID',
                      condition: '=',
                      value: nodes.data.ID
                    }]
              }
            }
                          ],_this.vueContext['CwDesignTable'], colsTable, colsColumns)
    },
    loadNode1(e,node, resolve) {
          this.vueContext['CwTree'].loadNode(node, resolve,['/bak-mes-task/dyn-table/query','/bak-mes-task/dyn-column/query'],[
            {
                data: {
                    sqlWhere: [
                      {
                        column: 'DB_ID',
                        condition: '=',
                        value: node.data.ID
                      }]
                  }
                  }, 
                      {
              data: {
                sqlWhere: [
                  {
                    column: 'TABLE_ID',
                    condition: '=',
                    value: node.data.ID
                  }]
              }
            }
                          ],
            [
                  {
                    label: 'TABLE_NAME',
                        value: 'ID'
               },
                {
                          label: 'COLUMN_NAME',
                        value: 'ID',
                      isLeaf: true
              }
              ]
            )
        
      }
  }