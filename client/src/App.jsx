import { Routes, Route } from 'react-router-dom';
import { SignUp } from './pages/SignUp';

function App() {
  return (
    <Routes>
      <Route path='/signUp' element={<SignUp />} />
    </Routes>
  );
}

export default App;
