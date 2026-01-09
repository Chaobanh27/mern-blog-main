import { Sparkles } from 'lucide-react'
import SearchDropdown from './SearchDropDown'

const Header = () => {

  return (
    <>
      <header
        // style={{ backgroundImage: 'url(https://res.cloudinary.com/dbk1x83kg/image/upload/v1766660457/samples/background/dark_glow_aesthetic-wallpaper-3440x1440_y5cqnd.jpg)' }}
        // className='bg-cover bg-no-repeat h-fit w-100'
      >
        <div
          className='mx-8 sm:mx-16 xl:mx-24 relative pt-30 '>
          <div className='text-center mb-8'>

            <span
              className="inline-flex items-center gap-1 rounded-md px-3 py-1
                text-sm font-medium text-white
                animate-[bgPulse_2.5s_ease-in-out_infinite]"
              style={{
                background:'linear-gradient(90deg, #7c3aed, #ec4899, #22d3ee)',
                backgroundSize: '200% 200%'
              }}
            >
              <style>
                {`
                  @keyframes bgPulse {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                  }
                `}
              </style>
                    New: AI feature integrated
              <Sparkles/>
            </span>


            <h1 className='text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700 dark:text-white'>Your own <span className='text-primary'> blogging</span> <br/> platform.</h1>

            <p className='my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500 dark:text-white'>This is your space to think out loud, to share what matters, and to write without filters. Whether it&apos;s one word or a thousand, your story starts right here.</p>
            <div className='flex justify-center'>
              <SearchDropdown />
            </div>

          </div>

          <img src={'/'} alt="" className='absolute -top-50 -z-1 opacity-50'/>
        </div>
      </header>

    </>
  )
}

export default Header