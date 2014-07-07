/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Global varaibles
 * @returns {Array|HTTP_GET_VARS}
 */

HTTP_GET_VARS = get_params();
//var repo_url = "http://serv21.ub.uni-heidelberg.de:8080/fedora/rest/";
var repo_url = "http:///pers31.ub.uni-heidelberg.de:8080/fedora/rest/";
var resource = GET('resource');
var full_url = repo_url + resource;
var ns = "http://www.jcp.org/jcr/sv/1.0";

/**
 * returns the  parameter values
 * @param {type} v
 * @returns {HTTP_GET_VARS|String}
 */
function get_params() {
    HTTP_GET_VARS = new Array();
    strGET = document.location.search.substr(1, document.location.search.length);
    if (strGET != '')
    {
        gArr = strGET.split('&');
        for (i = 0; i < gArr.length; ++i)
        {
            v = '';
            vArr = gArr[i].split('=');
            if (vArr.length > 1) {
                v = vArr[1];
            }
            HTTP_GET_VARS[unescape(vArr[0])] = unescape(v);
        }
    }
    return HTTP_GET_VARS;
}

/**
 * check if a parameter exists and return its value
 * @type Arguments
 */
function GET(v)
{
    if (!HTTP_GET_VARS[v]) {
        return 'undefined';
    }
    return HTTP_GET_VARS[v];
}




