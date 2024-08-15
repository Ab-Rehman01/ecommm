import {
    createUserWithEmailAndPassword,
    doc,
    db,
    setDoc,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
    auth,

} from "../../applicationjs/app.js";

const signup_btn =document.getElementById("submit_form");
const submit_btn =document.getElementById("submit_btn");


signup_btn.addEventListener("submit",function (e){
    e.preventDefault();
    console.log(e);
    console.log(e.target);

    const img=e.target[0].files[0];
    const email=e.target[1].value;
    const password = e.target[2].value;
    const firstName =e.target[4].value;
    const lastName = e.target[5].value;
    const phone = e.target[6].value;
    const company = e.target[7].value;

    const userInfo ={
        img,
        email,
        password,
        firstName,
        lastName,
        phone,
        company,


    };
    //create account
    submit_btn.disabled =true;
    submit_btn.innerText ="Loading....";
    createUserWithEmailAndPassword (auth,email,password)
    .then((user)=>{
        console.log("user=>", user.user.uid);
        //upload user image
        const userRef = ref(storage,`user/${user.user.uid}`)
        uploadBytes(userRef , img).then(()=>{
            console.log("user image uploaded");
            //geting url 
            getDownloadURL(userRef)
            .then((url)=>{
                console.log("user url =>", url);
                //update user obj
                userInfo.img=url;

                //created user doc
                const userDbref = doc (db,"users", user.user.uid);
                // set user doc.
                setDoc(userDbref, userInfo)
                .then(()=>{
                    console.log("user obj updated");
                    console.log("Redirecting to main page...");
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 1000);
                });

            })
            .catch((err) => {
                console.error("Error updating user obj:", err);
                submit_btn.disabled = false;
                submit_btn.innerText = "Submit";
            });
            })
        .catch(()=>{
            console.log("Error in uploading user image");
            submit_btn.disabled =false;
                 submit_btn.innerText ="Submit";

        });
    })
    .catch((err) => {
        alert(err),(submit_btn.disabled =false);
        submit_btn.innerText ="Submit";
    });
    console.log(userInfo);
        
    });
    
