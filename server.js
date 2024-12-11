import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

// Deno KV 初期化
const kv = await Deno.openKv();

async function getAllPosts() {
  const posts = [];
  for await (const entry of kv.list({ prefix: ["posts"] })) {
    posts.push(entry.value);
  }
  return posts;
}

async function addPost(text, image) {
  const id = crypto.randomUUID(); // 一意なIDを生成
  const post = { id, text, image };
  await kv.set(["posts", id], post);
  return post;
}

async function deletePost(id) {
  await kv.delete(["posts", id]);
}

const handler = async (req) => {
  const url = new URL(req.url);
  if (req.method === "GET" && url.pathname === "/posts") {
    // すべての投稿を取得
    const posts = await getAllPosts();
    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } else if (req.method === "POST" && url.pathname === "/posts") {
    // 新しい投稿を追加
    const body = await req.json();
    const post = await addPost(body.text, body.image);
    return new Response(JSON.stringify(post), {
      status: 201,
      headers: { "content-type": "application/json" },
    });
  } else if (req.method === "DELETE" && url.pathname.startsWith("/posts/")) {
    // 投稿を削除
    const id = url.pathname.split("/")[2];
    await deletePost(id);
    return new Response("Deleted", { status: 200 });
  }
  return new Response("Not Found", { status: 404 });
};

// サーバー起動
serve(handler);
