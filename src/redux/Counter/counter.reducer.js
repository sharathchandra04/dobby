import { INCREMENT, DECREMENT } from './counter.types';
const INITIAL_STATE = {
    count: 0,
};
const reducer = (state = INITIAL_STATE, action) => {
    console.log(action)
    switch (action.type) {
        case INCREMENT:
           console.log(action.data)
           return {
             ...state, count: state.count + 1,
           };
        case DECREMENT:
           return {
              ...state, count: state.count - 1,
           };
         default: return state;
    }
};
export default reducer;