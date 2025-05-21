import React from 'react';
import FeedbackForm from '../components/FeedbackForm';

const SupportPage = () => {
    return (
        <main 
          className="support-main container"
          style={{
            paddingTop: '80px',
            paddingBottom: '80px'
          }}
        >
          <div className="support-container">
            <FeedbackForm />
          </div>
        </main>
      );
};

export default SupportPage;