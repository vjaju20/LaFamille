//read the comments at the last of file !important
import React,{useEffect,createContext,useReducer,useContext} from "react";
import NavBar from "./components/Navbar";
import './App.css';
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom';
import Home from './components/screens/Home';
import Signin from './components/screens/SignIn';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from "./components/screens/CreatePost";
import UserProfile from './components/screens/UserProfile';
import FollowingUserPosts from './components/screens/FollowingUserPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword';
import {reducer,initialState} from './reducers/userReducer';
export const UserContext = createContext();
const Routing = () => {
  const history = useHistory();
  const {state,dispatch} = useContext(UserContext);
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    /* we have written the useContext line and dispatch line in if part because if user closes our application
    without logging out then we want that when the user comes back then signin page should not open and if
    we remove these lines then in this case user has to login when return as the state on closing the
    application is destroyed */
    if(user){
      dispatch({type:"USER",payload:user})
      //history.push('/');
      /* using the above commented line we can redirect user to home screen or any other by passing that
      route in the push everytime the site refreshes automatically or on purpose by the user but we have
      removed this because we want the user on the same screen after the site is refreshed on which the
      user is working and also it enhances the user experience */
    }
    else{
      if(!history.location.pathname.startsWith('/reset')){
        history.push('/signin')
      }
      /* we used the above if condition so that if the user wants to reset the password then it will
      not be redirected to signin page as we have the logic that if the user is not present in the
      local storage then user will be redirected to signin page */
    }
  },[]);
  /* passing the empty dependency list as we want the useEffect to run only when the components mount and
  the other thing which useEffect does is that if the user is not signed in then which ever route the user
  types in the search bar it will only be on signin page except for signup page combining the logic written
  in our NavBar.js as App.js is the first thing which loads on the browser */
  return(
    <Switch>
      <Route exact path="/"> 
        {/* We used the exact keyword as otherwise the home content will be shown along with the page content
        user navigate to and this is happening because of / is included in all the paths */}
        <Home/>
      </Route>
      <Route path="/signin">
        <Signin/>
      </Route>
      {/* we are using the exact keyword in the Profile Route as the same path has been repeated in UserProfile
      Route as well, so if we don't add exact keyword in the Profile Route the logged in user will not only
      see other users posts but also the posts posted by itself on the User Profile page and this is not a good
      user experience */}
      <Route exact path="/profile">
        <Profile/>
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route path="/create">
        <CreatePost/>
      </Route>
      <Route path="/profile/:userid">
        <UserProfile/>
      </Route>
      <Route path="/myfollowingpost">
        <FollowingUserPosts/>
      </Route>
      <Route exact path="/reset">
        <Reset/>
        {/* we put the exact keyword in this route so that when the user click on the link sent through mail
        user will be directed to new password page otherwise */}
      </Route>
      <Route path="/reset/:token">
        <NewPassword/>
      </Route>
    </Switch>
    /* what switch does is that it make sure that only one Route is active at a time according to the path */
  )
}
function App() {
  const [state,dispatch] = useReducer(reducer,initialState);
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar/>
        <Routing/>
        {/* <Route exact path="/"> 
          // We used the exact keyword as otherwise the home content will be shown along with the page content
          // user navigate to and this is happening because of / is included in all the paths 
          <Home/>
        </Route>
        <Route path="/signin">
          <Signin/>
        </Route>
        <Route path="/profile">
          <Profile/>
        </Route>
        <Route path="/signup">
          <Signup/>
        </Route>
        <Route path="/create">
          <CreatePost/>
        </Route> */}
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
/* we want to access history but we can't do it in App() but can do it with Home,Signin and rest of the
components because we have wrapped all those components inside the BrowserRouter component but we are
accessing it outside the BrowserRouter,so to solve this problem we create another component which is Routing
in this case */