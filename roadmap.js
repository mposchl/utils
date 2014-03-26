/**
 * roadmap behavior extend
 *
 * @type {Object}
 */
var Roadmap = function(data) {
    console.log(data);
    /**
     * url with redmine
     */
    this.url = data.url;

    /**
     * login to redmine
     */
    this.login = data.login;

    /**
     * password to redmine
     */
    this.pswd = data.pswd;

    /**
     * related issues
     */
    this.$related = null;

    /**
     * cache storage instance
     */
    this.storage = new Storage({defaultExpiration: 60, forceRefresh: true});
};

/**
 * perform run, needs to be called explicitly
 * 
 * @return void
 */
Roadmap.prototype.run = function() {
    this.$related = $('.related-issues');

    this.fillRoadmap();
};

/**
 * perform ajax request for desired issue id
 * 
 * @param {String} id the issue id
 * @return {jqXHR}
 */
Roadmap.prototype.request = function(id) {
    return $.ajax(this.url+'/issues/'+id+'.json', {
        dataType: 'json',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', Utils.makeBaseAuth(this.login, this.pswd));
        }
    });
};

/**
 * fill roadmap data got from ajax request
 * 
 * @return void
 */
Roadmap.prototype.fillRoadmap = function() {
    var that = this;
    this.$related.each(function() {
        var $table = $(this),
            $rows = $table.find('tr');
        
        $rows.each(function() {
            var $row = $(this),
                id = $row.find('input[name^="id"]').val(),
                item = that.storage.get(id);
            
            if (item) {
                that.insertCell(item, $row);
            } else {
                that.request(id).done(function(data) {
                    if (data && data.issue) {
                        that.insertCell(data.issue, $row);
                        that.storage.replaceExpired(id, data.issue);
                    }
                });
            }
        });
    });
};

/**
 * when job done, insert received and transformed data into particular rows
 * 
 * @param {Object} data array data got from ajax in JSON format
 * @param {jQuery} $row row object
 * 
 * @return void
 */
Roadmap.prototype.insertCell = function(data, $row) {
    var assigned = data.assigned_to ? data.assigned_to.name : '',
        status = data.status ? data.status.name : '',
        environment = Utils.getEnvironment(data.custom_fields ? data.custom_fields : []);

    $row.find('td:last').html($row.find('td:last').html() + ' (<i>' + status + ' [' + environment + ']</i> - <b>' + assigned + '</b>)');
};

