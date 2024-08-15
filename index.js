import {
  auth,
  db,
 storage,
 signOut,
 onAuthStateChanged
} from "./applicationjs/app.js";

const logout_btn= document.getElementById("logout_btn");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const uid = user.uid;
    // ...
  } else {
    window.location.href=`/authantication/login/login.html`
    // User is signed out
    // ...
  }
});
logout_btn.addEventListener("click", ()=>{
  signOut(auth);
})