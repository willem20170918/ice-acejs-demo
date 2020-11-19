import React from 'react'; // 主题
import EditorContainer, {ITool} from './Editor';
import {IssuesCloseOutlined} from '@ant-design/icons'

// ACE 依赖
import 'ace-builds/src-noconflict/ext-language_tools'; // 语法自动提示
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/snippets/json"; // js语法片段
import 'ace-builds/src-noconflict/theme-tomorrow';
import { nanoid } from 'nanoid';

export default class JsonEditorBox extends EditorContainer {


  getCompletion(){
    return []
  }

  /**
   * 检查代码语法
   * @param code
   */
  checkCode(code: string) {
    return new Promise(((resolve, reject) => {
      const annotations = this.editor.getSession().getAnnotations();
      const errorAnnotations = annotations.filter(item => item.type === 'error');
      if (errorAnnotations.length > 0) {
        reject(errorAnnotations);
      } else {
        resolve();
      }
    }));
  }

  async transformToJson(){
    try{
      let jsonCode = (new Function('', 'return JSON.stringify(' + this.state.code + ')'))();
      this.setState({
        code: jsonCode,
      }, () => {
        this.formatCode()
        this.props.onChange && this.props.onChange(jsonCode);
      });
    }catch (e) {

    }
  }

  /**
   * 自定义工具栏
   */
  getTools() : ITool[]{
    if(this.props.aceProps && this.props.aceProps.readOnly === true){
      return [];
    }
    return [
      {
        title: '将数据自动纠正为JSON格式',
        component: <IssuesCloseOutlined onClick={() => this.transformToJson()}/>,
      }
    ]
  }

  initAceProps(){
    return {
      mode: "json",
      name: 'jsonEditor_' + nanoid(4)
    }
  }
}
