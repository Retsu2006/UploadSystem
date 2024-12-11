const postsDiv = document.getElementById("posts");

// サーバーから投稿を取得して表示
async function fetchPosts() {
  const response = await fetch("/posts");
  const posts = await response.json();
  postsDiv.innerHTML = ""; // 一旦クリア
  posts.forEach((post) => {
    displayPost(post);
  });
}

// 投稿を表示
function displayPost(post) {
  const postDiv = document.createElement("div");
  postDiv.className = "post";
  postDiv.dataset.id = post.id;

  const textParagraph = document.createElement("p");
  textParagraph.textContent = post.text;
  postDiv.appendChild(textParagraph);

  if (post.image) {
    const img = document.createElement("img");
    img.src = post.image;
    postDiv.appendChild(img);
  }

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "削除";
  deleteButton.className = "delete-btn";
  deleteButton.addEventListener("click", async () => {
    await fetch(`/posts/${post.id}`, { method: "DELETE" });
    fetchPosts(); // 更新
  });

  postDiv.appendChild(deleteButton);
  postsDiv.prepend(postDiv);
}

// 新しい投稿を追加
document.getElementById("postForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const textInput = document.getElementById("textInput").value;
  const imageInput = document.getElementById("imageInput").files[0];

  let imageBase64 = null;
  if (imageInput) {
    const reader = new FileReader();
    reader.onload = async () => {
      imageBase64 = reader.result;
      await postNewContent(textInput, imageBase64);
    };
    reader.readAsDataURL(imageInput);
  } else {
    await postNewContent(textInput, null);
  }
});

// 新しい投稿をサーバーに送信
async function postNewContent(text, image) {
  await fetch("/posts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text, image }),
  });
  fetchPosts(); // 更新
}

// 初期データをロード
fetchPosts();
