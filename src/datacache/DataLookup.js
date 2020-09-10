/**
 * A lookup utitlity which will help to cache data in brower's storage(IndexDB, WbSQL,localstorage)
 * Options:
 * - It makes use of localforage to cache data. Every instance of this class creates a new instance of localforage
 * - Uses a priority queue to sort the data bases on how frequently it is accessed
 * - Makes use of MinHeap for implementation, so it is relatively fast in all operations
 * - Developers can send three configurations options
 *    {String} key - name for your localforage store
 *    {Number} limit - Max no. of keys to be cached
 *    {Boolean} expiry -  expiry for each key, default value is infinity
 *
 * author : Akshay Sehgal
 * date : 06/10/2019
 */

import localforage from "localforage";
import { PriorityQueue } from "./PriorityQueue";
/**
 * Other Instance variables used
 *
 */
class Lookup {
  constructor(key, limit, expiry) {
    this.key = key;
    this.limit = limit ? limit : 10000;
    this.store = localforage.createInstance(key);

    /** Instanitate priority queue */
    this.pQueue = new PriorityQueue(this.store, key);
    this.pQueue.setData([]);

    /** Set instance variables */
    this.expiry = expiry >>> 0;
    this.freeSpaceLookupLimit = 20;
    this.freeSpaceEncounters = 0;
    this.size = 0;

    this.initialisePQueue();
  }

  /**
   * @method
   * Initialises the priority queue based on the
   * value fetched on local forage
   */
  initialisePQueue() {
    this.store
      .getItem(
        this.key + "_searchPQueue",
        function(pQueueArr) {
          if (pQueueArr && pQueueArr instanceof Array) {
            this.pQueue.setData(pQueueArr);
          } else {
            this.store.setItem(this.key + "_searchPQueue", []);
          }
        }.bind(this)
      )
      .catch(
        function() {
          this.store.setItem(this.key + "_searchPQueue", []);
        }.bind(this)
      );
    this.store
      .getItem(
        this.key + "_fsEnc",
        function(fsEn) {
          if (fsEn) {
            this.freeSpaceEncounters = fsEn;
          } else {
            this.store.setItem(this.key + "_fsEnc", 0);
          }
        }.bind(this)
      )
      .catch(
        function() {
          this.store.setItem(this.key + "_fsEnc", 0);
        }.bind(this)
      );
  }
  /**
   * @method
   * Frees up space in localforage store if the limit is reached
   */
  freeSpace() {
    if (++this.freeSpaceEncounters === this.freeSpaceLookupLimit) {
      this.store.clear();
      this.pQueue = new PriorityQueue();
      this.freeSpaceEncounters = 0;
      this.store.setItem(this.key + "_fsEnc", 0);
    } else {
      const size = Math.min(this.size - 1, 10);
      for (let i = 0; i < size; i++) {
        const deletedNode = this.pQueue.removeNode();
        this.delete(deletedNode);
      }
    }
  }
  /**
   * @method
   * Fetched the diffefence between passed date and current date in minutes
   * @param {Date} date
   * @returns {Number}
   */
  dateDiffInMin(date) {
    return Math.round((new Date() - date) / (1000 * 60));
  }

  /**
   * @method
   * A utility used by 'set' method to check if the data is already
   * present and update the same accordingly based on the expiry
   *  of that data
   * @param {Object} data - data already set against a given key
   * @param {String}  key - key to be stored
   * @param {String} value - new data to set
   */
  setData(data, key, value) {
    if (data) {
      this.pQueue.increaseNodeUsage(key);
      if (this.expiry) {
        if (this.dateDiffInMin(data.expiry) > this.expiry) {
          this.store.setItem(key, { value, expiry: new Date() });
        } else {
          this.store.setItem(key, { value, expiry: data.expiry });
        }
      } else {
        this.store.setItem(key, value);
      }
    } else {
      this.size++;
      /** If size limit is reached then first free up the space */
      if (this.size > this.limit) {
        this.freeSpace();
      }
      /** Update the pQueue as well */
      this.pQueue.addNode(key);
      if (this.expiry) {
        this.store.setItem(key, { value, expiry: new Date() });
      } else {
        this.store.setItem(key, value);
      }
    }
  }

  /**
   * @method
   * Used to set a key-val pair in local forage. Uses setData to check for duplicates
   * @param {String}  key - key to be stored
   * @param {String} value - data to set
   */
  set(key, value) {
    this.store
      .getItem(key)
      .then(
        function(data) {
          this.setData(data, key, value);
        }.bind(this)
      )
      .catch(() => {
        // data not set
      });
  }

  /**
   * @method
   * Used to delete a key-val pair in local forage
   * @param {String}  key - key to be deleted
   */
  delete(key) {
    this.store.removeItem(key);
  }

  /**
   * @method
   * Used to get a key-val pair in local forage.
   * @param {String}  key - key to be fetched
   */
  get(key) {
    const itemPrms = this.store.getItem(key);
    const getPrms = new Promise((resolve, reject) => {
      itemPrms
        .then(
          function(data) {
            if (data) {
              this.pQueue.increaseNodeUsage(key);
              if (this.expiry) {
                if (this.dateDiffInMin(data.expiry) > this.expiry) {
                  this.store.setItem(key, {
                    value: data.value,
                    expiry: new Date()
                  });
                  reject(new Error("error"));
                }
              }
              resolve(data);
            } else {
              reject(new Error("error"));
            }
          }.bind(this)
        )
        .catch(() => {
          reject(new Error("error"));
        });
    });

    return getPrms;
  }

  /**
   * @method
   * Get name of this store
   */
  get keyName() {
    return this.key;
  }
}

const cacheInstances = new Map();
/** Interface to create data lookup */
export default class DataLookup {
  static createLookup(key, limit, expiry) {
    const lookup = new Lookup(key, limit, expiry);
    cacheInstances.set(key, lookup);
    return new Lookup(key, limit, expiry);
  }

  static getInstance(key) {
    return cacheInstances.get(key);
  }
}
