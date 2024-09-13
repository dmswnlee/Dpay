import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const RootLayout = () => {
  return (
    <section>
      <Header />
      <main>
        <Outlet />
      </main>
    </section>
  )
}

export default RootLayout