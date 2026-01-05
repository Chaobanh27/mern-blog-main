import { pick } from 'lodash'

export const pickUser = (user) => {
  if (!user) return {}
  return pick(user, ['_id', 'email', 'username', 'avatar', 'role', 'isActive', 'require2FA', 'createdAt', 'updatedAt', 'is2FAVerified'])
}

export const slugify = (str) => {
  str = str.toLowerCase().trim() // Convert to lowercase and trim leading/trailing white space

  // Normalize and remove accents (e.g., 'é' becomes 'e')
  str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  str = str.replace(/[^a-z0-9 -]/g, '') // Remove any non-alphanumeric characters, spaces, or hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace consecutive hyphens with a single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading and trailing hyphens

  return str
}

