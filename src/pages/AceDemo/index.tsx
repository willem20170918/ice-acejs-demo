import React from 'react';
import { JsEditor, IEditorProps, IAceEditor } from '@/components/AceEditor';


interface IProps {

}

interface IState{
  code: string;
  saveStatus: boolean;
  changeStatus: boolean;
  errorMsg: string[];
}

export default class AceBox extends React.PureComponent<IProps, IState>{

  public editor: IAceEditor;
  public errorAnnotations: any[]; // 语法错误集合

  constructor(props: IProps) {
    super(props);
    this.state = {
      code: '',
      errorMsg: [],
      saveStatus: false,
      changeStatus: false,
    };
    this.errorAnnotations = [];
  }

  onChange = (code: string) => {
    this.setState({
      code,
      saveStatus: false,
      changeStatus: true,
    });
  };


  /**
   * 获取编辑器配置
   */
  getEditorProps(): IEditorProps {
    return {
      value: this.state.code,
      title: '组件函数编程',
      onChange: (value: string) => {
        this.onChange(value);
      },
      onSaveCode: (code) => {
        // this.saveCode(code);
      },
      onComplete: (editor: IAceEditor) => {
        this.editor = editor;
        // this.setCompletion(editor);
      },
      tools: [

      ],
      aceProps: {
        placeholder: '',
        height: 'calc(100% - 50px)',
      },
    };
  }
  render(){
    return <div style={{height: '100vh', width: '50%', border: '1px solid orange'}}>
      <JsEditor
        {...this.getEditorProps()}
      />
    </div>;
  }
};
