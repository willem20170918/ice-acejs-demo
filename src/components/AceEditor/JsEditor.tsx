import common_keywords from './language_tools/common_keywords';
import EditorContainer from './Editor';

// ACE 依赖
import 'ace-builds/src-noconflict/ext-language_tools'; // 语法自动提示
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/snippets/javascript"; // js语法片段
import 'ace-builds/src-noconflict/theme-tomorrow'; // 主题
import 'ace-builds/src-noconflict/ext-searchbox';
import { nanoid } from 'nanoid';

export default class JsEditorBox extends EditorContainer {


  getCompletion(){
    return common_keywords
  }

  initAceProps(){
    return {
      mode: "javascript",
      name: 'jsEditor_' + nanoid(4)
    }
  }
}
