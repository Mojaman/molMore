// サーバーと接続開始
const socket = io();
//カードオブジェクト
const Cards = {
  gensiCards: document.querySelectorAll(".gensiCard"),
  mine: {
    gensi: {
      card1: document.getElementById("gensiCard4"),
      card2: document.getElementById("gensiCard5"),
      card3: document.getElementById("gensiCard6"),
    },
    bunsi: {},
    tec: document.getElementById("tecCard2"),
    deck: document.getElementById("yama2"),
  },
  opponent: {
    gensi: {
      card1: document.getElementById("gensiCard1"),
      card2: document.getElementById("gensiCard2"),
      card3: document.getElementById("gensiCard3"),
    },
    bunsi: {},
    tec: document.getElementById("tecCard1"),
    deck: document.getElementById("yama1"),
  },
  public: {
    display: {
      card1: document.getElementById("displayCard1"),
      card2: document.getElementById("displayCard2"),
      card3: document.getElementById("displayCard3"),
      card4: document.getElementById("displayCard4"),
      card5: document.getElementById("displayCard5"),
      card6: document.getElementById("displayCard6"),
      card7: document.getElementById("displayCard7"),
      card8: document.getElementById("displayCard8"),
      card9: document.getElementById("displayCard9"),
      card10: document.getElementById("displayCard10"),
      card11: document.getElementById("displayCard11"),
      card12: document.getElementById("displayCard12"),
    },
  },
};
//システムオブジェクト
const system = {
  status: document.getElementById("status"),
  displayRoomId: document.getElementById("displayRoomId"),
  turn: document.getElementById("turn"),
  whatBunsi: document.getElementById("whatBunsi"),
  myPoint: document.getElementById("myPoint"),
  opponentPoint: document.getElementById("opponentPoint"),
  yourResult: document.getElementById("yourResult"),
  opponentResult: document.getElementById("opponentResult"),
  winner: document.getElementById("winner"),
  finishCondition: document.getElementById("finishCondition"),
  turnCounter: document.getElementById("turnCount"),
  inputId: document.getElementById("inputId"),
  yourRoomId: document.getElementById("yourRoomId"),
  inputPlayerName: document.getElementById("inputPlayerName"),
  displayFinishCondition: document.getElementById("displayFinishCondition"),
  hintBook: document.getElementById("hintBook"),
  overlay: document.getElementById("overlay"),
};
//ボタンオブジェクト
let Buttons = {
  reset: document.getElementById("reset"),
  mix: document.getElementById("mix"),
  homeButton: document.getElementById("homeButton"),
};
//プレイヤーの番号
let playerNumber;
// imgに原子をそのまま入れられるようにする変数
let imgName;
// 自分の分子カードを順に指定するための変数
let gensiSelect;
//roomIdを保存
let roomId;
//原子カードの選択をやりやすく
let publicNum;
//選択された元素を保存
let selectedGensi;
//ターンを保存
let turn;
//自分のポイントを保存
let myPoint = 0;
//相手のポイントを保存
let opponentPoint = 0;
//mix時に作った原子の番号を保存
let madeBunsi;
//ゲームの終了条件を保存(0:枚数で終了,1:ターンで終了,2:どっちでもいいよ)
let finishCondition = 0;
//現在何ターン目かを保存
let turnCount = 0;
//ボタンとかが押せる状況か
let isClickable = true;
//入力されたプレイヤーの名前を保存
let playerName = null;
//プレイヤー1の名前を保存
let p1Name = null;
//プレイヤー2の名前を保存
let p2Name = null;
//現在ヒントを表示中かどうか
let isHint = false;
//index側のpublic原子の配列を保存
let publicgensi = [];
//原子カードの配列
const gensiP = [
  "h",
  "h",
  "h",
  "h",
  "h",
  "h",
  "h",
  "h",
  "h",
  "c",
  "c",
  "c",
  "c",
  "c",
  "c",
  "c",
  "n",
  "n",
  "n",
  "o",
  "o",
  "o",
  "o",
  "o",
];
//テスト用
// const gensiP = ["n", "o", "o"];
//分子の組み合わせを保存 [hの数,cの数,nの数,oの数]
//hint.jsにも反映させるの忘れないように！
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
//clickGensiCardで使う
let gensiCardStatus = [0, 0, 0, 0, 0, 0];
//displayの元素を入れる配列
let display = [];
//場にある原子の個数をオブジェクトとして保存する
let deck = {};
//場にある原子の個数を配列として保存する
let deckInfo = [];
//displayの分子の組み合わせを保存
let displayInfo = [0, 0, 0, 0];
//元素全種のリスト
let genso = ["h", "c", "n", "o"];
//deckで作成可能な分子の番号を保存するリスト
let makeableBunsi = [];

