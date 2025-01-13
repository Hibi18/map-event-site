// マップコンテナの生成
var mapContainer = document.createElement('div');
mapContainer.id = 'map';
document.body.appendChild(mapContainer);

// banner
var banner = document.createElement('div');
banner.id = 'banner';
banner.className = 'hidden';
banner.innerHTML = '<p id="banner-content"></p>';
document.body.appendChild(banner);

// leaflet
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
document.head.appendChild(link);

// map.css
var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'map.css';
document.head.appendChild(link);

// leaflet
var script = document.createElement('script');
script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
script.onload = function() {
  // マップの初期状態
  var map = L.map('map', {
    minZoom: 4 //最小ズームを設定
  }).setView([35.613110, 140.113622], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    minZoom: 4 //最小ズームを設定
  }).addTo(map);

  // カスタムアイコンの定義
  var blueIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
  });

  var redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
  });

  // マーカーの設定
  var markers = [
    {
      position: [35.71891888, 139.91070346],
      content: '大洲防災公園',
      content_detail: '市川市にある緊急時に役立つ防災公園です。',
      suggestion: [
        '緊急時にカマドになるベンチを確認してみましょう',
        '多目的広場を訪れてみましょう'
      ],
      icon: blueIcon
    },
    {
      position: [35.6337679, 140.1168127],
      content: '千草台公民館',
      content_detail: '千葉市稲毛区にある避難所の1つです。',
      suggestion: [
        'ここまでの経路を確認してみましょう。',
        '近くにある他の避難所を探してみましょう。'
      ],
      icon: blueIcon
    },
    {
      position: [35.632896, 139.880394],
      content: 'ディズニーリゾート',
      content_detail: '東京ディズニーリゾートは夢の国として知られています。',
      suggestion: [
        'ディズニーリゾート内で安全な避難ルートを確認しましょう。',
        '防災設備の位置を確認してみましょう。'
      ],
      icon: redIcon
    },
    {
      position: [35.7636035, 140.3859353],
      content: '成田空港第一ターミナル',
      content_detail: '千葉県の空の玄関口です。',
      suggestion: [
        '避難経路の確認をしてみましょう',
        '消火器の場所を確認しましょう'
      ],
      icon: redIcon
    }
  ];

  // マーカーの追加とポップアップ設定
  var redPins = markers.filter(marker => marker.icon === redIcon).map(marker => {
    return L.marker(marker.position, { icon: marker.icon })
      .bindPopup(`
        <div>
          <h3>${marker.content}</h3>
          <p>${marker.content_detail}</p>
          <button onclick="handleCheckIn('${marker.content}', '${encodeURIComponent(JSON.stringify(marker.suggestion))}')">チェックイン</button>
        </div>
      `);
  });

  var bluePins = markers.filter(marker => marker.icon === blueIcon).map(marker => {
    return L.marker(marker.position, { icon: marker.icon })
      .bindPopup(`
        <div>
          <h3>${marker.content}</h3>
          <p>${marker.content_detail}</p>
          <button onclick="handleCheckIn('${marker.content}', '${encodeURIComponent(JSON.stringify(marker.suggestion))}')">チェックイン</button>
        </div>
      `);
  });

  var redLayer = L.layerGroup(redPins).addTo(map);
  var blueLayer = L.layerGroup(bluePins).addTo(map);

  // カスタムコントロールの追加
  var customControl = L.Control.extend({
    options: { position: 'topright' },

    onAdd: function(map) {
      var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.style.backgroundColor = 'white';
      container.style.padding = '10px';

      var redCheckbox = document.createElement('input');
      redCheckbox.type = 'checkbox';
      redCheckbox.id = 'redPins';
      redCheckbox.checked = true;

      var redLabel = document.createElement('label');
      redLabel.htmlFor = 'redPins';
      redLabel.innerText = '観光';

      var blueCheckbox = document.createElement('input');
      blueCheckbox.type = 'checkbox';
      blueCheckbox.id = 'bluePins';
      blueCheckbox.checked = true;

      var blueLabel = document.createElement('label');
      blueLabel.htmlFor = 'bluePins';
      blueLabel.innerText = '防災';

      container.appendChild(redCheckbox);
      container.appendChild(redLabel);
      container.appendChild(document.createElement('br'));
      container.appendChild(blueCheckbox);
      container.appendChild(blueLabel);

      L.DomEvent.disableClickPropagation(container);

      redCheckbox.addEventListener('change', function() {
        if (redCheckbox.checked) {
          map.addLayer(redLayer);
        } else {
          map.removeLayer(redLayer);
        }
      });

      blueCheckbox.addEventListener('change', function() {
        if (blueCheckbox.checked) {
          map.addLayer(blueLayer);
        } else {
          map.removeLayer(blueLayer);
        }
      });

      return container;
    }
  });

  map.addControl(new customControl());
};
document.head.appendChild(script);

