$(document).ready(function(){

    // Прокрутка в top
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.scroll_to_top').show('fast');
        } else {
            $('.scroll_to_top').hide('fast');
        }
    });
    $('.scroll_to_top').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 200);
        return false;
    });

    // СЛАЙДЕР

    if ($('.b-slider__thumbnails-list').length) {
        $('.b-slider__thumbnails-list').bxSlider({
            slideWidth: 75,
            minSlides: 3,
            maxSlides: 3,
            slideMargin: 10,
            pager: false,
            nextText: '',
            prevText: ''

        });
    }

    //ДЕЛЕНИЕ НА КОЛОНКИ
    if ($('.b-about__content').length) {
        $('.b-about__content').columnize({
            width: 280,
            columns: 3
        });
    }

}); // - > ready_end;

//СЛАЙДЕР
(function(){

    $('.b-slider__thumbnails-link').on('click', function(e){
        e.preventDefault();

        var
            $this = $(this),
            container = $this.closest('.b-slider'),
            path = $this.find('img').attr('src'),
            item = $this.closest('li');

        if (!item.hasClass('active')) {

            item.addClass('active').siblings().removeClass('active');

            container.find('.b-slider__photo img').fadeOut(function(){
                $(this).attr('src', path).fadeIn();
            });
        }
    });
}());