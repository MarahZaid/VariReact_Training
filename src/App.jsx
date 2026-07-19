import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import AuthInitializer from "./AuthInitializer.jsx";
import CartInitializer from "./CartInitializer";
import router from './router.jsx'

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
