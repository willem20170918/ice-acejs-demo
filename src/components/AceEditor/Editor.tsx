import React, { ReactNode } from 'react';
import styles from './index.module.scss';
import {
  ArrowsAltOutlined,
  CodepenOutlined,
  ShrinkOutlined,
  FormatPainterOutlined,
} from '@ant-design/icons';
// import DraggableModalBox, { IDragModalBoxProps } from '@/components/DraggableModalBox';

// ACE 依赖
import AceEditor from 'react-ace';
import 'ace-builds/webpack-resolver';// 必须引入该依赖，解决webWorker问题
import { beautify } from 'ace-builds/src-noconflict/ext-beautify'; // 代码格式化
// TS
import { Ace } from 'ace-builds';
import Completion = Ace.Completion;
import Editor = Ace.Editor;

import { Tooltip } from 'antd';
import { merge } from 'lodash';
import { TooltipProps } from 'antd/lib/tooltip';

import * as classnames from 'classnames';
import EditSession = Ace.EditSession;
import Point = Ace.Point;
import CompleterCallback = Ace.CompleterCallback;

export interface ITool {
  type?: string,
  title?: string,
  tooltipProps?: TooltipProps,
  align?: 'left' | 'right', // 悬浮位置
  hidden?: boolean;
  component?: ReactNode;
  order?: number; // 排序
}

export interface IEditorProps {
  title?: string;
  value?: string;
  mode?: IMode;
  defaultValue?: string;
  emptySpaceTitle?: string; // 占位提示
  aceProps?: any;
  modeProps?: {
    insideTooltip?: string | undefined,
    modalTooltip?: string | undefined
  };

  onChange?(value: string): void;

  onSaveCode?(value: string): void;

  onClose?(): void;

  onComplete?(editor: Editor): void;

  onChangeMode?(mode: IMode): void;

  completion?: Array<Completion>;

  aceMsgTip?(): ReactNode; // 错误提示组件
  // modalProps?: IDragModalBoxProps, //
  tools?: Array<ITool>,
  hiddenModeIcon?: boolean; // 隐藏缩放图标
}

export interface IAceEditor extends Editor {
}

export interface ICompletion extends Completion {
}

export type IMode = 'modal' | 'inside' | 'drawer';

interface IState {
  code: string;
  mode: IMode;
}

/**
 * 控制编辑器的显示模式
 * 将当前模式回调给父级
 */
export default class EditorBox extends React.PureComponent<IEditorProps, IState> {
  static defaultProps = {
    completion: [],
    tools: [],
    title: '编辑器',
    emptySpaceTitle: '请在悬浮模态框中编程',
  };
  public editor: Editor;

  constructor(props: IEditorProps) {
    super(props);
    this.state = {
      code: props.value || props.defaultValue || '',
      mode: props.mode || 'inside',
    };
  }

  /**
   * 代码改变时
   * @param newValue
   */
  onChange = (newValue: string) => {
    this.setState({
      code: newValue,
    }, () => {
      this.props.onChange && this.props.onChange(newValue);
    });
  };


  /**
   * 格式化代码
   */
  formatCode = () => {
    beautify(this.editor.getSession());
  };

  public getCompletion(): Completion[] {
    return [];
  }

  public initAceProps() {
    return {
      mode: 'javascript',
    };
  }

  /**
   * 编辑器加载完成时
   * @param editor
   */
  complete = (editor: any) => {
    this.editor = editor;
    // MD 1、动态加载组件框架对应的语法提示
    const completions: Completion[] = [...this.props.completion || [], ...this.getCompletion()];
    // MD 2、为编辑器注入自动提示语句
    editor.completers.push({
      getCompletions: function(editor: Editor, session: EditSession, pos: Point, prefix: string, callback: CompleterCallback) {
        callback(null, completions);
      },
    });
    this.props.onComplete && this.props.onComplete(editor);
  };

  onChangeMode(mode: IMode) {
    this.setState({
      mode,
    }, () => {
      this.props.onChangeMode && this.props.onChangeMode(mode);
    });
  }

  /**
   * 自定义工具栏
   */
  getTools(): ITool[] {
    return [];
  }

  /**
   * 渲染工具
   */
  renderTools() {
    if (!Array.isArray(this.props.tools)) return;
    return [...this.getTools(), ...this.props.tools].map((tool: ITool, key: number) => {
      const { hidden, align, component, tooltipProps, title, type } = tool;
      return <li
        key={type || key}
        className={classnames({
          [styles.hidden]: !!hidden,
          [styles.flexLeft]: align === 'left',
          [styles.flexRight]: align === 'right',
        })}
      ><Tooltip title={title} {...tooltipProps}>{component}</Tooltip></li>;
    });
  }

  /**
   * 渲染内容组件
   */
  getContent() {
    return <React.Fragment>
      <ul className={styles.editorTool}>
        {/*左侧互动按钮*/}
        <li><Tooltip title={'格式化代码'}><FormatPainterOutlined onClick={this.formatCode}/></Tooltip></li>
        {
          this.renderTools()
        }
      </ul>
      <AceEditor
        {...this.getAceProps()}
        height={'calc(100% - 50px)'}
      />
      {this.props.aceMsgTip && this.props.aceMsgTip()}
    </React.Fragment>;
  }

  // ace组件属性配置
  getAceProps() {
    return merge({
      placeholder: '',
      width: '100%',
      height: 'calc(100% - 24px)',
      mode: 'javascript',
      theme: 'tomorrow',
      onChange: this.onChange,
      name: 'UNIQUE_ID_OF_DIV',
      editorProps: {
        $blockScrolling: true,
      },
      fontSize: 12,
      value: this.state.code,
      showPrintMargin: true,
      showGutter: true,
      highlightActiveLine: true,
      setOptions: {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      },
      onLoad: this.complete.bind(this),
      commands: [{    //命令是键绑定数组。
        name: 'saveFile', //键绑定的名称。
        bindKey: { win: 'Ctrl-S', mac: 'Command-S' }, //用于命令的组合键。
        exec: () => {
          this.props.onSaveCode && this.props.onSaveCode(this.state.code);
        },   //重新绑定命令的名称
      }],
    }, this.initAceProps(), this.props.aceProps || {});
  }

  render(): React.ReactNode {

    return <div className={styles.aceEditorBox}>
      {this.getContent()}
      {
        this.state.mode !== 'inside' && <div>
          <div className={styles.emptySpace}>
            <CodepenOutlined/>
            <div>{this.props.emptySpaceTitle}</div>
          </div>
        </div>
      }
    </div>;
  }
}
