import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  const protectedRoutes = ["/admin"];
  const noLoginRoutes = ["/signup", "/login"];

  // 檢查是否為需要保護的網址
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  const noLoginRoute = noLoginRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isProtectedRoute && !noLoginRoute) {
    return NextResponse.next();
  }

  if (noLoginRoute && !isProtectedRoute) {
    const token = request.cookies.get("token")?.value;

    if (token) {
      console.warn("[ middleware ] 已經找到Token");
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  try {
    // 前端 SERVER 端需從 cookies 取出 Token
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.warn("[ middleware ] 沒有找到Token");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 呼叫後端 API 驗證 token
    const verifyResponse = await fetch(`${SERVER_URL}/api/auth/verify/admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (verifyResponse.status === 401) {
      console.warn("[ middleware ] Token過期，清除Token");
      // 清除失效的 cookie token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    if (verifyResponse.status === 403) {
      // 沒有權限，拒絕進入保護網站
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    if (!verifyResponse.ok) {
      console.error(`[ middleware ] 驗證失敗： ${verifyResponse.status}`);
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // 其他異常
    console.error("[ middleware ] 錯誤:", error);
    // 發生錯誤時重定向到登入頁面
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