//export {bunsi, bunsiName};　違うhtmlファイルにあるjsファイル同士ではimport/exportできない！！
////////////////////////////////////////////////////////////////////////////////////////

console.log("ケミクエ！");

Buttons.homeButton.classList.add("hide");

//socket.onでサーバーからのメッセージを受信
socket.on("player-joined", (num, Id) => {
  playerNumber = num;
  roomId = Id;
  console.log("部屋" + roomId + "にプレイヤー" + num + "として参加しました");
  system.status.innerText = "お前はプレイヤー" + num;
   setPlayerName();
  socket.emit("setPlayerName", roomId, playerName, num);
});

//高階関数つかってみた
function checkTurn(fn) {
  if (turn === playerNumber && isClickable && !(isHint)) {
    console.log("あなたのターンです");
    fn();
  }
}

function nextTurn() {
  socket.emit("reloadTurn", roomId);
  sendDisplayReset(); //line378
  countDeck(); //line488
}

function strayMatching() {
  //socket.emit("strayMatching", Math.random().toString(36).slice(-8));
   socket.emit("strayMatching", finishCondition);
  system.yourRoomId.classList.add("hide")
}

function matching() {
  socket.emit("matching", system.inputId.value);
  system.yourRoomId.classList.remove("hide")
}

socket.on("checkedMatching", (isJoin) => {
  if (isJoin) {
    joinroom();
  } else {
    makeroom();
  }
});

socket.on("makeStrayRoom", (num) => {
  socket.emit(
    "makeroom",
    Math.floor(Math.random() * 2) + 1,
    finishCondition,
    //#は文字数制限の数分
    "########" + num,
  );
});

function makeroom() {
  const randomTurn = Math.floor(Math.random() * 2) + 1;
  socket.emit("makeroom", randomTurn, finishCondition, setRoomId());
  console.log("部屋を作成します");
}

socket.on("unusableId", () => {
  alert("そのIDは既に使われています");
  showPage("home");
});


function joinroom() {
  // promptで変数に直接入力することができる
  roomId = system.inputId.value;
  //roomIdが入力されていればtrueになる
  if (roomId) {
    socket.emit("joinroom", roomId, finishCondition);
    console.log("部屋に参加します:", roomId);
  } else {
    alert("部屋IDを入力してください");
  }
}

socket.on("room-created", (roomId) => {
  console.log("部屋が作成されました。部屋ID:", roomId);
  showPage("waiting");
  document.getElementById("displayRoomId").innerText = roomId;
  //system.displayRoomId.innerText = roomId;
});

//プレイヤーが退出したときの処理
socket.on("player-left", () => {
  console.log("プレイヤーが退出しました");
  showPage("home");
  alert("対戦相手が退出しました");
});

socket.on("game-start", () => {
  console.log("ゲーム開始!");
  showPage("game");
  gameStart();
});

//どのページを表示するか(ホームならdisconect)
function showPage(pageId) {
  document.querySelectorAll(".page").forEach((page) => {
    page.classList.remove("active");
  });
  document.getElementById(pageId).classList.add("active");

  if (pageId === "home") {
    //socket.emit("disconnect", "playerleft");
    socket.disconnect();
    Buttons.homeButton.classList.add("hide");
    // Socketを再接続　これが必要！！！！
    setTimeout(() => {
      socket.connect();
    }, 100);
  }else{
    Buttons.homeButton.classList.remove("hide");
  }
}

const gameStart = () => {
  reset();
  reLoad();
};

//リセット！！
function reset() {
  document.querySelectorAll(".bunsiCard").forEach((el) => {
    el.classList.add("blank");
  });

  shuffle();

  myPoint = 0;

  opponentPoint = 0;

  turnCount = 0;

  setPlayerName();

  system.myPoint.innerText = myPoint;
  system.opponentPoint.innerText = opponentPoint;

//finishConditionの表示
const FCList = ["15ポイントで終了", "5ターンで終了",];
  system.displayFinishCondition.innerText = FCList[finishCondition];

  socket.emit("reloadTurn", roomId);
}

