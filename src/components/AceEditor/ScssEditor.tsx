import EditorContainer from './Editor';
import {nanoid } from 'nanoid'

// ACE 依赖
import 'ace-builds/src-noconflict/ext-language_tools'; // 语法自动提示
import "ace-builds/src-noconflict/mode-scss"; // scss
import "ace-builds/src-noconflict/snippets/scss"; // js语法片段
import 'ace-builds/src-noconflict/theme-github'; // 主题

export default class ScssEditorBox extends EditorContainer {


  getCompletion(){
    return []
  }

  initAceProps(){
    return {
      mode: "scss",
      name: 'scssEditor_' + nanoid(4)
    }
  }
}
