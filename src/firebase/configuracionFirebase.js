// eslint-disable-next-line import/no-unresolved
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js';
// eslint-disable-next-line import/no-unresolved, object-curly-newline
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, signOut, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// eslint-disable-next-line import/no-unresolved, object-curly-newline
import { getFirestore, collection, getDoc, getDocs, setDoc, doc, onSnapshot, query, where, deleteDoc, updateDoc, arrayRemove, arrayUnion } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
// eslint-disable-next-line import/no-unresolved
import {
    getStorage, ref, getDownloadURL, uploadBytes,
} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js';
// eslint-disable-next-line object-curly-newline
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from './secrets.js';

export const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
export const database = getFirestore();
const provider = new GoogleAuthProvider(app);
export const storageRef = ref(storage);

export const coleccionNombresUsuario = collection(database, 'usernames');
export const coleccionUsuarios2 = collection(database, 'usuarios');
export const coleccionPost = collection(database, 'posts');

// Propuesta de Pris -> Se lo podria exportar las funciones desde aqui
// Authenticacion normal----------------------------------------------
// eslint-disable-next-line max-len
export const createUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);
export const normalSign = (email, password) => signInWithEmailAndPassword(auth, email, password);
// Guardar username desde el registro de la mascota
export const guardarDisplayName = (usernameIngresado) => updateProfile(auth.currentUser, {
    displayName: usernameIngresado,
});
// Autenticacion con el popup de Google Gmail-------------------------
export const googleSign = (providero) => signInWithPopup(auth, provider);

// Get the currently signed-in user
// The recommended way to get the current user is by setting an observer on the Auth object:
export const currentUser = {};

export const getCurrentUser = () => {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            currentUser.email = user.email;
            currentUser.uid = user.uid;
            currentUser.displayName = user.displayName;
            currentUser.petName = user.petName;
            currentUser.username = user.username;
        }
    });
};

// Cierre de sesión
export const logOut = () => signOut(auth);

// Borrar post
export const deletePost = (uid) => deleteDoc(doc(database, 'postsTimeline', uid));
// export const deletePost = uid => deleteDoc(doc(database, 'usuarios', auth.currentUser.uid, 'userPosts', uid));

// consultar
export const getPostData = (uid) => getDoc(doc(database, 'usuarios', auth.currentUser.uid));

export const getPostData2 = (uid) => getDoc(doc(database, 'postsTimeline', uid));

// Like post
export const likePost = (uid, likes, userLike) => updateDoc(doc(database, 'postsTimeline', uid), { amountLikes: likes, arrayUsersLikes: arrayUnion(userLike) });

// Dislike post
export const dislikePost = (uid, likes, userLike) => updateDoc(doc(database, 'postsTimeline', uid), { amountLikes: likes, arrayUsersLikes: arrayRemove(userLike) });

// Obtener doc
export const getPost = (uid) => getDoc(doc(database, 'postsTimeline', uid));

// Update doc
export const updatePost = (uid, nuevoValorPost) => updateDoc(doc(database, 'postsTimeline', uid), nuevoValorPost);

// Funcion para subir imagenes
export const uploadImage = async (file, nombrePic) => {
    const storageRefSeleccionado = ref(storage, `listaFotos/${nombrePic}`);
    return await uploadBytes(storageRefSeleccionado, file);
};

// Funcion que permita obtener la URL de la imagen
export const getImageURL = async (fileRef) => await getDownloadURL(fileRef);
