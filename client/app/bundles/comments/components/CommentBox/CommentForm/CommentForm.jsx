// NOTE: https://github.com/react-bootstrap/react-bootstrap/issues/1850 seesm to require string
// refs and not the callback kind.
/* eslint-disable react/no-find-dom-node, react/no-string-refs */
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import Col from 'react-bootstrap/Col';
import FormControl from 'react-bootstrap/FormControl';
import FormLabel from 'react-bootstrap/FormLabel';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import NavItem from 'react-bootstrap/NavItem';
import Alert from 'react-bootstrap/Alert';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { defaultMessages } from 'libs/i18n/default';
import BaseComponent from 'libs/components/BaseComponent';

import css from './CommentForm.module.scss';

const emptyComment = { author: '', text: '' };

function bsStyleFor(propName, error) {
  if (error) {
    const errorData = (error && error.response && error.response.data) || {};
    return propName in errorData ? 'error' : 'success';
  }

  return null;
}

class CommentForm extends BaseComponent {
  static propTypes = {
    isSaving: PropTypes.bool.isRequired,
    actions: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.any])).isRequired,
    error: PropTypes.oneOfType([PropTypes.any]),
    cssTransitionGroupClassNames: PropTypes.oneOfType([PropTypes.func, PropTypes.any]).isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    intl: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      formMode: 0,
      comment: emptyComment,
    };

    _.bindAll(this, ['handleSelect', 'handleChange', 'handleSubmit', 'resetAndFocus']);
  }

  handleSelect(selectedKey) {
    this.setState({ formMode: selectedKey });
  }

  handleChange() {
    let comment;

    switch (+this.state.formMode) {
      case 0:
        comment = {
          author: ReactDOM.findDOMNode(this.refs.horizontalAuthorNode).value,
          text: ReactDOM.findDOMNode(this.refs.horizontalTextNode).value,
        };
        break;
      case 1:
        comment = {
          author: ReactDOM.findDOMNode(this.refs.stackedAuthorNode).value,
          text: ReactDOM.findDOMNode(this.refs.stackedTextNode).value,
        };
        break;
      case 2:
        comment = {
          // This is different because the input is a native HTML element
          // rather than a React element.
          author: ReactDOM.findDOMNode(this.refs.inlineAuthorNode).value,
          text: ReactDOM.findDOMNode(this.refs.inlineTextNode).value,
        };
        break;
      default:
        throw new Error(`Unexpected state.formMode ${this.state.formMode}`);
    }

    this.setState({ comment });
  }

  handleSubmit(e) {
    e.preventDefault();
    const { actions } = this.props;
    actions.submitComment(this.state.comment).then(this.resetAndFocus);
  }

  resetAndFocus() {
    // Don't reset a form that didn't submit, this results in data loss
    if (this.props.error) return;

    const comment = { author: this.state.comment.author, text: '' };
    this.setState({ comment });

    let ref;
    switch (+this.state.formMode) {
      case 0:
        ref = ReactDOM.findDOMNode(this.refs.horizontalTextNode);
        break;
      case 1:
        ref = ReactDOM.findDOMNode(this.refs.stackedTextNode);
        break;
      case 2:
        ref = ReactDOM.findDOMNode(this.refs.inlineTextNode);
        break;
      default:
        throw new Error(`Unexpected state.formMode ${this.state.formMode}`);
    }

    ref.focus();
  }

  formHorizontal() {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <hr />
        <Form horizontal className="commentForm form-horizontal" onSubmit={this.handleSubmit}>
          <FormGroup controlId="formHorizontalName" className={`row ${css.rowHoriz} ${css.formGroup}`}>
            <Col componentClass={Form.Label} sm={2} className={css.labelHoriz}>
              {formatMessage(defaultMessages.inputNameLabel)}
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder={formatMessage(defaultMessages.inputNamePlaceholder)}
                ref="horizontalAuthorNode"
                value={this.state.comment.author}
                onChange={this.handleChange}
                disabled={this.props.isSaving}
                bsStyle={bsStyleFor('author', this.props.error)}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalName" className={`row ${css.rowHoriz} ${css.formGroup}`}>
            <Col componentClass={FormLabel} sm={2} className={css.labelHoriz}>
              {formatMessage(defaultMessages.inputTextLabel)}
            </Col>
            <Col sm={10}>
              <FormControl
                type="textarea"
                label="Text"
                placeholder={formatMessage(defaultMessages.inputTextPlaceholder)}
                ref="horizontalTextNode"
                value={this.state.comment.text}
                onChange={this.handleChange}
                disabled={this.props.isSaving}
                bsStyle={bsStyleFor('text', this.props.error)}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalSubmit" className={`row ${css.rowHoriz} ${css.formGroup}`}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit" className="btn btn-primary" disabled={this.props.isSaving}>
                {this.props.isSaving
                  ? `${formatMessage(defaultMessages.inputSaving)}...`
                  : formatMessage(defaultMessages.inputPost)}
              </Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    );
  }

  formStacked() {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <hr />
        <form className="commentForm form form-stacked" onSubmit={this.handleSubmit}>
          <FormGroup controlId="formBasicName" className={css.formGroup}>
            <FormLabel>{formatMessage(defaultMessages.inputNameLabel)}</FormLabel>
            <FormControl
              type="text"
              placeholder={formatMessage(defaultMessages.inputNamePlaceholder)}
              ref="stackedAuthorNode"
              value={this.state.comment.author}
              onChange={this.handleChange}
              disabled={this.props.isSaving}
              bsStyle={bsStyleFor('author', this.props.error)}
            />
          </FormGroup>
          <FormGroup controlId="formBasicText" className={css.formGroup}>
            <FormLabel>{formatMessage(defaultMessages.inputTextLabel)}</FormLabel>
            <FormControl
              type="textarea"
              label="Text"
              placeholder={formatMessage(defaultMessages.inputTextPlaceholder)}
              ref="stackedTextNode"
              value={this.state.comment.text}
              onChange={this.handleChange}
              disabled={this.props.isSaving}
              bsStyle={bsStyleFor('text', this.props.error)}
            />
          </FormGroup>
          <FormGroup controlId="formBasicSubmit" className={css.formGroup}>
            <Button type="submit" className="btn btn-primary" disabled={this.props.isSaving}>
              {this.props.isSaving
                ? `${formatMessage(defaultMessages.inputSaving)}...`
                : formatMessage(defaultMessages.inputPost)}
            </Button>
          </FormGroup>
        </form>
      </div>
    );
  }

  // Head up! We have some CSS modules going on here with the className props below.
  formInline() {
    const { formatMessage } = this.props.intl;
    return (
      <div>
        <hr />
        <Form className="commentForm d-flex" onSubmit={this.handleSubmit}>
          <FormGroup controlId="formInlineName" className="d-flex">
            <FormLabel>{formatMessage(defaultMessages.inputNameLabel)}</FormLabel>
            <FormControl
              type="text"
              placeholder={formatMessage(defaultMessages.inputNamePlaceholder)}
              ref="inlineAuthorNode"
              value={this.state.comment.author}
              onChange={this.handleChange}
              disabled={this.props.isSaving}
              bsStyle={bsStyleFor('author', this.props.error)}
              className={css.nameFormControl}
            />
          </FormGroup>
          <FormGroup controlId="formInlineName" className="d-flex">
            <FormLabel>{formatMessage(defaultMessages.inputTextLabel)}</FormLabel>
            <FormControl
              type="textarea"
              label="Text"
              placeholder={formatMessage(defaultMessages.inputTextPlaceholder)}
              ref="inlineTextNode"
              value={this.state.comment.text}
              onChange={this.handleChange}
              disabled={this.props.isSaving}
              bsStyle={bsStyleFor('text', this.props.error)}
              className={css.textFormControl}
            />
          </FormGroup>
          <Button type="submit" className="btn btn-primary" disabled={this.props.isSaving}>
            {this.props.isSaving
              ? `${formatMessage(defaultMessages.inputSaving)}...`
              : formatMessage(defaultMessages.inputPost)}
          </Button>
        </Form>
      </div>
    );
  }

  errorWarning() {
    const { error } = this.props;

    // If there is no error, there is nothing to add to the DOM
    if (!error) return null;

    const errorData = error.response && error.response.data;

    const errorElements = _.transform(
      errorData,
      (result, errorText, errorFor) => {
        result.push(
          <li key={errorFor}>
            <b>{_.upperFirst(errorFor)}:</b> {errorText}
          </li>,
        );
      },
      [],
    );

    return (
      <Alert bsStyle="danger" key="commentSubmissionError">
        <strong>Your comment was not saved!</strong>
        <ul>{errorElements}</ul>
      </Alert>
    );
  }

  render() {
    let inputForm;
    switch (+this.state.formMode) {
      case 0:
        inputForm = this.formHorizontal();
        break;
      case 1:
        inputForm = this.formStacked();
        break;
      case 2:
        inputForm = this.formInline();
        break;
      default:
        throw new Error(`Unknown form mode: ${this.state.formMode}.`);
    }

    const { cssTransitionGroupClassNames } = this.props;
    const { formatMessage } = this.props.intl;

    // For animation with ReactCSSTransitionGroup
    //   https://facebook.github.io/react/docs/animation.html
    // The 500 must correspond to the 0.5s in:
    //   client/app/bundles/comments/components/CommentBox/CommentBox.module.scss:6
    return (
      <div className={css.tabsForm}>
        <ReactCSSTransitionGroup
          transitionName={cssTransitionGroupClassNames}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {this.errorWarning()}
        </ReactCSSTransitionGroup>

        <Nav bsStyle="tabs" activeKey={+this.state.formMode} onSelect={this.handleSelect}>
          <Nav.Item as="li">
            <Nav.Link eventKey={0}>{formatMessage(defaultMessages.formHorizontal)}</Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link eventKey={1}>{formatMessage(defaultMessages.formStacked)}</Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link eventKey={2}>{formatMessage(defaultMessages.formInline)}</Nav.Link>
          </Nav.Item>
        </Nav>
        {inputForm}
      </div>
    );
  }
}

export default injectIntl(CommentForm);
