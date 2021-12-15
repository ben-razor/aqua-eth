import React, {useState, useEffect, createRef, Fragment} from 'react';
import Modal from 'react-modal';
import AqexButton from "./AqexButton";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px 8px 0 0',
      padding: 0
    },
    overlay: {zIndex: 999}
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function AqexModal(props) {
    const modalState = props.modalState;
    const setModalState = props.setModalState;
    const handleAccept = props.handleAccept;
 
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
    }
 
    function closeModal() {
      setModalState({ ...modalState, open: false });
    }

    return (
      <Modal
        isOpen={modalState.open}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Aqua Explore Modal"
      >
        <div className="aqex-modal-title">
          <h2>{modalState.title}</h2>
          <div className="aqex-modal-close">
            <AqexButton label={<i className="fas fa-times-circle" />} className="playground-button playground-icon-button" 
                        onClick={closeModal} />
          </div>
        </div>
        <div className="aqex-modal-panel">
          <div className="aqex-modal-content>">
            {modalState.content}
          </div>

          {!modalState.hideButtons &&
            <div className="aqex-modal-buttons">
              { modalState.closeBtnText &&
                <button className="aqex-modal-button playground-button" onClick={closeModal}>{modalState.closeBtnText || 'Close'}</button>
              }
              { modalState.acceptBtnText &&
                <button className="aqex-modal-button playground-button" onClick={handleAccept}>{modalState.acceptBtnText}</button>
              }
            </div>
          }

        </div>
      </Modal>
    );
}

export default AqexModal;