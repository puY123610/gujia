export function requireLogin(): boolean {
  const token = uni.getStorageSync('token')
  if (token) return true

  uni.showModal({
    title: '需要登录',
    content: '登录后可以继续使用该功能',
    confirmText: '去登录',
    cancelText: '先看看'
  })

  return false
}
