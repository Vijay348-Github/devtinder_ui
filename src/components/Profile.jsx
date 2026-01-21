import React from "react";
import ProfileEdit from "./ProfileEdit.jsx";
import { useSelector } from "react-redux";

const Profile = () => {
    const user = useSelector((store) => store.user);
    return (
        user && (
            <div>
                <ProfileEdit user={user} />
            </div>
        )
    );
};

export default Profile;
