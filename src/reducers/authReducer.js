import {
    SET_CURRENT_USER,
    USER_LOADING,
    LOGOUT__COMPLETED
} from "../actions/types";
const isEmpty = require("is-empty");
const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};
export default function (state = initialState, action) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
            };
        case LOGOUT__COMPLETED: {
            return Object.assign({}, state, {
                isAuthenticated: false,
                user: undefined,
            })
        }
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        default:
            return state;
    }
}