socket.on("nextTurn", (Turn, isCount) => {
  turn = Turn;
  console.log("ターン:" + turn);
  const names = [p1Name, p2Name]
  if(names[turn - 1] !== null){
    if(turn === 1){
      system.turn.innerText = p1Name + "のターン";
    }else if(turn === 2){
      system.turn.innerText = p2Name + "のターン";
    }
  }else{
    system.turn.innerText = "プレイヤー" + turn + "のターン";
  }
  console.log(playerName)
  

  if (isCount) {
    turnCount++;
    whetherFinishGame();
  }

  //ゲーム終了後はスキップしないように
  if (turn !== 0 && turnCount >= 1) {
    setTimeout(() => {
      whetherSkipTurn(); //
    }, 1000);
  }

  system.turnCounter.innerText = "現在ターン" + turnCount;

  Buttons.mix.classList.add("hide");

  // whetherSkipTurn();
});

//自分のカードをシャッフルする諸々の処理（ほぼリセット）
function shuffle() {
  gensiP.sort(() => Math.random() - 0.5);

  console.log(gensiP);

  // 3は自分の原子カードの数
  for (let i = 0; i < 3; i++) {
    imgName = "pngs/" + gensiP[i] + ".png";

    gensiSelect = "gensiCard" + (i + 4);

    document.getElementById(gensiSelect).src = imgName;
  }
  gensiCardStatus = [0, 0, 0, 0, 0, 0];

  document.querySelectorAll(".displayCard").forEach((el) => {
    el.classList.add("hide");
  });

  for (let i = 0; i < 6; i++) {
    document
      .getElementById("gensiCard" + (i + 1))
      .classList.remove("dark", "hide");
  }

  display = [];

  system.whatBunsi.innerText = " ";

  reLoad(); //line404

  sendDisplayReset(); //line378
}

//原子カードが押されたときの処理
//0:存在するだけ,1:一時的に選択された
const clickGensiCard = (num) => {
  console.log("clickedGensiCard" + num);
  console.log("ステータス" + gensiCardStatus);
  //player1を基準に1と2で変える！！
  if (playerNumber === 1) {
    publicNum = num - 1;

    if (gensiCardStatus[publicNum] === 0) {
      gensiCardStatus[publicNum] = 1;
      socket.emit("selectedGensiCard", roomId, 6 - publicNum);
    }
  } else {
    publicNum = 6 - num;

    if (gensiCardStatus[publicNum] === 0) {
      gensiCardStatus[publicNum] = 1;
      socket.emit("selectedGensiCard", roomId, 6 - publicNum);
    }
  }
  // console.log(gensiCardStatus);
  socket.emit("gensiStatus", roomId, gensiCardStatus);
};

//原子カードが押されたときの処理を実行するためのトリガー
Cards.gensiCards.forEach((card) => {
  const num = Number(card.dataset.num);
  card.addEventListener("pointerdown"
, () => {
    checkTurn(() => clickGensiCard(num));
  });
});

//checkTurn(clickGensiCard);

socket.on("gensiStatusReload", (gensiStatus) => {
  gensiCardStatus = gensiStatus;
  console.log("送信" + gensiCardStatus);
  for (let i = 0; i < 6; i++) {
    //player1を基準に1と2で変える！！
    if (playerNumber === 1) {
      if (gensiCardStatus[i] === 1) {
        document.getElementById("gensiCard" + (i + 1)).classList.add("dark");
      } else {
        document.getElementById("gensiCard" + (i + 1)).classList.remove("dark");
      }
    } else {
      if (gensiCardStatus[i] === 1) {
        document.getElementById("gensiCard" + (6 - i)).classList.add("dark");
      } else {
        document.getElementById("gensiCard" + (6 - i)).classList.remove("dark");
      }
    }
  }
});

socket.on("reloadDisplay", (selected) => {
  // 俺のコーディングがくそすぎるが故の無駄な条件分岐　反省
  if (selected === 1) {
    selectedGensi = publicgensi[2];
    console.log("selected:" + selectedGensi);
  } else if (selected === 3) {
    selectedGensi = publicgensi[0];
    console.log("selected:" + selectedGensi);
  } else {
    selectedGensi = publicgensi[selected - 1];
    console.log("selected:" + selectedGensi);
  }
  console.log(selected);

  displayReload(selectedGensi);
});

