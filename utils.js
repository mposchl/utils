/**
 * utils used with communication etc.
 * 
 * @type {Object}
 */
var Utils = {
    /**
     * find environment name in given array
     *
     * @param {Object} data array
     * @return string|null
     */
    getEnvironment: function (data) {
        for (var k = 0; k < data.length; k++) {
            if (data[k].name && data[k].name == 'Environment') {
                return data[k].value;
            }
        }
        return null;
    },

    /**
     * prepare authorization token
     * 
     * @param u {String} username
     * @param p {String} password
     * @return {String} authorization {String}
     */
    makeBaseAuth: function (u, p) {
        var tok = u + ':' + p;
        var hash = btoa(tok);
        return 'Basic ' + hash;
    }
};

