import React, { Fragment, useState, useEffect } from 'react';

let timerId = 0;

function AqexButton(props) {
  let className = props.className;
  let onClick = props.onClick;
  let label = props.label;
  let timeout = props.timeout;
  let id = props.id;
  let hideLabelDuringSubmit = props.hideLabelDuringSubmit;
  let setUIMsg = props.setUIMsg;
  const isSubmitting = props.isSubmitting;
  let [isSubmittingInternal, setIsSubmittingInternal] = useState();

  useEffect(() => {
    setIsSubmittingInternal(isSubmitting);

    if(timerId) clearTimeout(timerId);

    if(isSubmitting && timeout) {
      timerId = setTimeout(() => {

        setIsSubmittingInternal(false);
        if(setUIMsg) {
          setUIMsg({ type: 'ui-button-timeout', data: { id: id } });
        }
      }, timeout);
    }
  }, [isSubmitting]);

  return <button type="submit" disabled={isSubmitting && isSubmittingInternal} className={ className || '' } onClick={onClick}>
    { isSubmittingInternal ? 
      <i className="fa fa-refresh fa-spin" style={{ 
        marginRight: isSubmitting && !hideLabelDuringSubmit ? '5px' : '',
        width: isSubmitting ? '' : 0
      }} /> : ''
    }
    { !(hideLabelDuringSubmit && isSubmitting) && 
      <Fragment>
        { label ? label : 'Submit' }
      </Fragment>
    }
  </button>;
}

export default AqexButton;