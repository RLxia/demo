/**
 *
 * 基础服务
 * $http.get,$http.head,$http.post,$http.put,$http.delete,$http.jsonp,$http.patch
 *
 * */
function UtilsService($http, $q) {
    return {
        getIp: function () {
            return APIENDPOINT;
        },
        query: function (sUrl, sData, sMethod = "post") {
            // sMethod ? sMethod : sMethod = "post";
            return $http({
                url: sUrl,
                data: sData,
                cache: false,
                method: sMethod,
                ignoreLoadingBar: false
            });
        },
        downLoad: function (sUrl) {
            return $http({
                method: "GET",
                url: sUrl,
                //params: { name: name },
                responseType: 'arraybuffer'
            });
        },

        get: function (sUrl, sData) {
            return $http({
                url: sUrl,
                params: sData,
                cache: false,
                method: "GET",
                ignoreLoadingBar: false
            });
        },
        post: function (sUrl, sData) {
            return $http({
                url: sUrl,
                data: sData,
                cache: false,
                method: "POST",
                ignoreLoadingBar: false
            });
        },
        postBlob: function (sUrl, sData) {
            return $http({
                url: sUrl,
                data: sData,
                cache: false,
                method: "POST",
                ignoreLoadingBar: false,
                responseType: 'blob'
            });
        },
        put: function (sUrl, sData) {
            return $http({
                url: sUrl,
                data: sData,
                cache: false,
                method: "PUT",
                ignoreLoadingBar: false
            });
        },
        delete: function (sUrl, sData) {
            return $http({
                url: sUrl,
                data: sData,
                cache: false,
                method: "DELETE",
                ignoreLoadingBar: false
            });
        },
        
        saveCurrentUserToSession: function(content) {
            let session = window.sessionStorage;
            if (session) {
                session.setItem("username", content.username);
                session.setItem("user_id", content.id);
            }
        },
        getCurrentUser: function() {
            let session = window.sessionStorage;
            if (session.hasOwnProperty("CURRENT_USER")) {
                return JSON.parse(session.getItem("CURRENT_USER"));
            }
            return null;
        },
    }
}

UtilsService.$inject = ['$http', '$q'];

export default UtilsService;
