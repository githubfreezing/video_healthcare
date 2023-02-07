function scroll_control(event) {
    event.preventDefault();
}

function no_scroll() {
    // PCでのスクロール禁止
    document.addEventListener("mousewheel", scroll_control, { passive: false });
    // スマホでのタッチ操作でのスクロール禁止
    document.addEventListener("touchmove", scroll_control, { passive: false });
}

// スクロール禁止解除
function return_scroll() {
    // PCでのスクロール禁止解除
    document.removeEventListener("mousewheel", scroll_control, { passive: false });
    // スマホでのタッチ操作でのスクロール禁止解除
    document.removeEventListener('touchmove', scroll_control, { passive: false });
}

$(function() {
    setTimeout(function(){
        no_scroll();
        $('.start p').fadeIn(3200);
    }, 500);  // 0.5秒後にロゴをフェードイン！
    setTimeout(function(){
        $('.start').fadeOut(1000);
        return_scroll();
    }, 3000);  // 3.0秒後にロゴ含め真っ白背景をフェードアウト！
});