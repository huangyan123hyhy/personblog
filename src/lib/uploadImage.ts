import { supabase } from './supabase'

/**
 * Storage 桶名称。
 * 使用前请在 Supabase Dashboard → Storage → New bucket 创建名为 article-images 的桶，
 * 并在桶的 Policy 中设为 Public（或为 getPublicUrl 的链接配置公开读取策略）。
 */
const BUCKET = 'article-images'

/** 生成存储路径：时间戳 + 安全文件名，避免覆盖 */
function getStoragePath(file: File): string {
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
  return `${Date.now()}-${safeName}`
}

/**
 * 将图片上传到 Supabase Storage，返回公开访问 URL。
 * 使用前请在 Supabase Dashboard 创建桶 "article-images" 并设为 Public。
 */
export async function uploadImage(file: File): Promise<string> {
  const path = getStoragePath(file)
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return publicUrl
}
