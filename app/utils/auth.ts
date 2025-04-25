// Simple authentication utility without jsonwebtoken dependency
export function generateToken(length = 32): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function validatePassword(password: string, validPasswords: string[]): boolean {
  return validPasswords.includes(password)
}

export function generateHash(input: string): string {
  // Simple hash function for demonstration purposes
  // In production, use a proper hashing library
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString(16)
}
