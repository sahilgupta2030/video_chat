import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { acceptFriendRequest, getFriendRequest } from "../lib/api.js";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound.jsx";

function Notification() {
  const queryClient = useQueryClient();

  const { data: friendRequest, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequest,
  })

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  })

  const incomingFriendRequests = friendRequest?.incomingRequests || []
  const acceptFriendRequests = friendRequest?.acceptRequest || []

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">
          Notifications
        </h1>
        {
          isLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <>
              {incomingFriendRequests.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <UserCheckIcon className="h-5 w-5 text-primary" />
                    Friend Requests
                    <span className="badge badge-primary ml-2">{incomingFriendRequests.length}</span>
                  </h2>
                  <div className="space-y-3">
                    {incomingFriendRequests.map((request) => (
                      console.log("request:", request),
                      <div
                        key={request._id}
                        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="card-body p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="avatar w-14 h-14 rounded-full bg-base-300">
                                <img src={request.sender.profilePicture} alt={request.sender.fullName} />
                              </div>
                              <div>
                                <h3 className="font-semibold">{request.sender.fullName}</h3>
                              </div>
                            </div>

                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => {
                                console.log("Sending request for ID:", request._id);
                                acceptRequestMutation({ requestId: request._id });
                              }}
                              disabled={isPending}
                            >
                              Accept
                            </button>

                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {acceptFriendRequests.length > 0 && (
                <section className="space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <BellIcon className="h-5 w-5 text-success" />
                    New Connections
                  </h2>

                  <div className="space-y-3">
                    {acceptFriendRequests.map((notification) => (
                      <div key={notification._id} className="card bg-base-200 shadow-sm">
                        <div className="card-body p-4">
                          <div className="flex items-start gap-3">
                            <div className="avatar mt-1 size-10 rounded-full">
                              <img
                                src={notification.recipient.profilePicture}
                                alt={notification.recipient.fullName}
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold">{notification.recipient.fullName}</h3>
                              <p className="text-sm my-1">
                                {notification.recipient.fullName} accepted your friend request
                              </p>
                              <p className="text-xs flex items-center opacity-70">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                Recently
                              </p>
                            </div>
                            <div className="badge badge-success">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
              {incomingFriendRequests.length === 0 && acceptFriendRequests.length === 0 && (
                <NoNotificationsFound />
              )}
            </>
          )
        }
      </div>
    </div>
  )
}

export default Notification
