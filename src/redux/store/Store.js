import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import AuthReducer from '../reducer/AuthReducer';
import {logger} from 'redux-logger';
import RootSaga from '../saga/RootSaga';
import userReducer from '../reducer/userReducer';
let sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware, logger];
// const middleware = [sagaMiddleware];

export default configureStore({
  reducer: {
    AuthReducer: AuthReducer,
    user:userReducer
  },
  middleware,
});

sagaMiddleware.run(RootSaga);
