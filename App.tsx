import { useState, useEffect } from 'react'

interface Expense {
  id: string
  amount: number
  category: string
  description: string
  date: string
  time: string
}

const CATEGORIES = [
  { name: 'Food & Dining', icon: '🍽️', color: 'bg-orange-100 text-orange-800' },
  { name: 'Transportation', icon: '🚗', color: 'bg-blue-100 text-blue-800' },
  { name: 'Shopping', icon: '🛍️', color: 'bg-pink-100 text-pink-800' },
  { name: 'Entertainment', icon: '🎮', color: 'bg-purple-100 text-purple-800' },
  { name: 'Bills', icon: '💡', color: 'bg-red-100 text-red-800' },
  { name: 'Health', icon: '🏥', color: 'bg-green-100 text-green-800' },
  { name: 'Other', icon: '📝', color: 'bg-gray-100 text-gray-800' },
]

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState<number>(0)
  const [showBudgetInput, setShowBudgetInput] = useState(false)
  const [budgetInput, setBudgetInput] = useState('')

  // Load data from localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses')
    const savedBudget = localStorage.getItem('budget')
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
    if (savedBudget) {
      setBudget(parseFloat(savedBudget))
    }
  }, [])

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  // Save budget to localStorage
  useEffect(() => {
    localStorage.setItem('budget', budget.toString())
  }, [budget])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    const now = new Date()
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      category,
      description: description || 'No description',
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setExpenses(prev => [newExpense, ...prev])
    setAmount('')
    setCategory('')
    setDescription('')
  }

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id))
  }

  const setBudgetAmount = (e: React.FormEvent) => {
    e.preventDefault()
    if (budgetInput) {
      setBudget(parseFloat(budgetInput))
      setBudgetInput('')
      setShowBudgetInput(false)
    }
  }

  // Calculations
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date)
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
  })
  const monthlySpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const budgetRemaining = budget - monthlySpent
  const budgetPercentage = budget > 0 ? (monthlySpent / budget) * 100 : 0

  const todayExpenses = expenses.filter(expense => expense.date === new Date().toLocaleDateString())
  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

  const categoryTotals = CATEGORIES.map(cat => ({
    ...cat,
    total: expenses
      .filter(expense => expense.category === cat.name)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(cat => cat.total > 0)

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-bee-400 p-3 rounded-full">
            <span className="text-2xl">🐝</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">BUDGETBEE</h1>
            <p className="text-bee-600 font-medium">Simple Expense Tracker</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-3">
        {/* Left Column - Forms and Summary */}
        <div className="space-y-6">
          {/* Add Expense Form */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>💰</span>
              Add Expense
            </h2>
            
            <form onSubmit={addExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="form-input"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-input"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat.name} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-input"
                  placeholder="What did you buy?"
                />
              </div>

              <button type="submit" className="btn btn-primary w-full flex items-center justify-center gap-2">
                <span>🐝</span>
                Add Expense
              </button>
            </form>
          </div>

          {/* Budget Card */}
          <div className="card">
            {budget > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Budget</p>
                    <p className="text-xl font-bold text-purple-600">${budget.toFixed(2)}</p>
                  </div>
                  <button
                    onClick={() => setShowBudgetInput(true)}
                    className="text-purple-500 hover:text-purple-700 text-xl"
                  >
                    ⚙️
                  </button>
                </div>
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Spent: ${monthlySpent.toFixed(2)}</span>
                    <span className={budgetRemaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {budgetRemaining >= 0 ? 'Left' : 'Over'}: ${Math.abs(budgetRemaining).toFixed(2)}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className={`progress-fill ${
                        budgetPercentage > 100 ? 'progress-danger' : 
                        budgetPercentage > 80 ? 'progress-warning' : 'progress-safe'
                      }`}
                      style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <span className="text-4xl block mb-2">🎯</span>
                <button
                  onClick={() => setShowBudgetInput(true)}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Set Monthly Budget
                </button>
              </div>
            )}
            
            {showBudgetInput && (
              <form onSubmit={setBudgetAmount} className="mt-4 pt-4 border-t flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  className="form-input flex-1"
                  placeholder="Budget amount"
                  required
                />
                <button type="submit" className="btn btn-primary">Set</button>
                <button
                  type="button"
                  onClick={() => setShowBudgetInput(false)}
                  className="btn bg-gray-300 text-gray-700"
                >
                  ✕
                </button>
              </form>
            )}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">${monthlySpent.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{monthlyExpenses.length} items</p>
            </div>
            
            <div className="card">
              <p className="text-sm text-gray-600">Today</p>
              <p className="text-2xl font-bold text-green-600">${todayTotal.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{todayExpenses.length} items</p>
            </div>
          </div>
        </div>

        {/* Right Column - Expenses List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Expenses */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span>
              Recent Expenses
            </h2>

            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">🐝</span>
                <p className="text-gray-500">No expenses yet! Add your first expense to get started.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {expenses.map(expense => {
                  const categoryInfo = CATEGORIES.find(cat => cat.name === expense.category)
                  return (
                    <div key={expense.id} className="expense-item">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`category-tag ${categoryInfo?.color}`}>
                            {categoryInfo?.icon} {expense.category}
                          </span>
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-gray-500">{expense.date} at {expense.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-red-600">-${expense.amount.toFixed(2)}</span>
                          <button
                            onClick={() => deleteExpense(expense.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          {categoryTotals.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>📈</span>
                Spending by Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryTotals.map(cat => (
                  <div key={cat.name} className={`${cat.color} rounded-lg p-3`}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cat.icon} {cat.name}</span>
                      <span className="font-bold">${cat.total.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
