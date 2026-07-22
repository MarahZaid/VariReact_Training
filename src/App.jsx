import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import AuthInitializer from "./initializers/AuthInitializer.jsx";
import CartInitializer from "./initializers/CartInitializer.jsx";
import router from './routes/router.jsx';
import { HelmetProvider } from 'react-helmet-async';
import { ConfirmProvider } from "material-ui-confirm";

function App() {

  return (
    <ConfirmProvider>
      <HelmetProvider>
        <Provider store={store}>
          <AuthInitializer>
            <CartInitializer>
              <RouterProvider router={router} />
            </CartInitializer>
          </AuthInitializer>
        </Provider>
      </HelmetProvider>
    </ConfirmProvider>

  )
}

export default App
