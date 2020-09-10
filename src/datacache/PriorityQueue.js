/**
 * A priority Queue build on top of MinHeap algorithms
 * @param {Array} data - Array of keys that a user can store
 * @param {Map} usage - Usage map for storing the number of accesses of a key
 * @param {localforage} store - localforage instance to save pQueue data
 */
export class PriorityQueue {
  constructor(store, key) {
    this.store = store;
    this.usage = new Map();
    this.data = [];
    this.key = key;
    this.initialiseStore(key);
  }

  /**
   * @method
   * Initialise usagemap and search data, if not present in localforage then
   * creates it
   * @param {String} key - store name
   */
  initialiseStore(key) {
    this.store
      .getItem(key + "_searchUsageMap")
      .then(
        function(data) {
          if (data instanceof Map) {
            this.usage = data;
          } else {
            this.store.setItem(key + "_searchUsageMap", new Map());
          }
        }.bind(this)
      )
      .catch(
        function() {
          console.log("catch");
          this.store.setItem(key + "_searchUsageMap", new Map());
        }.bind(this)
      );

    this.store
      .getItem(key + "_searchData")
      .then(
        function(data) {
          if (data instanceof Array) {
            this.data = data;
          } else {
            this.store.setItem(key + "_searchData", []);
          }
        }.bind(this)
      )
      .catch(() => {
        this.store.setItem(key + "_searchData", []);
      });
  }

  /**
   * Swaps two elements of heap
   * @param {Number} idx1
   * @param {Number} idx2
   */
  swap(idx1, idx2) {
    const temp = this.data[idx1];
    this.data[idx1] = this.data[idx2];
    this.data[idx2] = temp;
  }

  /**
   * Sets heap data
   * @param {Array} data
   */
  setData(data) {
    this.data = data;
    this.store.setItem(this.key + "_searchData", this.data);
  }

  /**
   * Fetches parent of the element present at index i
   * @param {Number} i
   */
  getParent(i) {
    return (i - 1) / 2;
  }

  /**
   * Inserts a node at the end of heap then run the heapifyUp algorithm
   * to send the node to its appropriate position
   * @param {String} nodeVal
   */
  addNode(nodeVal) {
    this.data.push(nodeVal);
    this.usage.set(nodeVal, 1);
    this.store.setItem(this.key + "_searchUsageMap", this.usage);
    this.heapifyUp(this.data.length - 1);
    this.store.setItem(this.key + "_searchData", this.data);
  }
  /**
   * Places a node at index 'index' to its right position in the heap,
   * used by insertion algo
   * @param {index} index
   */
  heapifyUp(index) {
    const child = this.data[index];
    while (
      index > 0 &&
      this.usage.get(child) < this.usage.get(this.data[this.getParent(index)])
    ) {
      this.data[index] = this.data[this.getParent(index)];
      index = this.getParent(index);
    }
    this.data[index] = child;
  }

  /**
   * Swaps the root node with last node in heap then run the heapifyDown algorithm
   * to send the node to its appropriate position
   * @method
   */
  removeNode() {
    let root;
    if (!this.data.length) {
      return;
    }
    if (this.data.length === 1) {
      root = this.data.pop();
    } else {
      root = this.data[0];
      this.data[0] = this.data[this.data.length - 1];
      this.data = this.data.slice(0, this.data.length - 1);
    }

    this.usage.delete(root);
    this.heapifyDown(0);
    this.store.setItem(this.key + "_searchData", this.data);
    this.store.setItem(this.key + "_searchUsageMap", this.usage);
    return root;
  }

  /**
   * Increases the priority of a node
   * @param {*} nodeName Node name whose priority needs to be increased
   */
  increaseNodeUsage(nodeName) {
    const usage = this.usage.get(nodeName);
    this.usage.set(nodeName, usage + 1);
    this.store.setItem(this.key + "_searchUsageMap", this.usage);
    this.heapifyDown(this.data.indexOf(nodeName));
    this.store.setItem(this.key + "_searchData", this.data);
  }

  /**
   * Places a node at index 'index' to its right position in the heap,
   * used by deletion algo
   * @param {index} index
   */
  heapifyDown(index) {
    const size = this.data.length;
    let smallest = index;
    while (index < size) {
      const left = 2 * index + 1,
        right = 2 * index + 2;
      if (
        left < size &&
        this.usage.get(this.data[left]) < this.usage.get(this.data[index])
      ) {
        smallest = left;
      }
      if (
        right < size &&
        this.usage.get(this.data[right]) < this.usage.get(this.data[smallest])
      ) {
        smallest = right;
      }
      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else {
        break;
      }
    }
  }
}