function displayReload(genso) {
  display.push(genso);
  console.log("display:", display);
  for (let i = 0; i < display.length; i++) {
    document.getElementById("displayCard" + (i + 1)).classList.add("hide");
  }
  if (display.length <= 5){
    for (let i = 0; i < display.length; i++) {
      document.getElementById("displayCard" + (i + 1)).src =
        "pngs/" + display[i] + ".png";
      document.getElementById("displayCard" + (i + 1)).classList.remove("hide");
    }
  }else{
    for (let i = 0; i < display.length; i++) {
      document.getElementById("displayCard" + (i + 6)).src =
        "pngs/" + display[i] + ".png";
      document.getElementById("displayCard" + (i + 6)).classList.remove("hide");
    }
  }
  

  checkDisplay();
}

function sendDisplayReset() {
  socket.emit("sendDisplayReset", roomId);
  // console.log("sendDisplayReset");
}

function displayResetable() {
  checkTurn(sendDisplayReset);
  console.log("ぱぶりっく" + publicgensi);
}

socket.on("displayReset", () => {
  console.log("displayReset");
  display = [];
  system.whatBunsi.innerText = " ";
  gensiCardStatus = [0, 0, 0, 0, 0, 0];
  for (let i = 0; i < 12; i++) {
    document.getElementById("displayCard" + (i + 1)).classList.add("hide");
  }

  for (let i = 0; i < 6; i++) {
    document.getElementById("gensiCard" + (i + 1)).classList.remove("dark");
  }
  countDeck(); //line488
});

//相手に自分のカードを送って、相手のを読み込むだけ
const reLoad = () => {
  socket.emit("sendGensiCard1", gensiP[0]);
  socket.emit("sendGensiCard2", gensiP[1]);
  socket.emit("sendGensiCard3", gensiP[2]);

  socket.emit("reLoad", playerNumber);
};

//リロードの処理,相手のカードを反映させる
socket.on("reLoadedNewGensi", (gensiInfo) => {
  publicgensi = Object.values(gensiInfo);
  if (playerNumber === 1) {
    Cards.opponent.gensi.card3.src = "pngs/" + gensiInfo.publicgensi4 + ".png";
    Cards.opponent.gensi.card2.src = "pngs/" + gensiInfo.publicgensi5 + ".png";
    Cards.opponent.gensi.card1.src = "pngs/" + gensiInfo.publicgensi6 + ".png";

    Cards.mine.gensi.card1.src = "pngs/" + gensiInfo.publicgensi1 + ".png";
    Cards.mine.gensi.card2.src = "pngs/" + gensiInfo.publicgensi2 + ".png";
    Cards.mine.gensi.card3.src = "pngs/" + gensiInfo.publicgensi3 + ".png";
  } else if (playerNumber === 2) {
    Cards.opponent.gensi.card3.src = "pngs/" + gensiInfo.publicgensi1 + ".png";
    Cards.opponent.gensi.card2.src = "pngs/" + gensiInfo.publicgensi2 + ".png";
    Cards.opponent.gensi.card1.src = "pngs/" + gensiInfo.publicgensi3 + ".png";

    Cards.mine.gensi.card1.src = "pngs/" + gensiInfo.publicgensi4 + ".png";
    Cards.mine.gensi.card2.src = "pngs/" + gensiInfo.publicgensi5 + ".png";
    Cards.mine.gensi.card3.src = "pngs/" + gensiInfo.publicgensi6 + ".png";
  }
});

function copy() {
  navigator.clipboard.writeText(roomId);
}

//なんの分子が作れるか判断する
function checkDisplay() {
  displayInfo = [0, 0, 0, 0];
  for (let j = 0; j < genso.length; j++) {
    let temporary = 0;
    for (let i = 0; i < display.length; i++) {
      if (display[i] === genso[j]) {
        temporary += 1;
      }
    }
    displayInfo[j] = temporary;
  }

  console.log("info" + displayInfo);

  whatBunsi(displayInfo);
}

