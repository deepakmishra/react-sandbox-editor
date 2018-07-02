import React from "react";
import ReactDOM from "react-dom";
import processors from './processors'

export class SandboxInterpreter extends React.Component {

  constructor(props) {
    super(props)
    this.iframeContainerRef = null
  }

  buildDependencies = () => {
    return this.props.dependencies.map((dependency) => {
      return `<script src="${dependency}"></script>`
    })
    .join('\n')
  }

  buildStylesheet = () => {
    let stylesheetProcessor = processors.getStylesheetProcessor(this.props.stylesheetMode)
    return (`<style>${stylesheetProcessor(this.props.stylesheet)}</style>`)
  }

  buildScript = () => {
    let scriptProcessor = processors.getScriptProcessor(this.props.scriptMode)
    return (`<script>${scriptProcessor(this.props.script)}</script>`)
  }

  buildTemplate = () => {
    let templateProcessor = processors.getTemplateProcessor(this.props.templateMode)
    return (`<body>${templateProcessor(this.props.template)}</body>`)
  }

  buildContents = () => {
    return (
      `<html>
        ${this.buildDependencies()}
        ${this.buildStylesheet()}
        ${this.buildTemplate()}
        ${this.buildScript()}
       </html>`
    )
  }

  componentDidMount() {
    this.props.onRef(this)
    this.execute()
  }

  componentWillUnmount() {
    this.props.onRef(undefined)
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.script !== this.props.script ||
      prevProps.template !== this.props.template ||
      prevProps.stylesheet !== this.props.stylesheet
    ) {
      this.execute()
    }
  }

  execute() {
    //remove all children
    while (this.iframeContainerRef.hasChildNodes()) {
        this.iframeContainerRef.removeChild(this.iframeContainerRef.lastChild);
    }
    //create new iframe
    let iframe = document.createElement('iframe');
    iframe.height="100%"
    iframe.width="100%"
    iframe.style.border="none"
    //insert it into dom
    this.iframeContainerRef.appendChild(iframe);
    try {
      iframe.contentDocument.open();
      iframe.contentDocument.write(this.buildContents());
      iframe.contentDocument.close();
    }
    catch (e){
      console.error(e.name, e.message)
    }
  }

  render() {
    return (
      <div
        ref={(element) => {this.iframeContainerRef = element}}
        style={{
          height: '100%',
          width: '100%',
          ...this.props.style,
          background: 'white'
        }}>
      </div>
    )
  }
}

SandboxInterpreter.defaultProps = {
  dependencies: [],
  script: '',
  scriptMode: 'js',
  template: '',
  templateMode: 'html',
  stylesheet: '',
  stylesheetMode: 'css',
  onRef: () => {}
}
