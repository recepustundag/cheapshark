$(function () {
  getBatmanList();
});

function getBatmanList() {
  loading(true);
  $.ajax({
    method: 'GET',
    dataType: 'json',
    async: false,
    url: 'https://www.cheapshark.com/api/1.0/games?title=batman&exact=0',
  })
    .done(function (data) {
      if (data.length > 0) {
        var container = $('#batman-list');
        $.each(data, function (key, val) {
          priceList(val);
        });
      }
    })
    .fail(function () {});
}

function priceList(data) {
  $.ajax({
    method: 'GET',
    dataType: 'json',
    async: false,
    url: `https://www.cheapshark.com/api/1.0/games?id=${data.gameID}`,
  })
    .done(function (res) {
      if (typeof res.deals !== 'undefined') {
        var container = $('#batman-list'),
            arr = [],
            percent = null,
            arrSort = [];

        loading(false);

        res.deals.forEach(function (item, key) {
          percent = calculatePercent(item.retailPrice, item.price);
          arr.push({ key: key, val: percent });
        });

        arrSort = arr.sort(function (a, b) {
          return b.val - a.val;
        });

        if (arrSort[0].val !== '0') {
          container.append(cartTemplate(data, res.deals[arrSort[0].key], arrSort[0].val));
        }

      }
    })
    .fail(function () {});
}

function calculatePercent(oldPrice, discount) {
  var oldPrice = parseFloat(oldPrice),
    discount = parseFloat(discount);
  return Math.round(((oldPrice - discount) * 100) / oldPrice).toFixed(0);
}

function cartTemplate(data, price, percent) {
  return `
  <div class="flex justify-center">
    <div class="rounded-lg shadow-lg bg-white w-full">
      <img class="rounded-t-lg w-full object-cover h-48" src="${data.thumb}" alt="${data.external}" />
      <div class="py-6 px-4 flex flex-col h-44 justify-between">
        <h3 class="text-gray-600 text-lg font-medium mb-2">${data.external}</h3>
        <div class="flex items-center justify-between">
          <span class="text-lg text-black font-semibold">$${price.price}</span>
          <span class="flex flex-col items-end">
            <span class="text-md text-red-500 font-semibold priceold">$${price.retailPrice}</span>
            <span class="text-sm text-green-500 font-semibold">%${percent} indirim</span>
          </span>
        </div>
      </div>
    </div>
  </div>
  `;
}

function loading(param) {
  var elem = $('#loading');

  if (param) {
    elem.removeClass('hidden');
    return false;
  }

  elem.addClass('hidden');
}
