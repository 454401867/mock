angular.module('wisdom.directives', [])

.directive('focusme', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            $timeout(function () {
                element[0].focus();
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.show(); //open keyboard manually
                }
            }, 350);

        }
    }
});
