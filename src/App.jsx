import { useState, useEffect } from 'react'




function App() {
 

  // Dastlabgi qiymatlarni Local storage dan o'qib olish

  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('my_todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  })




  const [inputValue,setInputValue] = useState('')


  // Tahrirlash (Edit) uchun statelar

  const [isEditing, setIsEditing] = useState(false);
  const [currentTodoId, setCurrentTodoId] = useState(null)



  // Todos o'zgarganda uni LocalStorage ga yozib borish

  useEffect(() => {
    localStorage.setItem('my_todos', JSON.stringify(todos));
  },[todos])


  // Vazifa qo'shish yoki tahrirlashni saqlash

  const handleSubmit = (e) => {
    e.preventDefault();
    if(!inputValue.trim()) return;
  

  if (isEditing) {
    //Agar tahrirlash rejimida bulsa usha todo ni yangilaymiz
    setTodos(
      todos.map((todo) => 
      todo.id === currentTodoId ? {...todo, text: inputValue} : todo)
    )
    setIsEditing(false);
  setCurrentTodoId(null);
  } else {
    //Yangi todo qushish

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    };
    setTodos([...todos, newTodo])
  
  }

  setInputValue(''); // Inputni tozalash
  }


  //Tahrirlash rejimini yoqish

  const startEdit = (todo) => {
    setIsEditing(true);
    setCurrentTodoId(todo.id);
    setInputValue(todo.text) // Input ichiga eski matnni yuklaymiz

  };

  //Tahrirlashni bekor qilish

   const cancelEdit = () => {
    setIsEditing(false);
    setCurrentTodoId(null);
    setInputValue('')
   }

  //Vazifani bajarildi deb belgilash
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed} : todo)
    )
  }


  //Vazifani o'chirish

  const deleteTodo = (id) => {
    //Agar tahrirlanayotgan todo o'chirib tashlansa , edit rejimini  yopamiz

    if (currentTodoId === id) {
      cancelEdit()
    }

    setTodos(todos.filter((todo) => todo.id !== id))
  }
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center p-4 font-sans">
        <div className='bg-white w-full max-w-md rounded-2xl shadow-2xl p-6'>
          <h1>My to do list</h1>


          {/* Form (Input va tugmalar) */}
          
          <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-2 mb-6 md:grid-cols-2'>
            <input type="text" 
                   placeholder={isEditing ? "Vazifani tahrirlang..." : "Yangi vazifa kiriting"}
                   value={inputValue}
                   onChange={(e) => setInputValue(e.target.value)}
                   className={`flex-1 px-4 py-2 border-2 rounded-xl focus:outline-none transition-colors text-gray-700 ${
                    isEditing ? 'border-amber-400 focus:border-amber-500' : 'border-gray-200 focus:border-purple-500'
                   }`}
                   
            />
            
            <button type="submit"
             className={`font-semibold px-5 py-2 rounded-xl transition-all active:scale-95 shadow-md ${
             isEditing
             ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200'
             : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200'
            }`}
            >
              {isEditing ? 'Saqlash' : 'Qushish'}
            </button>


            {isEditing && (
              <button type='button'
              onClick={cancelEdit}
              className='bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-3 py-2 rounded-xl transition-all active:scale-95'
              >
              X
              </button>
            )}
          </form>


          {/* Vazifalar ro'yxati */}


          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
               {todos.length === 0 ? (
                <p className="text-center text-gray-400 py-4">Hozircha vazifalar yuq</p>
               ) : (
                todos.map((todo) => (
                  <div key={todo.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                      todo.completed 
                      ? 'bg-gray-50 border-gray-200 opacity-60'
                      : todo.id === currentTodoId
                      ? 'bg-amber-50/50 border-amber-300 shadow-sm ring-1 ring-amber-300'
                      : 'bg-white border-purple-100 hover:border-purple-300 shadow-sm'
                    }`}>
                    
                    


                  {/* Matn va Chekbox */}

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                     <input type=""
                       type="checkbox"
                       checked={todo.completed}
                       onChange={() => toggleTodo(todo.id)}
                       className="w-5 h-5 accent-purple-600 rounded cursor-pointer"
                       disabled={isEditing && currentTodoId === todo.id} // Tahrirlash paytida chekboxni uchirib turamiz
                     />
                     <span className={`text-gray-700 font-medium break-words cursor-pointer select-none ${
                      todo.completed ? 'line-through text-gray-400' : ''
                     }`}>
                          {todo.text}
                     </span>
                  </div>


                  {/* Amallar tugmalari (Edit & Delete) */}

                  <div className='flex items-center gap-1 ml-2'>

                    {/* Tahrirlash tugmasi (Faqat bajarmaganlar uchun) */}

                    {!todo.completed && (
                      <button onClick={() => startEdit(todo)}
                      className='text-gray-400 hover:text-amber-500 p-1 rounded-lg hover:bg-amber-50 transition-colors'
                      title='Tahrirlash'
                      >
                        
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      </button>

                    )}
                  
                  {/* O'chirish tugmasi */}

                  <button onClick={() => deleteTodo(todo.id)}
                  className='text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition-colors'
                  title="O'chirish"  
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    
                  </button>
                  </div>

                  </div>



        
                ))
               )}


               {/* Statistika */}

               {todos.length > 0 && (
                <div className='mt-6 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500 font-medium'>
                  <span>Umumiy: {todos.length}</span>
                  <span>
                    Bajarildi: {todos.filter((t) => t.completed).length} ta
                  </span>
                   </div>
               )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
