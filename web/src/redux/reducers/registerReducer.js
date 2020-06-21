import { EMAIL_CHANGE, PASSWORD_CHANGE, CONFIRM_PASSWORD_CHANGE, TERM_CHECK, PROMOTION_CHECK, REGISTER_CLICK } from '../actions/registerAction'
  
export default (state = { 
    email: "",
    password: "",
    confirmPassword: "",
    termCheck: false,
    promotionCheck: false
}, action) => {
    switch (action.type) {
        case EMAIL_CHANGE:
            return {
                ...state,
                email: action.payload
            }
        case PASSWORD_CHANGE:
            return {
                ...state,
                password: action.payload
            }
        case CONFIRM_PASSWORD_CHANGE:
            return {
                ...state,
                confirmPassword: action.payload
            }
        case TERM_CHECK:
            return {
                ...state,
                termCheck: action.payload
            }
        case PROMOTION_CHECK:
            return {
                ...state,
                promotionCheck: action.payload
            }
        case REGISTER_CLICK:
            return {
                ...state
            }
        default:
            return state
    }
}