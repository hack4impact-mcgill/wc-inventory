function App() {
// App.tsx is the main component where we define UI
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-6 flex items-center justify-center">
        <div className="text-center">
          <span>TODO LIST </span>
          <div className="flex-row content-between p-5 bg-stone-100">
            <ol className="flex-row p-5">
              <li>somehow replace this in app.tsx w dynamic list</li>
            </ol>
            <div className=" flex flex-row bg-stone-100 justify-between">
              <textarea className="bg-stone-400 w-[80%] rounded">New Task</textarea>
              <button className="max-w-10 bg-stone-400 rounded">Add</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App
