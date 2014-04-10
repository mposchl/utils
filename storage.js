/**
 * abstract of local storage
 *
 * @type {Object}
 */
var Storage = function(options) {
    /**
     * default options
     */
    var defaults = {
        expiration: 600000, //[ms]
        forceRefresh: false,
        storage: localStorage,
        prefix: '',
        debug: false
    };

    /**
     * merge optional config
     */
    $.extend(defaults, options);

    /**
     * @var
     */
    this.expiration = defaults.expiration;

    /**
     * @var
     */
    this.forceRefresh = defaults.forceRefresh;

    /**
     * @var
     */
    this.storage = defaults.storage;

    /**
     * @var
     */
    this.prefix = defaults.prefix;

    /**
     * @var
     */
    this.debug = defaults.debug;
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
   var valid = item && !this.empty(item) && !this.expired(item);
   this.log((valid ? 'valid ' : 'invalid ') + item);
   return valid;
};

/**
 * is given item expired?
 * 
 * @param {Object} item
 * @return {Boolean}
 */
Storage.prototype.expired = function(item) {
   var now = +new Date();

    this.log('item.expire: ' + item.expire + ' now: ' + now)

   return item.expire < now || this.forceRefresh;
};

/**
 * is given item empty?
 * 
 * @param {Object} item
 * @return {Boolean}
 */
Storage.prototype.empty = function(item) {
    return item == undefined;
};

/**
 * get expiration time for adding new data
 *
 * @return {Number}
 */
Storage.prototype.getExpiration = function() {
   var now = +new Date();

   return now + this.expiration;
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