//条件式のJSONがちと分からん
function whatBunsi(list) {
  // window.alert("分子" + list + "が作れます！");
  let found = false;
  for (let i = 0; i < Object.keys(bunsi).length; i++) {
    if (JSON.stringify(list) === JSON.stringify(bunsi[i])) {
      socket.emit("emitWhatBunsi", roomId, i);
      //window.alert(roomId + `してるはず`);
      found = true;
      break;
    }
  }
  if (!found) {
    socket.emit("emitWhatBunsi", roomId, -1);
  }
}

socket.on("reLoadWhatBunsi", (num) => {
  //window.alert(`socket.on成功`);
  if (num === -1) {
    //window.alert(`ifは-1`);
    system.whatBunsi.innerText = " ";
    Buttons.mix.classList.add("hide");
  } else {
    //window.alert(`ifはelse`);
    system.whatBunsi.innerText = "調合可能:" + bunsiName[num];
    madeBunsi = num;
    Buttons.mix.classList.remove("hide");
  }
});

//ターンが回ってきたとき実行する
function countDeck() {
  deck = {};
  deckInfo = [0, 0, 0, 0];
  for (const item of publicgensi) {
    deck[item] = (deck[item] || 0) + 1;
  }

  for (let i = 0; i < genso.length; i++) {
    deckInfo[i] = deck[genso[i]] || 0;
  }

  isMoregensi(deckInfo); //line503
}

//相手のと自分の一枚ずつ使う条件が足りてない！！！
function isMoregensi(deckInfo) {
  makeableBunsi = [];
  for (let i = 0; i < Object.keys(bunsi).length; i++) {
    if (
      deckInfo[0] >= bunsi[i][0] &&
      deckInfo[1] >= bunsi[i][1] &&
      deckInfo[2] >= bunsi[i][2] &&
      deckInfo[3] >= bunsi[i][3]
    ) {
      console.log(bunsiName[i] + "が作れます！");
      makeableBunsi.push(i);
    }
  }
  console.log(makeableBunsi);
}

//countDeckを実行した後に実行する
function whetherSkipTurn() {
  setTimeout(() => {
    if (makeableBunsi.length === 0 || whetherSkipTurn2()) {
      socket.emit(
        "alert",
        roomId,
        "分子が調合できないためターンをスキップします",
      );
      shuffle(); //line259
      setTimeout(() => {
        nextTurn();
      }, 3000);
      // nextTurn(); //line176
    }
  }, 1000);
}

function whetherSkipTurn2() {
  const p1 = [0, 0, 0, 0];
  const p2 = [0, 0, 0, 0];
  // p1.push(...publicgensi.slice(0, 3));
  // p2.push(...publicgensi.slice(3, 6));
  for (let i = 0; i < publicgensi.length / 2; i++) {
    if (publicgensi[i] === "h") {
      p1[0]++;
    }
    if (publicgensi[i] === "c") {
      p1[1]++;
    }
    if (publicgensi[i] === "n") {
      p1[2]++;
    }
    if (publicgensi[i] === "o") {
      p1[3]++;
    }
  }
  for (let i = publicgensi.length / 2; i < publicgensi.length; i++) {
    if (publicgensi[i] === "h") {
      p2[0]++;
    }
    if (publicgensi[i] === "c") {
      p2[1]++;
    }
    if (publicgensi[i] === "n") {
      p2[2]++;
    }
    if (publicgensi[i] === "o") {
      p2[3]++;
    }
  }

  for (let i = 0; i < makeableBunsi.length; i++) {
    //h, c, n, oを順に調べるための
    let gensoCount = 0;
    //元素が4種だから配列の長さも4以下(使う元素の番号)[0]水素
    let gensoUsage = [];
    bunsi[makeableBunsi[i]].forEach((element) => {
      if (element > 0) {
        gensoUsage.push(gensoCount);
      }
      gensoCount++;
    });
    let temporary = 0;
    for (let j = 0; j < gensoUsage.length; j++) {
      if (p1[gensoUsage[j]] < 1) {
        temporary++;
      }
    }
    let temporary2 = 0;
    for (let j = 0; j < gensoUsage.length; j++) {
      if (p2[gensoUsage[j]] < 1) {
        temporary2++;
      }
    }

    //temporaryとlengthが同じなら一つも作れない
    // temporary も temporary2 も gensoUsage.length ではない場合にここが実行される
    if (
      !(temporary === gensoUsage.length || temporary2 === gensoUsage.length)
    ) {
      return false;
    }
  }
  return true;
}

