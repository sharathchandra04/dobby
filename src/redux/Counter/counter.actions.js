import { INCREMENT, DECREMENT } from './counter.types';

export const increaseCounter = (mydata) => {
    return {
        type: INCREMENT,
        data: mydata
    };
};
export const decreaseCounter = (mydata) => {
    return {
       type: DECREMENT,
       data: mydata
    };
};