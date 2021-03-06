import './style.scss'
import { connect } from 'react-redux'
import { onPartyNameChanged, onMemberChanged, onCreatePartyClicked, closeModal, closeModalAndRedirect, uploadImage } from '../../redux/actions/partyCreationAction'

import React from 'react';

const PartyCreation = ({ 
    onPartyNameChanged, 
    onMemberChanged,
    onCreatePartyClicked,
    closeModalAndRedirect,
    closeModal,
    uploadImage,
    partyName, 
    maxMembers,
    createSuccessMsg,
    createFailedMsg,
    base64Img
}) => {
    return (
        <div id="party-creation-container">
            <div id="party-creation-form-container">
                <h1>Create Party</h1>
                <form id="party-creation-form" onSubmit={(e) => {e.preventDefault(); onCreatePartyClicked()}}>
                    <label>Party name</label>
                    <input id="party-creation-party-name-input" type="text" onChange={onPartyNameChanged} value={partyName} required></input>
                    <label>Members</label>
                    <input id="party-creation-members-input" type="number" onChange={onMemberChanged} value={maxMembers} required min={1}></input>
                    <label className="file-container">
                        <i className="fa fa-cloud-upload"></i> Upload image
                        <input id="party-creation-upload-file-input" type="file" onChange={(e) => uploadImage(e.target.files[0]) }/>
                    </label>
                    <img id="party-creation-img-preview" src={base64Img}/>
                    <br/>
                    <div className="button-container">
                        <button
                            id="party-creation-button"
                            type="submit" 
                            disabled={!partyName || !maxMembers}>
                                Create Party
                        </button>
                    </div>
                </form>
            </div>
            {(createFailedMsg || createSuccessMsg) && <div className="overlay"></div>}
            {
                createFailedMsg && 
                <div id="party-creation-failed-modal" className="modal">
                    <p id="party-creation-failed-msg">{createFailedMsg}</p>
                    <button id="party-creation-failed-confirm-button" onClick={closeModal}>Confirm</button>
                </div>
            }
            {
                createSuccessMsg && 
                <div id="party-creation-success-modal" className="modal">
                    <p id="party-creation-success-msg">{createSuccessMsg}</p>
                    <button id="party-creation-success-confirm-button" onClick={closeModalAndRedirect}>Confirm</button>
                </div>
            }
        </div>
    )
}

const mapStateToProps = state => ({
    partyName: state.partyCreation.partyName,
    maxMembers: state.partyCreation.maxMembers,
    createSuccessMsg: state.partyCreation.createSuccessMsg,
    createFailedMsg: state.partyCreation.createFailedMsg,
    base64Img: state.partyCreation.base64Img
})
  
const mapDispatchToProps = dispatch => ({
    onPartyNameChanged: (e) => dispatch(onPartyNameChanged(e.target.value)),
    onMemberChanged: (e) => dispatch(onMemberChanged(e.target.value)),
    onCreatePartyClicked: () => dispatch(onCreatePartyClicked()),
    closeModalAndRedirect: () => dispatch(closeModalAndRedirect()),
    closeModal: () => dispatch(closeModal()),
    uploadImage: (file) => dispatch(uploadImage(file))
})
  
export default connect(mapStateToProps, mapDispatchToProps)(PartyCreation)