var partnerLeftArrow = document.querySelector('.left-arrow');
var partnerRightArrow = document.querySelector('.right-arrow');
var partnersBlock = document.querySelector('.partners-block');

partnerLeftArrow.onclick = function () {
    var firstPartner = document.querySelectorAll('.partnerItem')[0];
    partnersBlock.appendChild(firstPartner);
};

partnerRightArrow.onclick = function () {
    var lastPartner = document.querySelectorAll('.partnerItem')[3];
    partnersBlock.insertBefore(lastPartner, partnersBlock.firstChild);
};
