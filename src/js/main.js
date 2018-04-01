$(document).ready(function () {

    $('.openNav').click(function () {
        var header = $('.container-header');

        if (header.hasClass('open')) {
            header.removeClass('open')
        } else {
            header.addClass('open')
        }
    });

});