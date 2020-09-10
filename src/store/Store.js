import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import reducer from "../reducers";
import rootSaga from "../sagas";
import StateLoader from "../stateLoader";

const stateLoader = new StateLoader();
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  process.env.NODE_ENV !== "production" &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;
const enhancer = composeEnhancers(applyMiddleware(sagaMiddleware));
const Store = createStore(reducer, stateLoader.loadState(), enhancer);

Store.subscribe(() => {
  stateLoader.saveState(Store.getState());
});
sagaMiddleware.run(rootSaga);

export default Store;
