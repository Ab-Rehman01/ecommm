import {
  auth,
  db,
  addDoc,
  collection,
 storage,
 signOut,
 ref, uploadBytes,
 getDownloadURL,
 onAuthStateChanged,
 query
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

 // Form submission handler
 document.getElementById('postForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const file = document.getElementById('blog_img').files[0];
  const uploadStatus = document.getElementById('upload_status');

  if (title && content && file) {
      // Create a storage reference
      const blogImgStorageRef = ref(storage,` PostsImages/${file.name}`);

      // Update status
      uploadStatus.textContent = "Uploading image...";

      try {
          // Upload the image
          await uploadBytes(blogImgStorageRef, file);
          const imageUrl = await getDownloadURL(blogImgStorageRef);

          // Add post data to Firestore
          await addDoc(collection(db, "posts"), {
              title,
              content,
              imageUrl,
              createdAt: new Date(),
          });

          // Update status
          uploadStatus.textContent = "Post added successfully!";
      } catch (error) {
          console.error("Error adding post: ", error);
          uploadStatus.textContent = "Failed to add post.";
      }
  } else {
      uploadStatus.textContent = "Please fill in all fields and select an image.";
}
});
// Function to render posts
async function renderPosts() {
  const postsContainer = document.getElementById("posts_container");
  postsContainer.innerHTML = ''; // Clear the container

  const q = query(collection(db, "posts"));
  const querySnapshot = await getDocs(q);

  querySnapshot.forEach((doc) => {
    const post = doc.data();
    const postElement = document.createElement("div");

    postElement.innerHTML = `
      <h3>${post.title}</h3>
      <img src="${post.imageUrl}" alt="Post Image" style="max-width: 100%;">
      <p>${post.content}</p>
      <hr>
    `;

    postsContainer.appendChild(postElement);
  });
}

// Initial render of posts on page load
renderPosts();