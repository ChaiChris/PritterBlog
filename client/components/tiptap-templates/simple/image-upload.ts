import axios from "axios";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8081";

//axios 實例
export const axiosUploadsInstance = axios.create({
  baseURL: `${SERVER_URL}/api/blog/uploads`,
  withCredentials: true,
});

export const handleImageUpload = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  console.log("[Editor] handleImageUpload => 開始");
  if (!file) throw new Error("No file provided");
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds limit: ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    );
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axiosUploadsInstance.post(
      `${SERVER_URL}/api/blog/uploads/post/image`,
      formData,
      {
        signal: abortSignal,
        onUploadProgress: (e) => {
          if (e.total) {
            const progress = Math.round((e.loaded / e.total) * 100);
            onProgress?.({ progress });
          }
        },
      }
    );
    return res.data.data.url;
  } catch (err: Error | unknown) {
    if (
      axios.isCancel(err) ||
      (err instanceof Error && err.name === "CanceledError")
    ) {
      throw new Error("Upload cancelled");
    }
    if (axios.isAxiosError(err)) {
      throw new Error(err.response?.data?.error || "Upload failed");
    }
    throw new Error("Upload failed");
  }
};
