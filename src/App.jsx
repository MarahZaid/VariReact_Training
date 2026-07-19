import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import AuthInitializer from "./initializers/AuthInitializer.jsx";
import CartInitializer from "./initializers/CartInitializer.jsx";
import router from './routes/router.jsx'

function App() {

  return (
    <Provider store={store}>
      <AuthInitializer>
        <CartInitializer>
          <RouterProvider router={router} />
        </CartInitializer>
      </AuthInitializer>
    </Provider>
  )
}

export default App
