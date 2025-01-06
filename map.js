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
  var map = L.map('map').setView([35.682839, 139.759455], 14);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // マーカーの設定
  var markers = [
    {
      position: [35.71366835962503, 139.77613130188482],
      content: '上野駅',
      content_detail: '上野駅は東京都台東区にある駅です。',
      suggestion: '上野駅の最寄りの避難所は確認しましたか？',
    },
    {
      position: [35.612805966761215, 140.11372769961613],
      content: '千葉駅',
      content_detail: '千葉駅は、千葉県千葉市中央区新千葉一丁目にあります。',
      suggestion: '千葉駅の消火器などの防災設備を探してみましょう。',
    }
  ];

  // マーカーの追加とポップアップ設定
  markers.forEach(marker => {
    const popupContent = `
      <div>
        <h3>${marker.content}</h3>
        <p>${marker.content_detail}</p>
        <button onclick="handleCheckIn('${marker.content}', '${marker.suggestion}')">チェックイン</button>
      </div>
    `;

    const mapMarker = L.marker(marker.position).addTo(map)
      .bindPopup(popupContent);
  });
};
document.head.appendChild(script);

// 「チェックイン」ボタンの動作
function handleCheckIn(placeName, suggestion) {
    // 同心円アニメーションを作成
    const overlay = document.createElement('div');
    overlay.className = 'circle-overlay';
    document.body.appendChild(overlay);

    // 中心をピンの座標に合わせて計算
    const mapCenter = document.getElementById('map').getBoundingClientRect();
    const mapWidth = mapCenter.width;
    const mapHeight = mapCenter.height;
    const circleX = mapCenter.left + mapWidth / 2; // 中心のX座標
    const circleY = mapCenter.top + mapHeight / 2; // 中心のY座標

    overlay.style.left = `${circleX}px`;
    overlay.style.top = `${circleY}px`;

    // メッセージ表示の準備
    const messageBox = document.createElement('div');
    messageBox.className = 'message-box';
    messageBox.innerHTML = `
        <h2>${placeName} で防災チェックイン</h2>
        <div class="suggestion-box">
            <label>
                <input type="checkbox" class="suggestion-checkbox">
                <span class="suggestion-text">${suggestion}</span>
            </label>
        </div>
        <button onclick="closeCheckIn()">閉じる</button>
    `;
    document.body.appendChild(messageBox);

    // アニメーション開始後1秒でメッセージを表示
    setTimeout(() => {
        messageBox.style.display = 'block'; // メッセージを表示
    }, 1000); // 1秒後
}

function closeCheckIn() {
    // チェックイン画面を閉じる
    document.querySelector('.circle-overlay').remove();
    document.querySelector('.message-box').remove();
}
