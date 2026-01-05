import { ScaleLoader } from 'react-spinners'

const LoadingSpinner = () => {
  return (
    <div className='flex justify-center items-center h-full'>
      <ScaleLoader color='#899499' />
    </div>
  )
}

export default LoadingSpinner