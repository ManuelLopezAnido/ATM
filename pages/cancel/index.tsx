import { useEffect } from 'react'
import styles from './cancel.module.css'
import { useRouter } from 'next/router';
const Cancel = () => {
  const router = useRouter();
  useEffect(()=>{
    const timeout = setTimeout(() => {
      router.push('/login')
    },5000)

    return (() => clearTimeout(timeout))
  },
  [])
  return (
    <div className = {styles.cancel}>
      <h1>
        La operación ha sido cancelada.
      </h1>
    </div>
  )
}

export default Cancel