import {addTransaction} from "../actions/addTransaction"
import axios from "axios";

let defaultState = {
    list: []
}

export default reducer = (state = defaultState, action) => {
    switch(action.type){
        case "ADD":
            return {
                ...state,
                list: action.item,
            }
        default:
            return state
    }
}

export default reducer;