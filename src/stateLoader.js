export default class StateLoader {
  loadState() {
    try {
      const serializedState = localStorage.getItem("appstate");

      if (serializedState === null) {
        return this.initializeState();
      }

      return JSON.parse(serializedState);
    } catch (err) {
      return this.initializeState();
    }
  }

  saveState(state) {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("appstate", serializedState);
    } catch (err) {}
  }
  initializeState() {
    return {
      // state object
    };
  }
}
