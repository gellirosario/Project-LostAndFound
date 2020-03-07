import { ALERT_SUCCESS } from "../actions/types";
const initialState = false;
export default function (state = initialState, action) {
    switch (action.type) {
        case ALERT_SUCCESS:
            return true;
        default:
            return state;
    }
}