socket.on("sentAlert", (message) => {
  window.alert(message);
});

Buttons.mix.addEventListener("click", () => {
  let condition1 =
    gensiCardStatus[0] == 1 ||
    gensiCardStatus[1] == 1 ||
    gensiCardStatus[2] == 1;
  let condition2 =
    gensiCardStatus[3] == 1 ||
    gensiCardStatus[4] == 1 ||
    gensiCardStatus[5] == 1;
  if (condition1 && condition2) {
    checkTurn(sendMix);
  } else {
    window.alert("相手のカードと自分のカードを最低Ⅰ枚ずつは使いましょう");
  }
});

function sendMix() {
  gensiP.sort(() => Math.random() - 0.5);
  socket.emit("sendMix", roomId, gensiP);
  mix();
}

socket.on("mix", () => {
  const visibleCards = [];
  animeMix(visibleCards, false, 0);
});

function mix() {
  console.log("つくれる");
  const visibleCards = [];
  let pointCounter = 0;

  isClickable = false;

  for (let i = 0; i < genso.length; i++) {
    pointCounter += bunsi[madeBunsi][i];
  }

  //遅延の関係でaddPointはこの中に
  animeMix(visibleCards, true, pointCounter);

  //既存の処理
  let numAsist;
  let card;
  let blank = [];
  // gensiP.sort(() => Math.random() - 0.5);
  for (let i = 0; i < gensiCardStatus.length; i++) {
    if (gensiCardStatus[i] === 1) {
      if (playerNumber === 1) {
        numAsist = i + 1;
      } else {
        numAsist = 6 - i;
      }

      card = document.getElementById("gensiCard" + numAsist);
      card.classList.add("hide");
      card.classList.remove("dark");
      // imgName = "pngs/" + gensiP[i] + ".png";

      // card.src = imgName;
      blank.push(i);
    }
  }
  socket.emit("socketReloadBlank", roomId, blank);

  // socket.emit("reLoad", playerNumber);
  gensiCardStatus = [0, 0, 0, 0, 0, 0];
}

//土台がカスすぎるが故のクソ条件分岐関数
socket.on("reloadBlank", (blank) => {
  for (let i = 0; i < blank.length; i++) {
    if (playerNumber === 1) {
      if (blank[i] === 3) {
        socket.emit("sendGensiCard1", gensiP[i]);
      }
      if (blank[i] === 4) {
        socket.emit("sendGensiCard2", gensiP[i]);
      }

      if (blank[i] === 5) {
        socket.emit("sendGensiCard3", gensiP[i]);
      }
    } else {
      if (blank[i] === 0) {
        socket.emit("sendGensiCard3", gensiP[i]);
      }
      if (blank[i] === 1) {
        socket.emit("sendGensiCard2", gensiP[i]);
      }
      if (blank[i] === 2) {
        socket.emit("sendGensiCard1", gensiP[i]);
      }
    }
  }
  socket.emit("reLoad", playerNumber);
});

//調合する時のアニメーションを実行する
function animeMix(visibleCards, isNextTurn, point) {
  // 表示中のdisplayCardを中央に集合 ちょっと仕組みわかんない
  for (let i = 0; i < display.length; i++) {
    let card;
    if (display.length <= 5){
     card = document.getElementById("displayCard" + (i + 1));
    }else{
     card = document.getElementById("displayCard" + (i + 6));
    }
  
    if (!card.classList.contains("hide")) {
      visibleCards.push(card);
      setTimeout(() => {
        card.style.transition = "transform 0.7s ease-out";
        card.style.transform = `translate(${150 - i * 70}px, 50px) scale(1)`;
      }, i * 150);
    }
  }

  //カードが集合した後（2秒後）に明るくするアニメーション開始
  setTimeout(() => {
    visibleCards.forEach((card, index) => {
      // 最初は暗くする
      card.style.filter = "brightness(90%)";

      // 順番に明るくしていく
      setTimeout(() => {
        card.style.transition = "filter 0.5s ease-out";
        card.style.filter = "brightness(150%) saturate(1.3)"; // 少し明るく、彩度もアップ
      }, index * 100); // 100msずつ遅延して明るくする
    });
  }, 1000); // カード集合アニメーション完了を待つ

  // Step 3: さらに輝きエフェクトを追加（オプション）
  setTimeout(() => {
    visibleCards.forEach((card, index) => {
      setTimeout(() => {
        // 一瞬強く光らせる
        card.style.filter =
          "brightness(200%) saturate(1.5) drop-shadow(0 0 10px gold)";

        // その後通常の明るさに戻す
        // setTimeout(() => {
        //   card.style.filter = 'brightness(100%)';
        // }, 500);
      }, index * 100);
    });
  }, 2000);

  //最後にリセットとポイント
  setTimeout(() => {
    display = [];
    visibleCards.forEach((card) => {
      card.style.transform = "";
      card.style.filter = "";
      card.classList.add("hide");
    });
    system.whatBunsi.innerText = " ";
    for (let i = 0; i < gensiCardStatus.length; i++) {
      document
        .getElementById("gensiCard" + (i + 1))
        .classList.remove("hide", "dark");
    }

    socket.emit("socketAddPoint", roomId, point, playerNumber);

    isClickable = true;

    if (isNextTurn) {
      nextTurn();
    }
  }, 2500);
}