// ランダムなバッジを選ぶ
function getRandomBadge() {
  const badgeIcons = [
    'images/badges/badge1.svg',
    'images/badges/badge2.svg',
    'images/badges/badge3.svg',
    'images/badges/badge4.svg'
  ];
  const randomIndex = Math.floor(Math.random() * badgeIcons.length);
  return badgeIcons[randomIndex];
}

// バッジを保存
function saveBadge(badge) {
  const badges = JSON.parse(localStorage.getItem('badges')) || [];
  badges.push(badge);
  localStorage.setItem('badges', JSON.stringify(badges));
}

// バッジを表示
function displayBadges() {
  const badgeContainer = document.getElementById('badge-container');
  badgeContainer.innerHTML = '';

  const badges = JSON.parse(localStorage.getItem('badges')) || [];

  if (badges.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'チェックインが完了するとバッジがもらえます';
    emptyMessage.style.color = '#aaa';
    emptyMessage.style.textAlign = 'center';
    badgeContainer.appendChild(emptyMessage);
  } else {
    badges.forEach(({ placeName, badgeIcon }) => {
      const badgeElement = document.createElement('div');
      badgeElement.className = 'badge';
      badgeElement.innerHTML = `<img src="${badgeIcon}" alt="バッジ" class="badge-image">`;
      badgeContainer.appendChild(badgeElement);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  displayBadges();
});

function handleCheckIn(placeName, encodedSuggestion) {
  const suggestion = JSON.parse(decodeURIComponent(encodedSuggestion));
  console.log('Check-in:', placeName, suggestion);

  const overlay = document.createElement('div');
  overlay.className = 'circle-overlay';
  document.body.appendChild(overlay);

  const mapCenter = document.getElementById('map').getBoundingClientRect();
  const circleX = mapCenter.left + mapCenter.width / 2;
  const circleY = mapCenter.top + mapCenter.height / 2;

  overlay.style.left = `${circleX}px`;
  overlay.style.top = `${circleY}px`;

  const messageBox = document.createElement('div');
  messageBox.className = 'message-box';

  const suggestionsHTML = suggestion
    .map((item, index) => `
      <div>
        <label>
          <input type="checkbox" class="suggestion-checkbox" data-index="${index}">
          ${item}
        </label>
      </div>
    `)
    .join('');

  messageBox.innerHTML = `
    <h2>${placeName} で防災チェックイン</h2>
    ${suggestionsHTML}
    <button onclick="closeCheckIn()">閉じる</button>
    <button id="completeButton" style="display: none;" onclick="completeCheckIn('${placeName}')">完了</button>
  `;
  document.body.appendChild(messageBox);

  setTimeout(() => {
    messageBox.style.display = 'block';
  }, 1000);

  const checkboxes = document.querySelectorAll('.suggestion-checkbox');
  const completeButton = document.getElementById('completeButton');

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const allChecked = Array.from(checkboxes).every(cb => cb.checked);
      completeButton.style.display = allChecked ? 'inline-block' : 'none';
    });
  });
}

function closeCheckIn() {
  document.querySelector('.circle-overlay').remove();
  document.querySelector('.message-box').remove();
}

function completeCheckIn(placeName) {
  const overlay = document.querySelector('.circle-overlay');
  overlay.style.transition = 'opacity 1s ease-out';
  overlay.style.opacity = '0';

  setTimeout(() => {
    overlay.remove();
    document.querySelector('.message-box').remove();

    const randomBadge = getRandomBadge();
    saveBadge({ placeName, badgeIcon: randomBadge });
    displayBadges();

    alert(`おめでとうございます！「${placeName}」のバッジを獲得しました！`);
  }, 1000);
}
