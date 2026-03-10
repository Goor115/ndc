import { useState } from 'react'

function LoginPage({ onLogin }) {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    if (!login || !password) {
      setError('Введіть логін та пароль')
      return
    }
    const success = onLogin(login, password)
    if (!success) {
      setError('Невірний логін або пароль')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 w-96">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-blue-400">📋 Наряд робіт</h1>
          <p className="text-gray-400 text-sm mt-1">Введіть дані для входу</p>
        </div>

        {/* Форма */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Логін</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Введіть логін..."
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="Введіть пароль..."
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-semibold mt-2"
          >
            Увійти
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