socket.on("addPoint", (point, num) => {
  if (num === playerNumber) {
    myPoint = point;
  } else {
    opponentPoint = point;
  }
  system.myPoint.innerText = myPoint;
  system.opponentPoint.innerText = opponentPoint;
});

function sendFinishGame() {
  socket.emit("socketFinishGame", roomId);
}

socket.on("finishGame", () => {
  console.log("ゲーム終了!");
  turn = 0;
  showPage("result");
  //document.getElementById("yourResult").innerText = "お前:" + myPoint + "ポイント";
  //yourResult: document.getElementById("yourResult")
  system.yourResult.innerText = "お前:" + myPoint + "ポイント";
  system.opponentResult.innerText = "相手:" + opponentPoint + "ポイント";
  if (myPoint > opponentPoint) {
    system.winner.innerText = "勝者はお前だ！";
  } else if (myPoint < opponentPoint) {
    system.winner.innerText = "お前の負け！";
  } else {
    system.winner.innerText = "引き分け！";
  }
});

//今選ばれてるのと違うのが選ばれたときに起爆
system.finishCondition.onchange = function () {
  //alert(this.value);
  switch (this.value) {
    case "枚数で終了":
      finishCondition = 0;
      break;
    case "ターンで終了":
      finishCondition = 1;
      break;
    case "どっちでもいいよ":
      finishCondition = 2;
  }
};

socket.on("sendFinishCondition", (condition) => {
  finishCondition = condition;
  console.log("finishCondition:" + finishCondition);
  //alert(finishCondition);
  const FCList = ["15ポイントで終了", "5ターンで終了",];
  system.displayFinishCondition.innerText = FCList[finishCondition];
});

function whetherFinishGame() {
  if (finishCondition === 0) {
    if (myPoint >= 15 || opponentPoint >= 15) {
      sendFinishGame();
    }
  }
  if (finishCondition === 1) {
    if (turnCount >= 5) {
      sendFinishGame();
    }
  }
}

function onemore() {
  socket.emit("isOnemore", roomId, playerNumber);
  system.yourRoomId.classList.add("hide")
  showPage("waiting");
}

socket.on("onemoreGame", () => {
  gameStart();
  showPage("game");
});

function setRoomId() {
  const setId = system.inputId.value;
  if (setId.length >= 3 && setId.length <= 8) {
    return setId;
  } else {
    return null;
  }
}

function setPlayerName() {
  if(system.inputPlayerName.value.length > 0){
    playerName = system.inputPlayerName.value;
  }else{
    playerName = null;
  }
  
};

socket.on("reloadPlayerName", (names) => {
  p1Name = names[1];
  p2Name = names[2];
  
});

function showHint() {
   isHint = true;
  document.getElementById("overlay").style.display = "flex";
}

system.overlay.addEventListener("click", (e) => {
  if (e.target.id === "overlay") {
    e.currentTarget.style.display = "none";
  }
});




function debug() {
  //publicgensi = ["n", "n", "n", "o", "o", "o"];
  //sendFinishGame();
  //alert(finishCondition);
  //whetherFinishGame();
  //reset();
  //console.log(finishCondition);
  //console.log(Math.random() * 3 + 1);
 socket.emit("debug", roomId);
}
