import {Ace} from "ace-builds";
import Completion = Ace.Completion;
import _ from 'lodash';

let keywords = {
  chart: '组件默认属性配置',
  data: '组件数据',
  myChart: '组件实例方法',
  dv: '大屏函数工具',
  'dv.getChartInstance': '获取大屏组件实例',
  // 其他
  'console.log': 'console.log',
};
let completions:Completion[] = [];

for (let key in keywords) {
  completions.push({
    caption: key,
    value: key,
    score: 10000,
    meta: keywords[key] || 'local'
  });
}

Object.keys(_.prototype).forEach(methodLey => {
  completions.push({
    caption: '_.'+ methodLey,
    value: '_.'+ methodLey,
    score: 1000,
    meta: '_.' + methodLey + '()'
  })
})


export default completions;
