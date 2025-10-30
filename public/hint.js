//モジュールを作らなかったが為の無駄な再定義
const bunsi = {
  0: [2, 0, 0, 0], //水素
  1: [0, 0, 0, 2], //酸素
  2: [0, 0, 2, 0], //窒素
  3: [0, 1, 0, 2], //二酸化炭素
  4: [1, 1, 1, 0], //シアン化水素
  5: [2, 0, 0, 1], //水
  6: [0, 0, 0, 3], //オゾン
  7: [2, 2, 0, 0], //アセチレン
  8: [2, 0, 0, 2], //過酸化水素
  9: [2, 1, 0, 1], //ホルムアルデヒド
  10: [3, 0, 1, 0], //アンモニア
  11: [4, 1, 0, 0], //メタン
  12: [4, 2, 0, 0], //エチレン
  13: [4, 0, 2, 0], //ヒドラシン
  14: [4, 1, 0, 1], //メタノール
};
//bunsiに対応した順で分子の名前を保存
const bunsiName = [
  "水素",
  "酸素",
  "窒素",
  "二酸化炭素",
  "シアン化水素",
  "水",
  "オゾン",
  "アセチレン",
  "過酸化水素",
  "ホルムアルデヒド",
  "アンモニア",
  "メタン",
  "エチレン",
  "ヒドラシン",
  "メタノール",
];

const formula = [
  "H2",
  "O2",
  "N2",
  "CO2",
  "HCN",
  "H2O",
  "O3",
  "C2H2",
  "H2O2",
  "HCHO",
  "NH3",
  "CH4",
  "C2H4",
  "H4N2",
  "CH3OH",
];

// img.loading = "eager";
//////////////////////////////////////////////////////////////////

const recipe = document.querySelector(".recipe");

for (let i = 0; i < Object.keys(bunsi).length; i++) {
  const clone = recipe.cloneNode(true);
  clone.querySelectorAll("span")[0].innerText = bunsi[i][0];
  if (bunsi[i][0] === 0) {
    clone.querySelectorAll("img")[0].classList.add("hide");
    clone.querySelectorAll("span")[0].classList.add("hide");
  }
  clone.querySelectorAll("span")[1].innerText = bunsi[i][1];
  if (bunsi[i][1] === 0) {
    clone.querySelectorAll("img")[1].classList.add("hide");
    clone.querySelectorAll("span")[1].classList.add("hide");
  }
  clone.querySelectorAll("span")[2].innerText = bunsi[i][2];
  if (bunsi[i][2] === 0) {
    clone.querySelectorAll("img")[2].classList.add("hide");
    clone.querySelectorAll("span")[2].classList.add("hide");
  }
  clone.querySelectorAll("span")[3].innerText = bunsi[i][3];
  if (bunsi[i][3] === 0) {
    clone.querySelectorAll("img")[3].classList.add("hide");
    clone.querySelectorAll("span")[3].classList.add("hide");
  }
  clone.querySelector(".bunsi").src = "hint_pngs/" + bunsiName[i] + ".png";
  document.body.appendChild(clone);
  clone.querySelector(".bunsiName").innerText = bunsiName[i];
  clone.querySelector(".bunsiFormula").innerText = formula[i];
}

recipe.classList.add("hide");
