// lib/api.ts
import { PostCard } from "@/types/post";
import { RegisterInput } from "@/types/auth";

export async function fetchPosts(): Promise<PostCard[]> {
  // 模擬
  return [
    {
      id: 1,
      title: "福岡旅遊攻略｜吃喝玩樂全主題分類總整理",
      content:
        "位於日本九州北部的福岡不只是以美食天堂聞名，也因為必去的各大景點集中又距離近，交通也很便利，所以近期許多人也把它當作獨旅或是日本自由行的首選之一！如果想要來一趟輕鬆愜意的快閃日本行或是首次挑戰一個人出國，那麼福岡你絕對可以當作入門首選。\n" +
        "\n" +
        "本篇福岡旅遊攻略為大家一次彙整了福岡景點、交通、美食、購物、住宿、票券、跟團行程，連必訪的賞楓、賞櫻勝地也一起推薦給你！福岡不管是自己安排自由行或是帶著全家大小來玩都很適合，帶著這篇超完整的福岡旅遊攻略就出發吧！\n" +
        "原網址：福岡旅遊攻略｜吃喝玩樂全主題分類總整理｜FunTime旅遊比價\n" +
        "https://www.funtime.com.tw/blog/funtime/fukuoka-guide-page",
      photoUrl:
        "https://www.funtime.com.tw/blog/wp-content/uploads/2025/07/fukuoka-guide-page-200x200.png",
      createdAt: "2025-07-27",
      author: {
        id: 100,
        name: "Chris Wood",
        avatarUrl: "https://github.com/shadcn.png",
      },
    },
    {
      id: 2,
      title: "福岡旅遊攻略｜吃喝玩樂全主題分類總整理",
      content:
        "位於日本九州北部的福岡不只是以美食天堂聞名，也因為必去的各大景點集中又距離近，交通也很便利，所以近期許多人也把它當作獨旅或是日本自由行的首選之一！如果想要來一趟輕鬆愜意的快閃日本行或是首次挑戰一個人出國，那麼福岡你絕對可以當作入門首選。\n" +
        "\n" +
        "本篇福岡旅遊攻略為大家一次彙整了福岡景點、交通、美食、購物、住宿、票券、跟團行程，連必訪的賞楓、賞櫻勝地也一起推薦給你！福岡不管是自己安排自由行或是帶著全家大小來玩都很適合，帶著這篇超完整的福岡旅遊攻略就出發吧！\n" +
        "原網址：福岡旅遊攻略｜吃喝玩樂全主題分類總整理｜FunTime旅遊比價\n" +
        "https://www.funtime.com.tw/blog/funtime/fukuoka-guide-page",
      photoUrl:
        "https://www.funtime.com.tw/blog/wp-content/uploads/2025/07/fukuoka-guide-page-200x200.png",
      createdAt: "2025-07-27",
      author: {
        id: 100,
        name: "Chris Wood",
        avatarUrl: "https://github.com/shadcn.png",
      },
    },
    {
      id: 3,
      title: "福岡旅遊攻略｜吃喝玩樂全主題分類總整理",
      content:
        "位於日本九州北部的福岡不只是以美食天堂聞名，也因為必去的各大景點集中又距離近，交通也很便利，所以近期許多人也把它當作獨旅或是日本自由行的首選之一！如果想要來一趟輕鬆愜意的快閃日本行或是首次挑戰一個人出國，那麼福岡你絕對可以當作入門首選。\n" +
        "\n" +
        "本篇福岡旅遊攻略為大家一次彙整了福岡景點、交通、美食、購物、住宿、票券、跟團行程，連必訪的賞楓、賞櫻勝地也一起推薦給你！福岡不管是自己安排自由行或是帶著全家大小來玩都很適合，帶著這篇超完整的福岡旅遊攻略就出發吧！\n" +
        "原網址：福岡旅遊攻略｜吃喝玩樂全主題分類總整理｜FunTime旅遊比價\n" +
        "https://www.funtime.com.tw/blog/funtime/fukuoka-guide-page",
      photoUrl:
        "https://www.funtime.com.tw/blog/wp-content/uploads/2025/07/fukuoka-guide-page-200x200.png",
      createdAt: "2025-07-27",
      author: {
        id: 100,
        name: "Chris Wood",
        avatarUrl: "https://github.com/shadcn.png",
      },
    },
    {
      id: 4,
      title: "福岡旅遊攻略｜吃喝玩樂全主題分類總整理",
      content:
        "位於日本九州北部的福岡不只是以美食天堂聞名，也因為必去的各大景點集中又距離近，交通也很便利，所以近期許多人也把它當作獨旅或是日本自由行的首選之一！如果想要來一趟輕鬆愜意的快閃日本行或是首次挑戰一個人出國，那麼福岡你絕對可以當作入門首選。\n" +
        "\n" +
        "本篇福岡旅遊攻略為大家一次彙整了福岡景點、交通、美食、購物、住宿、票券、跟團行程，連必訪的賞楓、賞櫻勝地也一起推薦給你！福岡不管是自己安排自由行或是帶著全家大小來玩都很適合，帶著這篇超完整的福岡旅遊攻略就出發吧！\n" +
        "原網址：福岡旅遊攻略｜吃喝玩樂全主題分類總整理｜FunTime旅遊比價\n" +
        "https://www.funtime.com.tw/blog/funtime/fukuoka-guide-page",
      photoUrl:
        "https://www.funtime.com.tw/blog/wp-content/uploads/2025/07/fukuoka-guide-page-200x200.png",
      createdAt: "2025-07-27",
      author: {
        id: 100,
        name: "Chris Wood",
        avatarUrl: "https://github.com/shadcn.png",
      },
    },
  ];
}

export async function registerUser(input: RegisterInput) {
  const result = await fetch("http://localhost:3001/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!result.ok) {
    const error = await result.json();
    throw new Error("registerUser: ERROR ", error);
  }

  return result;
}
