import { ALERT_SUCCESS, ALERT_FAILURE } from "../actions/types";
const initialState = false;
export default function (state = initialState, action) {
    switch (action.type) {
        case ALERT_SUCCESS:
            return true;
        case ALERT_FAILURE:
            return false;
        default:
            return state;
    }
}