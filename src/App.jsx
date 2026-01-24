import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import store from "./utils/store.js";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import Signup from "./components/SignUp.jsx";

function App() {
    return (
        <>
            <Provider store={store}>
                <BrowserRouter basename="/">
                    <Routes>
                        <Route path="/" element={<Body />}>
                            <Route path="/" element={<Feed />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/connections" element={<Connections />} />
                            <Route path="/requests" element={<Requests />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </Provider>
        </>
    );
}
export default App;
