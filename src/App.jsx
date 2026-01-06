import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "./Body";
import Home from "./Home";
import Profile from "./Profile";

function App() {
    return (
        <>
            <BrowserRouter basename="/">
                <Routes>
                    <Route path="/" element={<Body />}>
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;
