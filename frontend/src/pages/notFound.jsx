import { useState } from 'react';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) {
      onLogin();
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F4F0] text-slate-900 flex flex-col">
      <div className="mt-12 -mb-12">
        <SiteHeader 
          title="              The Page is not found. Please check the URL or return to the home page." 
        />
      </div>

      <main className="flex-grow flex items-center justify-center p-6 mt-16">
      
      </main>

      <SiteFooter />
    </div>
  );
}

export default Login;
