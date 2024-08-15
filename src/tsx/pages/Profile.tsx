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
    localStorage.clear();
    deleteCookies();
    navigate("/");
  };
  return(
    <div className="flex flex-col w-screen overflow-hidden">
      <Title text="Profile" reverse />
      <div className="flex flex-col mx-auto gap-5 w-11/12 mt-20">
        <img src=""/>
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