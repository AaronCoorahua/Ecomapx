// Importar las funciones de inicialización
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';


// Tus credenciales de configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD5c3K9d5L_1pqpoOtmRRXoB-vBpr5w2DM",
    authDomain: "chronos-cc6a3.firebaseapp.com",
    projectId: "chronos-cc6a3",
    storageBucket: "chronos-cc6a3.appspot.com",
    messagingSenderId: "856549981599",
    appId: "1:856549981599:web:0ecb691ce3d504296051aa",
    measurementId: "G-ZLFX274PLV"
  };
  

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Obtener la instancia de Firebase Storage
const storage = getStorage(app);

export { app, storage };
