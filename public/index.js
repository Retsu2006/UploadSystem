document.getElementById("postForm").addEventListener("submit", function (event) {
    event.preventDefault();
  
    // テキスト入力と画像ファイル取得
    const textInput = document.getElementById("textInput").value;
    const imageInput = document.getElementById("imageInput").files[0];
  
    // 投稿エリアを取得
    const postsDiv = document.getElementById("posts");
  
    // 新しい投稿要素を作成
    const postDiv = document.createElement("div");
    postDiv.className = "post";
  
    // 削除ボタンを作成
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", function () {
      postsDiv.removeChild(postDiv); // この投稿を削除
    });
  
    // テキスト追加
    const textParagraph = document.createElement("p");
    textParagraph.textContent = textInput;
    postDiv.appendChild(textParagraph);
  
    // 画像追加（ある場合）
    if (imageInput) {
      const reader = new FileReader();
      reader.onload = function () {
        const img = document.createElement("img");
        img.src = reader.result;
        postDiv.appendChild(img);
      };
      reader.readAsDataURL(imageInput);
    }
  
    // 削除ボタンを投稿に追加
    postDiv.appendChild(deleteButton);
  
    // 投稿エリアに追加
    postsDiv.prepend(postDiv);
  
    // フォームリセット
    document.getElementById("postForm").reset();
  });
  