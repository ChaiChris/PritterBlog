/**
 * 將任意字串轉成穩定的顏色
 * @param input - 任意字串（如使用者名稱、ID）
 * @param saturation - 色彩飽和度 (0-100%)
 * @param lightness - 亮度 (0-100%)
 * @returns HSL 顏色字串
 */

export function stringToColor(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 50%, 80%)`;
}
