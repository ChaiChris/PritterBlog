import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const SERVER_URL =
    process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";
  const protectedRoutes = ["/admin"];

  // 檢查是否為需要保護的網址
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // 從 cookies 中獲取 token
    const token = request.cookies.get("token")?.value;

    if (!token) {
      console.warn("No token found, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 驗證 token
    const verifyResponse = await fetch(`${SERVER_URL}/api/auth/verify/admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Cookie: request.headers.get("cookie") || "",
      },
    });

    if (verifyResponse.status === 401) {
      console.warn("Token expired or invalid, redirecting to login");
      // 清除無效的 cookie token
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    if (verifyResponse.status === 403) {
      console.warn("Access forbidden, redirecting to not-found");
      return NextResponse.redirect(new URL("/not-found", request.url));
    }

    if (!verifyResponse.ok) {
      console.error(
        `Verification failed with status: ${verifyResponse.status}`
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    // 處理網路錯誤或其他異常
    if (error instanceof Error) {
      if (error.name === "TimeoutError") {
        console.error("Verification request timed out");
      } else if (error.name === "TypeError") {
        console.error("Network error during verification:", error.message);
      } else {
        console.error("Verification failed:", error.message);
      }
    } else {
      console.error("Unknown verification error:", error);
    }

    // 發生錯誤時重定向到登入頁面
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
