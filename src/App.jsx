
import { useEffect, useState } from 'react';
import './App.css';
import moment from 'moment/moment';

import { collection, addDoc, getDocs, getFirestore, doc, onSnapshot, query } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { async } from '@firebase/util';



const firebaseConfig = {

  apiKey: "AIzaSyA2oJHn88XRIjXQExI6-wtCn4iG_jUzj8I",
  authDomain: "helloworldfirebase-5ccd3.firebaseapp.com",
  projectId: "helloworldfirebase-5ccd3",
  storageBucket: "helloworldfirebase-5ccd3.appspot.com",
  messagingSenderId: "425147438128",
  appId: "1:425147438128:web:d75e2bbaa78c0e1e21c9f5"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);


function App() {

  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);
  const [isLoading, SetisLoading] = useState(false);


  useEffect(() => {

    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `, doc.data());

        setPosts((prev) => {

          let newArray = [...prev, doc.data()];

          return newArray

        });

      });

    }
    // getData();

    let unsubscribe = null
    const RealtimeData = async () => {
      const q = query(collection(db, "posts"),);
     unsubscribe = onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
          posts.push(doc.data());

        });

        setPosts(posts)
        console.log("posts", posts);

      });

    }
    RealtimeData()

    return (()=>{
      unsubscribe();
    })

  }, [])

  const savePost = async (e) => {


    e.preventDefault();

    console.log("post", postText)

    try {
      const docRef = await addDoc(collection(db, "posts"), {
        Text: postText,
        createdon: new Date().getTime(),

      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }

  }

  return (
    <div >

      <form onSubmit={savePost}>
        <input
          type="text"
          placeholder="what's on your mind..."
          onChange={(e) => {
            setPostText(e.target.value)
          }}
        />
        <button type='submit'>Post</button>
      </form>
      <div >
        {(isLoading) ? "loading.." : ""}

        {posts.map((eachPost, i) => (

          <div key={i}>

            <h3 href={eachPost?.url}>{eachPost?.Text}</h3>

            <span>{
              moment(eachPost?.datePublished).format('MMMM Do YYYY , h:mm a')
            }
            </span>
          </div>
        ))}

      </div>



    </div>
  );
}



export default App
