"use strict";

angular.module('wisdom.services', [])

    .constant('baseUrl', "/api")

    .factory('IMEI', function($q, $log) {
        var d = $q.defer();
        if(window.plugins && window.plugins.imeiplugin) {
            window.plugins.imeiplugin.getImei(function(imei) {
                d.resolve(imei);
                $log.info("device IMEI:" + imei);
            });
        }
        return d.promise;
    })

    .factory('authInterceptor', function($log) {
        var interceptor = {
            'request': function(request) {
                return request;
            },
            'response': function(response) {
                $log.info("handle response in authInterceptor.");
                // TODO cas session timeout page.
                return response;
            },
            'responseError': function(rejection) {
                return rejection;
            }
        };
        return interceptor;
    })

    .config(function($httpProvider) {
        $httpProvider.interceptors.push("authInterceptor");
    })

    .factory('ToApproveService', function($q, $log, $http, baseUrl) {

        var toApproveList = [];

        var activeItem = {
            systemId: '',
            itemId: ''
        };
        var gesture = {
            css: '',
            title: ''
        };
        var search = { };
        for (var i = 0; i < 10; i++) {
            var item = {
                id: i,
                applier: "张*" + (i + 1),
                applicant: "5109160256",
                organization: "",
                applytype: "For Employee",
                applydate: "2016-01-12 16:08:14",
                description: "由于项目需要，拜访本地交通费报销在徐家汇的客户：某某某公司经理刘某某，申请报销交通费用。包括各种交际费用。",
                details: [
                    {
                        purpose: "1. Local Transportation",
                        cost: "125 CNY",
                        date: "2016.02.17"
                    },
                    {
                        purpose: "2. Local Transportation",
                        cost: "143 CNY",
                        date: "2016.02.17"
                    }
                ],
                attachments: [
                    {
                        fileName: "OReilly AngularJS.pdf",
                        fileUrl: "templates/OReillyAngularJS.pdf",
                        fileType: "pdf"
                    },
                    {
                        fileName: "picture 01.jpg",
                        fileUrl: "img/pic1.jpg",
                        fileType: "pic"
                    },
                    {
                        fileName: "picture 02.png",
                        fileUrl: "img/pic2.png",
                        fileType: "pic"
                    },
                    {
                        fileName: "picture 03.tif",
                        fileUrl: "img/pic3.tif",
                        fileType: "pic"
                    },
                    {
                        fileName: "phone.txt",
                        fileUrl: "phone.txt",
                        fileType: "txt"
                    },
                    {
                        fileName: "Excel Invoice.xls",
                        fileUrl: "templates/ExcelInvoice.xls",
                        fileType: "xls"
                    }
                ],
                records: [
                    {
                        approver: "朱*",
                        approverID: "5109v115457",
                        status: "Approved",
                        comment: "Beware of size of attachment.",
                        updDate: "4/14/2016 4：08：23 PM"
                    },
                    {
                        approver: "许*",
                        approverID: "5109v115457",
                        status: "Approved",
                        comment: "N/A",
                        updDate: "2016.02.17 16:02:12"
                    }
                ],
                comment: {
                    draft: "",
                    content: "",
                    isValid: true
                }
            };
            toApproveList.push(item);
        }

         var getRetrieveList = function(){
            return toApproveList;
        }
        var setActiveItem = function(id) {
            activeItem = FindById(id);
        }


        var getGesture = function() {
            return gesture;
        };
        var getActiveItem = function() {
            return activeItem;
        };
        var getSearch = function() {
            return search;
        };


        var clearGesture = function() {
            gesture.num1 = "";
            gesture.num2 = "";
            gesture.num3 = "";
            gesture.num4 = "";
        };
        var pRetrieveList = function() {
            var d = $q.defer();
            // TODO dummy code.
            d.resolve(toApproveList);
            return d.promise;
        };
        var pSearch = function(search) {

            var d = $q.defer();
            //var path = $window.encodeURI('_http://43.82.163.43:9010/List?gid=5109v11205&companyCode=common&systemId=001&callback=JSON_CALLBACK');
            $http.get(baseUrl + '/Search?gid=5109v11205&companyCode=common&systemId=001&search='+search)
                .success(function(data) {
                    console.info(data);
                    toApproveList = data;
                    d.resolve(toApproveList);
                }).error(function() {
                    d.reject();
                })
                .finally(function() {

                });

            return d.promise;
        };

        var pGetList = function() {
            var d = $q.defer();
            //console.log(_BASE_URL_+'List?gid=5109v11205&companyCode=common&systemId=001');

            $http.get(baseUrl + '/List?gid=5109v11205&companyCode=common&systemId=001')

                .success(function(data) {
                    toApproveList = data;
                    d.resolve(toApproveList);
                }).error(function(e) {
                  //  console.info("e" + e);
                    d.reject(e);
                })
                .finally(function() {
                });
            return d.promise;
        }



        var pGetTyleList = function(wfTypeId) {
            var d = $q.defer();
            $http.get(baseUrl + '/Typelist?gid=5109v11205&companyCode=common&systemId=001&wfTypeId=' + wfTypeId)
                .success(function(data) {
                    toApproveList = data;
                    d.resolve(toApproveList);
                }).error(function(e) {
                    console.info("e" + e);
                    d.reject(e);
                })
                .finally(function() {
                });
            return d.promise;
        }


//登录请求1-2:post
        var pLogin = function(gid,imei) {

            var d = $q.defer();

              $http({
                'url':baseUrl+'/appClient?gid='+gid+'&imei='+imei+'&sendtype=2',
                'Content-Type':'application/x-www-form-urlencoded;charset=utf-8',
                'method':'post'
            }).success(function(data) {
                    d.resolve(data);

                }).error(function(e) {
                    d.reject();
                })


            return d.promise;
        }
        //解锁页面
        var pGesture = function(gid,imei,status) {

            var d = $q.defer();
              $http({
                'url':baseUrl+'/appClient?gid='+gid+'&imei='+imei+'&status'+status+'&sendtype=3',
                'Content-Type':'application/x-www-form-urlencoded;charset=utf-8',
                'method':'post'
            }).success(function(data) {
                    d.resolve(data);

                }).error(function(e) {
                    d.reject();
                })

            return d.promise;
        }




        var pGetPageList = function(pageNum) {

            var d = $q.defer();
            $http.get(baseUrl + '/List?gid=5109v11205&companyCode=common&systemId=001&pageNum=' + pageNum)
                .success(function(data) {
                    console.log(data);
                    // toApproveList = data;
                    d.resolve(toApproveList);
                }).error(function(e) {
                    d.reject(e);
                })
                .finally(function() {
                });
            return d.promise;
        }

        // retrieve to-approve list from server and produces a promise.
        var pRetrieveList = function() {
            var d = $q.defer();
            // TODO dummy code.
            d.resolve(toApproveList);
            return d.promise;
        };

        var getList = function() {
            return toApproveList;
        }

        var pQuery = function(qStr) { };
        var pFindById = function(id) {
        };

        var FindById = function(id) {
            for (var index in toApproveList) {
                if (toApproveList[index].id == id) {
                    return toApproveList[index];
                }
            }
            return null;
        };

        var setComment = function(comment) {
            for (var index in toApproveList) {
                if (toApproveList[index].id == activeItem.itemId) {
                    toApproveList[index].comment = comment;
                    break;
                }
            }
        };
        var pGetAttachment = function(fileId) {
            var d = $q.defer();
            $http.get(baseUrl + '/download/' + fileId)
            .success(function(data) {
                d.resolve(data);
            })
            .error(function(e) {
                d.reject(e);
            })
            .finally(function() {

            });
            return d.promise;
        };
        var pApprove = function(id) {
            var d = $q.defer();
            // TODO dummy code.
            d.resolve(toApproveList);
            return d.promise;
        };
        var pReject = function(id) { };
        var approve = function() {
            for (var index in toApproveList) {
                if (toApproveList[index].id == activeItem.id) {
                    toApproveList.splice(index, 1);
                    break;
                }
            }
        };
        var reject = function() {
            for (var index in toApproveList) {
                if (toApproveList[index].id == activeItem.id) {
                    toApproveList.splice(index, 1);
                    break;
                }
            }
        };


        return {
            pGesture:pGesture,
            pLogin:pLogin,
            pGetTyleList: pGetTyleList,
            getRetrieveList: getRetrieveList,
            getSearch: getSearch,
            pSearch: pSearch,
            pGetList: pGetList,
            pGetPageList: pGetPageList,
            clearGesture: clearGesture,
            pRetrieveList: pRetrieveList,
            getList: getList,
            setActiveItem: setActiveItem,
            getActiveItem: getActiveItem,
            pQuery: pQuery,
            pFindById: pRetrieveList,
            FindById: FindById,
            setComment: setComment,
            pGetAttachment: pGetAttachment,
            pApprove: pApprove,
            approve: approve,
            reject: reject,
            pReject: pApprove,
            getGesture: getGesture

        };
    })

    .factory('GestureService', function() {
        return {
            pSetGesture: function(password) { },
            pVerifyGesture: function(password) { },
            pClearGesture: function() { }
        }
    })

    .factory('LoginService', function() {
        return {
            pLogin: function(gid, password) { },
            logout: function() { },
            pGetMyInfo: function() { },
            getStoragedGID: function() { }
        }
    })
    .factory('AuthService', function() {
        return {
            hasLoggedIn: function() {
                return true;
            }
        }

    })//本地存储数据===================================
    .factory('LocalsService', ['$window', function($window) {
        return {
            //存储单个属性
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            //读取单个属性
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            //存储对象，以JSON格式存储
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            //读取对象
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }]);
