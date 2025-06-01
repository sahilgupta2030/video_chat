import { LoaderIcon } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore.js';

function PageLoader() {
  const {theme} = useThemeStore()
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
      <LoaderIcon className='animate-spin size10 text-primary'/>
    </div>
  )
}

export default PageLoader 
