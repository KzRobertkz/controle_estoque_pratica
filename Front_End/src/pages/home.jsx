import { useEffect, useState } from 'react'
import Header from "../components/header"
import axios from 'axios'

function Home() {
  const [message, setMessage] = useState('Testando conexão...')

  useEffect(() => {
    axios.get('http://localhost:3333/api/ping')
      .then(response => {
        setMessage(response.data.message)
      })
      .catch(error => {
        console.error('Erro ao conectar com o backend:', error)
        setMessage('Falha ao conectar com o backend')
      })
  }, [])

  return (
    <div>
      <Header />
      <p className='pl-5 text-green-500'>
        Backend diz: {message}
      </p>
    </div>
  )
}



export default Home

  