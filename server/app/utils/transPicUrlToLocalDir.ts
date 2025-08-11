import path from "path";

export default function transPicUrlToLocalDir(
  coverImageUrl: string,
  baseStaticDir = "public"
) {
  try {
    const urlObj = new URL(coverImageUrl);
    const pathname = urlObj.pathname;
    return path.join(__dirname, "..", "..", baseStaticDir, pathname);
  } catch (error) {
    console.error("[ getLocalFilePathFromUrl ]: URL 錯誤", error);
    return null;
  }
}
