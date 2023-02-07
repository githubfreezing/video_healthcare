$('.slider').slick({
    fade: true,  // 切り替えをフェードで行う
    autoplay: true,  // 自動的に動き出すか
    autoplaySpeed: 3000,  // 次のスライドに切り替わる待ち時間
    speed: 1000,  // スライドの動きのスピード
    infinite: false,  // スライドをループさせるかどうか
    // slidesToShow: 1,  // スライドを画面に2枚見せる
    // slidesToScroll: 1,  // 1回のスクロールで3枚の写真を移動して見せる
    arrows: false,  // 左右の矢印あり
    prevArrow: '<div class="slick-prev"></div>',  // 矢印部分PreviewのHTMLを変更
    nextArrow: '<div class="slick-next"></div>',  // 矢印部分NextのHTMLを変更
    dots: true,  // 下部ドットナビゲーションの表示
    pauseOnFocus: false,  // フォーカスで一時停止を無効
    pauseOnHover: false,  // マウスホバーで一時停止を無効
    pauseOnDotsHover: false,  // ドットナビゲーションをマウスホバーで一時停止を無効
});

// スマホ用：スライダーをタッチしても止めずにスライドをさせたい場合
$('.slider').on('touchmove', function(event, slick, currentSlide, nextSlide){
    $('.slider').slick('slickPlay');
});