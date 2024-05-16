import {configureStore} from '@reduxjs/toolkit'
import gameReducer from '../Features/gameSlice'
export const store = configureStore({
    reducer: {
        game : gameReducer
    },
});