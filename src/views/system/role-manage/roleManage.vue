<style lang="scss">
  @import "role-manage";
</style>
<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row class="operation">
            <Button @click="addRole" type="primary" icon="md-add">添加角色</Button>
            <Button @click="delAll" icon="md-trash">批量删除</Button>
            <Button @click="init" icon="md-refresh">刷新</Button>
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom"
                   @on-sort-change="changeSort" @on-selection-change="changeSelect"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="pageNumber" :total="total" :page-size="pageSize" @on-change="changePage"
                  @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total
                  show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <!-- 编辑 -->
    <Modal :title="modalTitle" v-model="roleModalVisible" :mask-closable='false' :width="500">
      <Form ref="roleForm" :model="roleForm" :label-width="80" :rules="roleFormValidate">
        <FormItem label="角色名称" prop="name">
          <Input v-model="roleForm.name" placeholder="请输入角色名称"/>
        </FormItem>
        <FormItem label="角色代码" prop="name">
          <Input v-model="roleForm.code" placeholder="按照Spring Security约定建议以‘ROLE_’开头"/>
        </FormItem>
        <FormItem label="备注" prop="description">
          <Input v-model="roleForm.remark"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelRole">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitRole">提交</Button>
      </div>
    </Modal>
    <!-- 菜单权限 -->
    <Modal :title="modalTitle" v-model="permModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}"
           class="permModal">
      <Tree ref="tree" :data="permData" @on-check-change="checkTree" @on-select-change="selectTree" show-checkbox
            :check-strictly="checkStrictly"
            multiple></Tree>
      <Spin size="large" v-if="treeLoading"></Spin>
      <div slot="footer">
        <Button type="text" @click="cancelPermEdit">取消</Button>
        <Button @click="selectTreeAll">全选/反选</Button>
        <Button type="primary" :loading="submitPermLoading" @click="submitPermEdit">提交</Button>
      </div>
    </Modal>
    <!-- 数据权限 -->
    <Modal :title="modalTitle" v-model="depModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}"
           class="depModal">
      <Form :label-width="65">
        <FormItem label="数据范围">
          <Select v-model="dataType">
            <Option :value="0">全部数据权限</Option>
            <Option :value="1">自定义数据权限</Option>
          </Select>
        </FormItem>
      </Form>
      <Alert show-icon>
        默认可查看全部数据，自定义数据范围请点击选择下方数据
      </Alert>
      <div v-if="dataType!=0" style="margin-top:15px">
        <Tree ref="depTree" :data="depData" :load-data="loadData" @on-toggle-expand="expandCheckDep" multiple
              style="margin-top:15px"></Tree>
        <Spin size="large" v-if="depTreeLoading"></Spin>
      </div>
      <div slot="footer">
        <Button type="text" @click="depModalVisible=false">取消</Button>
        <Button type="primary" :loading="submitDepLoading" @click="submitDepEdit">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    getRoleList,
    getAllPermissionList,
    addRole,
    editRole,
    deleteRole,
    setDefaultRole,
    editRolePerm,
    initDepartment,
    loadDepartment,
    editRoleDep
  } from '@/api/system/role-manage'
  import circleLoading from '../../../my-components/circle-loading.vue'

  export default {
    name: 'role-manage',
    components: {
      circleLoading
    },
    data() {
      return {
        loading: true,
        treeLoading: true,
        checkStrictly: true,
        depTreeLoading: true,
        operationLoading: false,
        submitPermLoading: false,
        submitDepLoading: false,
        searchKey: '',
        sortColumn: 'createTime',
        sortType: 'desc',
        modalType: 0,
        roleModalVisible: false,
        permModalVisible: false,
        depModalVisible: false,
        modalTitle: '',
        roleForm: {
          name: '',
          code: '',
          remark: ''
        },
        roleFormValidate: {
          name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
        },
        submitLoading: false,
        selectList: [],
        selectCount: 0,
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            type: 'index',
            width: 60,
            align: 'center'
          },
          {
            title: '角色名称',
            key: 'name',
            width: 150,
            align: 'center',
            sortable: true
          },
          {
            title: '备注',
            key: 'remark',
            minWidth: 190,
            align: 'center',
            sortable: true
          },
          {
            title: '创建时间',
            key: 'createTime',
            width: 160,
            sortable: true,
            align: 'center',
            sortType: 'desc'
          },
          {
            title: '更新时间',
            key: 'updateTime',
            width: 160,
            align: 'center',
            sortable: true
          },
          {
            title: '是否设置为注册用户默认角色',
            key: 'def',
            align: 'center',
            width: 180,
            render: (h, params) => {
              if (params.row.def == 1) {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'success',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.cancelDefault(params.row)
                        }
                      }
                    },
                    '取消默认'
                  )
                ])
              } else {
                return h('div', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'info',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.setDefault(params.row)
                        }
                      }
                    },
                    '设为默认'
                  )
                ])
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 300,
            render: (h, params) => {
              return h('div', [
                h(
                  'Button',
                  {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editPerm(params.row)
                      }
                    }
                  },
                  '菜单权限'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editDep(params.row)
                      }
                    }
                  },
                  '数据权限'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      type: 'error',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                  },
                  '删除'
                )
              ])
            }
          }
        ],
        data: [],
        pageNumber: 1,
        pageSize: 10,
        total: 0,
        permData: [],
        editRolePermId: '',
        selectAllFlag: false,
        depData: [],
        dataType: 0,
        editDepartments: []
      }
    },
    methods: {
      init() {
        this.getRoleList()
        // 获取所有菜单权限树
        this.getPermList()
      },
      changePage(v) {
        this.pageNumber = v
        this.getRoleList()
        this.clearSelectAll()
      },
      changePageSize(v) {
        this.pageSize = v
        this.getRoleList()
      },
      changeSort(e) {
        this.sortColumn = e.key
        this.sortType = e.order
        if (e.order === 'normal') {
          this.sortType = ''
        }
        this.getRoleList()
      },
      getRoleList() {
        this.loading = true
        let params = {
          current: this.pageNumber,
          size: this.pageSize,
          sort: this.sortColumn,
          order: this.sort
        }
        getRoleList(params).then(res => {
          this.loading = false
          if (res.success === true) {
            this.data = res.data.records
            this.total = res.data.total
          }
        })
      },
      getPermList() {
        this.treeLoading = true
        getAllPermissionList().then(res => {
          this.treeLoading = false
          if (res.success === true) {
            //this.deleteDisableNode(res.data);
            this.permData = res.data
          }
        })
      },
      //选择菜单节点
      selectTree(v, n) {
        if (n.checked === false) {
          n.checked = true
        } else {
          n.selected = false
          n.checked = false
        }
      },
      //选中菜单节点
      checkTree(v, n) {
        if (n.selected === false) {
          n.selected = true
        } else {
          n.checked = false
          n.selected = false
        }
      },
      // 递归标记禁用节点
      deleteDisableNode(permData) {
        let that = this
        permData.forEach(function(e) {
          if (e.enabled === 1) {
            e.title = '[已禁用] ' + e.name
            e.disabled = true
          }
          if (e.children && e.children.length > 0) {
            that.deleteDisableNode(e.children)
          }
        })
      },
      cancelRole() {
        this.roleModalVisible = false
      },
      submitRole() {
        this.$refs.roleForm.validate(valid => {
          if (valid) {
            if (this.modalType === 0) {
              // 添加
              this.submitLoading = true
              addRole(this.roleForm).then(res => {
                this.submitLoading = false
                if (res.success === true) {
                  this.$Message.success('操作成功')
                  this.getRoleList()
                  this.roleModalVisible = false
                }
              })
            } else {
              this.submitLoading = true
              editRole(this.roleForm).then(res => {
                this.submitLoading = false
                if (res.success === true) {
                  this.$Message.success('操作成功')
                  this.getRoleList()
                  this.roleModalVisible = false
                }
              })
            }
          }
        })
      },
      addRole() {
        this.modalType = 0
        this.modalTitle = '添加角色'
        this.$refs.roleForm.resetFields()
        delete this.roleForm.id
        this.roleModalVisible = true
      },
      edit(v) {
        this.modalType = 1
        this.modalTitle = '编辑角色'
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = ''
          }
        }
        let str = JSON.stringify(v)
        let roleInfo = JSON.parse(str)
        this.roleForm.id = roleInfo.id
        this.roleForm.code = roleInfo.code
        this.roleForm.name = roleInfo.name
        this.roleForm.remark = roleInfo.remark
        this.roleModalVisible = true
      },
      remove(v) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除角色 ' + v.name + ' ?',
          onOk: () => {
            this.operationLoading = true
            deleteRole(v.id).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('删除成功')
                this.getRoleList()
              }
            })
          }
        })
      },
      setDefault(v) {
        this.$Modal.confirm({
          title: '确认设置',
          content: '您确认要设置所选的 ' + v.name + ' 为注册用户默认角色?',
          onOk: () => {
            let params = {
              id: v.id,
              def: 1
            }
            this.operationLoading = true
            setDefaultRole(params).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getRoleList()
              }
            })
          }
        })
      },
      cancelDefault(v) {
        this.$Modal.confirm({
          title: '确认取消',
          content: '您确认要取消所选的 ' + v.name + ' 角色为默认?',
          onOk: () => {
            let params = {
              id: v.id,
              def: 0
            }
            this.operationLoading = true
            setDefaultRole(params).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('操作成功')
                this.getRoleList()
              }
            })
          }
        })
      },
      clearSelectAll() {
        this.$refs.table.selectAll(false)
      },
      changeSelect(e) {
        this.selectList = e
        this.selectCount = e.length
      },
      delAll() {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要删除的数据')
          return
        }
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除所选的 ' + this.selectCount + ' 条数据?',
          onOk: () => {
            let ids = ''
            this.selectList.forEach(function(e) {
              ids += e.id + ','
            })
            ids = ids.substring(0, ids.length - 1)
            this.operationLoading = true
            deleteRole(ids).then(res => {
              this.operationLoading = false
              if (res.success === true) {
                this.$Message.success('删除成功')
                this.clearSelectAll()
                this.getRoleList()
              }
            })
          }
        })
      },
      editPerm(v) {
        this.editRolePermId = v.id
        this.modalTitle = '分配 ' + v.name + ' 的菜单权限(点击选择)'
        // 匹配勾选
        if (v.pids === undefined) {
          v.pids = 'xxx'
        }
        let rolePerms = v.pids.split(',')
        this.checkPermTree(this.permData, rolePerms)
        // 递归判断子节点

        this.permModalVisible = true
      },
      // 递归判断子节点
      checkPermTree(permData, rolePerms) {
        let that = this
        permData.forEach(function(p) {
          if (that.hasPerm(p, rolePerms)) {
            p.selected = true
            p.checked = true
          } else {
            p.checked = false
            p.selected = false
          }
          if (p.children && p.children.length > 0) {
            that.checkPermTree(p.children, rolePerms)
          }
        })
      },
      // 判断角色拥有的权限节点勾选
      hasPerm(p, rolePerms) {
        let flag = false
        for (let i = 0; i < rolePerms.length; i++) {
          if (p.id === rolePerms[i]) {
            flag = true
            break
          }
        }
        if (flag) {
          return true
        }
        return false
      },
      // 全选反选
      selectTreeAll() {
        this.selectAllFlag = !this.selectAllFlag
        let select = this.selectAllFlag
        this.selectedTreeAll(this.permData, select)
      },
      // 递归全选节点
      selectedTreeAll(permData, select) {
        let that = this
        permData.forEach(function(e) {
          e.selected = select
          e.checked = select
          if (e.children && e.children.length > 0) {
            that.selectedTreeAll(e.children, select)
          }
        })
      },
      submitPermEdit() {
        this.submitPermLoading = true
        let permIds = ''
        let selectedNodes = this.$refs.tree.getCheckedAndIndeterminateNodes()
        selectedNodes.forEach(function(e) {
          permIds += e.id + ','
        })
        permIds = permIds.substring(0, permIds.length - 1)
        editRolePerm({
          id: this.editRolePermId,
          pids: permIds
        }).then(res => {
          this.submitPermLoading = false
          if (res.success === true) {
            this.$Message.success('操作成功')
            this.getRoleList()
            this.permModalVisible = false
          }
        })
      },
      cancelPermEdit() {
        this.permModalVisible = false
      },
      loadData(item, callback) {
        let that = this
        loadDepartment(item.id).then(res => {
          if (this.editDepartments === undefined) {
            this.editDepartments = 'xxx'
          }
          let roleDeptIds = this.editDepartments.split(',')
          if (res.success === true) {
            res.data.forEach(function(e) {
              e.title = e.deptName
              e.expand = false
              e.selected = true
              if (that.hasDepPerm(e, roleDeptIds)) {
                e.selected = true
              } else {
                e.selected = false
              }
              if (e.isParent) {
                e.loading = false
                e.children = []
              }
            })
            callback(res.data)
          }
        })
      },
      editDep(v) {
        this.dataType = 0
        this.editRolePermId = v.id
        this.modalTitle = '分配 ' + v.name + ' 的数据权限'
        if (v.dataType) {
          this.dataType = v.dataType
        }
        // 匹配勾选
        let roleDepIds = v.depts
        this.editDepartments = roleDepIds
        this.depTreeLoading = true
        initDepartment().then(res => {
          this.depTreeLoading = false
          if (res.success === true) {
            res.data.forEach(function(e) {
              e.selected = false
              if (e.parentId === '0') {
                e.loading = false
                e.title = e.deptName
                e.children = []
              }
            })
            this.depData = res.data
            // 判断子节点
            // if (roleDepIds !== undefined) {
            //   this.checkDepTree(this.depData, roleDepIds.split(','))
            // }
            this.depModalVisible = true
          }
        })
      },

      expandCheckDep(v) {
        // 判断展开子节点
        this.checkDepTree(v.children, this.editDepartments)
      },
      // 判断子节点
      checkDepTree(depData, roleDepIds) {
        let that = this
        depData.forEach(function(p) {
          if (that.hasDepPerm(p, roleDepIds)) {
            p.selected = true
          } else {
            p.selected = false
          }
        })
      },
      // 判断角色拥有的权限节点勾选
      hasDepPerm(p, roleDepIds) {
        let flag = false
        for (let i = 0; i < roleDepIds.length; i++) {
          if (p.id === roleDepIds[i]) {
            flag = true
            break
          }
        }
        if (flag) {
          return true
        }
        return false
      },
      submitDepEdit() {
        let depIds = ''
        if (this.dataType != 0) {
          let selectedNodes = this.$refs.depTree.getSelectedNodes()
          if (selectedNodes.length < 1) {
            this.$Message.error('请至少选择一条数据')
            return
          }
          selectedNodes.forEach(function(e) {
            depIds += e.id + ','
          })
          depIds = depIds.substring(0, depIds.length - 1)
        }
        this.submitDepLoading = true
        editRoleDep({
          id: this.editRolePermId,
          dataType: this.dataType,
          depts: depIds
        }).then(res => {
          this.submitDepLoading = false
          if (res.success === true) {
            this.$Message.success('操作成功')
            this.getRoleList()
            this.depModalVisible = false
          }
        })
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
