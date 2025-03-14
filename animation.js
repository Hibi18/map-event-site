// ヘッダーを動的に読み込むスクリプト
fetch('header.html')
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch header.html');
    }
    return response.text();
  })
  .then(data => {
    document.getElementById('header-container').innerHTML = data;
  })
  .catch(error => {
    console.error('Error loading header:', error);
  });

document.addEventListener("DOMContentLoaded", function() {
  console.log("schedule.js: IntersectionObserver 初期化開始");

  const fadeSections = document.querySelectorAll(".fade-in-section");
  const fadeImages = document.querySelectorAll(".intro-image");
  
  console.log(`fade-in-section の数: ${fadeSections.length}`);
  console.log(`fade-in 画像の数: ${fadeImages.length}`);

  if (fadeSections.length === 0) {
    console.warn("⚠ `fade-in-section` が見つかりません。HTML の読み込み順を確認してください。");
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`アニメーション開始: ${entry.target.id}`);

        // フェードインアニメーションの適用
        entry.target.classList.add("show");

        // 枠線アニメーションの適用（防災×観光）
        const titleBox = entry.target.querySelector(".all_border_title");
        if (titleBox) {
          console.log(`枠線アニメーション適用: ${titleBox}`);
          titleBox.classList.add("_anime");

          // 0.6秒後に `_disappear` クラスを追加し、線が流れながら消える
          setTimeout(() => {
            titleBox.classList.add("_disappear");
            console.log(`枠線アニメーション消去: ${titleBox}`);
            
            const titleText = entry.target.querySelector(".title");
            if (titleText) {
              titleText.classList.add("_text-appear");
              console.log(`マスクと文字のアニメーション開始: ${titleText}`);
            }   
          }, 600);
        }

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  fadeSections.forEach(section => observer.observe(section));
  fadeImages.forEach(image => observer.observe(image));

  // 画像専用のもの
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log(`画像アニメーション開始: ${entry.target.src}`);
        entry.target.classList.add("show"); // 画像に `show` クラスを追加
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  fadeImages.forEach(image => imageObserver.observe(image));

  // 最初から表示されている要素に `.show` & `._anime` を適用
  function isVisible(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom >= 0;
  }

  fadeSections.forEach(section => {
    if (isVisible(section)) {
      console.log(`最初から表示されているため、アニメーション適用: ${section.id}`);
      section.classList.add("show");

      // 枠線アニメーションの適用（最初から表示されている要素）
      const titleBox = section.querySelector(".all_border_title");
      if (titleBox) {
        titleBox.classList.add("_anime");

        // 0.6秒後に `_disappear` クラスを追加
        setTimeout(() => {
          titleBox.classList.add("_disappear");
          console.log(`枠線アニメーション消去: ${titleBox}`);
          
          const titleText = section.querySelector(".title");
          if (titleText) {
            titleText.classList.add("_text-appear");
            console.log(`マスクと文字のアニメーション開始: ${titleText}`);
          }
        }, 600);
      }
    }
  });

    const titleObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log(`「防災はなぜ必要？」のアニメーション開始: ${entry.target.textContent}`);
                entry.target.classList.add("active"); // クラスを追加してアニメーションを実行
                titleObserver.unobserve(entry.target); // 一度実行したら監視を解除
            }
        });
    }, { threshold: 0.5 }); // 50% 以上見えたらアニメーション開始

    // 「防災はなぜ必要？」のタイトル（h2）を監視対象にする
    const problemTitle = document.querySelector("#problem-solution .title-span");
    if (problemTitle) {
        titleObserver.observe(problemTitle);
    } else {
      console.error("❌ `#problem-solution .title-span` が見つかりません。");
    }

    // 下線のアニメーションを追加
    const underlineElements = document.querySelectorAll('.underline-before');

    const underlineObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log(`「${entry.target.textContent}」の下線アニメーション開始`);
          entry.target.classList.add("underline-after"); // クラスを追加して下線を表示
          underlineObserver.unobserve(entry.target); // 一度実行したら監視を解除
        }
      });
    }, { threshold: 0.5 }); // 50% 以上見えたらアニメーション開始
    underlineElements.forEach(element => underlineObserver.observe(element));
});
