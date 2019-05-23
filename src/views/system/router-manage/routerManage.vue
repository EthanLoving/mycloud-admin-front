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
    </Card>
    <!--添加路由弹窗-->
    <Modal v-model="routerAddModal" title="新增路由" :closable="false" :mask-closable="false" :loading="true"
           width="1000px" @on-ok="submitRouter()">
      <Form :model="formItem" :label-width="120">
        <FormItem label="路由ID:">
          <Input v-model="formItem.id" placeholder="请输入id"></Input>
        </FormItem>
        <FormItem label="路由uri:">
          <Input v-model="formItem.uri" placeholder="请输入路由uri"></Input>
        </FormItem>
        <FormItem label="路由order:">
          <Input v-model="formItem.order" placeholder="请输入路由order"></Input>
        </FormItem>
        <FormItem label="filters:">
          <Row v-for="(item,index) in formItem.filters" :key="index"
               style="border-bottom: 1px solid #f0f0f0;padding: 10px;">
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
            </Col>
          </Row>
        </FormItem>
        <FormItem label="predicates:">
          <Row v-for="(item,index) in formItem.predicates" :key="index"
               style="border-bottom: 1px solid #f0f0f0;padding: 10px;">
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
            </Col>
          </Row>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import { addRouter } from '@/api/index'
  export default {
    name: 'routerManage',
    data() {
      return {
        routerAddModal: false,
        formItem: {
          id: '',
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
              pattern: '/jd'
            }
          }]
        }
      }
    },
    methods: {
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
      handleAddFilters() {
        this.formItem.filters.push({
          name: '',
          args: {
            _genkey_0: ''
          }
        })
      },
      submitRouter(){
        addRouter(this.formItem).then(res =>{
          console.log(res.data)
        })
      }
    }
  }
</script>
