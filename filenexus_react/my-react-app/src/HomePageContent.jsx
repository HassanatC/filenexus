import './index.css'
import { Link } from 'react-router-dom';
import logo from './assets/filenexus-logo.png';

function HomePageContent() {
  return (
    <div className="home-content">
      <div className="hero-section">
        <img src={logo} alt="FileNexus Logo" className="herologo" />
        <h1 className="title">Welcome to FileNexus!</h1>
      </div>
      <div className="feature-box">
        <p>
          Discover an effortless way to store, manage, and share your files with FileNexus! 
          Your digital assets are securely kept in our cloud storage, accessible anytime, anywhere.
        </p>
      </div>
      <div className="feature-box">
        <p>
          With a user-friendly interface, FileNexus allows you to upload, manage, and organize your 
          files effortlessly. You can create folders, rename, delete, and share files seamlessly, 
          without any complicated procedures.
        </p>
      </div>
      <div className="feature-box">
        <p>
          Our secure file sharing option allows you to share your documents, photos, videos, 
          and other files with anyone you want. Whether you are sharing work documents with 
          your team or photos with your friends, FileNexus ensures the safe transit of your files.
        </p>
      </div>
      <div className="feature-box">
        <p>
          FileNexus also provides insightful data about your storage usage. Easily keep track of your 
          storage capacity and know what type of files occupy your storage space.
        </p>
      </div>
      <div className="cta-box">
        <p>
          Ready to elevate your file management experience?
        </p>
        <p> 
          <Link to="/register">Register now</Link> and enjoy seamless file storage and sharing. 
          Already a member? Feel free to <Link to="/login">login</Link> and access your files.
        </p>
      </div>
    </div>
  );
}

export default HomePageContent;