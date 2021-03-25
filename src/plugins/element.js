import Vue from 'vue'
import { Button } from 'element-ui'

import { Form } from 'element-ui'
import { FormItem } from 'element-ui'
import { Input } from 'element-ui'

// 引入message
import { Message } from 'element-ui'
Vue.prototype.$message = Message;

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)