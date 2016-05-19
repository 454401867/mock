var app = angular.module('wisdom.controllers', ['wisdom.services', 'wisdom.directives'])

    .controller('WisdomController', function($scope, $rootScope, $ionicActionSheet, $log, $ionicPlatform, $state, $location) {
        ///home键




        $ionicPlatform.on('pause', function() {
            // alert('android-home-catch')
            //$state.go('gesture');
            if ($location.path() == '/splash' || $location.path() == '/login') {

            } else {
                $state.go('gesture');
            }
        });
        /////
        $rootScope.$on('system:error', function(event, msg) {
            //TODO
            $log.info("handle system error: " + msg);
            /*$ionicActionSheet.show({
                titleText: msg
            });*/
        })
        $rootScope.$on("auth:failure", function(event) {
            //TODO
            $log.info("handle authentication failure.");
        })

    })

    .controller('HomeController', function($scope, $http, $ionicActionSheet, $ionicModal, $state, $ionicViewSwitcher,
        $log, $timeout, $window,ToApproveService) {
        $scope.pageNum = 0;
        $scope.wfTypeId = '';
        $scope.hasMore = true;

        $scope.goSearch = function() {
            $state.go('search');
        }
        $scope.reload = function() {
            $scope.hasMore = true;
        }

        //自动获取焦点
        $scope.$on('$ionicView.afterEnter', function() {
           // $('#search').focus();
            if ($window.cordova && $window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.show(); //open keyboard manually
            }

            ToApproveService.pRetrieveList().then(function(data) {
                //  $scope.items = data;
                $scope.items = ToApproveService.getRetrieveList();
            }, function(e) {
                console.log('error');
                $log.info(e);
            });
        });

        $scope.showActionsheet = function() {
            var retrivelList = ToApproveService.getRetrieveList();
            //  console.log(retrivelList);
            var buttons = [];
            //  console.log(retrivelList.typeList);
            angular.forEach(retrivelList.typeList, function(data, index, array) {
                // data等价于array[index]
                //console.log(data.wfTypeName+'='+array[index].wfTypeName);
                buttons[index] = {
                    text: data.wfTypeName + '<span>12</span>',
                };
            });

            $ionicActionSheet.show({
                buttons: [
                    { text: 'All Applications<span>12</span>' },
                    { text: 'Biztrip Pre-Application<span>2</span>' },
                    { text: 'Biztrip Payment<span>3</span>' },
                    { text: 'Decision Making<span>4</span>' },
                    { text: 'Chop Function<span>3</span>' },
                ],
                cancel: function() {
                    console.log('CANCELLED');
                },
                cssClass: "actionsheet-home",
                buttonClicked: function(index) {
                    //var wfTypeId = retrivelList.typeList[index].wfTypeId;
                    //ToApproveService.pGetPageList(wfTypeId);
                    return true;
                }
            });
        };



        $scope.doRefresh = function() {
            console.log('doRefresh');
            ToApproveService.pRetrieveList().then(function(data) {
                $scope.items = data;
            }, function(e) {
                console.log('error');
                $log.info(e);
            });

            // ToApproveService.pGetList().then(function(data) {
            //     $scope.items = data.detailList;
            // }, function(e) {
            //    // console.log('error');
            //     $log.info(e);
            // });

            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.forward = function(id) {
            //var activeItem = ToApproveService.GetActiveItem();
            //activeItem = item;
            ToApproveService.setActiveItem(id);
            $ionicViewSwitcher.nextDirection('forward');
            $state.go('detail');
        }
        $scope.loadMore = function() {

            console.log('loadMore');
            //  ToApproveService.pRetrieveList().then(function(data) {
            //     $scope.items = data;
            // }, function(e) {
            //     console.log('error');
            //     $log.info(e);
            // });
            // $scope.$broadcast('scroll.infiniteScrollComplete');

            // ToApproveService.pGetPageList(++$scope.pageNum).then(function(data) {
            //      console.log("loadMore");

            //      $scope.items = data.detailList;

            //  }, function(e) {
            //     console.log('error');
            //      $log.info(e);
            //  });
            $timeout(function() {
                $scope.hasMore = false;
                // $scope.$broadcast('scroll.infiniteScrollComplete');
            }, 2000);

        };

    })
    .controller('SearchController', function($scope, $state, $window, ToApproveService, $ionicHistory, $ionicLoading) {
        //绑定searchValue
        $scope.search = ToApproveService.getSearch();

        //自动获取焦点
        $scope.$on('$ionicView.afterEnter', function() {
            $('#search').focus();
            if ($window.cordova && $window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.show(); //open keyboard manually
            }
        });
        //获取焦点
        $scope.hide = function() {
            //判断search是否为空
            if ($("#search").val() == '') {
                //为空clear按钮不显示
                $("#clear").css('display', 'none');
            } else {
                $("#clear").css('display', 'block');
            }
        }
        //失去焦点
        $scope.show = function() {
            //clear按钮隐藏
            //$("#clear").css('display', 'none');
        }
        //当输入search内容时触发
        $scope.clearShowOrHide = function(event) {
            //判断search是否为空
            if ($("#search").val() == '') {
                $("#clear").css('display', 'none');
            } else {
                //不为空clear按钮显示
                $("#clear").css('display', 'block');
            }
        }
        //清空search
        $scope.clear = function() {
            $("#search").val('');
        }
        //回车事件
        $scope.keydown = function(event) {
            if (event.keyCode == 13) {
                //获取search内容
                var search = ToApproveService.getSearch();
                //显示载入指示器
                $ionicLoading.show({
                    template: "正在载入数据，请稍后..."
                });
                //调用service
                //ToApproveService.pSearch(search.searchValue).then(function(data){
                //隐藏载入指示器
                $ionicLoading.hide();
                $state.go("searchlist");
                //});
            }
        }
        //回退事件
        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
    })
    .controller('LoginController', function($scope, $ionicPopup, $state, ToApproveService, IMEI) {

        $scope.data = {};


        IMEI.then(function(data) {

            //alert('IMEI====' + data)
        });


        $scope.login = function() {


            // window.plugins.myEcho(['https://43.82.221.88/', $scope.data.gid, $scope.data.password],
            //     function(data) {
            //         alert(data);
            //         //公共认证返回的token------data
            //   window.localStorage.setItem("castoken",data);
            //         ToApproveService.pLogin($scope.data.gid, '000').then(function(data) {
            //             //$state.go('gesture', {}, { reload: true });
            //             alert(data.result);
            //             if (data.result == '0') {
            //                 $state.go('gesture');
            //             } else {
            //                 var alertPopup = $ionicPopup.alert({
            //                     title: 'Login failed!',
            //                     template: 'Please check your credentials!'
            //                 });
            //             }

            //         }, function() {
            //             var alertPopup = $ionicPopup.alert({
            //                 title: 'Login failed!',
            //                 template: 'Please check your credentials!'
            //             });
            //         });

            //     },
            //     function(error) {
            //         alert(error);
            //     });

            // ToApproveService.pLogin($scope.data.gid, '000').then(function(data) {
            //     //$state.go('gesture', {}, { reload: true });
            //     console.log(data.result)

            //     if (data.result == '0') {

            //         $state.go('gesture');
            //     } else {
            //         var alertPopup = $ionicPopup.alert({
            //             title: 'Login failed!',
            //             template: 'Please check your credentials!'
            //         });
            //     }

            // }, function() {
            //     var alertPopup = $ionicPopup.alert({
            //         title: 'Login failed!',
            //         template: 'Please check your credentials!'
            //     });
            // });
            $state.go('gesture');
        }
    })
    .controller('SearchListController', function($scope, $http, $state, $ionicViewSwitcher, $ionicHistory, ToApproveService) {

        $scope.items = [];
        ToApproveService.pRetrieveList()
            .then(function(list) {
                //$scope.hello = list[0].name;
                $scope.items = list;
            });

        $scope.goBack = function() {
            //console.log('123');
            $ionicHistory.goBack();
        }
        // ToApproveService.pRetrieveList().then(function(data) {
        //     $scope.items = data;
        // }, function(e) {
        //     console.log('error');
        //     $log.info(e);
        // });
        $scope.forward = function(id) {
            // var activeItem = ToApproveService.GetActiveItem();
            // activeItem = item;
            // $ionicViewSwitcher.nextDirection('back');
            // $state.go('detail');
            // ToApproveService.setActiveItem(id);
            // $ionicViewSwitcher.nextDirection('back');
            // $state.go('detail');
        }
        $scope.forward = function(id) {
            //var activeItem = ToApproveService.GetActiveItem();
            //activeItem = item;
            ToApproveService.setActiveItem(id);
            $ionicViewSwitcher.nextDirection('back');
            $state.go('detail');
        }
        $scope.doRefresh = function() {
            console.log('doRefresh');
            ToApproveService.pRetrieveList().then(function(data) {
                $scope.items = data;
            }, function(e) {
                console.log('error');
                $log.info(e);
            });

            // ToApproveService.pGetList().then(function(data) {
            //     $scope.items = data.detailList;
            // }, function(e) {
            //    // console.log('error');
            //     $log.info(e);
            // });

            $scope.$broadcast('scroll.refreshComplete');
        };

    })
    .controller('DetailController', function($scope, $ionicScrollDelegate, $timeout,
        $ionicActionSheet, $state, $stateParams, $ionicHistory, ToApproveService, $window) {

        $scope.$on('$ionicView.beforeEnter', function(event) {
            $ionicScrollDelegate.scrollTop();
            if ($window.location.href.indexOf('comment') == -1) {
                $("#centent").css('display', 'none');
                $("#top").css('display', 'block');
            }
            if (event.targetScope !== $scope) {
                return;
            }
            //显示等待动画
            $scope.ions = "circles";

            $timeout(function() {
                //显示根据ID查找的内容
                $scope.item = ToApproveService.getActiveItem();
                if ($scope.item != null) {
                    $("#centent").css('display', 'block');
                    $("#top").css('display', 'none');
                }
            }, 2000);
            $scope.item.comment.isValid = true;
        });

        //回退事件
        $scope.goBack = function() {
            $ionicHistory.goBack();
        }
        //拒绝操作
        $scope.reject = function() {
            //判断comment内容
            if ($scope.item.comment.content == "") {
                $scope.item.comment.isValid = false;
                //画面滚动到底部
                $ionicScrollDelegate.scrollBottom();
                return true;
            }
            $scope.item.comment.isValid = true;
            $ionicActionSheet.show({
                //显示提示框内容和按钮
                titleText: 'Are you sure to REJECT?',
                buttons: [
                    { text: 'NO' },
                    { text: 'YES' }
                ],
                cssClass: "actionsheet-approvement",
                buttonClicked: function(index) {
                    if (index === 0) {
                        //点击OK
                    } else if (index === 1) {
                        ToApproveService.pReject().then(
                            function(data) {
                                //调用service
                                //ToApproveService.pSearch().then(function(data){
                                //本地干掉该条数据
                                ToApproveService.reject();
                                //});
                            },
                            function(e) {

                            });
                        var hideSheet = $ionicActionSheet.show({
                            //显示拒绝成功信息
                            titleText: 'REJECT successfully.',
                            cssClass: "actionsheet-success",
                            cancel: function() {
                                $timeout.cancel(promize);
                                $ionicHistory.goBack();
                            }
                        });

                        var promize = $timeout(function() {
                            hideSheet();
                        }, 2000);

                    }
                    return true;
                }
            });
        };
        //承认操作
        $scope.accept = function() {

            $scope.item.comment.isValid = true;

            var hideSheet = $ionicActionSheet.show({
                //显示提示框内容和按钮
                titleText: 'Are you sure to APPROVE?',
                buttons: [
                    { text: 'NO' },
                    { text: 'YES' }
                ],
                cssClass: "actionsheet-approvement",
                buttonClicked: function(index) {
                    if (index === 0) {
                        //点击OK
                    } else if (index === 1) {
                        ToApproveService.pApprove().then(
                            function(data) {
                                //调用service
                                //ToApproveService.pSearch().then(function(data){
                                //本地干掉该条数据
                                ToApproveService.approve();
                                //});
                            },
                            function(e) {

                            });
                        var hideSheet = $ionicActionSheet.show({
                            //显示承认成功信息
                            titleText: 'Approve successfully.',
                            cssClass: "actionsheet-success",
                            cancel: function() {
                                $timeout.cancel(promize);
                                $ionicHistory.goBack();
                            }
                        });
                        var promize = $timeout(function() {
                            hideSheet();
                        }, 2000);
                    }
                    return true;
                }
            });
        };
        //判断附件类型并打开
        $scope.openDocument = function(doc) {
            if (doc.fileType == 'pdf' || doc.fileType == 'txt' || doc.fileType == 'pic') {
                $state.go('fileviewer', { 'activeDocument': doc });
            }
        };
        //跳转到comment
        $scope.editComment = function() {
            $state.go('comment');
        }
    })

    .controller('FileController', function($scope, $stateParams, $ionicModal, ToApproveService) {
        $scope.zoomMin = 1;
        $scope.$on('$ionicView.beforeEnter', function(event) {
            if (event.targetScope !== $scope) {
                return;
            }
            $scope.isPDF = false;
            $scope.isIMG = false;
            $scope.isTXT = false;
            $scope.fileType = $stateParams.activeDocument.fileType;
            $scope.fileUrl = $stateParams.activeDocument.fileUrl;
            $scope.fileName = $stateParams.activeDocument.fileName;

            if ($scope.fileType == "pdf") {
                $scope.pdfUrl = $scope.fileUrl;
                $scope.isPDF = true;
            }
            else if ($scope.fileType == "txt") {
                $scope.isTXT = true;
                ToApproveService.pGetAttachment($scope.fileName)
                    .then(function(data) {
                        $scope.txtData = data;
                    }, function(e) {
                        console.log(e);
                    });
            }
            else if ($scope.fileType == "pic") {
                $scope.isIMG = true;
            }
            $scope.scroll = 0;
        });

        $scope.showImage = function() {
            $scope.showModal('templates/fileviewer-img.html');
        };

        $scope.showModal = function(templateUrl) {
            $ionicModal.fromTemplateUrl(templateUrl, {
                scope: $scope
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        };

        $scope.closeModal = function() {
            $scope.modal.hide();
            $scope.modal.remove()
        };

        $scope.getNavStyle = function(scroll) {
            if (scroll > 100) return 'attachment-pdf-controls attachment-pdf-fixed';
            else return 'attachment-pdf-controls';
        };

        $scope.onError = function(error) {
            console.log(error);
        }
    })

    .controller('CommentController', function($scope, $state, $ionicHistory, ToApproveService) {

        $scope.$on('$ionicView.beforeEnter', function(event) {
            if (event.targetScope !== $scope) {
                return;
            }
            $scope.comment = ToApproveService.getActiveItem().comment;
            $scope.comment.draft = $scope.comment.content;
        });

        $scope.doOnKeydown = function(event) {
            if (event.keyCode == 13) {
                $scope.comment.content = $scope.comment.draft;
                $scope.comment.draft = "";
                if ($scope.comment.content != '' && !$scope.comment.isValid) {
                    $scope.comment.isValid = true;
                }
                ToApproveService.setComment($scope.comment);
                $ionicHistory.goBack();
            }
        }
    })

    //  手势解锁控制

    .controller('LockController', function($scope, LoginService, ToApproveService, $ionicPopup, $state, $timeout, $ionicActionSheet, $http) {
        var gestureY = 'SLIDE_STATE_OK';  //   正确手势
        var gestureN = 'SLIDE_STATE_ERROR'; // 错误手势
        var imei = '000';  //获取imei
        var gid = '5109V11481'; //获取本地存储gid

        var gestureNum = '0';
        //  数据双向绑定
        var gesture = ToApproveService.getGesture();
        $scope.gesture = gesture;
        $scope.$on('$ionicView.beforeEnter', function(event) {
            if (event.targetScope !== $scope) {
                return;
            }
            ToApproveService.pGesture(gid, imei, '').then(function(data) {
                data.result = '0';////*****
                gestureNum = '0';///******
                if (data.result == '0') {
                    gestureNum = '0';
                } else {
                    gestureNum = '0';///000
                    //  var alertPopup = $ionicPopup.alert({
                    //  title: 'Gesture Locked!',
                    //  template: 'Please check your credentials!'
                    //});

                }
                $scope.log_pattern = LoginService.getLoginPattern();



                if ($scope.log_pattern != null) {

                    console.log(gestureNum);
                    if (gestureNum == '0') {

                        document.getElementById('res').style.display = 'block';
                        document.getElementById('res').style.color = '#FFFFFF';

                        //document.getElementById('title').style.color = '#FAFAFA';
                        // document.getElementById('title').innerHTML = 'Please slide the correct gesture.';

                        gesture.css = 'write';
                        gesture.title = "Please slide the correct gesture."
                    } else {
                        document.getElementById('res').style.display = 'none';
                        gesture.css = 'red';
                        gesture.title = "Your error has reached ten times."
                    }

                } else {
                    document.getElementById('res').style.display = 'none';
                    // document.getElementById('title').style.color = '#FAFAFA';
                    gesture.css = 'write';
                    gesture.title = "Please create a new gesture."
                }

            }, function() {
                gestureNum = '0';//00
                // var alertPopup = $ionicPopup.alert({
                //    title: 'Sorry!',
                //    template: 'Please check your network!'
                // });
            });

        });





        //重置密码
        $scope.data = {};
        $scope.Reset = function() {
            window.localStorage.clear("login_pattern");
            window.localStorage.clear("castoken");
            document.getElementById('res').style.display = 'none';
            // document.getElementById('title').innerHTML = 'Please create a new gesture.';
            gesture.css = 'write';
            gesture.title = "Please create a new gesture."
            pattern = 0;
            count = 0;
            ConfirmPassword = 0;
            $state.go('login');
        }



        $scope.log_pattern = LoginService.getLoginPattern();
        var ConfirmPassword;
        var count = 0;




        var lock = new PatternLock("#lockPattern", {


            // 3
            onDraw: function(pattern) {


                // 4
                if ($scope.log_pattern) {

                    if (gestureNum == '0') {
                        // 5
                        LoginService.checkLoginPattern(pattern).success(function(data) {
                            lock.reset();
                            ToApproveService.pGesture(gid, imei, gestureY).then(function(data) {
                                //$state.go('gesture', {}, { reload: true });
                                console.log(data.result);

                            }, function() {
                                gestureNum = '0';///0000
                                // var alertPopup = $ionicPopup.alert({
                                //    title: 'Sorry!',
                                //    template: 'Please check your network!'
                                // });
                            });
                            $state.go('app.home');


                        }).error(function(data) {

                            // document.getElementById('title').style.color = '#C50E0E';
                            // document.getElementById('title').innerHTML = 'Error correct.';
                            gesture.css = 'red';
                            gesture.title = "Error correct."
                            ToApproveService.pGesture(gid, imei, gestureN).then(function(data) {
                                //$state.go('gesture', {}, { reload: true });
                                console.log('lock=' + data.result);
                                data.result = '0'////***
                                gestureNum = '0';/////***
                                if (data.result == '0') {
                                    gestureNum = '0';
                                    $timeout(function() {
                                        // document.getElementById('title').style.color = '#FAFAFA';
                                        // document.getElementById('title').innerHTML = 'Please slide the correct gesture.';
                                        gesture.css = 'write';
                                        gesture.title = "Please slide the correct gesture."

                                    }, 1000);

                                } else {
                                    gestureNum = '0';///000
                                    $timeout(function() {
                                        // document.getElementById('title').style.color = '#FAFAFA';
                                        // document.getElementById('title').innerHTML = 'Please slide the correct gesture.';
                                        gesture.css = 'write';
                                        gesture.title = "Please slide the correct gesture."

                                    }, 1000);
                                    // document.getElementById('res').style.display = 'none';
                                    // gesture.css = 'red';
                                    // gesture.title = "Your error has reached ten times."

                                    //  var alertPopup = $ionicPopup.alert({
                                    //    title: 'Gesture Locked!',
                                    //     template: 'Please check your credentials!'
                                    //});

                                }

                            }, function() {
                                gestureNum = '0';  ////0000
                                // var alertPopup = $ionicPopup.alert({
                                //    title: 'Sorry!',
                                //    template: 'Please check your network!'
                                // });
                            });
                            lock.error();
                            lock.reset();


                        });
                    } else {
                        lock.reset();
                    }
                } else {
                    // 6
                    if (pattern.length < 6) {
                        // document.getElementById('title').style.color = '#C50E0E';
                        // document.getElementById('title').innerHTML = 'At least use 6 dots.';
                        gesture.css = 'red';
                        gesture.title = "At least use 6 dots."

                        $timeout(function() {
                            // document.getElementById('title').style.color = '#FAFAFA';
                            // document.getElementById('title').innerHTML = 'Please create a new gesture.';
                            gesture.css = 'write';
                            gesture.title = "Please create a new gesture."


                        }, 1000);
                        pattern = 0;
                        count = 0;
                        ConfirmPassword = 0;
                    } else {
                        if (count == 0) {
                            ConfirmPassword = pattern;

                            // document.getElementById('title').style.color = '#FAFAFA';
                            // document.getElementById('title').innerHTML = 'Please draw gesture again.';
                            gesture.css = 'write';
                            gesture.title = "Please draw gesture again."
                            count++;
                        } else {
                            if (pattern == ConfirmPassword) {
                                LoginService.setLoginPattern(pattern);
                                // document.getElementById('title').style.color = '#FAFAFA';
                                // document.getElementById('title').innerHTML = 'Please slide the correct gesture.';
                                gesture.css = 'write';
                                gesture.title = "Please slide the correct gesture."


                                var hideSheet = $ionicActionSheet.show({
                                    titleText: 'Set gesture succeully.',
                                    cssClass: "actionsheet-gesture",
                                });

                                $timeout(function() {
                                    $state.go('app.home');
                                }, 2000)

                            } else {
                                // document.getElementById('title').style.color = '#C50E0E';
                                // document.getElementById('title').innerHTML = 'Dierent with last drawing.';
                                gesture.css = 'red';
                                gesture.title = "Dierent with last drawing."

                                var hideSheet = $ionicActionSheet.show({
                                    titleText: 'Set failed.',
                                    cssClass: "actionsheet-gesture",
                                });

                                $timeout(function() {
                                    // document.getElementById('title').style.color = '#FAFAFA';
                                    // document.getElementById('title').innerHTML = 'Please create a new gesture.';
                                    gesture.css = 'write';
                                    gesture.title = "Please create a new gesture."

                                }, 1000);
                                count = 0;
                                ConfirmPassword = 0;
                                pattern = 0;
                            }

                        }
                    }
                    lock.reset();
                    $scope.$apply(function() {
                        $scope.log_pattern = LoginService.getLoginPattern();
                    });

                }





            }
        });
    })



    .service('LoginService', function($q) {
        return {
            loginUser: function(name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                if (name == 'user' && pw == '123') {
                    deferred.resolve('Welcome ' + name + '!');
                } else {
                    deferred.reject('Wrong credentials.');
                }
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            },


            getLoginPattern: function() {
                return window.localStorage.getItem("login_pattern");
            },

            setLoginPattern: function(pattern) {
                window.localStorage.setItem("login_pattern", pattern);
            },
            checkLoginPattern: function(pattern) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                }

                if (pattern == this.getLoginPattern()) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }

                return promise;
            }



        }

    });
