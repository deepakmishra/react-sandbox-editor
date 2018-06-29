import React from "react";
import ReactDOM from "react-dom";

export class SandboxInterpreter extends React.Component {

  constructor(props) {
    super(props)
    this.iframeRef = null
  }

  buildStylesheet = () => {
    return (`<style>${this.props.stylesheet}</style>`)
  }

  buildScript = () => {
    return (`<script>${this.props.script}</script>`)
  }

  buildTemplate = () => {
    return (`<body>${this.props.template}</body>`)
  }

  buildContents = () => {
    return (
      `<html>
        ${this.buildStylesheet()}
        ${this.buildScript()}
        ${this.buildTemplate()}
       </html>`
    )
  }

  componentDidMount() {
    this.execute()
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
    this.iframeRef.contentDocument.open();
    this.iframeRef.contentDocument.write(this.buildContents());
    this.iframeRef.contentDocument.close();
  }

  render() {
    return (
      <div style={{...this.props.style, height: '100%', width: '100%', background: 'white'}}>
        <iframe style={{border: 'none'}} ref={(element) => {this.iframeRef = element}} id="frameID" width="100%" height="100%"></iframe>
      </div>
    )
  }
}
