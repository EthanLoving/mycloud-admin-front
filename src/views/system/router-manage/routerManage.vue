<style lang="scss" scoped>
  @import "router-manage";
</style>
<template>
  <div style="background:#eee;padding:7px;height: 90%">
    <Card :bordered="false">
      <Row>
        <Col span="12">
          <Button type="primary" icon="ios-add" @click="handleAddRouter()">添加路由</Button>
        </Col>
      </Row>
      <Row>
        <Table border :columns="routerColumns" :data="routerTableData"></Table>
      </Row>
    </Card>
    <!--添加路由弹窗-->
    <Modal
      v-model="routerAddModal"
      title="新增路由"
      :closable="false"
      :mask-closable="false"
      :loading="true"
      width="1000px"
      @on-ok="submitRouter()"
    >
      <Form :model="formItem" :label-width="120">
        <FormItem label="路由名称:">
          <Input v-model="formItem.routerName" placeholder="请输入路由名称"/>
        </FormItem>
        <FormItem label="路由uri:">
          <Input v-model="formItem.uri" placeholder="请输入路由uri"/>
        </FormItem>
        <FormItem label="路由order:">
          <Input v-model="formItem.order" placeholder="请输入路由order"/>
        </FormItem>
        <FormItem label="filters:">
          <Row
            v-for="(item,index) in formItem.filters"
            :key="index"
            style="border-bottom: 1px solid #f0f0f0;padding: 10px;"
          >
            <Col span="8">
              <Select v-model="item.name">
                <Option value="StripPrefix">StripPrefix</Option>
                <Option value="AddRequestHeader">AddRequestHeader</Option>
                <Option value="AddRequestHeader">AddRequestParameter</Option>
              </Select>
            </Col>
            <Col span="8">
              <Input v-model="item.args._genkey_0" placeholder="参数0"/>
              <Input v-model="item.args._genkey_1" placeholder="参数1"/>
            </Col>
            <Col span="8">
              <Button type="primary" icon="ios-add" @click="handleAddFilters()">新增参数</Button>
              <Button type="error" icon="ios-close" @click="handleDelFilters()">删除参数</Button>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="predicates:">
          <Row
            v-for="(item,index) in formItem.predicates"
            :key="index"
            style="border-bottom: 1px solid #f0f0f0;padding: 10px;"
          >
            <Col span="8">
              <Select v-model="item.name">
                <Option value="Path">Path</Option>
              </Select>
            </Col>
            <Col span="8">
              <Input v-model="item.args.pattern" placeholder="参数"/>
            </Col>
            <Col span="8">
              <Button type="primary" icon="ios-add" @click="handleAddPredicates()">新增参数</Button>
              <Button type="error" icon="ios-close" @click="handleDelPredicates()">删除参数</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { addRouter, routers } from '@/api/index'
  import { getRouters } from '../../../api'

  export default {
    name: 'RouterManage',
    data() {
      return {
        routerColumns: [
          {
            title: '路由名称',
            key: 'routerName'
          },
          {
            title: '服务uri',
            key: 'uri'
          },
          {
            title: '排序',
            key: 'order'
          },
          {
            title: '路由断言集合配置',
            key: 'predicates'
          },
          {
            title: '路由过滤器集合配置',
            key: 'filters'
          },
          {
            title: 'Action',
            key: 'action',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params)
                    }
                  }
                }, '详细信息'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        routerTableData: [],
        routerAddModal: false,
        formItem: {
          routerName: '',
          uri: '',
          order: '',
          select: '',
          filters: [{
            name: '',
            args: {
              _genkey_0: '',
              _genkey_1: ''
            }
          }],
          predicates: [{
            name: 'Path',
            args: {
              pattern: '/test'
            }
          }]
        }
      }
    },
    methods: {
      //路由信息列表
      init() {
        this.getRouterTablePageList()
      },
      getRouterTablePageList() {
        getRouters().then(res => {
          this.routerTableData = res.data
        })
      },
      handleAddRouter() {
        this.routerAddModal = true
      },
      handleAddPredicates() {
        this.formItem.predicates.push(
          {
            name: '',
            args: {
              pattern: '/'
            }
          }
        )
      },
      handleDelPredicates() {
        this.formItem.predicates.splice(this.formItem.predicates.length - 1, 1)
      },
      handleAddFilters() {
        this.formItem.filters.push({
          name: '',
          args: {
            _genkey_0: ''
          }
        })
      },
      handleDelFilters() {
        this.formItem.filters.splice(this.formItem.filters.length - 1, 1)
      },
      submitRouter() {
        addRouter(this.formItem).then(res => {
          this.routerAddModal = false
        })
      },
      show(p) {
        this.routerAddModal = true
        this.formItem.routerName = p.row.routerName
        this.formItem.uri = p.row.uri
        this.formItem.order = p.row.order
        this.formItem.select = p.row.select
        this.formItem.filters = JSON.parse(p.row.select)
        this.formItem.predicates = JSON.parse(p.row.predicates)
      }
    },
    mounted() {
      this.init()
    }
  }
</script>
