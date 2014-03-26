/**
 * abstract of local storage
 *
 * @type {Object}
 */
var Storage = function(data) {
   /**
    * @var
    */
    this.defaultExpiration = data && data.defaultExpiration || 600; //[s]

    /**
     * @var
     */
    this.forceRefresh = data && data.forceRefresh || false;

    /**
     * @var
     */
    this.storage = localStorage;

    /**
     * @var
     */
    this.prefix = '';

    /**
     * @var
     */
    this.debug = true;
}

/**
 * replace data with given key if they expired
 *
 * @param {String} key
 * @param {Object} data
 * @return void
 */
Storage.prototype.replaceExpired = function(key, data) {
    if (!this.get(key)) {
        var saveKey = this.getKey(key),
            saveData = this.wrapData(data);

        this.remove(saveKey);
        this.save(saveKey, saveData);
    }
};

/**
 * add new data to storage with given key
 *
 * @param {String} key
 * @param {Object} data
 * @return void
 */
Storage.prototype.add = function(key, data) {
   var saveKey = this.getKey(key),
       saveData = this.wrapData(data);

   this.save(saveKey, saveData);
};

/**
 * get data from storage by given key, if no
 * data found, null is returned
 *
 * @param {String} key
 * @return {String}|null
 */
Storage.prototype.get = function(key) {
   var getKey = this.getKey(key),
       item = this.storage.getItem(getKey);

   this.log((this.valid(item) ? 'found ' : 'invalid') + getKey);
   return this.valid(item) ? JSON.parse(item) : null;
};

/**
 * physically save data to storage by given key
 * 
 * @param {String} key
 * @param {String} data
 * @return void
 */
Storage.prototype.save = function(key, data) {
   this.log('stored ' + key);        
   this.storage.setItem(key, data);
};

/**
 * remove data from storage
 * 
 * @param {String} key
 * @return void
 */
Storage.prototype.remove = function(key) {
   this.log('removed ' + key);
   this.storage.removeItem(key);
};

/**
 * prepare key
 * 
 * @param {String} key
 * @return {String}
 */
Storage.prototype.getKey = function(key) {
   return key;
};

/**
 * wrap data before save - add expiration etc.
 * 
 * @param {Object} data
 * @return {String}
 */
Storage.prototype.wrapData = function(data) {
   data.expire = this.getExpiration();

   return JSON.stringify(data);
};

/**
 * is given item valid - not empty and not expired?
 * 
 * @param {Object} item
 * @return {Boolean}
 */
Storage.prototype.valid = function(item) {
   this.log('valid ' + item);
   return item && !this.empty(item) && !this.expired(item);
};

/**
 * is given item expired?
 * 
 * @param {Object} item
 * @return {Boolean}
 */
Storage.prototype.expired = function(item) {
   var now = +new Date();

   return item.expire >= now || this.forceRefresh;
};

/**
 * is given item empty?
 * 
 * @param {Object} item
 * @return {Boolean}
 */
Storage.prototype.empty = function(item) {
   return item != undefined;
};

/**
 * get expiration time for adding new data
 *
 * @return {Number}
 */
Storage.prototype.getExpiration = function() {
   var now = +new Date();

   return now + this.defaultExpiration;
};

/**
 * log some data to console if debug is on
 *
 * @param {Object} msg
 * @return void
 */
Storage.prototype.log = function(msg) {
   if (this.debug && msg) {
       console.log(msg);
   }
};

