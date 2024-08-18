import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
        import { getFirestore, 
            collection, 
            addDoc } 
            from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
        import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

        // // Your web app's Firebase configuration
        // const firebaseConfig = {
        //     apiKey: "AIzaSyCaPcVltcEn9ApQkO0VutroVK3UQFCpAqo",
        //     authDomain: "practice-project-73d0f.firebaseapp.com",
        //     projectId: "practice-project-73d0f",
        //     storageBucket: "practice-project-73d0f.appspot.com",
        //     messagingSenderId: "850462338184",
        //     appId: "1:850462338184:web:07fd563c69b43b8976833d"
        // };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const storage = getStorage(app);

        // Form submission handler
        document.getElementById('postForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const file = document.getElementById('blog_img').files[0];
            const uploadStatus = document.getElementById('upload_status');

            if (title && content && file) {
                // Create a storage reference
                const blogImgStorageRef = ref(storage, PostsImages/${file.name});

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
