import useAuthUser from '../hooks/useAuthUser.js'
import { Link, useLocation } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../lib/api.js'
import { BellIcon, HomeIcon, LogOutIcon, Podcast, UserIcon } from 'lucide-react'
import ThemeSelector from './ThemeSelector.jsx'
import { useMediaQuery } from 'react-responsive';

function Navbar() {
  const isMobile = useMediaQuery({ maxWidth: 1023 })
  const { authUser } = useAuthUser()
  const loaction = useLocation()
  const isChatPage = loaction.pathname?.startsWith("/chat")
  const queryClient = useQueryClient()
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] })
  })
  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-end w-full'>
          {/* Logo if we are in the chat page */}
          {isChatPage && (
            <div className="pl-5">
              <Link to="/" className="flex items-center gap-2.5">
                <Podcast className="size-9 text-primary" />
                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider pr-96 mr-96">
                  VideoChat
                </span>
              </Link>
            </div>
          )}
          {isMobile && <div className='flex items-center gap-3 sm:gap-4 ml-auto'>
            <Link to={"/"}>
              <button className='btn btn-ghost btn-circle'>
                <HomeIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>
            <Link to={"/friends"}>
              <button className='btn btn-ghost btn-circle'>
                <UserIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>
            <Link to={"/notifications"}>
              <button className='btn btn-ghost btn-circle'>
                <BellIcon className='h-6 w-6 text-base-content opacity-70' />
              </button>
            </Link>
          </div>}
          <div className="flex items-center gap-3 sm:gap-4 ml-4">
            <ThemeSelector />
            <div className="avatar">
              <div className="w-9 rounded-full">
                <img src={authUser?.profilePicture} alt="User avatar" rel='noreferrer' />
              </div>
            </div>
            <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
              <LogOutIcon className='h-6 w-6 text-base-content opacity-70' />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
