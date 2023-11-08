import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ActivationPage = () => {
  
  const { uidb64, token } = useParams();
  const [activationStatus, setActivationStatus] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/activate/${uidb64}/${token}`)
      .then(res => {
        console.log(res.data);
        setActivationStatus('success');
      })
      
      .catch(err => {
        console.log(err);
        setActivationStatus('error');
      });
  }, [uidb64, token]);
  
  return (
    <div>
      <h1 className="welcome">Activating account..</h1>
      {activationStatus === 'success' && <p>Account successfully activated!</p>}
      {activationStatus === 'error' && <p>There was an error activating your account.</p>}
    </div>
  );
};

export default ActivationPage;