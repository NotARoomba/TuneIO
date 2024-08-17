import PageButton from "../components/buttons/PageButton";
import HomeButton from "../components/buttons/HomeButton";
import Title from "../components/misc/Title";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkIfLogin, callAPI, deleteCookies } from "../utils/Functions";
import { User, STATUS_CODES } from "../utils/Types";
import LoadingScreen from "../components/misc/LoadingScreen";
import EditModal from "../components/modals/EditModal";
import AlertModal from "../components/modals/AlertModal";

export default function Profile() {
    const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>();
  const [editModal, setEditModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  useEffect(() => {
    if (!editModal) {
      setLoading(true);
      checkIfLogin().then((user) => {
        if (!user) {
          return navigate("/login");
        }
        setUser(user);
        setLoading(false);
      });
    }
  }, [navigate, editModal]);
  const logout = () => {
    deleteCookies();
    navigate("/");
  };
  return(
    <div className="flex flex-col w-screen h-[100dvh] overflow-hidden font-medium ">
      <Title text="Profile" reverse />
        <img className="w-2/3 mx-auto aspect-square outline outline-8 outline-beige rounded mt-2 mb-8" src={user?.avatar}/>
        <p className="text-5xl mx-auto ">{user?.username}</p>
        <p className="text-xl mx-auto my-2 ">Date Joined: {(() => {
                const d = new Date(user?.dateJoined ?? 0);
                return (
                  [d.getMonth() + 1, d.getDate(), d.getFullYear()].join("/")
                );
              })()}</p>

<div className=" gap-y-3 w-11/12 mx-auto">
<PageButton link="/" title="Home" color="bg-ash_gray"/>
<PageButton action={() => setEditModal(true)} title="Edit Profile" color="bg-air_force_blue"/>
<PageButton  action={() => setLogoutModal(true)} title="Logout" color="bg-midnight_green"/>

</div>
      <LoadingScreen loading={loading} />
      <EditModal setIsOpen={setEditModal} isOpen={editModal} />
      <AlertModal
        title={"Error"}
        text={"There was an error fething the data!"}
        isOpen={errorModal}
        setIsOpen={setErrorModal}
      />
      <AlertModal
        title={"Confirmation"}
        text={"Are you sure you want to logout?"}
        action={logout}
        cancel
        isOpen={logoutModal}
        setIsOpen={setLogoutModal}
      />
    </div>
  )
}