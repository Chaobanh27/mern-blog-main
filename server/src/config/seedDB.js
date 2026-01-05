import userModel from '~/models/userModel'
import roleModel from '~/models/roleModel'
import bcrypt from 'bcryptjs'
import { env } from './environment'
import categoryModel from '~/models/categoryModel'
import tagModel from '~/models/tagModel'
import { slugify } from '~/utils/formatters'

const seedDB = async () => {
  const roleCount = await roleModel.countDocuments()
  if (roleCount === 0) {
    await roleModel.insertMany([
      {
        name: 'user',
        permissions: [
          'user_self_read',
          'user_self_update'

          //có thể thêm phần thao tác với content của bản thân ở đây
        ]
      },
      {
        name: 'moderator',
        permissions: [
          'user_self_read',
          'user_self_update',
          'user_read',
          'user_update'

          //có thể thêm phần thao tác với content của user ở đây
        ]
      },
      {
        name: 'admin',
        permissions: [
          'user_self_read',
          'user_self_update',

          'user_create',
          'user_read',
          'user_update',
          'user_delete',

          'role_create',
          'role_read',
          'role_update',
          'role_delete'

          //có thể thêm phần thao tác với content ở đây
        ]
      }
    ])
  }

  const categoryCount = await categoryModel.countDocuments()
  if (categoryCount === 0) {
    await categoryModel.insertMany([
      {
        name: 'Code',
        slug: slugify('code')
      },
      {
        name: 'Tech',
        slug: slugify('Tech')
      },
      {
        name: 'Travel',
        slug: slugify('Travel')
      },
      {
        name: 'Finance',
        slug: slugify('Finance')
      }
    ])
  }
  const tagCount = await tagModel.countDocuments()
  if (tagCount === 0) {
    await tagModel.insertMany([
      {
        name: 'React',
        slug: slugify('React')
      },
      {
        name: 'Crypto',
        slug: slugify('Crypto')
      },
      {
        name: 'Javascript',
        slug: slugify('Javascript')
      },
      {
        name: 'Artificial Intelligence',
        slug: slugify('Artificial Intelligence')
      },
      {
        name: 'VietNam',
        slug: slugify('VietNam')
      },
      {
        name: 'Japan',
        slug: slugify('Japan')
      },
      {
        name: 'Nvidia',
        slug: slugify('Nvidia')
      }
    ])
  }
  const admin = await userModel.findOne({ email: 'chaobanh27@gmail.com' })
  const adminRole = await roleModel.findOne({ name: 'admin' })
  if (!admin) {
    await userModel.create({
      username: 'chaobanh27',
      email: 'chaobanh27@gmail.com',
      password: bcrypt.hashSync(env.ADMIN_PASSWORD, 8),
      role: adminRole._id,
      isActive: true
    })
  } else {
    return
  }
}

export default seedDB